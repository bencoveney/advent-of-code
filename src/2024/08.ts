import { Input } from "../utils.js";

type Vector2 = {
  x: number;
  y: number;
};

type Nodes = {
  [frequency: string]: Vector2[];
};

function parse(lines: string[]): { min: Vector2; max: Vector2; nodes: Nodes } {
  const nodes: Nodes = {};
  lines.forEach((line, x) => {
    line.split("").forEach((char, y) => {
      if (char === ".") {
        return;
      }
      if (!nodes[char]) {
        nodes[char] = [];
      }
      nodes[char].push({ x, y });
    });
  });
  return {
    min: { x: 0, y: 0 },
    max: { x: lines.length, y: lines[0].length },
    nodes,
  };
}

function isValidNode(min: Vector2, max: Vector2, x: number, y: number) {
  const xValid = !(x < min.x || x >= max.x);
  const yValid = !(y < min.y || y >= max.y);
  return xValid && yValid;
}

export function part1({ lines }: Input) {
  const { nodes, max, min } = parse(lines);
  let antinodeLocations = new Set();
  Object.values(nodes).forEach((nodeList) => {
    for (let left = 0; left < nodeList.length - 1; left++) {
      for (let right = left + 1; right < nodeList.length; right++) {
        const leftNode = nodeList[left];
        const rightNode = nodeList[right];

        const leftAntinodeX = leftNode.x + (leftNode.x - rightNode.x);
        const leftAntinodeY = leftNode.y + (leftNode.y - rightNode.y);
        if (isValidNode(min, max, leftAntinodeX, leftAntinodeY)) {
          antinodeLocations.add(`${leftAntinodeX},${leftAntinodeY}`);
        }
        const rightAntinodeX = rightNode.x + (rightNode.x - leftNode.x);
        const rightAntinodeY = rightNode.y + (rightNode.y - leftNode.y);
        if (isValidNode(min, max, rightAntinodeX, rightAntinodeY)) {
          antinodeLocations.add(`${rightAntinodeX},${rightAntinodeY}`);
        }
      }
    }
  });
  return antinodeLocations.size;
}

part1.test = 14;
part1.real = 332;

export function part2({ lines }: Input) {
  const { nodes, max, min } = parse(lines);
  let antinodeLocations = new Set();
  Object.values(nodes).forEach((nodeList) => {
    if (nodeList.length <= 1) {
      return;
    }
    nodeList.forEach(({ x, y }) => {
      antinodeLocations.add(`${x},${y}`);
    });
    for (let left = 0; left < nodeList.length - 1; left++) {
      for (let right = left + 1; right < nodeList.length; right++) {
        const leftNode = nodeList[left];
        const rightNode = nodeList[right];

        let stepX = leftNode.x - rightNode.x;
        let stepY = leftNode.y - rightNode.y;

        let leftAntinodeX = leftNode.x + stepX;
        let leftAntinodeY = leftNode.y + stepY;

        while (isValidNode(min, max, leftAntinodeX, leftAntinodeY)) {
          antinodeLocations.add(`${leftAntinodeX},${leftAntinodeY}`);

          leftAntinodeX = leftAntinodeX + stepX;
          leftAntinodeY = leftAntinodeY + stepY;
        }

        let rightAntinodeX = leftNode.x - stepX;
        let rightAntinodeY = leftNode.y - stepY;

        while (isValidNode(min, max, rightAntinodeX, rightAntinodeY)) {
          antinodeLocations.add(`${rightAntinodeX},${rightAntinodeY}`);

          rightAntinodeX = rightAntinodeX - stepX;
          rightAntinodeY = rightAntinodeY - stepY;
        }
      }
    }
  });
  return antinodeLocations.size;
}

part2.test = 34;
part2.real = 1174;
