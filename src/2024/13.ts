import { Input, sum } from "../utils.js";

type Vector2 = { x: number; y: number };

type Machine = {
  buttonA: Vector2;
  buttonB: Vector2;
  prize: Vector2;
};

const buttonRegex = /Button .: X\+(\d+), Y\+(\d+)/g;
const prizeRegex = /Prize: X=(\d+), Y=(\d+)/g;

function parse(lines: string[]): Machine[] {
  let machines: Machine[] = [];
  for (let i = 0; i < lines.length; i += 3) {
    const buttonA = [...lines[i].matchAll(buttonRegex)][0];
    const buttonB = [...lines[i + 1].matchAll(buttonRegex)][0];
    const prize = [...lines[i + 2].matchAll(prizeRegex)][0];
    machines.push({
      buttonA: { x: parseInt(buttonA[1]), y: parseInt(buttonA[2]) },
      buttonB: { x: parseInt(buttonB[1]), y: parseInt(buttonB[2]) },
      prize: { x: parseInt(prize[1]), y: parseInt(prize[2]) },
    });
  }
  return machines;
}

type Solution = {
  a: number;
  b: number;
};

function solve({ prize, buttonA, buttonB }: Machine): Solution | null {
  // Hint used: Solve as linear equations with 2 unknowns.

  /*
    Programs can be mapped as 2 equations with 2 unknowns
    a * buttonA.x + b * buttonB.x = prize.x
    a * buttonA.y + b * buttonB.y = prize.y

    Multiply both sides to try to isolate B presses
    (a * buttonA.x + b * buttonB.x) * buttonB.y = prize.x * buttonB.y
    (a * buttonA.y + b * buttonB.y) * buttonB.x = prize.y * buttonB.x

    b * buttonB.x * buttonB.y = prize.x * buttonB.y - a * buttonA.x * buttonB.y
    b * buttonB.y * buttonB.x = prize.y * buttonB.x - a * buttonA.y * buttonB.x

    LHS of each match, so you can set them as equal, and remove B presses.
    prize.x * buttonB.y - a * buttonA.x * buttonB.y = prize.y * buttonB.x - a * buttonA.y * buttonB.x

    Rearrange so A presses are the only unknown. You can now solve for it.
    a * (buttonA.y * buttonB.x - buttonA.x * buttonB.y) = prize.y * buttonB.x - prize.x * buttonB.y

    a = (prize.y * buttonB.x - prize.x * buttonB.y) / (buttonA.y * buttonB.x - buttonA.x * buttonB.y)
  */

  const a =
    (prize.y * buttonB.x - prize.x * buttonB.y) /
    (buttonA.y * buttonB.x - buttonA.x * buttonB.y);

  // Now that we know how many A presses, we can substitute it in to one of hte original equations to calculate B presses.

  const b = (prize.x - a * buttonA.x) / buttonB.x;

  if (!Number.isInteger(a) || a < 0 || !Number.isInteger(b) || b < 0) {
    return null;
  }

  return { a: a, b: b };
}

function getTotal(solution: Solution): number {
  return solution.a * 3 + solution.b;
}

export function part1({ lines }: Input) {
  return sum(
    parse(lines)
      .map(solve)
      .filter((result): result is Solution => result !== null)
      .filter((solution) => solution.a <= 100 && solution.b <= 100)
      .map(getTotal)
  );
}

part1.test = 480;
part1.real = 35729;

export function part2({ lines }: Input) {
  return sum(
    parse(lines)
      .map((machine) => ({
        ...machine,
        prize: {
          x: machine.prize.x + 10000000000000,
          y: machine.prize.y + 10000000000000,
        },
      }))
      .map(solve)
      .filter((result): result is Solution => result !== null)
      .map(getTotal)
  );
}

part2.test = 875318608908;
part2.real = 88584689879723;
