import { Input, sum, Vector2 } from "../utils.js";

type Cell = "#" | null;

type Instruction = "<" | "^" | ">" | "v";

type Map = {
  content: Cell[][];
  robot: Vector2;
  boxes: Vector2[];
  instructions: Instruction[];
  min: Vector2;
  max: Vector2;
};

const directions: Record<Instruction, Vector2> = {
  "<": { x: 0, y: -1 },
  ">": { x: 0, y: 1 },
  "^": { x: -1, y: 0 },
  v: { x: 1, y: 0 },
};

function parsePart1(lines: string[]): Map {
  let robot: Vector2;
  const boxes: Vector2[] = [];
  const content = lines
    .filter(
      (line) => line.startsWith("#") && line.replaceAll("#", "").length > 0
    )
    .map((row, x) => {
      const cells = row.substring(1, row.length - 1).split("");
      return cells.map<Cell>((cell, y) => {
        switch (cell) {
          case "@":
            robot = { x, y };
            return null;
          case ".":
            return null;
          case "O":
            boxes.push({ x, y });
            return null;
          case "#":
            return "#";
          default:
            throw new Error("Whoopsie");
        }
      });
    });

  const instructions = lines
    .filter((line) => !line.startsWith("#"))
    .flatMap((line) => line.split("") as Instruction[]);
  return {
    content,
    robot: robot!,
    boxes,
    instructions,
    min: { x: 0, y: 0 },
    max: { x: content.length, y: content[0].length },
  };
}

function tryMovePart1(map: Map, direction: Vector2, from: Vector2): boolean {
  const { min, max, content, boxes } = map;
  const nextX = from.x + direction.x;
  const nextY = from.y + direction.y;
  if (nextX < min.x || nextX >= max.x || nextY < min.y || nextY >= max.y) {
    return false;
  }
  if (content[nextX][nextY] === "#") {
    return false;
  }
  let box = boxes.find((box) => box.x === nextX && box.y === nextY);
  if (box) {
    let didMove = tryMovePart1(map, direction, box);
    if (didMove) {
      from.x += direction.x;
      from.y += direction.y;
    }
    return didMove;
  }
  from.x += direction.x;
  from.y += direction.y;
  return true;
}

export function part1({ lines }: Input) {
  const map = parsePart1(lines);
  while (map.instructions.length > 0) {
    const instruction = map.instructions.shift()!;
    const direction = directions[instruction];
    tryMovePart1(map, direction, map.robot);
  }
  return sum(map.boxes.map(({ x, y }) => (x + 1) * 100 + (y + 1)));
}

part1.test = 10092;
part1.real = 1577255;

function parsePart2(lines: string[]): Map {
  let robot: Vector2;
  const boxes: Vector2[] = [];
  const content = lines
    .filter(
      (line) => line.startsWith("#") && line.replaceAll("#", "").length > 0
    )
    .map((row, x) => {
      const cells = row.substring(1, row.length - 1).split("");
      return cells.flatMap<Cell>((cell, y) => {
        switch (cell) {
          case "@":
            robot = { x, y: y * 2 };
            return [null, null];
          case ".":
            return [null, null];
          case "O":
            boxes.push({ x, y: y * 2 });
            return [null, null];
          case "#":
            return ["#", "#"];
          default:
            throw new Error("Whoopsie");
        }
      });
    });

  const instructions = lines
    .filter((line) => !line.startsWith("#"))
    .flatMap((line) => line.split("") as Instruction[]);
  return {
    content,
    robot: robot!,
    boxes,
    instructions,
    min: { x: 0, y: 0 },
    max: { x: content.length, y: content[0].length },
  };
}

function tryMove(
  map: Map,
  willBeOccupied: Vector2,
  direction: Vector2
): Vector2[] | null {
  const { min, max, content, boxes } = map;
  if (
    willBeOccupied.x < min.x ||
    willBeOccupied.x >= max.x ||
    willBeOccupied.y < min.y ||
    willBeOccupied.y >= max.y
  ) {
    return null;
  }
  if (content[willBeOccupied.x][willBeOccupied.y] === "#") {
    return null;
  }
  const boxInPosition = boxes.find(
    (box) =>
      box.x === willBeOccupied.x &&
      (box.y === willBeOccupied.y || box.y + 1 === willBeOccupied.y)
  );
  if (boxInPosition) {
    switch (direction) {
      case directions["^"]:
      case directions["v"]: {
        let leftPush = tryMove(
          map,
          {
            x: boxInPosition.x + direction.x,
            y: boxInPosition.y + direction.y,
          },
          direction
        );
        if (leftPush === null) {
          return null;
        }
        let rightPush = tryMove(
          map,
          {
            x: boxInPosition.x + direction.x,
            y: boxInPosition.y + direction.y + 1,
          },
          direction
        );
        if (rightPush === null) {
          return null;
        }
        return [boxInPosition, ...leftPush, ...rightPush];
      }
      case directions[">"]: {
        let push = tryMove(
          map,
          {
            x: boxInPosition.x + direction.x,
            y: boxInPosition.y + direction.y + 1,
          },
          direction
        );
        if (push === null) {
          return null;
        }
        return [boxInPosition, ...push];
      }
      case directions["<"]: {
        let push = tryMove(
          map,
          {
            x: boxInPosition.x + direction.x,
            y: boxInPosition.y + direction.y,
          },
          direction
        );
        if (push === null) {
          return null;
        }
        return [boxInPosition, ...push];
      }
    }
  }
  return [];
}

export function doMove(map: Map) {
  const instruction = map.instructions.shift()!;
  const direction = directions[instruction];
  const result = tryMove(
    map,
    { x: map.robot.x + direction.x, y: map.robot.y + direction.y },
    direction
  );
  if (result !== null) {
    map.robot.x += direction.x;
    map.robot.y += direction.y;
    new Set(result).forEach((position) => {
      position.x += direction.x;
      position.y += direction.y;
    });
  }
}

export function part2({ lines }: Input) {
  const map = parsePart2(lines);
  while (map.instructions.length > 0) {
    doMove(map);
  }
  return sum(map.boxes.map(({ x, y }) => (x + 1) * 100 + (y + 2)));
}

part2.test = 9021;
part2.real = 1597035;
