import { anyChar, eof } from "./primitives";
import { ParserOutput } from "./types";

describe("anyChar", () => {
  const parser = anyChar;

  it("Empty input", () => {
    const input = [] as const;
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<string>>({
      result: "fail",
    });
  });

  it("1 character input", () => {
    const input = [..."a"];
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<string>>({
      result: "success",
      data: "a",
      rest: [],
    });
  });

  it("Many characters input", () => {
    const input = [..."foo"];
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<string>>({
      result: "success",
      data: "f",
      rest: [..."oo"],
    });
  });
});

describe("eof", () => {
  const parser = eof;

  it("Empty input", () => {
    const input = [] as const;
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<null>>({
      result: "success",
      data: null,
      rest: [],
    });
  });

  it("1 character input", () => {
    const input = [..."a"];
    const output = parser(input);

    expect(output).toStrictEqual<ParserOutput<null>>({
      result: "fail",
    });
  });
});
