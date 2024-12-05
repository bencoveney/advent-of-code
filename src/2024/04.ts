import { Input } from "../utils.js";

type Grid = string[][];

type Direction = { x: number; y: number };
const directions: Direction[] = [
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
];

export function part1({ lines }: Input) {
  const grid: Grid = lines.map((line) => line.split(""));
  let count = 0;
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== "X") {
        return;
      }
      directions.forEach((direction) => {
        let match = true;
        ["M", "A", "S"].forEach((char, charIndex) => {
          let xOffset = x + direction.x * (charIndex + 1);
          let yOffset = y + direction.y * (charIndex + 1);
          let result = getChar(grid, xOffset, yOffset);
          if (char !== result) {
            match = false;
          }
        });
        if (match) {
          count++;
        }
      });
    });
  });
  return count;
}

function getChar(grid: Grid, x: number, y: number): string | null {
  if (x < 0) {
    return null;
  }
  if (y < 0) {
    return null;
  }
  if (x >= grid[0].length) {
    return null;
  }
  if (y >= grid.length) {
    return null;
  }
  return grid[y][x];
}

part1.test = 18;
part1.real = 2414;

export function part2({ lines }: Input) {
  const grid: Grid = lines.map((line) => line.split(""));
  let count = 0;
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== "A") {
        return;
      }
      let a1 = getChar(grid, x - 1, y - 1);
      let a2 = getChar(grid, x + 1, y + 1);
      switch (a1) {
        case "M":
          if (a2 !== "S") {
            return;
          }
          break;
        case "S":
          if (a2 !== "M") {
            return;
          }
          break;
        default:
          return;
      }
      let b1 = getChar(grid, x + 1, y - 1);
      let b2 = getChar(grid, x - 1, y + 1);
      switch (b1) {
        case "M":
          if (b2 !== "S") {
            return;
          }
          break;
        case "S":
          if (b2 !== "M") {
            return;
          }
          break;
        default:
          return;
      }
      count++;
    });
  });
  return count;
}

part2.test = 9;
part2.real = 1871;
