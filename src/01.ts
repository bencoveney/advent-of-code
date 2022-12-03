import { Input } from "./utils";

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
  };
  elves.push(current);

  elves.sort((a, b) => a-b).reverse();

  return elves;
}

export function part1({allLines}: Input) {
  const elves = getElves(allLines);
  return elves[0];
};

part1.test = 24000;
part1.real = 67658;

export function part2({allLines}: Input) {
  const elves = getElves(allLines);
  return elves[0] + elves[1] + elves[2];
};

part2.test = 45000;
part2.real = 200158;
