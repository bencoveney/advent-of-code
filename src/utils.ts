import chalk from "chalk";

export type Input = {
  raw: string; // Caveat: Trailing whitespace trimmed.
  lines: string[]; // Excludes empty.
  allLines: string[]; // Includes empty.
};

export type PartAnswer<T = number> = {
  test?: T;
  real?: T;
  (input: Input): T;
};

export function festive(text: string): string {
  return text
    .split("")
    .map((character, index) =>
      index % 2 === 0
        ? chalk.redBright(character)
        : chalk.greenBright(character)
    )
    .join("");
}

export function chunk<T = any>(arr: T[], chunkSize: number): T[][] {
  return arr.reduce((prev, next) => {
    const lastGroup = prev[prev.length - 1];
    if (!lastGroup || lastGroup.length === chunkSize) {
      prev.push([next]);
    } else {
      lastGroup.push(next);
    }
    return prev;
  }, [] as T[][]);
}

export function sum(nums: number[]): number {
  return nums.reduce((prev, next) => prev + next, 0);
}

export function sortNums(nums: number[]): number[] {
  return nums.sort((a, b) => a - b);
}

export const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
