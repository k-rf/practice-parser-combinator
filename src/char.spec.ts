import { alpha, char, digit, is, lowerAlpha, upperAlpha } from "./char";
import { Alphabet, Digit, LowerAlphabet, ParserOutput, UpperAlphabet } from "./types";

describe('char("a")', () => {
  const parser = char("a");

  it("Empty input", () => {
    const input = [] as const;
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<"a">>({
      result: "fail",
    });
  });

  it('Input "a"', () => {
    const input = [..."a"];
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<"a">>({
      result: "success",
      data: "a",
      rest: [],
    });
  });

  it('Input "A"', () => {
    const input = [..."A"];
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<"a">>({
      result: "fail",
    });
  });

  it('Input "foo"', () => {
    const input = [..."foo"];
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<"a">>({
      result: "fail",
    });
  });
});

describe("is()", () => {
  describe('is(c => c === "a")', () => {
    const parser = is((c): c is "a" => c === "a");

    it("Empty input", () => {
      const input = [] as const;
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<"a">>({
        result: "fail",
      });
    });

    it('Input "a"', () => {
      const input = [..."a"];
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<"a">>({
        result: "success",
        data: "a",
        rest: [],
      });
    });

    it('Input "A"', () => {
      const input = [..."A"];
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<"a">>({
        result: "fail",
      });
    });
  });

  describe('is(c => c === "0" || c === "1")', () => {
    const parser = is((c): c is "0" | "1" => c === "0" || c === "1");

    it("Empty input", () => {
      const input = [] as const;
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<"0" | "1">>({
        result: "fail",
      });
    });

    it('Input "0"', () => {
      const input = [..."0"];
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<"0" | "1">>({
        result: "success",
        data: "0",
        rest: [],
      });
    });

    it('Input "1"', () => {
      const input = [..."1"];
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<"0" | "1">>({
        result: "success",
        data: "1",
        rest: [],
      });
    });

    it('Input "A"', () => {
      const input = [..."A"];
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<"0" | "1">>({
        result: "fail",
      });
    });
  });
});

describe("upperAlpha", () => {
  const parser = upperAlpha;

  it.each<{ title: string; input: string[]; expected: ParserOutput<UpperAlphabet> }>([
    { title: "Empty input", input: [], expected: { result: "fail" } },
    { title: 'Input "a"', input: [..."a"], expected: { result: "fail" } },
    { title: 'Input "A"', input: [..."A"], expected: { result: "success", data: "A", rest: [] } },
  ])("$title", ({ input, expected }) => {
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<UpperAlphabet>>(expected);
  });
});

describe("lowerAlpha", () => {
  const parser = lowerAlpha;

  it.each<{ title: string; input: string[]; expected: ParserOutput<LowerAlphabet> }>([
    { title: "Empty input", input: [], expected: { result: "fail" } },
    { title: 'Input "a"', input: [..."a"], expected: { result: "success", data: "a", rest: [] } },
    { title: 'Input "A"', input: [..."A"], expected: { result: "fail" } },
  ])("$title", ({ input, expected }) => {
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<LowerAlphabet>>(expected);
  });
});

describe("alpha", () => {
  const parser = alpha;

  it.each<{ title: string; input: string[]; expected: ParserOutput<Alphabet> }>([
    { title: "Empty input", input: [], expected: { result: "fail" } },
    { title: 'Input "a"', input: [..."a"], expected: { result: "success", data: "a", rest: [] } },
    { title: 'Input "A"', input: [..."A"], expected: { result: "success", data: "A", rest: [] } },
    { title: 'Input "1"', input: [..."1"], expected: { result: "fail" } },
  ])("$title", ({ input, expected }) => {
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<Alphabet>>(expected);
  });
});

describe("alpha", () => {
  const parser = digit;

  it.each<{ title: string; input: string[]; expected: ParserOutput<Digit> }>([
    { title: "Empty input", input: [], expected: { result: "fail" } },
    { title: 'Input "5"', input: [..."5"], expected: { result: "success", data: "5", rest: [] } },
    { title: 'Input "a"', input: [..."a"], expected: { result: "fail" } },
  ])("$title", ({ input, expected }) => {
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<Digit>>(expected);
  });
});
