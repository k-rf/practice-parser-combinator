import type { Parser, ParserData } from "./types";

type NotFunc = (p: Parser<unknown>) => Parser<null>;

export const not: NotFunc = (p) => (input) => {
  if (p(input).result === "success") {
    return { result: "fail" };
  } else {
    return { result: "success", data: null, rest: input };
  }
};

type OrFunc = <T>(ps: Parser<T>[]) => Parser<T>;

export const or: OrFunc = (ps) => (input) => {
  for (const p of ps) {
    const r = p(input);

    if (r.result === "success") {
      return r;
    }
  }
  return { result: "fail" };
};

type CatFunc = <T extends Parser<unknown>[]>(
  ps: [...T]
) => Parser<{ [K in keyof T]: ParserData<T[K]> }>;

export const cat: CatFunc = (ps) => (input) => {
  const rs = [];
  let i = input;

  for (const p of ps) {
    const r = p(i);

    if (r.result === "fail") {
      return r;
    }

    rs.push(r.data);
    i = r.rest;
  }

  return {
    result: "success",
    data: rs as ParserData<ReturnType<ReturnType<CatFunc>>>,
    rest: i,
  };
};

type RepFunc = <T>(p: Parser<T>, min?: number, max?: number) => Parser<T[]>;

export const rep: RepFunc =
  (p, min = 0, max = Number.POSITIVE_INFINITY) =>
  (input) => {
    if (max < min) {
      throw new Error("rep: max < min is not allowed.");
    }

    if (min < 0) {
      throw new Error("rep: negative min is not allowed.");
    }

    if (max < 0) {
      throw new Error("rep: negative max is not allowed.");
    }

    const rs: ParserData<typeof p>[] = [];
    let i = input;

    for (let n = 0; n < max; n++) {
      const r = p(i);

      if (r.result === "fail") {
        break;
      }

      rs.push(r.data);
      i = r.rest;
    }

    if (rs.length < min) {
      return { result: "fail" };
    }

    return {
      result: "success",
      data: rs,
      rest: i,
    };
  };
