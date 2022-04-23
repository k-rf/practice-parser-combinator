type ParseSuccess<T> = {
  result: "success";
  data: T;
  rest: ParserInput;
};

type ParseFail = {
  result: "fail";
};

export type ParserInput = readonly string[];
export type ParserOutput<T> = Readonly<ParseSuccess<T> | ParseFail>;

export type Parser<T> = (input: ParserInput) => ParserOutput<T>;
export type ParserData<P> = P extends Parser<infer T> ? T : never;

// prettier-ignore
export type UpperAlphabet = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";
export type LowerAlphabet = Lowercase<UpperAlphabet>;
export type Alphabet = UpperAlphabet | LowerAlphabet;

export type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type Some<T> = {
  status: "some";
  value: T;
};

export type None = {
  status: "none";
};

export type Option<T> = Some<T> | None;
