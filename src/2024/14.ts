import { Input, sortNumsDesc, Vector2 } from "../utils.js";

const robotRegex = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/g;

type Robot = {
  position: Vector2;
  velocity: Vector2;
};

function parse(lines: string[]): Robot[] {
  return lines.map<Robot>((line) => {
    const result = [...line.matchAll(robotRegex)][0];
    return {
      position: { x: parseInt(result[1]), y: parseInt(result[2]) },
      velocity: { x: parseInt(result[3]), y: parseInt(result[4]) },
    };
  });
}

function getDimensions(isTest: boolean): Vector2 {
  if (isTest) {
    return { x: 11, y: 7 };
  } else {
    return { x: 101, y: 103 };
  }
}

function elapseSecond(robots: Robot[], dimensions: Vector2) {
  robots.forEach((robot) => {
    robot.position.x =
      (robot.position.x + robot.velocity.x + dimensions.x) % dimensions.x;
    robot.position.y =
      (robot.position.y + robot.velocity.y + dimensions.y) % dimensions.y;
  });
}

export function part1({ lines, isTest }: Input) {
  const robots = parse(lines);
  const dimensions = getDimensions(isTest);
  for (let i = 0; i < 100; i++) {
    elapseSecond(robots, dimensions);
  }
  const leftMax = Math.floor(dimensions.x / 2);
  const rightMin = Math.ceil(dimensions.x / 2);
  const topMax = Math.floor(dimensions.y / 2);
  const bottomMin = Math.ceil(dimensions.y / 2);
  const quadrantA = robots.filter(
    ({ position }) => position.x < leftMax && position.y < topMax
  );
  const quadrantB = robots.filter(
    ({ position }) => position.x >= rightMin && position.y < topMax
  );
  const quadrantC = robots.filter(
    ({ position }) => position.x < leftMax && position.y >= bottomMin
  );
  const quadrantD = robots.filter(
    ({ position }) => position.x >= rightMin && position.y >= bottomMin
  );
  return (
    quadrantA.length * quadrantB.length * quadrantC.length * quadrantD.length
  );
}

part1.test = 12;
part1.real = 217132650;

function testForTree(robots: Robot[], dimensions: Vector2): boolean {
  let output = "";
  for (let x = 0; x < dimensions.x; x++) {
    for (let y = 0; y < dimensions.y; y++) {
      let count = robots.filter(
        (robot) => robot.position.x === x && robot.position.y === y
      ).length;
      output += count > 0 ? count.toString() : ".";
    }
    output += "\n";
  }
  const byX = robots.toSorted((a, b) => a.position.x - b.position.x);
  const byY = robots.toSorted((a, b) => a.position.y - b.position.y);
  let bottomQuarter = Math.min(robots.length * 0.25);
  let topQuarter = Math.max(robots.length * 0.75);
  const distanceMinX = Math.abs(
    byX[bottomQuarter].position.x - dimensions.x * 0.25
  );
  const distanceMaxX = Math.abs(
    byX[topQuarter].position.x - dimensions.x * 0.75
  );
  const distanceMinY = Math.abs(
    byY[bottomQuarter].position.y - dimensions.y * 0.25
  );
  const distanceMaxY = Math.abs(
    byY[topQuarter].position.y - dimensions.y * 0.75
  );
  const score = Math.round(
    distanceMinX * distanceMaxX * distanceMinY * distanceMaxY
  );
  return score > 10000;
}

// The test input has no result for part 2.
const nonResult = 5;

export function part2({ lines, isTest }: Input) {
  if (isTest) {
    return nonResult;
  }
  const robots = parse(lines);
  const dimensions = getDimensions(isTest);
  let iteration = 0;
  while (!testForTree(robots, dimensions) && iteration < 10000) {
    elapseSecond(robots, dimensions);
    iteration++;
  }
  return iteration;
}

part2.test = nonResult;
part2.real = 6516;
