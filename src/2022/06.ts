import { Input } from "../utils.js";

function isUniqueAll(chars: string[]) {
  return new Set(chars).size === chars.length;
}

function findMarker(chars: string[], length: number) {
  for (let i = length; i < chars.length + 1; i++) {
    if (isUniqueAll(chars.slice(i - length, i))) {
      return i;
    }
  }
  return -1;
}

export function part1({ chars }: Input) {
  return findMarker(chars, 4);
}

part1.test = 7;
part1.real = 1282;

export function part2({ chars }: Input) {
  return findMarker(chars, 14);
}

part2.test = 19;
part2.real = 3513;
