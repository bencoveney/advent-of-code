import fs from "fs/promises";
import { highest, leftPad, loadSolutions } from "./utils.js";

const solutions = await loadSolutions();
const highestSolution = highest(
  solutions.map((solution) => parseInt(solution.slice(0, 2)))
);
const newName = leftPad((highestSolution + 1).toString(), 2);
const template = await fs.readFile("./src/template.content.ts", "utf8");
await fs.writeFile(`./src/${newName}.ts`, template);
await fs.writeFile(`./src/${newName}.test.txt`, "");
await fs.writeFile(`./src/${newName}.input.txt`, "");
