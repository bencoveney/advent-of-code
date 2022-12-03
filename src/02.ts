import { Input } from "./utils";

const enum Choices {
  Rock = "Rock",
  Paper = "Paper",
  Scissors = "Scissors"
}

const choiceMap: {[key: string]: Choices} = {
  "A": Choices.Rock,
  "B": Choices.Paper,
  "C": Choices.Scissors,
  "X": Choices.Rock,
  "Y": Choices.Paper,
  "Z": Choices.Scissors,
}

const scoreMap = {
  [Choices.Rock]: 1,
  [Choices.Paper]: 2,
  [Choices.Scissors]: 3,
};

function play(opponent: Choices, you: Choices): number {
  let score = scoreMap[you];

  if (opponent === you) {
    // Draw.
    score += 3;
  } else if (
    (opponent === Choices.Rock && you === Choices.Paper) ||
    (opponent === Choices.Paper && you === Choices.Scissors) ||
    (opponent === Choices.Scissors && you === Choices.Rock)
  ) {
    // Win.
    score += 6;
  }

  return score;
}

const outcomeMap: {[key: string]: {[key: string]: Choices}} = {
  // Lose
  "X": {
    [Choices.Rock]: Choices.Scissors,
    [Choices.Paper]: Choices.Rock,
    [Choices.Scissors]: Choices.Paper,
  },
  "Y": {
    [Choices.Rock]: Choices.Rock,
    [Choices.Paper]: Choices.Paper,
    [Choices.Scissors]: Choices.Scissors,
  },
  "Z": {
    [Choices.Rock]: Choices.Paper,
    [Choices.Paper]: Choices.Scissors,
    [Choices.Scissors]: Choices.Rock,
  },
}

export function part1({lines}: Input) {
  return lines.filter(line => !!line).map(line => {
    const opponent = choiceMap[line.charAt(0)];
    const you = choiceMap[line.charAt(2)];
    return play(opponent, you);
  }).reduce((prev, next) => prev + next, 0);
}

part1.test = 15;
part1.real = 15523;

export function part2({lines}: Input) {
  return lines.filter(line => !!line).map(line => {
    const opponent = choiceMap[line.charAt(0)];
    const you = outcomeMap[line.charAt(2)][opponent];
    return play(opponent, you);
  }).reduce((prev, next) => prev + next, 0);
}

part2.test = 12;
part2.real = 15702;
