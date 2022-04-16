import { DomainPrimitive, Primitive } from "./domain-primitive";

class TestValueObject extends DomainPrimitive<Primitive, "TestValueObject"> {
  protected validate(value: Primitive): Primitive {
    return value;
  }
}

type Props = {
  valueA: TestValueObject;
  valueB: TestValueObject;
};

class CompositeTestValueObject extends DomainPrimitive<Props, "CompositeTestValueObject"> {
  protected validate(value: Props): Props {
    return value;
  }
}

describe("DomainPrimitive", () => {
  describe("equals", () => {
    it.each([
      [1, 1, true],
      [1, 2, false],
      ["abc", "abc", true],
      ["abc", "xyz", false],
      [new Date(0), new Date(0), true],
      [new Date(0), new Date(1), false],
      [
        new TestValueObject([new TestValueObject(0), new TestValueObject(1)]),
        new TestValueObject([new TestValueObject(0), new TestValueObject(1)]),
        true,
      ],
      [
        new TestValueObject([new TestValueObject(0), new TestValueObject(1)]),
        new TestValueObject([new TestValueObject(1), new TestValueObject(0)]),
        false,
      ],
      [new TestValueObject(0), new TestValueObject(0), true],
      [new TestValueObject(0), new TestValueObject(1), false],
      [new TestValueObject("abc"), new TestValueObject("abc"), true],
      [new TestValueObject("abc"), new TestValueObject("xyz"), false],
      [new TestValueObject(new Date(0)), new TestValueObject(new Date(0)), true],
      [new TestValueObject(new Date(0)), new TestValueObject(new Date(1)), false],
      [
        new CompositeTestValueObject({
          valueA: new TestValueObject(0),
          valueB: new TestValueObject(0),
        }),
        new CompositeTestValueObject({
          valueA: new TestValueObject(0),
          valueB: new TestValueObject(0),
        }),
        true,
      ],
      [
        new CompositeTestValueObject({
          valueA: new TestValueObject(0),
          valueB: new TestValueObject(0),
        }),
        new CompositeTestValueObject({
          valueA: new TestValueObject(0),
          valueB: new TestValueObject(1),
        }),
        false,
      ],
      [
        new CompositeTestValueObject({
          valueA: new TestValueObject(0),
          valueB: new TestValueObject(0),
        }),
        new CompositeTestValueObject({
          valueA: new TestValueObject(1),
          valueB: new TestValueObject(0),
        }),
        false,
      ],
      [
        new CompositeTestValueObject({
          valueA: new TestValueObject(0),
          valueB: new TestValueObject(0),
        }),
        new CompositeTestValueObject({
          valueA: new TestValueObject(1),
          valueB: new TestValueObject(1),
        }),
        false,
      ],
    ])("%s equals %s => %s", (a, b, expected) => {
      const valueA = new TestValueObject(a);
      const valueB = new TestValueObject(b);

      expect(valueA.equals(valueB)).toStrictEqual(expected);
    });
  });

  describe("valueOf", () => {
    const valueA = new TestValueObject("valueA");
    const valueB = new TestValueObject("valueB");
    const testValue = new CompositeTestValueObject({
      valueA,
      valueB,
    });

    it("キーを指定せずに値を取得する", () => {
      expect(testValue.valueOf()).toStrictEqual({ valueA, valueB });
    });

    it.each<[keyof Props, Props[keyof Props]]>([
      ["valueA", valueA],
      ["valueB", valueB],
    ])("キーを指定して値を取得する", (a, expected) => {
      expect(testValue.valueOf(a)).toStrictEqual(expected);
    });
  });
});
