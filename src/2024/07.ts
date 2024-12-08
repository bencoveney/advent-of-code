import { Input, sum } from "../utils.js";

type Equation = {
  total: number;
  parts: number[];
};

function parse(lines: string[]): Equation[] {
  return lines.map<Equation>((line) => {
    const [total, parts] = line.split(": ");
    return {
      total: parseInt(total),
      parts: parts.split(" ").map((p) => parseInt(p)),
    };
  });
}

function concatenateNumbers(left: number, right: number): number {
  const rightDigits = Math.ceil(Math.log10(right + 1));
  return left * Math.pow(10, rightDigits) + right;
}

function dfsPart1(
  equation: Equation,
  partIndex: number,
  current: number
): boolean {
  if (current > equation.total) {
    return false;
  }
  const nextPart = equation.parts[partIndex];
  if (partIndex === equation.parts.length - 1) {
    return (
      current + nextPart === equation.total ||
      current * nextPart === equation.total
    );
  }
  return (
    dfsPart1(equation, partIndex + 1, current + nextPart) ||
    dfsPart1(equation, partIndex + 1, current * nextPart)
  );
}

function runPart(
  lines: string[],
  dfs: (equation: Equation, partIndex: number, current: number) => boolean
) {
  return sum(
    parse(lines)
      .filter((equation) => dfs(equation, 1, equation.parts[0]))
      .map(({ total }) => total)
  );
}

export function part1({ lines }: Input) {
  return runPart(lines, dfsPart1);
}

part1.test = 3749;
part1.real = 2299996598890;

function dfsPart2(
  equation: Equation,
  partIndex: number,
  current: number
): boolean {
  if (current > equation.total) {
    return false;
  }
  const nextPart = equation.parts[partIndex];
  if (partIndex === equation.parts.length - 1) {
    return (
      current + nextPart === equation.total ||
      current * nextPart === equation.total ||
      concatenateNumbers(current, nextPart) === equation.total
    );
  }
  return (
    dfsPart2(equation, partIndex + 1, current + nextPart) ||
    dfsPart2(equation, partIndex + 1, current * nextPart) ||
    dfsPart2(equation, partIndex + 1, concatenateNumbers(current, nextPart))
  );
}

export function part2({ lines }: Input) {
  return runPart(lines, dfsPart2);
}

part2.test = 11387;
part2.real = 362646859298554;
