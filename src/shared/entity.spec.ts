import { DomainPrimitive } from "./domain-primitive";
import { Entity } from "./entity";
import { Uuid } from "./uuid";

class TestId extends Uuid<"TestId"> {}

class TestNumber extends DomainPrimitive<number, "TestNumber"> {
  protected validate(value: number): number {
    return value;
  }
}

class TestString extends DomainPrimitive<string, "TestString"> {
  protected validate(value: string): string {
    return value;
  }
}

type Props = {
  id: TestId;
  num: TestNumber;
  str: TestString;
};

class TestEntity extends Entity<Props, "TestEntity"> {
  protected validate(value: Props): Props {
    return value;
  }
}

describe("DomainPrimitive", () => {
  describe("equals", () => {
    const id1 = new TestId();
    const id2 = new TestId();

    it.each([
      [
        new TestEntity({
          id: id1,
          num: new TestNumber(1),
          str: new TestString("abc"),
        }),
        new TestEntity({
          id: id1,
          num: new TestNumber(2),
          str: new TestString("xyz"),
        }),
        true,
      ],
      [
        new TestEntity({
          id: id1,
          num: new TestNumber(1),
          str: new TestString("abc"),
        }),
        new TestEntity({
          id: id2,
          num: new TestNumber(2),
          str: new TestString("xyz"),
        }),
        false,
      ],
      [
        new TestEntity({
          id: id1,
          num: new TestNumber(1),
          str: new TestString("abc"),
        }),
        new TestEntity({
          id: id2,
          num: new TestNumber(1),
          str: new TestString("abc"),
        }),
        false,
      ],
    ])("%s equals %s => %s", (a, b, expected) => {
      expect(a.equals(b)).toStrictEqual(expected);
    });

    describe("valueOf", () => {
      const id = new TestId();
      const num = new TestNumber(1);
      const str = new TestString("abc");

      const entity = new TestEntity({ id, num, str });

      it("キーを指定せずに値を取得する", () => {
        expect(entity.valueOf()).toStrictEqual({ id, num, str });
      });

      it.each<[keyof Props, Props[keyof Props]]>([
        ["id", id],
        ["num", num],
        ["str", str],
      ])("キーを指定して値を取得する", (a, expected) => {
        expect(entity.valueOf(a)).toStrictEqual(expected);
      });
    });
  });
});
