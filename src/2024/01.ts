import { Input } from "../utils.js";

export function part1({ raw, lines, allLines, chars }: Input) {
  const left = new Array<number>(lines.length);
  const right = new Array<number>(lines.length);
  lines.forEach((line, index) => {
    const [l, r] = line.split(/\s+/);
    left[index] = parseInt(l);
    right[index] = parseInt(r);
  });
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

export function part2({ raw, lines, allLines, chars }: Input) {
  const left = new Array<number>(lines.length);
  const right = new Array<number>(lines.length);
  lines.forEach((line, index) => {
    const [l, r] = line.split(/\s+/);
    left[index] = parseInt(l);
    right[index] = parseInt(r);
  });
  let similarity = 0;
  left.forEach((l) => {
    const count = right.filter((r) => r === l).length;
    similarity += l * count;
  });
  return similarity;
}

part2.test = 31;
part2.real = 22588371;
