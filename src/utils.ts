export type Input = {
  raw: string; // Caveat: Trailing whitespace trimmed.
  lines: string[]; // Excludes empty.
  allLines: string[]; // Includes empty.
};

export type PartAnswer<T = number> = {
  test?: T;
  real?: T;
  (input: Input): T;
};
