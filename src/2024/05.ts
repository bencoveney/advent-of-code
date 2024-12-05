import { Input } from "../utils.js";

type OrderingRule = { before: number; after: number };

function parseInput(lines: string[]): {
  orderingRules: OrderingRule[];
  updates: number[][];
} {
  const split = lines.indexOf("");

  const orderingRules = lines
    .filter((_, index) => index < split)
    .map<OrderingRule>((rule) => {
      const [left, right] = rule.split("|");
      return { before: parseInt(left), after: parseInt(right) };
    });

  const updates = lines
    .filter((_, index) => index > split)
    .map((update) => update.split(",").map((page) => parseInt(page)));

  return { orderingRules, updates };
}

function isUpdateCorrect(update: number[], orderingRules: OrderingRule[]) {
  const violatedRules = orderingRules.filter(({ before, after }) => {
    if (!update.includes(before)) {
      return false;
    }
    if (!update.includes(after)) {
      return false;
    }
    return update.indexOf(before) > update.indexOf(after);
  });
  return violatedRules.length === 0;
}

export function part1({ raw, lines, allLines, chars }: Input) {
  const { orderingRules, updates } = parseInput(allLines);

  const correctUpdates = updates.filter((update) =>
    isUpdateCorrect(update, orderingRules)
  );

  return correctUpdates.reduce(
    (prev, next) => prev + next[(next.length - 1) / 2],
    0
  );
}

part1.test = 143;
part1.real = 7198;

export function part2({ raw, lines, allLines, chars }: Input) {
  const { orderingRules, updates } = parseInput(allLines);

  const incorrectUpdates = updates.filter(
    (update) => !isUpdateCorrect(update, orderingRules)
  );

  const correctedUpdates = incorrectUpdates.map((update) => {
    const relevantRules = orderingRules.filter(
      (rule) => update.includes(rule.before) && update.includes(rule.after)
    );

    let remainingPages = update;
    let remainingRules = relevantRules;
    let newOrder = [];
    while (remainingPages.length > 0) {
      // Find a page which only appears on the left side of rules
      const next = remainingPages.find((page) =>
        remainingRules.every(({ before, after }) => {
          if (before === page) {
            return true;
          }
          if (after === page) {
            return false;
          }
          return true;
        })
      );
      if (!next) {
        throw new Error("Could not establish order");
      }
      newOrder.push(next);
      remainingPages = remainingPages.toSpliced(
        remainingPages.indexOf(next),
        1
      );
      remainingRules = remainingRules.filter((rule) => rule.before !== next);
    }
    return newOrder;
  });

  return correctedUpdates.reduce(
    (prev, next) => prev + next[(next.length - 1) / 2],
    0
  );
}

part2.test = 123;
part2.real = 4230;
