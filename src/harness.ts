import fs from "fs/promises";

async function loadSolutions() {
  const list = await fs.readdir("./src");
  return list.filter((file) => file.match(/\d\d\.ts/) != null).sort();
}

async function loadFile(name: string) {
  try {
    return await fs.readFile(name, "utf8");
  } catch (e) {
    console.log(`${name} not found`);
    return "";
  }
}

async function loadInputs(solution: string) {
  return [
    await loadFile(`./src/${solution.slice(0, 2)}.test.txt`),
    await loadFile(`./src/${solution.slice(0, 2)}.input.txt`),
  ];
}

async function runSolution(solution: string) {
  console.log("---", solution, "---");
  const [test, input] = await loadInputs(solution);
  const loadedSolution = await import(`./${solution}`);

  console.log("\nPart 1:");
  if (loadedSolution.part1) {
    test && console.log("- Test", loadedSolution.part1(test));
    input && console.log("- Real", loadedSolution.part1(input));
  } else {
    console.log("- Missing export part1()");
  }

  console.log("\nPart 2:");
  if (loadedSolution.part2) {
    test && console.log("- Test", loadedSolution.part2(test));
    input && console.log("- Real", loadedSolution.part2(input));
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
