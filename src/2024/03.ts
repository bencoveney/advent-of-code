import { Input } from "../utils.js";

export function part1({ raw, lines, allLines, chars }: Input) {
  return sumMultiplies(raw);
}

part1.test = 161;
part1.real = 153469856;

export function part2({ raw, lines, allLines, chars }: Input) {
  const [start, ...rest] = raw.split("don't()");
  let sum = sumMultiplies(start);
  rest.forEach((disabled) => {
    const [_, ...enabled] = disabled.split("do()");
    sum += sumMultiplies(enabled.join("do()"));
  });
  return sum;
}

part2.test = 48;
part2.real = 77055967;

function sumMultiplies(text: string): number {
  const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;
  let match: RegExpExecArray | null;
  let sum = 0;
  do {
    match = regex.exec(text);
    if (match) {
      sum += parseInt(match[1]) * parseInt(match[2]);
    }
  } while (match);
  return sum;
}
