import { Input } from "../utils.js";

function parse(lines: string[]): {
  min: Vector2;
  max: Vector2;
  map: number[][];
} {
  const map = lines.map((line) =>
    line.split("").map((height) => parseInt(height))
  );
  return {
    map,
    min: { x: 0, y: 0 },
    max: { x: lines.length, y: lines[0].length },
  };
}

function isValidPosition(min: Vector2, max: Vector2, x: number, y: number) {
  const xValid = !(x < min.x || x >= max.x);
  const yValid = !(y < min.y || y >= max.y);
  return xValid && yValid;
}

type Vector2 = { x: number; y: number };
const directions: Vector2[] = [
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
];

export function part1({ lines }: Input) {
  const { map, min, max } = parse(lines);
  let sum = 0;
  for (let startX = 0; startX < max.x; startX++) {
    for (let startY = 0; startY < max.y; startY++) {
      const startHeight = map[startX][startY];
      if (startHeight !== 0) {
        continue;
      }
      let trailPositions = [{ x: startX, y: startY }];
      for (let height = 1; height < 10; height++) {
        let candidates: Vector2[] = [];
        trailPositions.forEach((prevPosition) => {
          directions.forEach((direction) => {
            let possibilityX = prevPosition.x + direction.x;
            let possibilityY = prevPosition.y + direction.y;
            if (!isValidPosition(min, max, possibilityX, possibilityY)) {
              return;
            }
            if (map[possibilityX][possibilityY] !== height) {
              return;
            }
            if (
              candidates.find(
                (candidate) =>
                  candidate.x === possibilityX && candidate.y === possibilityY
              )
            ) {
              return;
            }
            candidates.push({ x: possibilityX, y: possibilityY });
          });
        });
        trailPositions = candidates;
      }
      sum += trailPositions.length;
    }
  }
  return sum;
}

part1.test = 36;
part1.real = 550;

export function part2({ lines }: Input) {
  const { map, min, max } = parse(lines);
  let sum = 0;
  for (let startX = 0; startX < max.x; startX++) {
    for (let startY = 0; startY < max.y; startY++) {
      const startHeight = map[startX][startY];
      if (startHeight !== 0) {
        continue;
      }
      let trailPositions = [{ x: startX, y: startY }];
      for (let height = 1; height < 10; height++) {
        let candidates: Vector2[] = [];
        trailPositions.forEach((prevPosition) => {
          directions.forEach((direction) => {
            let possibilityX = prevPosition.x + direction.x;
            let possibilityY = prevPosition.y + direction.y;
            if (!isValidPosition(min, max, possibilityX, possibilityY)) {
              return;
            }
            if (map[possibilityX][possibilityY] !== height) {
              return;
            }
            candidates.push({ x: possibilityX, y: possibilityY });
          });
        });
        trailPositions = candidates;
      }
      sum += trailPositions.length;
    }
  }
  return sum;
}

part2.test = 81;
part2.real = 1255;
