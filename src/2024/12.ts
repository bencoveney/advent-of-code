import { Input, sum, Vector2 } from "../utils.js";

type Plot = {
  value: string;
  region: Region | null;
  x: number;
  y: number;
};

type Garden = {
  min: Vector2;
  max: Vector2;
  plots: Plot[][];
};

function parse(lines: string[]): Garden {
  const plots = lines.map((line, x) =>
    line.split("").map<Plot>((value, y) => ({ value, region: null, x, y }))
  );
  return {
    plots,
    min: { x: 0, y: 0 },
    max: { x: lines.length, y: lines[0].length },
  };
}

type Region = {
  plots: Plot[];
  value: string;
};

const directions: Vector2[] = [
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
];

function isValidPosition(min: Vector2, max: Vector2, x: number, y: number) {
  const xValid = !(x < min.x || x >= max.x);
  const yValid = !(y < min.y || y >= max.y);
  return xValid && yValid;
}

function getRegions({ plots, min, max }: Garden): Region[] {
  const regions: Region[] = [];
  for (let x = min.x; x < max.x; x++) {
    for (let y = min.y; y < max.y; y++) {
      let plot = plots[x][y];
      if (plot.region !== null) {
        continue;
      }
      const region: Region = {
        plots: [plot],
        value: plot.value,
      };
      plot.region = region;
      let findNeighboursFor: Plot[] = [plot];
      while (findNeighboursFor.length > 0) {
        let newNeighbours: Plot[] = [];
        findNeighboursFor.forEach((findFor) => {
          directions.forEach((direction) => {
            const candidateX = findFor.x + direction.x;
            const candidateY = findFor.y + direction.y;
            if (!isValidPosition(min, max, candidateX, candidateY)) {
              return;
            }
            const otherPlot = plots[candidateX][candidateY];
            if (otherPlot.region !== null) {
              return;
            }
            if (otherPlot.value !== plot.value) {
              return;
            }
            otherPlot.region = region;
            region.plots.push(otherPlot);
            newNeighbours.push(otherPlot);
          });
        });
        findNeighboursFor = newNeighbours;
      }
      region.plots = region.plots.sort((a, b) =>
        a.x === b.x ? a.y - b.y : a.x - b.x
      );
      regions.push(region);
    }
  }
  return regions;
}

function getPerimeter(region: Region): number {
  return sum(
    region.plots.map((plot) => {
      return (
        4 -
        directions.filter((direction) => {
          let newX = plot.x + direction.x;
          let newY = plot.y + direction.y;
          return region.plots.find(
            (neighbour) => neighbour.x === newX && neighbour.y === newY
          );
        }).length
      );
    })
  );
}

function getSides(region: Region): number {
  const sides = sum(
    region.plots.map((plot) => {
      // Hint used: Count corners, that will equal the number of sides.
      return directions.filter((direction, directionIndex) => {
        let directionAX = plot.x + direction.x;
        let directionAY = plot.y + direction.y;
        let nextDirection =
          directions[(directionIndex + 1) % directions.length];
        let directionBX = plot.x + nextDirection.x;
        let directionBY = plot.y + nextDirection.y;
        let directionCX = plot.x + direction.x + nextDirection.x;
        let directionCY = plot.y + direction.y + nextDirection.y;
        const neighbourA = region.plots.find(
          (neighbour) =>
            neighbour.x === directionAX && neighbour.y === directionAY
        );
        const neighbourB = region.plots.find(
          (neighbour) =>
            neighbour.x === directionBX && neighbour.y === directionBY
        );
        const neighbourC = region.plots.find(
          (neighbour) =>
            neighbour.x === directionCX && neighbour.y === directionCY
        );
        // Check for inner corners.
        if (neighbourA && neighbourB && !neighbourC) {
          return true;
        }
        // Check for outer corners.
        if (neighbourA || neighbourB) {
          return false;
        }
        return true;
      }).length;
    })
  );
  return sides;
}

export function part1({ lines }: Input) {
  const { plots, min, max } = parse(lines);
  const regions = getRegions({ plots, min, max });
  return sum(
    regions.map((region) => region.plots.length * getPerimeter(region))
  );
}

part1.test = 1930;
part1.real = 1431316;

export function part2({ lines }: Input) {
  const { plots, min, max } = parse(lines);
  const regions = getRegions({ plots, min, max });
  return sum(regions.map((region) => region.plots.length * getSides(region)));
}

part2.test = 1206;
part2.real = 821428;
