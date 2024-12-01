import { Input } from "../utils.js";

type Stack = string[];
type Stacks = Stack[];

function populateStacks(stackMap: string) {
  const stackRows = stackMap.split("\n").slice(0, -1).reverse();
  const stacks = stackRows[0].split(" ").map<Stack>(() => []);
  stackRows.forEach((row) => {
    let stack = 0;
    for (let i = 1; i < row.length; i += 4) {
      const letter = row[i];
      if (letter.trim() === "") {
        stack++;
        continue;
      }
      stacks[stack].push(letter);
      stack++;
    }
  });
  return stacks;
}

type Instruction = {
  amount: number;
  from: number;
  to: number;
};

function parseInstructions(instructionList: string): Instruction[] {
  return instructionList.split("\n").map((instructionLine) => {
    const parts = instructionLine.split(" ");
    return {
      amount: parseInt(parts[1]),
      from: parseInt(parts[3]),
      to: parseInt(parts[5]),
    };
  });
}

function runInstructions9000(stacks: Stacks, instructions: Instruction[]) {
  instructions.forEach(({ amount, from, to }) => {
    for (let i = 0; i < amount; i++) {
      stacks[to - 1].push(stacks[from - 1].pop()!);
    }
  });
}

function runInstructions9001(stacks: Stacks, instructions: Instruction[]) {
  instructions.forEach(({ amount, from, to }) => {
    let moving = [];
    for (let i = 0; i < amount; i++) {
      moving.push(stacks[from - 1].pop()!);
    }
    moving.reverse().forEach((letter) => {
      stacks[to - 1].push(letter);
    });
  });
}

function getTops(stacks: Stacks): string {
  return stacks.map((stack) => stack[stack.length - 1]).join("");
}

export function part1({ raw, lines, allLines }: Input) {
  const [stackMap, instructionList] = raw.split("\n\n");
  const stacks = populateStacks(stackMap);
  const instructions = parseInstructions(instructionList);
  runInstructions9000(stacks, instructions);
  return getTops(stacks);
}

part1.test = "CMZ";
part1.real = "WCZTHTMPS";

export function part2({ raw, lines, allLines }: Input) {
  const [stackMap, instructionList] = raw.split("\n\n");
  const stacks = populateStacks(stackMap);
  const instructions = parseInstructions(instructionList);
  runInstructions9001(stacks, instructions);
  return getTops(stacks);
}

part2.test = "MCD";
part2.real = "BLSGJSDTS";
