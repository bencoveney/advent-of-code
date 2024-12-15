import { Input } from "../utils.js";

function parse(lines: string[]): { direction: string; distance: number }[] {
  return lines[0].split(", ").map((turn) => ({
    direction: turn[0],
    distance: parseInt(turn.substring(1)),
  }));
}

type Location = { n: number; e: number; total: number };

export function part1({ lines, isTest }: Input) {
  const state = {
    n: 0,
    e: 0,
    s: 0,
    w: 0,
    direction: "n",
  };
  const locations: Location[] = [];
  let duplicate: Location | null = null;
  parse(lines).forEach(function (turn) {
    let nextDirection: "n" | "e" | "s" | "w";
    switch (state.direction) {
      case "n":
        nextDirection = turn.direction === "R" ? "e" : "w";
        break;
      case "e":
        nextDirection = turn.direction === "R" ? "s" : "n";
        break;
      case "s":
        nextDirection = turn.direction === "R" ? "w" : "e";
        break;
      case "w":
        nextDirection = turn.direction === "R" ? "n" : "s";
        break;
      default:
        throw new Error("Whoops");
    }
    state.direction = nextDirection;

    for (let i = 0; i < turn.distance; i++) {
      state[nextDirection] += 1;

      const n = state.n - state.s;
      const e = state.e - state.w;
      const nextLocation = { n, e, total: Math.abs(n) + Math.abs(e) };

      if (!duplicate) {
        locations.forEach(function (location) {
          if (location.n === nextLocation.n && location.e === nextLocation.e) {
            duplicate = nextLocation;
          }
        });
      }

      locations.push(nextLocation);
    }
  });
  return locations[locations.length - 1].total;
}

part1.test = 8;
part1.real = 146;

export function part2({ raw, lines, allLines, chars, isTest, part }: Input) {
  const state = {
    n: 0,
    e: 0,
    s: 0,
    w: 0,
    direction: "n",
  };
  const locations: Location[] = [];
  let duplicate: Location | null = null;
  parse(lines).forEach(function (turn) {
    let nextDirection: "n" | "e" | "s" | "w";
    switch (state.direction) {
      case "n":
        nextDirection = turn.direction === "R" ? "e" : "w";
        break;
      case "e":
        nextDirection = turn.direction === "R" ? "s" : "n";
        break;
      case "s":
        nextDirection = turn.direction === "R" ? "w" : "e";
        break;
      case "w":
        nextDirection = turn.direction === "R" ? "n" : "s";
        break;
      default:
        throw new Error("Whoops");
    }
    state.direction = nextDirection;

    for (let i = 0; i < turn.distance; i++) {
      state[nextDirection] += 1;

      const n = state.n - state.s;
      const e = state.e - state.w;
      const nextLocation = { n, e, total: Math.abs(n) + Math.abs(e) };

      if (!duplicate) {
        locations.forEach(function (location) {
          if (location.n === nextLocation.n && location.e === nextLocation.e) {
            duplicate = nextLocation;
          }
        });
      }

      locations.push(nextLocation);
    }
  });
  return duplicate!.total;
}

part2.test = 4;
part2.real = 131;
