import { Input } from "./utils";

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
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

function getPriority(item: string): number {
  return priorityOrder.indexOf(item) + 1;
}

function getGroups(lines: string[]) {
  return lines
    .reduce((prev, next) => {
      const lastGroup = prev[prev.length - 1];
      if (!lastGroup || lastGroup.length === 3) {
        prev.push([next]);
      } else {
        lastGroup.push(next);
      }
      return prev;
    }, [] as string[][]);
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

export function findGroupPriorities(input: string) {
  return;
}

export function part1({ lines }: Input) {
  return lines
    .map((line) => getItems(line))
    .map((rucksack) => findMatchingItem(rucksack))
    .map((item) => getPriority(item))
    .reduce((prev, next) => prev + next, 0);
}

part1.test = 157;
part1.real = 7568;

export function part2({ lines }: Input) {
  return getGroups(lines)
    .map((group) => getPriority(findCommonLetter(group)))
    .reduce((prev, next) => prev + next, 0);
}

part2.test = 70;
part2.real = 2780;
