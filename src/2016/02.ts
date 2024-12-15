import { Input, Vector2 } from "../utils.js";

type Keypad = {
  layout: (string | null)[][];
  start: Vector2;
};

function runKeypad(lines: string[], keypad: Keypad): string {
  let position: Vector2 = { x: 1, y: 1 };
  return lines
    .map((inputString) => {
      let letter;
      for (let i = 0; i < inputString.length; i++) {
        let axis: keyof Vector2;
        let delta: number;
        switch (inputString[i]) {
          case "U":
            axis = "y";
            delta = -1;
            break;
          case "D":
            axis = "y";
            delta = 1;
            break;
          case "L":
            axis = "x";
            delta = -1;
            break;
          case "R":
            axis = "x";
            delta = 1;
            break;
          default:
            throw new Error("Whoops");
        }

        let potentialPosition: Vector2 = { x: position.x, y: position.y };
        potentialPosition[axis] = position[axis] + delta;

        let row = keypad.layout[potentialPosition.y];
        let column = row && row[potentialPosition.x];
        if (typeof column === "string") {
          letter = column;
          position = potentialPosition;
        }
      }
      return letter;
    })
    .join("");
}

export function part1({ lines }: Input) {
  const keypad1: Keypad = {
    layout: [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
    ],
    start: { x: 1, y: 1 },
  };
  return runKeypad(lines, keypad1);
}

part1.test = "1985";
part1.real = "95549";

export function part2({ lines }: Input) {
  const keypad2: Keypad = {
    layout: [
      [null, null, "1", null, null],
      [null, "2", "3", "4", null],
      ["5", "6", "7", "8", "9"],
      [null, "A", "B", "C", null],
      [null, null, "D", null, null],
    ],
    start: { x: 2, y: 0 },
  };
  return runKeypad(lines, keypad2);
}

// part2.test = "5DB3";
part2.test = "CB3";
part2.real = "D87AD";
