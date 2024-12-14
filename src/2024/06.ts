import { Input, sum, Vector2 } from "../utils.js";

type BlockedCell = {
  kind: "blocked";
};

type WalkableCell = {
  kind: "walkable";
  walked: number[];
};

type Cell = BlockedCell | WalkableCell;

type Grid = Cell[][];

const directions: Vector2[] = [
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
];

function parse(lines: string[]): { position: Vector2; grid: Grid } {
  let position: Vector2;
  const grid: Grid = lines.map((line, x) =>
    line.split("").map((cell, y) => {
      switch (cell) {
        case "#":
          return { kind: "blocked" };
        case "^":
          position = { x, y };
          return { kind: "walkable", walked: [0] };
        case ".":
        default:
          return { kind: "walkable", walked: [] };
      }
    })
  );
  // @ts-ignore
  if (!position) {
    throw new Error("Didn't find start");
  }
  return { position, grid };
}

function walkGrid(
  grid: Grid,
  startPosition: Vector2,
  startDirectionIndex: number,
  onVisitCell: (
    position: Vector2,
    cell: WalkableCell,
    directionIndex: number
  ) => boolean | void
) {
  let position = startPosition;
  let directionIndex = startDirectionIndex;

  while (true) {
    const direction = directions[directionIndex];
    let nextPosition: Vector2 = {
      x: position.x + direction.x,
      y: position.y + direction.y,
    };

    if (
      nextPosition.x < 0 ||
      nextPosition.x >= grid.length ||
      nextPosition.y < 0 ||
      nextPosition.y >= grid[0].length
    ) {
      return;
    }
    const nextCell = grid[nextPosition.x][nextPosition.y];
    let shouldExit: boolean | void;
    if (nextCell.kind === "blocked") {
      directionIndex = (directionIndex + 1) % 4;
      const currentCell = grid[position.x][position.y] as WalkableCell;
      shouldExit = onVisitCell(position, currentCell, directionIndex);
    } else {
      position = nextPosition;
      shouldExit = onVisitCell(nextPosition, nextCell, directionIndex);
    }
    if (shouldExit === true) {
      return;
    }
  }
}

export function part1({ lines }: Input) {
  let { position, grid } = parse(lines);
  walkGrid(grid, position, 0, (_, cell, directionIndex) => {
    if (!cell.walked.includes(directionIndex)) {
      cell.walked.push(directionIndex);
    }
    return false;
  });
  return sum(
    grid.map((row) =>
      sum(
        row.map((cell) =>
          cell.kind === "walkable" && cell.walked.length > 0 ? 1 : 0
        )
      )
    )
  );
}

part1.test = 41;
part1.real = 4580;

export function part2({ lines }: Input) {
  let { position, grid } = parse(lines);
  walkGrid(grid, position, 0, (_, cell, directionIndex) => {
    if (!cell.walked.includes(directionIndex)) {
      cell.walked.push(directionIndex);
    }
    return false;
  });
  let traversed: Vector2[] = [];
  grid.forEach((row, x) =>
    row.forEach((cell, y) => {
      if (cell.kind === "walkable" && cell.walked.length > 0) {
        traversed.push({ x, y });
      }
    })
  );
  let loopCount = 0;
  traversed.forEach(({ x, y }) => {
    // Skip start position
    if (x === position.x && y === position.y) {
      return;
    }
    grid.forEach((row) =>
      row.forEach((cell) => {
        if (cell.kind === "walkable") {
          cell.walked = [];
        }
      })
    );
    // Place an obstable
    const temp = grid[x][y];
    grid[x][y] = { kind: "blocked" };
    walkGrid(grid, position, 0, (_, cell, directionIndex) => {
      if (cell.walked.includes(directionIndex)) {
        loopCount++;
        return true;
      }
      cell.walked.push(directionIndex);
      return false;
    });
    grid[x][y] = temp;
  });

  return loopCount;
}

part2.test = 6;
part2.real = 1480;
