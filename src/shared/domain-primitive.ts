import { objectPropertySort } from "~/util/object-property-sort";

export type Primitive =
  | number
  | string
  | Date
  | DomainPrimitive<Primitive>
  | Array<DomainPrimitive<Primitive>>
  | Record<string, DomainPrimitive<Primitive>>;

type Key<T> = T extends Record<string, DomainPrimitive<Primitive>> ? keyof T : never;
type Value<T> = T extends Record<string, DomainPrimitive<Primitive>> ? never : T;

export abstract class DomainPrimitive<T extends Primitive, U extends string = string> {
  private domainPrimitiveBrand!: U;

  constructor(private readonly value: T) {
    this.value = this.validate(value);
  }

  protected abstract validate(value: T): T;

  valueOf(): Value<T>;
  valueOf<K extends Key<T>>(key: K): T[K];
  valueOf<K extends Key<T>>(key?: K) {
    if (key) {
      return this.value[key];
    } else {
      return this.value;
    }
  }

  equals(that: DomainPrimitive<T, U>): boolean {
    return JSON.stringify(objectPropertySort(this)) === JSON.stringify(objectPropertySort(that));
  }
}
