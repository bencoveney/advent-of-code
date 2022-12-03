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
  return text.split("").map((character, index) => index % 2 === 0 ? chalk.redBright(character) : chalk.greenBright(character)).join("");
}