import chalk from "chalk";
import fs from "fs/promises";

export async function loadSolutions() {
  const list = await fs.readdir("./src");
  return list.filter((file) => file.match(/\d\d\.ts/) != null).sort();
}

export function leftPad(text: string, length: number, padWith: string = "0") {
  return padWith.repeat(length - text.length) + text;
}

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

export function copyArr<T = any>(arr: T[]): T[] {
  return arr.concat([]);
}

export function sum(nums: number[]): number {
  return nums.reduce((prev, next) => prev + next, 0);
}

export function sortNumsAsc(nums: number[]): number[] {
  return copyArr(nums).sort((a, b) => a - b);
}

export function sortNumsDesc(nums: number[]): number[] {
  return sortNumsAsc(nums).reverse();
}

export function highest(nums: number[]): number {
  const sorted = sortNumsDesc(nums);
  return sorted[0] || 0;
}

export function lowest(nums: number[]): number {
  const sorted = sortNumsAsc(nums);
  return sorted[0] || 0;
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
