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

function getPossibilities(
  parts: number[],
  mapper: (result: number, nextPart: number) => number[]
): number[] {
  let [first, ...rest] = parts;
  return rest.reduce<number[]>(
    (intermediateResults, nextPart) =>
      intermediateResults.flatMap((result) => mapper(result, nextPart)),
    [first]
  );
}

function concatenateNumbers(left: number, right: number): number {
  const rightDigits = Math.ceil(Math.log10(right + 1));
  return left * Math.pow(10, rightDigits) + right;
}

export function part1({ lines }: Input) {
  return sum(
    parse(lines)
      .filter(({ total, parts }) =>
        getPossibilities(parts, (result, nextPart) => [
          result * nextPart,
          result + nextPart,
        ]).includes(total)
      )
      .map(({ total }) => total)
  );
}

part1.test = 3749;
part1.real = 2299996598890;

export function part2({ lines }: Input) {
  return sum(
    parse(lines)
      .filter(({ total, parts }) =>
        getPossibilities(parts, (result, nextPart) => {
          return [
            result * nextPart,
            result + nextPart,
            concatenateNumbers(result, nextPart),
          ];
        }).includes(total)
      )
      .map(({ total }) => total)
  );
}

part2.test = 11387;
part2.real = 362646859298554;
