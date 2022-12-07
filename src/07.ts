import { Input, sortNumsAsc, sum } from "./utils.js";

type File = {
  kind: "file";
  size: number;
};

type Dir = {
  parent?: Dir;
  kind: "dir";
  content: { [name: string]: File | Dir };
};

function buildFsFromCommands(commands: string[]) {
  const root: Dir = {
    kind: "dir",
    content: {},
  };
  let currentDir = root;
  let copy = ([] as String[]).concat(commands);
  while (copy.length > 0) {
    const nextCommand = copy.shift()!;
    const parts = nextCommand.split(" ");
    switch (parts[0]) {
      case "dir":
        const dirName = parts[1];
        if (!currentDir.content[dirName]) {
          currentDir.content[dirName] = {
            parent: currentDir,
            kind: "dir",
            content: {},
          };
        }
        break;
      case "$":
        if (parts[1] == "cd") {
          const path = parts[2];
          switch (path) {
            case "..":
              currentDir = currentDir.parent!;
              break;
            case "/":
              currentDir = root;
              break;
            default:
              currentDir = currentDir.content[path] as Dir;
              break;
          }
        }
        // Do nothing for ls.
        break;
      default:
        const size = parseInt(parts[0]);
        const fileName = parts[1];
        if (!currentDir.content[fileName]) {
          currentDir.content[fileName] = {
            kind: "file",
            size,
          };
        }
        break;
    }
  }
  return root;
}

function forEachChild(target: Dir, cb: (content: File | Dir) => void) {
  Object.entries(target.content).forEach(([_, value]) => {
    cb(value);
    if (value.kind === "dir") {
      forEachChild(value, cb);
    }
  });
}

function getDirectorySize(dir: Dir): number {
  let size = 0;
  forEachChild(dir, (content) => {
    if (content.kind === "file") {
      size += content.size;
    }
  });
  return size;
}

function getDirectorySizes(dir: Dir): number[] {
  const sizes: number[] = [getDirectorySize(dir)];
  forEachChild(dir, (content) => {
    if (content.kind === "dir") {
      sizes.push(getDirectorySize(content));
    }
  });
  return sizes;
}

export function part1({ lines }: Input) {
  const fileSystem = buildFsFromCommands(lines);
  const sizes = getDirectorySizes(fileSystem);
  return sum(sizes.filter((size) => size <= 100000));
}

part1.test = 95437;
part1.real = 1743217;

export function part2({ lines }: Input) {
  const fileSystem = buildFsFromCommands(lines);
  const diskSpaceAvailable = 70000000;
  const diskSpaceNeeded = 30000000;
  const freeSpaceNeeded =
    getDirectorySize(fileSystem) - (diskSpaceAvailable - diskSpaceNeeded);
  const sizes = sortNumsAsc(getDirectorySizes(fileSystem)).filter(
    (size) => size >= freeSpaceNeeded
  );
  return sizes[0];
}

part2.test = 24933642;
part2.real = 8319096;
