"""Risk-weighted route planning.

A* over a sea grid where edge cost is NOT just distance:

    cost = distance_km
         + wave_penalty        (sea state along the leg)
         + wind_penalty
         + zone_penalty        (enormous — restricted areas are effectively walls)
         + shore_penalty       (mild pull towards the coast in bad weather)

Because the zone penalty dwarfs distance, the safest route is frequently longer
than the straight line — which is exactly the behaviour we want to show a judge:
the shortest track clips a naval exclusion area, ORCA routes around it.
"""
from __future__ import annotations

import heapq
from typing import Dict, List, Optional, Sequence, Tuple

from ..data.geo import (Coord, distance_to_polygon_km, haversine_km, is_on_land,
                        point_in_polygon, RESTRICTED_ZONES, route_zone_conflicts)
from ..schemas import Language, RouteLeg, RouteOption
from .i18n import t, zone_name

GRID_STEPS = 20                # nodes per axis; 400-node graph — still instant
ZONE_PENALTY_KM = 400.0        # effective cost of entering a restricted polygon
ZONE_BUFFER_KM = 2.0           # keep-clear buffer around polygons
BASE_SPEED_KMH = 18.0          # ~10 knots: typical small motorised fishing craft
HARBOUR_KM = 3.0               # a course may leave and reach its own harbours
LAND_SAMPLE_KM = 1.0           # how finely a leg is checked for land


def _speed_for(wave_m: Optional[float], wind_kmh: Optional[float]) -> float:
    speed = BASE_SPEED_KMH
    if wave_m:
        speed -= min(5.0, wave_m * 1.6)
    if wind_kmh:
        speed -= min(3.0, wind_kmh / 22.0)
    return max(4.0, speed)


def _zone_cost(pt: Coord) -> Tuple[float, Optional[str]]:
    """Penalty and the offending zone name for a candidate point."""
    worst_cost, worst_name = 0.0, None
    for zone in RESTRICTED_ZONES:
        d = distance_to_polygon_km(pt, zone["polygon"])
        if d == 0.0:
            return ZONE_PENALTY_KM, zone["name"]
        if d < ZONE_BUFFER_KM:
            cost = ZONE_PENALTY_KM * 0.25 * (ZONE_BUFFER_KM - d) / ZONE_BUFFER_KM
            if cost > worst_cost:
                worst_cost, worst_name = cost, zone["name"]
    return worst_cost, worst_name


def _build_grid(origin: Coord, dest: Coord) -> List[List[Coord]]:
    pad = 0.35  # expand the bounding box so the search can detour outside it
    lat_lo, lat_hi = min(origin[0], dest[0]), max(origin[0], dest[0])
    lon_lo, lon_hi = min(origin[1], dest[1]), max(origin[1], dest[1])
    dlat = (lat_hi - lat_lo) or 0.05
    dlon = (lon_hi - lon_lo) or 0.05
    lat_lo, lat_hi = lat_lo - pad * dlat, lat_hi + pad * dlat
    lon_lo, lon_hi = lon_lo - pad * dlon, lon_hi + pad * dlon

    grid: List[List[Coord]] = []
    for i in range(GRID_STEPS):
        row: List[Coord] = []
        for j in range(GRID_STEPS):
            lat = lat_lo + (lat_hi - lat_lo) * i / (GRID_STEPS - 1)
            lon = lon_lo + (lon_hi - lon_lo) * j / (GRID_STEPS - 1)
            row.append((lat, lon))
        grid.append(row)
    return grid


def _nearest_node(grid: List[List[Coord]], pt: Coord) -> Tuple[int, int]:
    best, best_d = (0, 0), float("inf")
    for i, row in enumerate(grid):
        for j, node in enumerate(row):
            d = haversine_km(pt, node)
            if d < best_d:
                best, best_d = (i, j), d
    return best


def _land_between(a: Coord, b: Coord, ends: Sequence[Coord]) -> bool:
    """Does the leg a-b touch land outside the harbour circles around `ends`?

    Sampled every LAND_SAMPLE_KM (the simplified coastline is +-10-20 km in the
    deltas, so a finer test would be false precision). A point within
    HARBOUR_KM of an end is the harbour itself: a boat has to leave it.
    """
    steps = max(1, int(haversine_km(a, b) / LAND_SAMPLE_KM))
    for s in range(steps + 1):
        pt = (a[0] + (b[0] - a[0]) * s / steps, a[1] + (b[1] - a[1]) * s / steps)
        if any(haversine_km(pt, e) <= HARBOUR_KM for e in ends):
            continue
        if is_on_land(pt[0], pt[1]):
            return True
    return False


