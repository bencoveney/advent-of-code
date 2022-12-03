import fs from "fs/promises";
import { Input, PartAnswer } from "./utils";

async function loadSolutions() {
  const list = await fs.readdir("./src");
  return list.filter((file) => file.match(/\d\d\.ts/) != null).sort();
}

async function loadFile(name: string): Promise<Input | null> {
  try {
    const raw = (await fs.readFile(name, "utf8")).trim();
    const allLines = raw.split("\n");
    const lines = allLines.filter(line => !!line);
    return {raw, allLines, lines};
  } catch (e) {
    console.log(`${name} not found`);
    return null;
  }
}

async function loadInputs(solution: string): Promise<[Input | null, Input | null]> {
  return [
    await loadFile(`./src/${solution.slice(0, 2)}.test.txt`),
    await loadFile(`./src/${solution.slice(0, 2)}.input.txt`),
  ];
}

function runPartAgainstInput(part: PartAnswer, input: Input | null, expected: any, name: string) {
  if (input == null) {
    console.log(`- ${name} Missing`);
    return;
  }
  let result = undefined;
  try {
    result = part(input);
  } catch (e) {
    console.error(e && (e as Error).message || e);
    result = "err";
  }
  const correct = expected === undefined ? "Unknown" : Object.is(result, expected) ? "Correct" : `Wrong - Expected ${expected}`;
  console.log(`- ${name}: ${result} (${correct})`)
}

async function runSolution(solution: string) {
  console.log("---", solution, "---");
  const [test, real] = await loadInputs(solution);
  const loadedSolution = await import(`./${solution}`);

  console.log("\nPart 1:");
  if (loadedSolution.part1) {
    runPartAgainstInput(loadedSolution.part1, test, loadedSolution.part1.test, "Test");
    runPartAgainstInput(loadedSolution.part1, real, loadedSolution.part1.real, "Real");
  } else {
    console.log("- Missing export part1()");
  }

  console.log("\nPart 2:");
  if (loadedSolution.part2) {
    runPartAgainstInput(loadedSolution.part2, test, loadedSolution.part2.test, "Test");
    runPartAgainstInput(loadedSolution.part2, real, loadedSolution.part2.real, "Real");
  } else {
    console.log("- Missing export part2()");
  }

  console.log("");
}

const solutions = await loadSolutions();
if (process.argv.includes("--all")) {
  await solutions.reduce(
    (prev, next) => prev.then(() => runSolution(next)),
    Promise.resolve()
  );
} else {
  await runSolution(solutions[solutions.length - 1]);
}
