import { alphabet, chunk, Input, sum } from "../utils.js";

function getItems(rucksack: string): [string, string] {
  const perCompartment = rucksack.length / 2;
  return [rucksack.slice(0, perCompartment), rucksack.slice(perCompartment)];
}

function findMatchingItem([first, second]: [string, string]): string {
  for (const item of first.split("")) {
    if (second.indexOf(item) !== -1) {
      return item;
    }
  }
  throw new Error("No match");
}

const priorityOrder = [
  ...alphabet,
  ...alphabet.map((letter) => letter.toUpperCase()),
];

function getPriority(item: string): number {
  return priorityOrder.indexOf(item) + 1;
}

function findCommonLetter(group: string[]) {
  const items: { [item: string]: number } = {};
  group.forEach((elf) => {
    const seen: string[] = [];
    elf.split("").forEach((item) => {
      if (seen.includes(item)) {
        return;
      }
      seen.push(item);
      if (Object.hasOwn(items, item)) {
        items[item] = items[item] + 1;
      } else {
        items[item] = 1;
      }
    });
  });
  return Object.entries(items)
    .filter(([_, count]) => count === 3)
    .map(([item, _]) => item)[0];
}

export function part1({ lines }: Input) {
  return sum(
    lines
      .map((line) => getItems(line))
      .map((rucksack) => findMatchingItem(rucksack))
      .map((item) => getPriority(item))
  );
}

part1.test = 157;
part1.real = 7568;

export function part2({ lines }: Input) {
  return sum(
    chunk(lines, 3).map((group) => getPriority(findCommonLetter(group)))
  );
}

part2.test = 70;
part2.real = 2780;
