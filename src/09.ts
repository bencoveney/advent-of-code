import { Input } from "./utils.js";

const deltas: { [direction: string]: Position } = {
  R: { x: 1, y: 0 },
  U: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  D: { x: 0, y: -1 },
};

type Movement = {
  delta: Position;
  distance: number;
};

type Position = {
  x: number;
  y: number;
};

function getMovements(lines: string[]): Movement[] {
  return lines.map((line) => {
    const [direction, distance] = line.split(" ");
    return {
      delta: deltas[direction!]!,
      distance: parseInt(distance),
    };
  });
}

function moveInDirection(position: Position, delta: Position) {
  position.x += delta.x;
  position.y += delta.y;
}

function isPulling(a: Position, b: Position) {
  return Math.abs(a.x - b.x) > 1 || Math.abs(a.y - b.y) > 1;
}

function copy({ x, y }: Position) {
  return { x, y };
}

function invert(position: Position) {
  return {
    x: position.x * -1,
    y: position.y * -1,
  };
}

function runMovement(head: Position, tail: Position, delta: Position) {
  moveInDirection(head, delta);
  if (isPulling(head, tail)) {
    const newTail = copy(head);
    moveInDirection(newTail, invert(delta));
    tail.x = newTail.x;
    tail.y = newTail.y;
  }
}

function runMovements(movements: Movement[]): Position[] {
  const head: Position = { x: 0, y: 0 };
  const tail: Position = { x: 0, y: 0 };
  const visited: Position[] = [{ ...tail }];
  movements.forEach(({ distance, delta }) => {
    for (let i = 0; i < distance; i++) {
      runMovement(head, tail, delta);
      const alreadyVisited = visited.find(
        ({ x, y }) => tail.x === x && tail.y === y
      );
      if (!alreadyVisited) {
        visited.push({ ...tail });
      }
    }
  });
  return visited;
}

export function part1({ lines }: Input) {
  return runMovements(getMovements(lines)).length;
}

part1.test = 13;
part1.real = 5710;

export function part2({ raw, lines, allLines, chars }: Input) {}

part2.test = 0;
// part2.real = 0;
