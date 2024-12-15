import { Input } from "../utils.js";

function parse(lines: string[]) {
  return lines.map(function (triangle) {
    return triangle
      .split(/\s+/)
      .filter(function (side) {
        return side.length > 0;
      })
      .map(function (side) {
        return parseInt(side);
      });
  });
}

function doIt(set: number[][]) {
  return set.filter(function (triangle) {
    triangle.sort(function (a, b) {
      return a - b;
    });
    return triangle[0] + triangle[1] > triangle[2];
  }).length;
}

export function part1({ lines }: Input) {
  const parsed = parse(lines);
  return doIt(parsed);
}

part1.test = 3;
part1.real = 983;

export function part2({ lines }: Input) {
  const parsed = parse(lines);
  var verticals = [];

  for (let i = 0; i < parsed.length / 3; i++) {
    var start = i * 3;
    for (let j = 0; j < 3; j++) {
      var triangle = [];
      for (let k = 0; k < 3; k++) {
        triangle.push(parsed[start + k][j]);
      }
      verticals.push(triangle);
    }
  }

  return doIt(verticals);
}

part2.test = 6;
part2.real = 1836;
