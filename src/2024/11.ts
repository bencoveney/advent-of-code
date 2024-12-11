import { Input, sum } from "../utils.js";

function parse(raw: string): number[] {
  return raw.split(" ").map((value) => parseInt(value));
}

type DepthCache = { [key: number]: Map<number, number> };
const depthCache: DepthCache = {};
function setInCache(blink: number, stone: number, value: number) {
  if (depthCache[blink] === undefined) {
    depthCache[blink] = new Map();
  }
  if (!depthCache[blink].has(stone)) {
    depthCache[blink].set(stone, value);
  }
}
function readFromCache(blink: number, stone: number): number | null {
  if (depthCache[blink] && depthCache[blink].has(stone)) {
    return depthCache[blink].get(stone)!;
  } else return null;
}

function walkStones(blinks: number, stone: number): number {
  if (blinks === 0) {
    return 1;
  }
  const cached = readFromCache(blinks, stone);
  if (cached !== null) {
    return cached;
  }
  const nextBlinks = blinks - 1;
  if (stone === 0) {
    const result = walkStones(nextBlinks, 1);
    setInCache(blinks, stone, result);
    return result;
  }
  const asString = stone.toString();
  if (asString.length % 2 === 0) {
    const halfLength = asString.length / 2;
    const left = asString.substring(0, halfLength);
    const right = asString.substring(halfLength, asString.length);
    const result =
      walkStones(nextBlinks, parseInt(left)) +
      walkStones(nextBlinks, parseInt(right));
    setInCache(blinks, stone, result);
    return result;
  }
  const result = walkStones(nextBlinks, stone * 2024);
  setInCache(blinks, stone, result);
  return result;
}

export function part1({ raw }: Input) {
  const result = parse(raw);
  return sum(result.map((stone) => walkStones(25, stone)));
}

part1.test = 55312;
part1.real = 199946;

export function part2({ raw }: Input) {
  const result = parse(raw);
  return sum(result.map((stone) => walkStones(75, stone)));
}

part2.test = 65601038650482;
part2.real = 237994815702032;
