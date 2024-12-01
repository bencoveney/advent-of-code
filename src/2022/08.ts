import { Input } from "../utils.js";

type Visibility = {
  height: number;
  isVisibleL: boolean;
  isVisibleR: boolean;
  isVisibleT: boolean;
  isVisibleB: boolean;
  isVisible: boolean;
  score: number;
};

function setVisibility(map: Visibility[][]) {
  for (let row = 0; row < map.length; row++) {
    const currentRow = map[row];
    let rowMaxFromL = -1;
    let rowMaxFromR = -1;
    for (let col = 0; col < map[0].length; col++) {
      if (currentRow[col].height <= rowMaxFromL) {
        currentRow[col].isVisibleL = false;
      } else {
        rowMaxFromL = Math.max(rowMaxFromL, currentRow[col].height);
      }
      if (currentRow[currentRow.length - col - 1].height <= rowMaxFromR) {
        currentRow[currentRow.length - col - 1].isVisibleR = false;
      } else {
        rowMaxFromR = Math.max(
          rowMaxFromR,
          currentRow[currentRow.length - col - 1].height
        );
      }
    }
  }
  for (let col = 0; col < map[0].length; col++) {
    let colMaxFromT = -1;
    let colMaxFromB = -1;
    for (let row = 0; row < map.length; row++) {
      const rowIndex = row;
      const rowIndexRev = map[0].length - row - 1;
      if (map[rowIndex][col].height <= colMaxFromT) {
        map[rowIndex][col].isVisibleT = false;
      } else {
        colMaxFromT = Math.max(colMaxFromT, map[rowIndex][col].height);
      }
      if (map[rowIndexRev][col].height <= colMaxFromB) {
        map[rowIndexRev][col].isVisibleB = false;
      } else {
        colMaxFromB = Math.max(colMaxFromB, map[rowIndexRev][col].height);
      }
    }
  }
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      const current = map[row][col];
      current.isVisible =
        current.isVisibleL ||
        current.isVisibleR ||
        current.isVisibleT ||
        current.isVisibleB;
    }
  }
}

function countVisible(map: Visibility[][]): number {
  return map.flat(1).filter((tree) => tree.isVisible).length;
}

export function part1({ lines }: Input) {
  const heights: Visibility[][] = lines.map((line) =>
    line.split("").map((height) => ({
      height: parseInt(height),
      isVisibleL: true,
      isVisibleR: true,
      isVisibleT: true,
      isVisibleB: true,
      isVisible: true,
      score: 1,
    }))
  );
  setVisibility(heights);
  return countVisible(heights);
}

part1.test = 21;
part1.real = 1792;

function getScore(map: number[][], currentRow: number, currentCol: number) {
  const current = map[currentRow][currentCol];
  let totalScore = 1;
  {
    // Looking down.
    let score = 0;
    for (let row = currentRow + 1; row < map.length; row++) {
      score++;
      if (map[row][currentCol] >= current) {
        break;
      }
    }
    totalScore *= score;
  }
  {
    // Looking up.
    let score = 0;
    for (let row = currentRow - 1; row >= 0; row--) {
      score++;
      if (map[row][currentCol] >= current) {
        break;
      }
    }
    totalScore *= score;
  }
  {
    // Looking right
    let score = 0;
    for (let col = currentCol + 1; col < map[0].length; col++) {
      score++;
      if (map[currentRow][col] >= current) {
        break;
      }
    }
    totalScore *= score;
  }
  {
    // Looking left.
    let score = 0;
    for (let col = currentCol - 1; col >= 0; col--) {
      score++;
      if (map[currentRow][col] >= current) {
        break;
      }
    }
    totalScore *= score;
  }
  return totalScore;
}

function getMaxScore(map: number[][]) {
  let score = 0;
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      score = Math.max(getScore(map, row, col), score);
    }
  }
  return score;
}

export function part2({ lines }: Input) {
  const scores: number[][] = lines.map((line) =>
    line.split("").map((height) => parseInt(height))
  );
  return getMaxScore(scores);
}

part2.test = 8;
part2.real = 334880;
