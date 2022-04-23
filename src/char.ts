import { anyChar } from "./primitives";
import { Alphabet, Digit, LowerAlphabet, Parser, ParserInput, UpperAlphabet } from "./types";

type CharFunc = <T extends ParserInput[0]>(c: T) => Parser<T>;

export const char: CharFunc = (c) => (input) => {
  const r = anyChar(input);

  if (r.result === "fail") {
    return r;
  }

  if (r.data !== c) {
    return { result: "fail" };
  }

  return {
    result: "success",
    data: c,
    rest: r.rest,
  };
};

type IsFunc = <T extends string>(f: (c: ParserInput[0]) => c is T) => Parser<T>;

export const is: IsFunc = (f) => (input) => {
  const r = anyChar(input);

  if (r.result === "fail") {
    return r;
  }

  if (!f(r.data)) {
    return {
      result: "fail",
    };
  }

  return {
    result: "success",
    data: r.data,
    rest: r.rest,
  };
};

export const upperAlpha: Parser<UpperAlphabet> = is((c): c is UpperAlphabet => /^[A-Z]$/.test(c));
export const lowerAlpha: Parser<LowerAlphabet> = is((c): c is LowerAlphabet => /^[a-z]$/.test(c));
export const alpha: Parser<Alphabet> = is((c): c is Alphabet => /^[A-Za-z]/.test(c));

export const digit: Parser<Digit> = is((c): c is Digit => /^\d$/.test(c));
