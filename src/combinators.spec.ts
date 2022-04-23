import { char } from "./char";
import { cat, not, or, rep } from "./combinators";
import { ParserOutput } from "./types";

describe('not(char("a")', () => {
  const parser = not(char("a"));

  it("Empty input", () => {
    const input = [] as const;
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<null>>({
      result: "success",
      data: null,
      rest: [],
    });
  });

  it('Input "a"', () => {
    const input = [..."a"];
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<null>>({
      result: "fail",
    });
  });

  it('Input "A"', () => {
    const input = [..."A"];
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<null>>({
      result: "success",
      data: null,
      rest: [..."A"],
    });
  });

  it('Input "foo"', () => {
    const input = [..."foo"];
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<null>>({
      result: "success",
      data: null,
      rest: [..."foo"],
    });
  });
});

describe("or()", () => {
  describe("or([])", () => {
    const parser = or([]);

    it("Empty input", () => {
      const input = [] as const;
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<unknown>>({
        result: "fail",
      });
    });

    it('Input "a"', () => {
      const input = [..."a"];
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<unknown>>({
        result: "fail",
      });
    });
  });

  describe('or([char("a"), char("b")])', () => {
    const parser = or([char("a"), char("b")]);

    it("Empty input", () => {
      const input = [] as const;
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<"a" | "b">>({
        result: "fail",
      });
    });

    it('Input "a"', () => {
      const input = [..."a"];
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<"a" | "b">>({
        result: "success",
        data: "a",
        rest: [],
      });
    });

    it('Input "b"', () => {
      const input = [..."b"];
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<"a" | "b">>({
        result: "success",
        data: "b",
        rest: [],
      });
    });

    it('Input "A"', () => {
      const input = [..."A"];
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<"a" | "b">>({
        result: "fail",
      });
    });
  });
});

describe("cat()", () => {
  describe("cat([])", () => {
    const parser = cat([]);

    it("Empty input", () => {
      const input = [] as const;
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<[]>>({
        result: "success",
        data: [],
        rest: [],
      });
    });

    it('Input "a"', () => {
      const input = [..."a"];
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<[]>>({
        result: "success",
        data: [],
        rest: [..."a"],
      });
    });
  });

  describe('cat([char("a"), char("b")])', () => {
    () => {
      const parser = cat([char("a"), char("b")]);

      it.each<{ title: string; input: string[]; expected: ParserOutput<["a", "b"]> }>([
        { title: "Empty input", input: [], expected: { result: "fail" } },
        { title: 'Input "a"', input: [..."a"], expected: { result: "fail" } },
        {
          title: 'Input "abc"',
          input: [..."abc"],
          expected: { result: "success", data: ["a", "b"], rest: [..."c"] },
        },
        {
          title: 'Input "A"',
          input: [..."A"],
          expected: { result: "fail" },
        },
      ])("$title", ({ input, expected }) => {
        const output = parser(input);

        expect(output).toStrictEqual<ParserOutput<["a", "b"]>>(expected);
      });
    };
  });
});

describe("rep()", () => {
  describe('rep(char("a"))', () => {
    const parser = rep(char("a"));

    it.each<{ title: string; input: string[]; expected: ParserOutput<"a"[]> }>([
      { title: "Empty input", input: [], expected: { result: "success", data: [], rest: [] } },
      {
        title: 'Input "a"',
        input: [..."a"],
        expected: { result: "success", data: ["a"], rest: [] },
      },
      {
        title: 'Input "aa"',
        input: [..."aa"],
        expected: { result: "success", data: ["a", "a"], rest: [] },
      },
      {
        title: 'Input "aab"',
        input: [..."aab"],
        expected: { result: "success", data: ["a", "a"], rest: [..."b"] },
      },
    ])("$title", ({ input, expected }) => {
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<"a"[]>>(expected);
    });
  });

  describe('rep(char("a"), 1)', () => {
    const parser = rep(char("a"), 1);

    it.each<{ title: string; input: string[]; expected: ParserOutput<"a"[]> }>([
      { title: "Empty input", input: [], expected: { result: "fail" } },
      {
        title: 'Input "a"',
        input: [..."a"],
        expected: { result: "success", data: ["a"], rest: [] },
      },
      {
        title: 'Input "aa"',
        input: [..."aa"],
        expected: { result: "success", data: ["a", "a"], rest: [] },
      },
      {
        title: 'Input "aab"',
        input: [..."aab"],
        expected: { result: "success", data: ["a", "a"], rest: [..."b"] },
      },
    ])("$title", ({ input, expected }) => {
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<"a"[]>>(expected);
    });
  });

  describe('rep(char("a"), 1, 2)', () => {
    const parser = rep(char("a"), 1, 2);

    it.each<{ title: string; input: string[]; expected: ParserOutput<"a"[]> }>([
      { title: "Empty input", input: [], expected: { result: "fail" } },
      {
        title: 'Input "a"',
        input: [..."a"],
        expected: { result: "success", data: ["a"], rest: [] },
      },
      {
        title: 'Input "aa"',
        input: [..."aa"],
        expected: { result: "success", data: ["a", "a"], rest: [] },
      },
      {
        title: 'Input "aaa"',
        input: [..."aaa"],
        expected: { result: "success", data: ["a", "a"], rest: [..."a"] },
      },
    ])("$title", ({ input, expected }) => {
      const output = parser(input);

      expect(output).toStrictEqual<ParserOutput<"a"[]>>(expected);
    });
  });
});
