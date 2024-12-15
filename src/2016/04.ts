import { Input, alphabet as refAlphabet } from "../utils.js";

var regex = /((?:(?:[a-z])+-)+)(\d+)\[([a-z]+)\]/;

export function part1({ lines }: Input) {
  var total = 0;

  lines.forEach((word) => {
    var parts = regex.exec(word)!;
    if (!parts) {
      console.error("Broken :'( " + word);
    }

    var originalLetters = parts[1];
    var letters = originalLetters.split("-").join("");
    var number = parseInt(parts[2]);
    var hash = parts[3];

    var alphabet: Record<string, number> = {};
    var max = 0;
    letters.split("").forEach((letter) => {
      if (alphabet[letter]) {
        alphabet[letter]++;
      } else {
        alphabet[letter] = 1;
      }

      max = Math.max(max, alphabet[letter]);
    });

    var letterBins = new Array(max);
    for (var i = 1; i <= max; i++) {
      letterBins[i] = [];
    }

    for (var letter in alphabet) {
      letterBins[alphabet[letter]].push(letter);
    }

    letterBins = letterBins.map((letterBin) => {
      letterBin.sort();
      return letterBin.join("");
    });
    var calculatedHash = letterBins.reverse().join("").substring(0, 5);

    if (calculatedHash !== hash) {
      return;
    }

    total += number;
  });

  return total;
}

part1.test = 1514;
part1.real = 158835;

// The test input has no result for part 2.
const nonResult = 5;

export function part2({ lines, isTest }: Input) {
  if (isTest) {
    return nonResult;
  }

  var total = 0;

  lines.forEach((word) => {
    var parts = regex.exec(word)!;
    if (!parts) {
      console.error("Broken :'( " + word);
    }

    var originalLetters = parts[1];
    var letters = originalLetters.split("-").join("");
    var number = parseInt(parts[2]);
    var hash = parts[3];

    var alphabet: Record<string, number> = {};
    var max = 0;
    letters.split("").forEach((letter) => {
      if (alphabet[letter]) {
        alphabet[letter]++;
      } else {
        alphabet[letter] = 1;
      }

      max = Math.max(max, alphabet[letter]);
    });

    var letterBins = new Array(max);
    for (var i = 1; i <= max; i++) {
      letterBins[i] = [];
    }

    for (var letter in alphabet) {
      letterBins[alphabet[letter]].push(letter);
    }

    letterBins = letterBins.map((letterBin) => {
      letterBin.sort();
      return letterBin.join("");
    });
    var calculatedHash = letterBins.reverse().join("").substring(0, 5);

    if (calculatedHash !== hash) {
      return;
    }

    var allLetters = [...refAlphabet];
    var shift = number % allLetters.length;

    var shiftedLetters = originalLetters
      .split("")
      .map((letter) => {
        if (letter === "-") {
          return "-";
        }
        var index = allLetters.indexOf(letter);
        var shifted = (index + shift) % allLetters.length;
        return allLetters[shifted];
      })
      .join("");

    if (shiftedLetters.indexOf("northpole") >= 0) {
      total = number;
    }
  });

  return total;
}

part2.test = nonResult;
part2.real = 993;
