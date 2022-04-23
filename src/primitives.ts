import type { Parser } from "./types";

export const anyChar: Parser<string> = (input) => {
  if (input.length === 0) {
    return { result: "fail" };
  }

  const [data, ...rest] = input;

  return {
    result: "success",
    data,
    rest,
  };
};

export const eof: Parser<null> = (input) => {
  if (input.length === 0) {
    return {
      result: "success",
      data: null,
      rest: [],
    };
  }

  return { result: "fail" };
};
