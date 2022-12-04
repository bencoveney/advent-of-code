import { Input } from "./utils.js";

type Assignment = [number, number];

function readAssignment(line: string): Assignment {
  return line.split("-").map((num) => parseInt(num, 10)) as Assignment;
}

type Pair = [Assignment, Assignment];

function readPair(line: string): Pair {
  return line
    .split(",")
    .map((assignment) => readAssignment(assignment)) as Pair;
}

function overlapFully(a: Assignment, b: Assignment): boolean {
  return a[0] <= b[0] && a[1] >= b[1];
}

function eitherOverlapFully([first, second]: Pair): boolean {
  return overlapFully(first, second) || overlapFully(second, first);
}

function overlapPartially(a: Assignment, b: Assignment): boolean {
  return a[0] <= b[1] && a[1] >= b[0];
}

function eitherOverlapPartially([first, second]: Pair): boolean {
  return overlapPartially(first, second) || overlapPartially(second, first);
}

export function part1({ lines }: Input) {
  return lines.map(readPair).filter(eitherOverlapFully).length;
}

part1.test = 2;
part1.real = 496;

export function part2({ lines }: Input) {
  return lines.map(readPair).filter(eitherOverlapPartially).length;
}

part2.test = 4;
part2.real = 847;
