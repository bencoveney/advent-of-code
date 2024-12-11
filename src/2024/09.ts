import { Input } from "../utils.js";

type Disk = Array<number | null>;

function parse(chars: string[]): Disk {
  return chars
    .map((char) => parseInt(char))
    .flatMap((size, index) => {
      if (index % 2 === 0) {
        const fileNumber = index / 2;
        return new Array(size).fill(fileNumber);
      }
      return new Array(size).fill(null);
    });
}

function checksum(disk: Disk): number {
  return disk.reduce<number>(
    (total, next, index) => (next === null ? total : total + next * index),
    0
  );
}

export function part1({ chars }: Input) {
  const disk = parse(chars);
  for (let i = disk.length - 1; i >= 0; i--) {
    const currentChar = disk[i];
    if (currentChar === null) {
      continue;
    }
    const firstSpace = disk.indexOf(null);
    if (!(firstSpace < i)) {
      break;
    }
    disk[firstSpace] = currentChar;
    disk[i] = null;
  }
  return checksum(disk);
}

part1.test = 1928;
part1.real = 6344673854800;

export function part2({ chars }: Input) {
  const disk = parse(chars);
  for (let fileIndex = disk.length - 1; fileIndex >= 0; fileIndex--) {
    const currentChar = disk[fileIndex];
    if (currentChar === null) {
      continue;
    }
    let fileSize = 1;
    while (disk[fileIndex - 1] === currentChar) {
      fileSize++;
      fileIndex--;
    }
    for (let spaceIndex = 0; spaceIndex < fileIndex; spaceIndex++) {
      let spaceSize = 0;
      let spaceStartsAt = spaceIndex;
      while (disk[spaceIndex] === null) {
        spaceSize++;
        spaceIndex++;
      }
      if (spaceSize >= fileSize) {
        for (let moving = 0; moving < fileSize; moving++) {
          disk[spaceStartsAt + moving] = currentChar;
          disk[fileIndex + moving] = null;
        }
        break;
      }
    }
  }
  return checksum(disk);
}

part2.test = 2858;
part2.real = 6360363199987;
