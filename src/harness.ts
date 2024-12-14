import fs from "fs/promises";
import {
  festive,
  getCliArgs,
  Input,
  InputContent,
  loadSolutions,
  Mode,
  PartAnswer,
} from "./utils.js";
import chalk from "chalk";

async function loadFile(name: string): Promise<InputContent | null> {
  try {
    const raw = (await fs.readFile(name, "utf8")).trimEnd();
    const allLines = raw.split("\n");
    const lines = allLines.filter((line) => !!line);
    const chars = lines[0]?.split("") || [];
    return { raw, allLines, lines, chars };
  } catch (e) {
    console.log(`${name} not found`);
    return null;
  }
}

async function loadInputs(
  solution: string,
  year: number
): Promise<[InputContent | null, InputContent | null]> {
  return [
    await loadFile(`./src/${year}/${solution.slice(0, 2)}.test.txt`),
    await loadFile(`./src/${year}/${solution.slice(0, 2)}.input.txt`),
  ];
}

function runPartAgainstInput(
  part: PartAnswer | undefined,
  input: Input | null,
  expected: any
): boolean {
  const name = input?.isTest === false ? "Real" : "Test";
  if (!part) {
    console.log(chalk.gray(`- ${name}: No part()`));
    return false;
  }
  if (!input || !input.raw) {
    console.log(chalk.gray(`- ${name}: No Input`));
    return false;
  }
  let startMillis = performance.now();
  let endMillis = 0;
  let result = undefined;
  try {
    result = part(input);
    endMillis = performance.now();
  } catch (e) {
    console.error(e);
    result = chalk.redBright("err");
  }
  if (!result) {
    console.log(chalk.gray(`- ${name}: No Result`));
    return false;
  }
  let timeSpentMillis = Math.round((endMillis - startMillis) * 100) / 100;
  const correct =
    expected === undefined
      ? chalk.gray("Unknown")
      : Object.is(result, expected)
      ? chalk.greenBright("Correct")
      : chalk.redBright(`Expected ${expected}`);
  console.log(
    `${chalk.gray(`- ${name}:`)} ${result} (${correct}) ${chalk.grey(
      `in ${timeSpentMillis}ms`
    )}`
  );
  return Object.is(result, expected);
}

function writeTitle(text: string) {
  console.log(`${festive("---")} ${chalk.underline(text)} ${festive("---")}`);
}

async function runSolution(solution: string, year: number) {
  writeTitle(solution);
  const [test, real] = await loadInputs(solution, year);
  const loadedSolution = await import(`./${year}/${solution}`);

  console.log("\nPart 1:");
  const part1TestPassed = runPartAgainstInput(
    loadedSolution.part1,
    test ? { ...test, isTest: true, part: 1 } : null,
    loadedSolution.part1?.test
  );
  part1TestPassed &&
    runPartAgainstInput(
      loadedSolution.part1,
      real ? { ...real, isTest: false, part: 1 } : null,
      loadedSolution.part1?.real
    );

  console.log("\nPart 2:");
  const part2TestPassed = runPartAgainstInput(
    loadedSolution.part2,
    test ? { ...test, isTest: true, part: 2 } : null,
    loadedSolution.part2?.test
  );
  part2TestPassed &&
    runPartAgainstInput(
      loadedSolution.part2,
      real ? { ...real, isTest: false, part: 2 } : null,
      loadedSolution.part2?.real
    );

  console.log("");
}

const { mode, year } = getCliArgs();
console.log(
  `Running ${chalk.yellow(mode)} exercises from ${chalk.yellow(year)}\n`
);

const solutions = await loadSolutions(year);

if (mode === Mode.All) {
  await solutions.reduce(
    (prev, next) => prev.then(() => runSolution(next, year)),
    Promise.resolve()
  );
} else {
  await runSolution(solutions[solutions.length - 1], year);
}
