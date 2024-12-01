import fs from "fs/promises";
import { getCliArgs, highest, leftPad, loadSolutions } from "./utils.js";
import chalk from "chalk";

const { year } = getCliArgs();
console.log(`Instantiating template for ${chalk.yellow(year)}\n`);

const solutions = await loadSolutions(year);
const highestSolution = highest(
  solutions.map((solution) => parseInt(solution.slice(0, 2)))
);
const newName = leftPad((highestSolution + 1).toString(), 2);
const template = await fs.readFile("./src/template.ts.content", "utf8");
await fs.writeFile(`./src/${year}/${newName}.ts`, template);
await fs.writeFile(`./src/${year}/${newName}.test.txt`, "");
await fs.writeFile(`./src/${year}/${newName}.input.txt`, "");
