import { Input, sortNumsDesc, sum } from "../utils.js";

export function getElves(lines: string[]): number[] {
  const elves = [0];

  let current = 0;
  for (const cal of lines) {
    if (cal === "") {
      elves.push(current);
      current = 0;
    } else {
      current += parseInt(cal);
    }
  }
  elves.push(current);

  return sortNumsDesc(elves);
}

export function part1({ allLines }: Input) {
  return getElves(allLines)[0];
}

part1.test = 24000;
part1.real = 67658;

export function part2({ allLines }: Input) {
  return sum(getElves(allLines).slice(0, 3));
}

part2.test = 45000;
part2.real = 200158;
