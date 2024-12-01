import { Input } from "../utils.js";

function parse(lines: string[]): { left: number[]; right: number[] } {
  const left = new Array<number>(lines.length);
  const right = new Array<number>(lines.length);
  lines.forEach((line, index) => {
    const [l, r] = line.split(/\s+/);
    left[index] = parseInt(l);
    right[index] = parseInt(r);
  });
  return { left, right };
}

export function part1({ lines }: Input) {
  const { left, right } = parse(lines);
  left.sort();
  right.sort();
  let difference = 0;
  left.forEach((l, index) => {
    const r = right[index];
    const distance = Math.abs(l - r);
    difference += distance;
  });
  return difference;
}

part1.test = 11;
part1.real = 1590491;

export function part2({ lines }: Input) {
  const { left, right } = parse(lines);
  let similarity = 0;
  left.forEach((l) => {
    const count = right.filter((r) => r === l).length;
    similarity += l * count;
  });
  return similarity;
}

part2.test = 31;
part2.real = 22588371;
