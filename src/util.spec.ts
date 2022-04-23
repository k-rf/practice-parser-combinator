import { char, digit } from "./char";
import { Digit, Option, ParserOutput } from "./types";
import { diff, list, map, opt, str } from "./util";

describe("map(digit, s => Number.parseInt(s, 10))", () => {
  const parser = map(digit, (s) => Number.parseInt(s, 10));

  it.each<{ title: string; input: string[]; expected: ParserOutput<number> }>([
    { title: "Empty Input", input: [], expected: { result: "fail" } },
    { title: 'Input "5"', input: [..."5"], expected: { result: "success", data: 5, rest: [] } },
  ])("$title", ({ input, expected }) => {
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<number>>(expected);
  });
});

describe('str("true")', () => {
  const parser = str("true");
  parser(["true"]);

  it.each<{ title: string; input: string[]; expected: ParserOutput<"true"> }>([
    { title: "Empty input", input: [], expected: { result: "fail" } },
    {
      title: 'Input "true"',
      input: [..."true"],
      expected: { result: "success", data: "true", rest: [] },
    },
  ])("$title", ({ input, expected }) => {
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<"true">>(expected);
  });
});

describe("opt()", () => {
  describe('opt(char("a"))', () => {
    const parser = opt(char("a"));

    it.each<{ title: string; input: string[]; expected: ParserOutput<Option<"a">> }>([
      {
        title: "Empty input",
        input: [],
        expected: { result: "success", data: { status: "none" }, rest: [] },
      },
      {
        title: 'Input "a"',
        input: [..."a"],
        expected: { result: "success", data: { status: "some", value: "a" }, rest: [] },
      },
      {
        title: 'Input "aa"',
        input: [..."aa"],
        expected: { result: "success", data: { status: "some", value: "a" }, rest: [..."a"] },
      },
      {
        title: 'Input "b"',
        input: [..."b"],
        expected: { result: "success", data: { status: "none" }, rest: [..."b"] },
      },
    ])("$title", ({ input, expected }) => {
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<Option<"a">>>(expected);
    });
  });
});

describe('diff(digit, char("0"))', () => {
  const parser = diff(digit, char("0"));

  it.each<{ title: string; input: string[]; expected: ParserOutput<Digit> }>([
    {
      title: "Empty input",
      input: [],
      expected: { result: "fail" },
    },
    {
      title: 'Input "a"',
      input: [..."a"],
      expected: { result: "fail" },
    },
    {
      title: 'Input "0"',
      input: [..."0"],
      expected: { result: "fail" },
    },
    {
      title: 'Input "5"',
      input: [..."5"],
      expected: { result: "success", data: "5", rest: [] },
    },
  ])("$title", ({ input, expected }) => {
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<Digit>>(expected);
  });
});

describe('list(digit, char(","))', () => {
  const parser = list(digit, char(","));

  it.each<{ title: string; input: string[]; expected: ParserOutput<Digit[]> }>([
    {
      title: "Empty input",
      input: [],
      expected: { result: "fail" },
    },
    {
      title: 'Input "a"',
      input: [..."a"],
      expected: { result: "fail" },
    },
    {
      title: 'Input "1"',
      input: [..."1"],
      expected: { result: "success", data: ["1"], rest: [] },
    },
    {
      title: 'Input "1,2,3,4,5"',
      input: [..."1,2,3,4,5"],
      expected: { result: "success", data: ["1", "2", "3", "4", "5"], rest: [] },
    },
  ])("$title", ({ input, expected }) => {
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<Digit[]>>(expected);
  });
});
