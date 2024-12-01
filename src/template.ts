import fs from "fs/promises";
import { highest, leftPad, loadSolutions } from "./utils.js";

const latestYear = 2022;

const solutions = await loadSolutions(latestYear);
const highestSolution = highest(
  solutions.map((solution) => parseInt(solution.slice(0, 2)))
);
const newName = leftPad((highestSolution + 1).toString(), 2);
const template = await fs.readFile("./src/template.content.ts", "utf8");
await fs.writeFile(`./src/${latestYear}/${newName}.ts`, template);
await fs.writeFile(`./src/${latestYear}/${newName}.test.txt`, "");
await fs.writeFile(`./src/${latestYear}/${newName}.input.txt`, "");
