import { Input, sum } from "../utils.js";

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
  return (
    orderingRules.filter(
      ({ before, after }) =>
        update.includes(before) &&
        update.includes(after) &&
        update.indexOf(before) > update.indexOf(after)
    ).length === 0
  );
}

function middleNum(nums: number[]) {
  return nums[(nums.length - 1) / 2];
}

export function part1({ allLines }: Input) {
  const { orderingRules, updates } = parseInput(allLines);

  const correctUpdates = updates.filter((update) =>
    isUpdateCorrect(update, orderingRules)
  );

  return sum(correctUpdates.map(middleNum));
}

part1.test = 143;
part1.real = 7198;

export function part2({ allLines }: Input) {
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
        remainingRules.every(
          ({ before, after }) => before === page || after !== page
        )
      );
      if (!next) {
        throw new Error("Bad rules");
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

  return sum(correctedUpdates.map(middleNum));
}

part2.test = 123;
part2.real = 4230;
