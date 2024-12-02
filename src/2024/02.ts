import { Input } from "../utils.js";

export function part1({ lines }: Input) {
  return lines.filter((line) => {
    let values = line.split(" ").map((num) => parseInt(num));
    const noProblems = checkForProblems(values);
    return noProblems;
  }).length;
}

function checkForProblems(values: number[]) {
  let [current, ...rest] = values;
  let ascending = true;
  let descending = true;
  let withinRange = true;
  while (rest.length > 0) {
    let [next, ...nextRest] = rest;
    if (next < current) {
      ascending = false;
    }
    if (next > current) {
      descending = false;
    }
    let change = Math.abs(current - next);
    if (change < 1 || change > 3) {
      withinRange = false;
    }
    current = next;
    rest = nextRest;
  }
  return (ascending || descending) && withinRange;
}

part1.test = 2;
part1.real = 390;

export function part2({ lines }: Input) {
  return lines.filter((line) => {
    let values = line.split(" ").map((num) => parseInt(num));
    const noProblems = checkForProblems(values);
    if (noProblems) {
      return true;
    }
    for (let i = 0; i < values.length; i++) {
      const withoutValue = values.toSpliced(i, 1);
      const noProblems = checkForProblems(withoutValue);
      if (noProblems) return true;
    }
    return false;
  }).length;
}

part2.test = 4;
part2.real = 439;
