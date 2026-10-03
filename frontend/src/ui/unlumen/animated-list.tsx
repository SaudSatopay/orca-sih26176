/*
 * Animated List — from Unlumen UI (https://ui.unlumen.com/docs/components/animated-list),
 * free component, used under the Unlumen UI license. See src/ui/LICENSES.md.
 *
 * Adapted for ORCA: a log that takes new entries at the top. The newest entry
 * drops in from above on a short spring and the rest make room; nothing
 * enters from opacity 0, because the entries are readings and must be
 * legible from their first frame (only a leaving entry fades). It renders as
 * a table body as well as a list, so a log keeps its table semantics. Under
 * reduced motion entries are simply there.
 */
import { type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, prefersReducedMotion } from "../cn";

/** The house spring for an entry making its way in: short, no overshoot to speak of. */
const SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

const ITEM = { div: motion.div, li: motion.li, tr: motion.tr } as const;
const LIST = { div: "div", ol: "ol", ul: "ul", tbody: "tbody" } as const;

/** What a caller may set on an entry's element. */
export type ItemProps = { className?: string; style?: CSSProperties } & { [data: `data-${string}`]: string | undefined };

export interface AnimatedListProps<T> {
  /** Index 0 is the newest. */
  items: T[];
  itemKey: (item: T) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
  /** The list element; `tbody` keeps a log a real table. */
  as?: keyof typeof LIST;
  /** The element each entry is drawn in; follows `as` by default. */
  itemAs?: keyof typeof ITEM;
  className?: string;
  /** Class, style and data attributes for each entry's own element. */
  itemProps?: (item: T, index: number) => ItemProps;
  /** Distance the newest entry drops from, px. */
  drop?: number;
}

export function AnimatedList<T>({
  items,
  itemKey,
  renderItem,
  as = "div",
  itemAs = as === "tbody" ? "tr" : as === "div" ? "div" : "li",
  className,
  itemProps,
  drop = 14,
}: AnimatedListProps<T>) {
  const still = prefersReducedMotion();
  const List = LIST[as];
  const Item = ITEM[itemAs];
  return (
    <List className={cn(className)}>
      <AnimatePresence initial={false}>
        {items.map((item, index) => (
          <Item
            key={itemKey(item)}
            data-index={index}
            {...itemProps?.(item, index)}
            layout={still ? false : "position"}
            initial={still ? false : { y: -drop }}
            animate={{ y: 0 }}
            exit={still ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.15 } }}
            transition={SPRING}
          >
            {renderItem(item, index)}
          </Item>
        ))}
      </AnimatePresence>
    </List>
  );
}
