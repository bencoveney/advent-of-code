import fs from "fs/promises";
import {
  festive,
  getCliArgs,
  Input,
  loadSolutions,
  Mode,
  PartAnswer,
} from "./utils.js";
import chalk from "chalk";

async function loadFile(name: string): Promise<Input | null> {
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
): Promise<[Input | null, Input | null]> {
  return [
    await loadFile(`./src/${year}/${solution.slice(0, 2)}.test.txt`),
    await loadFile(`./src/${year}/${solution.slice(0, 2)}.input.txt`),
  ];
}

function runPartAgainstInput(
  part: PartAnswer | undefined,
  input: Input | null,
  expected: any,
  name: string
): boolean {
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
    console.error((e && (e as Error)?.message) || e);
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
    test,
    loadedSolution.part1?.test,
    "Test"
  );
  part1TestPassed &&
    runPartAgainstInput(
      loadedSolution.part1,
      real,
      loadedSolution.part1?.real,
      "Real"
    );

  console.log("\nPart 2:");
  const part2TestPassed = runPartAgainstInput(
    loadedSolution.part2,
    test,
    loadedSolution.part2?.test,
    "Test"
  );
  part2TestPassed &&
    runPartAgainstInput(
      loadedSolution.part2,
      real,
      loadedSolution.part2?.real,
      "Real"
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