def route_crosses_land(points: Sequence[Coord]) -> bool:
    """True when a course runs over land anywhere beyond its two ends."""
    ends = (points[0], points[-1]) if points else ()
    return any(_land_between(points[i], points[i + 1], ends) for i in range(len(points) - 1))


def _astar(grid: List[List[Coord]], start: Tuple[int, int], goal: Tuple[int, int],
           wave_m: Optional[float], wind_kmh: Optional[float],
           avoid_zones: bool, ends: Sequence[Coord] = ()) -> List[Tuple[int, int]]:
    rows, cols = len(grid), len(grid[0])
    goal_pt = grid[goal[0]][goal[1]]
    # Land is a wall, not a cost: a leg that touches land outside the two
    # harbours is never taken. Checked lazily, once per leg.
    land_leg: Dict[Tuple[Tuple[int, int], Tuple[int, int]], bool] = {}

    def over_land(a: Tuple[int, int], b: Tuple[int, int]) -> bool:
        key = (a, b) if a <= b else (b, a)
        if key not in land_leg:
            land_leg[key] = _land_between(grid[a[0]][a[1]], grid[b[0]][b[1]], ends)
        return land_leg[key]

    def h(node: Tuple[int, int]) -> float:
        return haversine_km(grid[node[0]][node[1]], goal_pt)

    open_heap = [(h(start), 0.0, start)]
    came: Dict[Tuple[int, int], Tuple[int, int]] = {}
    g_score: Dict[Tuple[int, int], float] = {start: 0.0}
    seen = set()

    wave_penalty_per_km = 0.0 if not wave_m else min(1.2, max(0.0, (wave_m - 1.0)) * 0.6)
    wind_penalty_per_km = 0.0 if not wind_kmh else min(0.8, max(0.0, (wind_kmh - 20)) * 0.02)

    neighbours = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]

    while open_heap:
        _, g, current = heapq.heappop(open_heap)
        if current in seen:
            continue
        seen.add(current)
        if current == goal:
            break
        ci, cj = current
        for di, dj in neighbours:
            ni, nj = ci + di, cj + dj
            if not (0 <= ni < rows and 0 <= nj < cols):
                continue
            nxt = (ni, nj)
            if ends and over_land(current, nxt):
                continue
            leg_km = haversine_km(grid[ci][cj], grid[ni][nj])
            cost = leg_km * (1.0 + wave_penalty_per_km + wind_penalty_per_km)
            if avoid_zones:
                zcost, _ = _zone_cost(grid[ni][nj])
                cost += zcost
            tentative = g + cost
            if tentative < g_score.get(nxt, float("inf")):
                g_score[nxt] = tentative
                came[nxt] = current
                heapq.heappush(open_heap, (tentative + h(nxt), tentative, nxt))

    if goal not in came and goal != start:
        return [start, goal]

    path = [goal]
    while path[-1] != start:
        prev = came.get(path[-1])
        if prev is None:
            break
        path.append(prev)
    return list(reversed(path))


def _perpendicular_km(pt: Coord, a: Coord, b: Coord) -> float:
    """Distance from `pt` to the infinite line a-b (local planar approximation)."""
    import math
    lat0 = math.radians((a[0] + b[0]) / 2)
    kx, ky = math.cos(lat0) * 111.320, 110.574
    px, py = pt[1] * kx, pt[0] * ky
    ax, ay = a[1] * kx, a[0] * ky
    bx, by = b[1] * kx, b[0] * ky
    dx, dy = bx - ax, by - ay
    norm = math.hypot(dx, dy)
    if norm == 0:
        return math.hypot(px - ax, py - ay)
    return abs(dy * px - dx * py + bx * ay - by * ax) / norm


