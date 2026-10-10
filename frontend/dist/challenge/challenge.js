/* ORCA · the mentor-challenge showcase. Vanilla, no dependencies, no build.
 *
 * The HTML is complete without this file: every number on the page is
 * already printed from a real backend response. This script adds motion,
 * and the live demo, which talks to the same-origin ORCA API:
 *
 *   GET  /api/config/data-health          is there a backend?
 *   POST /api/chat {message, drill, ...}  ask the question under that drill
 *   POST /api/config/data-health {drill}  fallback only (see chat() below)
 *
 * Each question carries its own drill, so the server-wide drill shared with
 * the ORCA app is not touched. Only a backend that ignores the per-request
 * field makes this page use the global switch, and then it puts the drill
 * back on "healthy" after each answer, when the story ends, on Reset, and
 * when the page is hidden or closed (sendBeacon). Without a backend (static
 * hosting) the demo replays recorded.json, real responses captured from the
 * backend, and says so.
 */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canObserve = "IntersectionObserver" in window;
  doc.classList.add("js");
  if (!reduced && canObserve) doc.classList.add("motion");

  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };
  var sleep = function (ms) {
    return new Promise(function (r) {
      setTimeout(r, ms);
    });
  };

  /* ------------------------------------------------------------ words */
  var QUESTIONS = {
    goa: "Is it safe to go fishing tomorrow morning near Goa?",
    paradip: "Is there a cyclone near Paradip? Can I go fishing?",
    mumbai: "Can I go fishing tomorrow at 6 AM near Mumbai?",
  };
  var PLACE = { goa: "Goa", paradip: "Paradip", mumbai: "Mumbai 6 AM" };
  var STATE_WORD = { GO: "GO", CAUTION: "CAUTION", NO_GO: "NO-GO", INSUFFICIENT_DATA: "INSUFFICIENT DATA" };
  var STATE_SAY = { GO: "go", CAUTION: "caution", NO_GO: "no-go", INSUFFICIENT_DATA: "insufficient data" };
  var TONE = { GO: "go", CAUTION: "caution", NO_GO: "nogo", INSUFFICIENT_DATA: "insufficient" };
  var CONF = { normal: "normal confidence", degraded: "degraded confidence", insufficient: "insufficient evidence" };
  var STATUS = { FRESH: "Fresh", STALE: "Stale", MISSING: "Missing", ERROR: "Error" };
  var FEED = {
    marine: "marine forecast feed",
    weather: "weather forecast feed",
    warnings: "warnings bulletin feed",
    chart: "bundled chart layer",
  };
  var SCALE_S = 12 * 3600; // the ruler's 12 hours

  function ageText(s) {
    if (s === null || s === undefined) return null;
    var m = Math.round(s / 60);
    if (m < 1) return "under 1 min";
    var h = Math.floor(m / 60);
    var r = m % 60;
    if (!h) return m + " min";
    return r ? h + " h " + r + " min" : h + " h";
  }
  function obsText(iso) {
    if (!iso) return null;
    var m = /T(\d\d):(\d\d)(?::\d\d)?(.*)$/.exec(iso);
    if (!m) return iso;
    return m[1] + ":" + m[2] + (m[3] === "+05:30" ? " IST" : " " + m[3]);
  }
  function isStatic(h) {
    return h.freshness_limit_seconds === null || h.freshness_limit_seconds === undefined;
  }
  function limitPair(h) {
    if (isStatic(h)) return "static layer";
    return "fresh ≤ " + ageText(h.freshness_limit_seconds) + " · usable ≤ " + ageText(h.max_age_seconds);
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function restamp(node) {
    if (reduced) return;
    node.classList.remove("thunk-now");
    void node.offsetWidth;
    node.classList.add("thunk-now");
  }

  /* ------------------------------------------------------------ recorded responses */
  var recorded = null;
  var recordedReady = fetch("challenge/recorded.json", { cache: "no-cache" })
    .then(function (r) {
      return r.ok ? r.json() : null;
    })
    .then(function (j) {
      recorded = j;
      return j;
    })
    .catch(function () {
      return null;
    });

  /* ------------------------------------------------------------ reveals */
  if (doc.classList.contains("motion")) {
    $$(".term-out .t-l").forEach(function (l, i) {
      l.style.setProperty("--i", String(i));
    });
    var revealIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealIO.unobserve(e.target);
            // the stamps in a sheet land one after another as it arrives
            $$(".stamp", e.target).forEach(function (s, i) {
              setTimeout(function () {
                restamp(s);
              }, 260 + i * 110);
            });
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    $$("[data-reveal]").forEach(function (n) {
      revealIO.observe(n);
    });
    // A reveal inside a container that was hidden at load (the wide
    // pipeline on a narrow window) would never intersect: on any resize,
    // or before printing, everything is simply shown.
    var revealAll = function () {
      $$("[data-reveal]").forEach(function (n) {
        n.classList.add("in");
      });
    };
    window.addEventListener("resize", revealAll, { once: true });
    window.addEventListener("beforeprint", revealAll);
  }

  /* ------------------------------------------------------------ loops rest off-screen */
  if (canObserve) {
    var idleIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle("idle", !e.isIntersecting);
        if (e.isIntersecting) e.target.classList.add("seen");
      });
    });
    $$(".hero, .sec").forEach(function (s) {
      idleIO.observe(s);
    });
  }

  /* ------------------------------------------------------------ scroll: progress, rail, nav */
  var sheetNums = $$(".sheet-n");
  var progress = $(".progress span");
  var railBoat = $(".rail-boat");
  var rail = $(".rail");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progress) progress.style.transform = "scaleX(" + p.toFixed(4) + ")";
      if (railBoat && rail && rail.offsetHeight) {
        railBoat.style.transform = "translateY(" + Math.round(p * (rail.offsetHeight - 24)) + "px)";
      }
      // the sheet numerals drift a little slower than the sheet (wide screens)
      if (!reduced && sheetNums.length && window.innerWidth >= 1200) {
        var vh = window.innerHeight;
        sheetNums.forEach(function (n) {
          var r = n.parentNode.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) return;
          var t = Math.max(-1, Math.min(1, (r.top - vh * 0.35) / vh));
          n.style.setProperty("--py", (t * 56).toFixed(1) + "px");
        });
      }
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  if (canObserve) {
    var navLinks = $$(".mast-nav a");
    var byId = {};
    navLinks.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var navIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          navLinks.forEach(function (a) {
            a.removeAttribute("aria-current");
          });
          var a = byId[e.target.id];
          if (a) a.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    $$("main > section[id]").forEach(function (s) {
      navIO.observe(s);
    });
  }

  // the vertical pipeline's signal needs the list's height
  var pipeList = $(".pipe-list");
  function sizePipe() {
    if (pipeList) pipeList.style.setProperty("--pipe-h", pipeList.offsetHeight + "px");
  }
  sizePipe();
  window.addEventListener("resize", sizePipe);

  /* ================================================================ hero */
  var HERO = [
    {
      key: "go",
      tone: "go",
      stamp: "GO",
      sub: "normal confidence",
      wave: "0.6 m",
      age: "18 min old",
      deg: (1080 / SCALE_S) * 360,
      status: "FRESH",
      score: "9/100 · LOW",
      reason: "All 4 critical inputs are fresh.",
    },
    {
      key: "caution",
      tone: "caution",
      stamp: "CAUTION",
      sub: "degraded confidence · data stale",
      wave: "0.6 m",
      age: "4 h 10 min old",
      deg: (15000 / SCALE_S) * 360,
      status: "STALE",
      score: "9/100 · unconfirmed",
      reason: "Wave height is 4 h 10 min old — over the 3 h limit.",
    },
    {
      key: "insufficient",
      tone: "insufficient",
      stamp: "INSUFFICIENT DATA",
      sub: "follow the official advisory",
      wave: "—",
      age: "no reading",
      deg: 0,
      status: "MISSING",
      score: "No score — ORCA will not guess",
      reason: "Wave height: no reading — the marine forecast feed did not respond.",
    },
    {
      key: "recovery",
      tone: "go",
      stamp: "GO",
      sub: "normal confidence",
      wave: "0.6 m",
      age: "1 min old",
      deg: (60 / SCALE_S) * 360,
      status: "FRESH",
      score: "9/100 · LOW",
      reason: "The marine forecast feed reconnected 1 min ago — readings are fresh again.",
    },
  ];
  var heroSheet = $(".hero-sheet");
  var heroBits = {};
  $$("[data-hero]", heroSheet).forEach(function (n) {
    heroBits[n.getAttribute("data-hero")] = n;
  });
  var hand = $(".ad-hand", heroSheet);
  var legs = $$(".leg[data-i]");
  var pauseBtn = $(".leg[data-pause]");
  var heroI = 0;
  var heroPaused = reduced;
  var heroHover = false;
  var heroVisible = true;
  if (pauseBtn) {
    pauseBtn.setAttribute("aria-pressed", String(heroPaused));
    pauseBtn.textContent = heroPaused ? "Play" : "Pause";
  }

  function showHero(i) {
    heroI = i;
    var s = HERO[i];
    heroSheet.setAttribute("data-state", s.key === "recovery" ? "go" : s.key);
    heroBits.stamp.textContent = s.stamp;
    heroBits.stamp.setAttribute("data-tone", s.tone);
    heroBits.sub.textContent = s.sub;
    heroBits.reason.textContent = s.reason;
    heroBits.wave.textContent = s.wave;
    heroBits.age.textContent = s.age;
    heroBits.status.textContent = STATUS[s.status];
    heroBits.status.setAttribute("data-s", s.status);
    heroBits.score.textContent = s.score;
    if (hand) hand.style.setProperty("--deg", s.deg.toFixed(1) + "deg");
    restamp(heroBits.stamp);
    legs.forEach(function (b, j) {
      b.setAttribute("aria-pressed", String(j === i));
    });
  }
  legs.forEach(function (b) {
    b.addEventListener("click", function () {
      heroPaused = true;
      if (pauseBtn) {
        pauseBtn.setAttribute("aria-pressed", "true");
        pauseBtn.textContent = "Play";
      }
      showHero(Number(b.getAttribute("data-i")));
    });
  });
  if (pauseBtn) {
    pauseBtn.addEventListener("click", function () {
      heroPaused = !heroPaused;
      pauseBtn.setAttribute("aria-pressed", String(heroPaused));
      pauseBtn.textContent = heroPaused ? "Play" : "Pause";
    });
  }
  heroSheet.addEventListener("pointerenter", function () {
    heroHover = true;
  });
  heroSheet.addEventListener("pointerleave", function () {
    heroHover = false;
  });
  if (canObserve) {
    new IntersectionObserver(function (es) {
      heroVisible = es[0].isIntersecting;
    }).observe(heroSheet);
  }
  setInterval(function () {
    if (heroPaused || heroHover || !heroVisible || document.hidden) return;
    showHero((heroI + 1) % HERO.length);
  }, 3600);
  if (hand) hand.style.setProperty("--deg", HERO[0].deg.toFixed(1) + "deg");

  /* ================================================================ health cards + ruler */
  var cards = {};
  $$("#health-cards .hcard").forEach(function (c) {
    cards[c.getAttribute("data-input")] = c;
  });
  var rows = {};
  $$(".ruler .r-row").forEach(function (r) {
    rows[r.getAttribute("data-input")] = r;
  });
  var healthSrc = $("#health-src");
  var hdrillBtns = $$("[data-hdrill]");

  function renderHealth(health, label, drill) {
    if (!health) return;
    health.forEach(function (h) {
      var c = cards[h.input];
      var gone = h.status === "MISSING" || h.status === "ERROR";
      if (c) {
        var changed = c.getAttribute("data-s") !== h.status;
        c.setAttribute("data-s", h.status);
        var f = function (k) {
          return $('[data-f="' + k + '"]', c);
        };
        f("feed").textContent = FEED[h.feed] || h.feed;
        f("obs").textContent = obsText(h.observed_at) || (isStatic(h) && !gone ? "bundled" : "no reading");
        f("age").textContent = ageText(h.age_seconds) || (gone ? "—" : isStatic(h) ? "static" : "—");
        f("limit").textContent = limitPair(h);
        var st = f("status");
        st.textContent = STATUS[h.status] || h.status;
        st.setAttribute("data-s", h.status);
        if (changed && !reduced) {
          c.classList.remove("bump");
          void c.offsetWidth;
          c.classList.add("bump");
        }
      }
      var r = rows[h.input];
      if (r && !isStatic(h)) {
        r.style.setProperty("--f", ((h.freshness_limit_seconds / SCALE_S) * 100).toFixed(3));
        r.style.setProperty("--m", (Math.min(1, h.max_age_seconds / SCALE_S) * 100).toFixed(3));
        r.setAttribute("data-s", h.status);
        var mk = $(".r-mk", r);
        var pin = $(".r-pin b", r);
        var a = gone || h.age_seconds === null ? 0 : Math.min(100, (h.age_seconds / SCALE_S) * 100);
        mk.style.setProperty("--a", a.toFixed(3));
        mk.setAttribute("data-edge", a < 6 ? "start" : "mid");
        pin.textContent = gone ? "no reading" : ageText(h.age_seconds) + (h.status === "STALE" ? " · stale" : "");
      }
    });
    if (healthSrc && label) healthSrc.textContent = label;
    if (drill) {
      hdrillBtns.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-hdrill") === drill));
      });
    }
  }
  hdrillBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var d = b.getAttribute("data-hdrill");
      recordedReady.then(function (rec) {
        var resp = rec && rec.responses[d + "/goa"];
        if (resp) renderHealth(resp.data_health, "recorded from the real backend · drill " + d, d);
      });
    });
  });
  // mark the start of the ruler for markers near zero
  $$(".r-mk").forEach(function (m) {
    m.setAttribute("data-edge", "start");
  });

  /* ================================================================ what if
   * An illustration of the backend's freshness rule (data_health.py) and the
   * gate (safety_gate.py), computed here for the Goa question with every
   * other input fresh. Nothing is sent anywhere: the limits come from
   * GET /api/config/data-health when a backend answers, else recorded.json.
   *   age <= fresh limit -> FRESH  -> GO, normal confidence
   *   age <= max age     -> STALE  -> CAUTION, degraded (score unconfirmed)
   *   older than that    -> too old, counts as missing -> INSUFFICIENT DATA,
   *                         and no score is printed */
  var wi = $("#whatif");
  var wiLimitsFrom = null; // "live" | "recorded"
  var whatIf = { limits: function () {} };
  if (wi) {
    var wiIn = $("#wi-age", wi);
    var wiOut = $(".wi-out", wi);
    var wiLive = $("#wi-live", wi);
    var W = {};
    $$("[data-wi]", wi).forEach(function (n) {
      W[n.getAttribute("data-wi")] = n;
    });
    var lawLis = $$(".wi-law li", wi);
    var wd = { fresh: $(".wd-fresh", wi), stale: $(".wd-stale", wi), dead: $(".wd-dead", wi), hand: $(".wd-hand", wi) };
    var lim = { fresh: 10800, max: 21600 };
    var wiState = null;
    var WI_STATUS = { FRESH: "Fresh", STALE: "Stale", MISSING: "Too old · treated as missing" };
    var LAW_K = { FRESH: "fresh", STALE: "stale", MISSING: "dead" };

    var wiUpdate = function (min, quiet) {
      var s = Math.max(0, min) * 60;
      var st = s <= lim.fresh ? "FRESH" : s <= lim.max ? "STALE" : "MISSING";
      var state = st === "FRESH" ? "GO" : st === "STALE" ? "CAUTION" : "INSUFFICIENT_DATA";
      var a = ageText(s);
      W.age.textContent = a;
      W["age-sm"].textContent = a;
      wi.style.setProperty("--a", Math.min(100, (s / SCALE_S) * 100).toFixed(3));
      wd.hand.style.setProperty("--deg", Math.min(360, (s / SCALE_S) * 360).toFixed(1) + "deg");
      wi.setAttribute("data-s", st);
      wiOut.setAttribute("data-s", st);
      wiOut.setAttribute("data-state", state);
      W.status.textContent = WI_STATUS[st];
      W.status.setAttribute("data-s", st);
      W.stamp.textContent = STATE_WORD[state];
      W.stamp.setAttribute("data-tone", TONE[state]);
      if (state === "GO") {
        W.why.textContent = "Normal confidence, 9/100. All 4 critical inputs are fresh.";
      } else if (state === "CAUTION") {
        W.why.textContent =
          "Degraded confidence, 9/100 unconfirmed. Wave height is " + a + " old — over the " + ageText(lim.fresh) + " limit.";
      } else {
        W.why.textContent =
          "No score: ORCA will not guess. Wave height is " + a + " old — too old to use (limit " +
          ageText(lim.max) + "). Follow the official advisory.";
      }
      lawLis.forEach(function (li) {
        li.setAttribute("aria-current", String(li.getAttribute("data-k") === LAW_K[st]));
      });
      wiIn.setAttribute("aria-valuetext", a + " old: " + WI_STATUS[st].toLowerCase() + ", gate says " + STATE_SAY[state]);
      if (state !== wiState) {
        if (wiState !== null && !quiet) {
          restamp(W.stamp);
          wiLive.textContent =
            "Wave reading " + a + " old: " + WI_STATUS[st].toLowerCase() + ". The gate says " + STATE_SAY[state] + ".";
        }
        wiState = state;
      }
    };

    whatIf.limits = function (inp, from) {
      if (!inp || typeof inp.fresh_s !== "number" || typeof inp.max_age_s !== "number") return;
      if (wiLimitsFrom === "live" && from !== "live") return; // the live server wins
      wiLimitsFrom = from;
      lim.fresh = inp.fresh_s;
      lim.max = inp.max_age_s;
      var f = Math.min(100, (lim.fresh / SCALE_S) * 100);
      var m = Math.min(100, (lim.max / SCALE_S) * 100);
      wi.style.setProperty("--f", f.toFixed(3));
      wi.style.setProperty("--m", m.toFixed(3));
      wd.fresh.style.strokeDasharray = f.toFixed(2) + " 100";
      wd.stale.style.strokeDasharray = "0 " + f.toFixed(2) + " " + (m - f).toFixed(2) + " 100";
      wd.dead.style.strokeDasharray = "0 " + m.toFixed(2) + " " + (100 - m).toFixed(2) + " 100";
      W["ax-f"].textContent = ageText(lim.fresh);
      W["ax-f"].style.setProperty("--x", f.toFixed(3));
      W["ax-m"].textContent = ageText(lim.max);
      W["ax-m"].style.setProperty("--x", m.toFixed(3));
      W["law-f"].textContent = ageText(lim.fresh);
      W["law-m"].textContent = ageText(lim.max);
      W.limits.textContent =
        "fresh ≤ " + ageText(lim.fresh) + " · usable ≤ " + ageText(lim.max) +
        (from === "live" ? ", read from this server just now" : ", as recorded from the real backend");
      wiUpdate(Number(wiIn.value), true);
    };

    wiIn.addEventListener("input", function () {
      wiUpdate(Number(wiIn.value), false);
    });
    wiIn.addEventListener("keydown", function (e) {
      var d = e.key === "PageUp" ? 60 : e.key === "PageDown" ? -60 : 0;
      if (!d) return;
      e.preventDefault();
      wiIn.value = String(Math.max(0, Math.min(720, Number(wiIn.value) + d)));
      wiUpdate(Number(wiIn.value), false);
    });
    $$("[data-wi-min]", wi).forEach(function (b) {
      b.addEventListener("click", function () {
        wiIn.value = b.getAttribute("data-wi-min");
        wiUpdate(Number(wiIn.value), false);
      });
    });
    wiUpdate(Number(wiIn.value), true);
    recordedReady.then(function (rec) {
      if (rec && rec.config && rec.config.inputs) whatIf.limits(rec.config.inputs.wave, "recorded");
    });
  }

  /* ================================================================ live demo */
  var demo = {
    mode: "checking",
    drill: "healthy",
    q: "goa",
    serverDrill: null, // the last drill this page set on the server (fallback only)
    perRequest: null, // does the backend honour "drill" in the chat body? null: not known yet
    seq: 0,
    story: null,
  };
  var SESSION = "challenge-" + Math.random().toString(36).slice(2, 8);
  var result = $("#result");
  var R = {
    live: $("#result-live"),
    q: $("#res-q"),
    meta: $("#res-meta"),
    stamp: $("#res-stamp"),
    conf: $("#res-conf"),
    score: $("#res-score"),
    scoreN: $("#res-score-n"),
    cat: $("#res-cat"),
    headline: $("#res-headline"),
    reasons: $("#res-reasons"),
    floor: $("#res-floor"),
    health: $("#res-health"),
    trace: $("#res-trace"),
    evidence: $("#res-evidence"),
    answer: $("#res-answer"),
    elapsed: $("#res-elapsed"),
    origin: $("#res-origin"),
  };
  var modeBox = $("#mode");
  var modeText = $("#mode-text");
  var caption = $("#caption");
  var storyBtn = $("#story-btn");
  var storyLabel = $("#story-label");
  var resetBtn = $("#reset-btn");
  var drillBtns = $$("[data-drill]");
  var qBtns = $$("[data-q]");
  var storySteps = $$("#story li");

  function setMode(mode, note) {
    demo.mode = mode;
    modeBox.setAttribute("data-mode", mode);
    if (mode === "live") {
      modeText.textContent = "Live: connected to the ORCA backend on this server. Every answer below is computed now.";
    } else {
      modeText.textContent =
        (note ? note + " " : "No ORCA backend on this host. ") +
        "Showing responses recorded from the real backend (10 Oct 2026).";
    }
  }

  function fetchT(url, opts, ms) {
    var ctl = "AbortController" in window ? new AbortController() : null;
    var t = ctl
      ? setTimeout(function () {
          ctl.abort();
        }, ms)
      : 0;
    var o = opts || {};
    if (ctl) o.signal = ctl.signal;
    return fetch(url, o).finally(function () {
      clearTimeout(t);
    });
  }
  function postJSON(url, body, ms) {
    return fetchT(
      url,
      { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) },
      ms
    ).then(function (r) {
      if (!r.ok) throw new Error(url + " answered " + r.status);
      return r.json();
    });
  }

  function detect() {
    return fetchT("/api/config/data-health", { cache: "no-store" }, 3500)
      .then(function (r) {
        if (!r.ok) throw new Error("no api");
        return r.json();
      })
      .then(function (j) {
        if (!j || !Array.isArray(j.drills)) throw new Error("not orca");
        setMode("live");
        if (j.inputs) whatIf.limits(j.inputs.wave, "live");
      })
      .catch(function () {
        setMode("recorded");
      });
  }

  function syncChips() {
    drillBtns.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-drill") === demo.drill));
    });
    qBtns.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-q") === demo.q));
    });
  }

  function cellFor(d) {
    var row = d.risk_go === false ? "nogo" : "go";
    var col =
      d.risk_go === null || d.risk_go === undefined || (d.blocking_inputs || []).length
        ? "missing"
        : (d.stale_inputs || []).length
        ? "stale"
        : "fresh";
    return row + "-" + col;
  }
  function lightMatrix(d) {
    $$(".matrix td").forEach(function (td) {
      td.classList.remove("lit");
      var h = $(".here", td);
      if (h) h.remove();
    });
    var td = $('.matrix td[data-cell="' + cellFor(d) + '"]');
    if (td) {
      td.classList.add("lit");
      td.appendChild(el("span", "here", "last demo answer"));
    }
  }

  function render(r, origin, drill, q, quiet) {
    var d = r.decision || {};
    var state = d.state || "INSUFFICIENT_DATA";
    var withheld = state === "INSUFFICIENT_DATA" || !r.risk;
    result.setAttribute("data-state", state);

    R.q.textContent = r.question || QUESTIONS[q];
    var served = d.drill || drill;
    R.meta.textContent =
      (origin === "live" ? "live answer" : "recorded from the real backend") +
      " · drill " +
      served +
      (origin === "live" && served !== drill ? " (another client changed it)" : "");

    var newStamp = STATE_WORD[state] || state;
    R.stamp.textContent = newStamp;
    R.stamp.setAttribute("data-tone", TONE[state] || "insufficient");
    if (!quiet) restamp(R.stamp);
    R.conf.textContent = CONF[d.confidence] || d.confidence || "";

    // the score, or nothing at all
    R.score.setAttribute("data-withheld", String(withheld));
    if (!withheld) {
      var n = String(r.risk.score);
      if (R.scoreN.textContent !== n && !quiet && !reduced) {
        R.scoreN.classList.remove("flip");
        void R.scoreN.offsetWidth;
        R.scoreN.classList.add("flip");
      }
      R.scoreN.textContent = n;
      R.cat.textContent = r.risk.category + (state === "CAUTION" ? " · unconfirmed" : "");
      R.cat.setAttribute("data-cat", r.risk.category);
    } else {
      R.scoreN.textContent = "—";
      R.cat.textContent = "withheld";
      R.cat.setAttribute("data-cat", "");
    }

    R.headline.textContent = d.headline || "";
    R.reasons.textContent = "";
    (d.reasons || []).forEach(function (x) {
      R.reasons.appendChild(el("li", "", x));
    });

    var ov = r.risk && r.risk.overrides && r.risk.overrides.length ? r.risk.overrides[0] : "";
    if (ov && !withheld) {
      R.floor.hidden = false;
      R.floor.textContent = "Safety floor in force: " + ov + ". The gate cannot lower it.";
    } else {
      R.floor.hidden = true;
      R.floor.textContent = "";
    }

    // data health, as the gate saw it
    var prev = {};
    $$("tr", R.health).forEach(function (tr) {
      prev[tr.getAttribute("data-input")] = tr.getAttribute("data-s");
    });
    R.health.textContent = "";
    (r.data_health || []).forEach(function (h) {
      var tr = el("tr");
      tr.setAttribute("data-input", h.input);
      tr.setAttribute("data-s", h.status);
      if (prev[h.input] && prev[h.input] !== h.status && !quiet) tr.className = "changed";
      var th = el("th", "", h.label);
      th.setAttribute("scope", "row");
      if (h.critical) {
        th.appendChild(document.createTextNode(" "));
        th.appendChild(el("span", "crit-dot", "critical"));
      }
      var gone = h.status === "MISSING" || h.status === "ERROR";
      tr.appendChild(th);
      tr.appendChild(el("td", "", ageText(h.age_seconds) || (gone ? "no reading" : "static")));
      tr.appendChild(el("td", "", isStatic(h) ? "bundled" : ageText(h.freshness_limit_seconds)));
      var td = el("td");
      var chip = el("span", "chip-status", STATUS[h.status] || h.status);
      chip.setAttribute("data-s", h.status);
      td.appendChild(chip);
      tr.appendChild(td);
      R.health.appendChild(tr);
    });

    // the crew
    R.trace.textContent = "";
    (r.trace || []).forEach(function (t) {
      var li = el("li");
      li.setAttribute("data-st", t.status);
      li.appendChild(el("b", "", t.agent));
      var summary = t.summary;
      // The risk engine still runs on what it has; when the gate withholds
      // the result, this page does not print the number either.
      if (withheld && t.agent === "risk") summary = "ran; its number is withheld by the gate";
      li.appendChild(el("span", "", summary));
      R.trace.appendChild(li);
    });

    // the evidence ledger's gate rows
    R.evidence.textContent = "";
    (r.evidence || [])
      .filter(function (e) {
        return /^(Safety gate|Freshness)/.test(e.label);
      })
      .forEach(function (e) {
        var li = el("li");
        li.appendChild(el("b", "", e.label));
        li.appendChild(el("span", "", e.value));
        R.evidence.appendChild(li);
      });

    R.answer.textContent = r.answer || "";
    R.elapsed.textContent = "pipeline answered in " + (r.elapsed_ms || 0) + " ms";
    R.origin.textContent =
      origin === "live" ? "live from POST /api/chat" : "recorded from the real backend, POST /api/chat";

    if (!quiet) {
      R.live.textContent =
        PLACE[q] +
        " under the " +
        drill +
        " drill: " +
        STATE_SAY[state] +
        ", " +
        (CONF[d.confidence] || "") +
        ". " +
        (withheld ? "No score. " : "Risk " + r.risk.score + " out of 100. ") +
        ((d.reasons || [])[0] || "");
    }

    lightMatrix(d);
    renderHealth(
      r.data_health,
      (origin === "live" ? "following the live demo" : "recorded from the real backend") + " · drill " + served,
      served
    );
  }

  var chain = Promise.resolve();
  function ask(drill, q) {
    var seq = ++demo.seq;
    demo.drill = drill;
    demo.q = q;
    syncChips();
    result.setAttribute("aria-busy", "true");
    var job = chain.then(function () {
      if (seq !== demo.seq) return null; // a newer press replaced this one
      return runAsk(seq, drill, q);
    });
    chain = job.catch(function () {});
    return job;
  }

  // Every question carries its own drill ("drill" in the /api/chat body), so
  // the server-wide drill, which the ORCA app shares, is left alone. A backend
  // that predates the per-request field answers under its global drill; that
  // shows as decision.drill !== the drill sent, and only then does this page
  // fall back to the global switch for that run, restoring Healthy after it.
  function chat(seq, drill, q) {
    return postJSON(
      "/api/chat",
      { message: QUESTIONS[q], session_id: SESSION + "-" + seq, language: "en", drill: drill },
      25000
    );
  }
  function honoured(res, drill) {
    return !!(res && res.decision && res.decision.drill === drill);
  }
  function viaGlobalSwitch(seq, drill, q) {
    return postJSON("/api/config/data-health", { drill: drill }, 6000)
      .then(function () {
        demo.serverDrill = drill;
        return chat(seq, drill, q);
      })
      .then(function (res) {
        return restore().then(function () {
          return res;
        });
      });
  }
  function runAsk(seq, drill, q) {
    var origin = "recorded";
    var live = demo.mode === "live"
      ? (demo.perRequest === false ? viaGlobalSwitch(seq, drill, q) : chat(seq, drill, q))
          .then(function (res) {
            if (demo.perRequest === false || honoured(res, drill)) {
              if (demo.perRequest !== false && drill !== "healthy") demo.perRequest = true;
              return res;
            }
            demo.perRequest = false; // this backend ignores the field
            return viaGlobalSwitch(seq, drill, q);
          })
          .then(function (res) {
            origin = "live";
            return res;
          })
          .catch(function () {
            restore();
            setMode("recorded", "The live backend stopped answering.");
            return null;
          })
      : Promise.resolve(null);
    return live
      .then(function (res) {
        if (res) return res;
        return recordedReady.then(function (rec) {
          return sleep(reduced ? 0 : 480).then(function () {
            return rec ? rec.responses[drill + "/" + q] : null;
          });
        });
      })
      .then(function (res) {
        if (seq !== demo.seq) return;
        result.setAttribute("aria-busy", "false");
        if (res) render(res, origin, drill, q, false);
        else R.live.textContent = "No answer: neither the backend nor the recording could be read.";
      });
  }

  function restore() {
    if (demo.mode !== "live" || demo.serverDrill === null || demo.serverDrill === "healthy") {
      return Promise.resolve();
    }
    return postJSON("/api/config/data-health", { drill: "healthy" }, 6000)
      .then(function () {
        demo.serverDrill = "healthy";
      })
      .catch(function () {});
  }
  function beaconRestore() {
    if (demo.mode !== "live" || demo.serverDrill === null || demo.serverDrill === "healthy") return;
    var body = JSON.stringify({ drill: "healthy" });
    var sent = false;
    try {
      sent = navigator.sendBeacon("/api/config/data-health", new Blob([body], { type: "application/json" }));
    } catch (e) {
      sent = false;
    }
    if (!sent) {
      try {
        fetch("/api/config/data-health", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: body,
          keepalive: true,
        });
      } catch (e) {
        /* nothing more to try */
      }
    }
    demo.serverDrill = "healthy";
  }
  window.addEventListener("pagehide", beaconRestore);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      if (demo.story) stopStory("The story stopped when the page was hidden.");
      beaconRestore();
    }
  });

  /* ------------------------------------------------------------ the story */
  var STORY = [
    {
      drill: "healthy",
      q: "goa",
      cap: "Healthy. Every critical input is fresh, so ORCA answers exactly as it always did: 9/100, GO, normal confidence.",
    },
    {
      drill: "stale",
      q: "goa",
      cap: "Stale. Same sea, same 9/100, but the wave forecast is 4 h 10 min old. Before today ORCA would have said “Safe to go” at full confidence.",
    },
    {
      drill: "unavailable",
      q: "goa",
      cap: "Missing. The marine feed stops answering. No score and no invented wave height: insufficient data, follow the official advisory. The ocean agent turns amber.",
    },
    {
      drill: "unavailable",
      q: "paradip",
      cap: "The floor holds. The feed is still down and the cyclone warning still wins: 92 EXTREME, NO-GO. Bad data only pushes ORCA toward caution.",
    },
    {
      drill: "recovery",
      q: "goa",
      cap: "Recovery. The feed reconnects and the next question is GO at normal confidence again. No restart, no code change.",
    },
  ];
  var DWELL = 5600;

  function say(text) {
    caption.textContent = text;
    if (!reduced) {
      caption.classList.remove("is-new");
      void caption.offsetWidth;
      caption.classList.add("is-new");
    }
  }
  function markStep(i) {
    storySteps.forEach(function (li, j) {
      li.classList.toggle("on", j === i);
      li.classList.toggle("done", j < i);
      var bar = $(".st-bar i", li);
      if (j >= i) {
        bar.style.transition = "none";
        bar.style.transform = "";
      }
    });
  }
  function runBar(i, ms) {
    var bar = $(".st-bar i", storySteps[i]);
    void bar.offsetWidth;
    bar.style.transition = reduced ? "none" : "transform " + ms + "ms linear";
    bar.style.transform = "scaleX(1)";
  }
  function setStoryUi(on) {
    storyBtn.setAttribute("aria-pressed", String(on));
    storyLabel.textContent = on ? "Stop the story" : "Play the story";
  }
  function wait(ms, token) {
    return new Promise(function (resolve) {
      var t = setTimeout(resolve, ms);
      token.cancel = function () {
        clearTimeout(t);
        resolve();
      };
    });
  }
  function playStory() {
    var token = { stopped: false, cancel: null };
    demo.story = token;
    setStoryUi(true);
    var i = 0;
    var step = function () {
      if (token.stopped) return null;
      if (i >= STORY.length) return finish();
      var s = STORY[i];
      markStep(i);
      say(s.cap);
      return ask(s.drill, s.q).then(function () {
        if (token.stopped) return null;
        runBar(i, DWELL);
        return wait(DWELL, token).then(function () {
          i += 1;
          return step();
        });
      });
    };
    var finish = function () {
      storySteps.forEach(function (li) {
        li.classList.remove("on");
        li.classList.add("done");
      });
      return restore().then(function () {
        if (token.stopped) return;
        demo.story = null;
        demo.drill = "healthy";
        syncChips();
        setStoryUi(false);
        say("That is the story. The drill is back on Healthy. Pick any drill and question to explore it yourself.");
      });
    };
    step();
  }
  function stopStory(text, noRestore) {
    var token = demo.story;
    if (!token) return Promise.resolve();
    token.stopped = true;
    if (token.cancel) token.cancel();
    demo.story = null;
    setStoryUi(false);
    storySteps.forEach(function (li) {
      li.classList.remove("on");
    });
    if (text) say(text);
    return noRestore ? Promise.resolve() : restore();
  }

  storyBtn.addEventListener("click", function () {
    if (demo.story) {
      stopStory("Story stopped. The drill is back on Healthy.").then(function () {
        demo.drill = "healthy";
        syncChips();
      });
    } else {
      playStory();
    }
  });
  resetBtn.addEventListener("click", function () {
    stopStory(null, true);
    markStep(-1);
    say("Reset. The marine feed is healthy again.");
    ask("healthy", "goa");
  });
  drillBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      if (demo.story) stopStory(null, true);
      ask(b.getAttribute("data-drill"), demo.q);
    });
  });
  qBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      if (demo.story) stopStory(null, true);
      ask(demo.drill, b.getAttribute("data-q"));
    });
  });

  /* ------------------------------------------------------------ boot */
  detect();
  recordedReady.then(function (rec) {
    if (!rec) return;
    var first = rec.responses["healthy/goa"];
    if (first && demo.seq === 0) render(first, "recorded", "healthy", "goa", true);
  });
})();
