/* eslint-disable @typescript-eslint/no-explicit-any */

import { DomainPrimitive } from "./domain-primitive";
import { Uuid } from "./uuid";

type Key<T> = T extends Record<string, DomainPrimitive<any>> ? keyof T : never;

export abstract class Entity<
  T extends Record<"id", Uuid<string>> & Record<string, DomainPrimitive<any>>,
  U extends string
> {
  private entityBrand!: U;

  constructor(private readonly value: T) {
    this.value = this.validate(value);
  }

  protected abstract validate(value: T): T;

  valueOf(): T;
  valueOf<K extends Key<T>>(key: K): T[K];
  valueOf<K extends Key<T>>(key?: K) {
    if (key) {
      return this.value[key];
    } else {
      return this.value;
    }
  }

  equals(that: Entity<T, U>): boolean {
    return this.value.id.equals(that.value.id);
  }
}