def _simplify(points: List[Coord], tolerance_km: float = 0.8) -> List[Coord]:
    """Douglas-Peucker.

    The naive 'drop each near-collinear point' version silently flattened a
    smooth detour back into the straight line it was built to avoid — the
    per-point deviation is tiny even when the arc as a whole swings wide.
    Douglas-Peucker measures against the retained chord, so the shape survives.
    """
    if len(points) <= 2:
        return list(points)

    worst_i, worst_d = 0, 0.0
    for i in range(1, len(points) - 1):
        d = _perpendicular_km(points[i], points[0], points[-1])
        if d > worst_d:
            worst_i, worst_d = i, d

    if worst_d <= tolerance_km:
        return [points[0], points[-1]]

    left = _simplify(points[: worst_i + 1], tolerance_km)
    right = _simplify(points[worst_i:], tolerance_km)
    return left[:-1] + right


def _path_length(points: Sequence[Coord]) -> float:
    return sum(haversine_km(points[i], points[i + 1]) for i in range(len(points) - 1))


def plan_routes(origin: Coord, dest: Coord, *, wave_m: Optional[float] = None,
                wind_kmh: Optional[float] = None, risk_score: int = 40,
                risk_category: str = "MODERATE",
                lang: Language = "en") -> List[RouteOption]:
    """Return the direct track and the risk-weighted safest track."""
    speed = _speed_for(wave_m, wind_kmh)

    # --- direct / shortest -------------------------------------------------
    direct_pts: List[Coord] = [origin, dest]
    direct_km = haversine_km(origin, dest)
    direct_conflicts = route_zone_conflicts(direct_pts)

    # --- safest (A*, zone-aware) ------------------------------------------
    grid = _build_grid(origin, dest)
    s = _nearest_node(grid, origin)
    g = _nearest_node(grid, dest)
    idx_path = _astar(grid, s, g, wave_m, wind_kmh, avoid_zones=True, ends=(origin, dest))
    full_pts = [origin] + [grid[i][j] for i, j in idx_path] + [dest]
    safe_pts = _simplify(full_pts)
    # Never let cosmetic simplification reintroduce a hazard the planner avoided.
    if route_zone_conflicts(safe_pts) and not route_zone_conflicts(full_pts):
        safe_pts = full_pts
    if route_crosses_land(safe_pts) and not route_crosses_land(full_pts):
        safe_pts = full_pts
    # The chart has no sea path at this resolution: say so, never recommend
    # a line over land as "safest".
    no_sea_route = route_crosses_land(safe_pts)
    safe_km = _path_length(safe_pts)
    safe_conflicts = route_zone_conflicts(safe_pts)

    options: List[RouteOption] = []

    safest = RouteOption(
        name=t("route_name_safest", lang),
        kind="safest",
        legs=[RouteLeg(latitude=round(p[0], 4), longitude=round(p[1], 4)) for p in safe_pts],
        distance_km=round(safe_km, 1),
        eta_minutes=int(round(safe_km / speed * 60)),
        risk_score=risk_score,
        risk_category=risk_category,  # type: ignore[arg-type]
        penalties={"restricted_zones": float(len(safe_conflicts)),
                   "extra_km_vs_direct": round(max(0.0, safe_km - direct_km), 1),
                   "over_land": 1.0 if no_sea_route else 0.0},
        recommended=not no_sea_route,
        notes=(t("route_note_no_sea", lang) if no_sea_route else
               t("route_note_clear", lang) if not safe_conflicts else
               t("route_note_close", lang)),
    )

    direct = RouteOption(
        name=t("route_name_direct", lang),
        kind="shortest",
        legs=[RouteLeg(latitude=round(p[0], 4), longitude=round(p[1], 4)) for p in direct_pts],
        distance_km=round(direct_km, 1),
        eta_minutes=int(round(direct_km / speed * 60)),
        risk_score=min(100, risk_score + 15 * len(direct_conflicts)),
        risk_category="EXTREME" if direct_conflicts else risk_category,  # type: ignore[arg-type]
        penalties={"restricted_zones": float(len(direct_conflicts))},
        recommended=False,
        notes=(t("route_note_through", lang,
                 zones=", ".join(zone_name(z["name"], lang) for z in direct_conflicts))
               if direct_conflicts else t("route_note_direct_clear", lang)),
    )

    direct_over_land = route_crosses_land(direct_pts)
    if direct_over_land:
        direct.penalties["over_land"] = 1.0
        direct.notes = t("route_note_direct_land", lang)

    # If the direct line is clean and barely shorter, don't invent a detour.
    if not direct_conflicts and not direct_over_land and safe_km <= direct_km * 1.03:
        direct.recommended = True
        safest.recommended = False
        options = [direct, safest]
    else:
        options = [safest, direct]

    return options
