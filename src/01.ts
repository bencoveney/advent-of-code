export function getMost(input: string) {
  const elves = [0];
  
  const lines = input.split("\n").map(line => line.trim());
  
  let current = 0;
  for (const cal of lines) {
    if (cal === "") {
      elves.push(current);
      current = 0;
    } else {
      current += parseInt(cal);
    }
  };

  elves.sort((a, b) => a-b).reverse();

  return {
    max: elves[0],
    topThree: elves[0] + elves[1] + elves[2]
  }
}

export function part1(input: string) {
  return getMost(input).max;
};

export function part2(input: string) {
  return getMost(input).topThree;
};
