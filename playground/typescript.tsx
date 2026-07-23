// @ts-nocheck
// Single-line comment
/* Multi-line
   block comment */
/**
 * JSDoc / TSDoc comment
 * @param options — configuration object
 * @template T — the inferred element type
 * @returns A promise resolving to the processed result
 * @deprecated Use `newApi()` instead
 */

// keyof / typeof
type ObjKeys = keyof typeof obj;
type ValueOf<T> = T[keyof T];

// ── 4. Interfaces ───────────────────────────────────────────────
interface Base {
  id: string;
  readonly createdAt: Date;
  updatedAt?: Date;
}

interface Named {
  name: string;
}

interface User extends Base, Named {
  email: string;
  age: number;
  tags: string[];
  metadata?: Record<string, unknown>;
  greet(): string;
}

// Interface with call/construct signatures
interface Callable {
  (x: number): string;
  new (x: number): SomeClass;
}

// Interface with index signature
interface StringDict {
  [key: string]: unknown;
  length: number;
}

// ── 5. Type Aliases ─────────────────────────────────────────────
type ID = string | number;
type Status = "active" | "inactive" | "pending";
type Callback<T> = (err: Error | null, result?: T) => void;
type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };
type Brand<T, B> = T & { __brand: B };

// Template literal types
type EventName = `on${Capitalize<string>}`;
type HexDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a" | "b" | "c" | "d" | "e" | "f";
type Color = `#${string}${HexDigit}${HexDigit}${HexDigit}`;

// ── 6. Enums ────────────────────────────────────────────────────
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

enum HttpStatus {
  OK = 200,
  NotFound = 404,
  InternalError = 500,
}

enum StringEnum {
  None = "NONE",
  Read = "READ",
  Write = "WRITE",
}

const enum ConstEnum {
  A = 1,
  B = A * 2,
}

// ── 7. Generics ─────────────────────────────────────────────────
function identity<T>(arg: T): T {
  return arg;
}

function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

const genericArrow = <T,>(x: T): T => x;

class Box<T> {
  #value: T;
  constructor(value: T) {
    this.#value = value;
  }
  get(): T {
    return this.#value;
  }
  set(value: T): void {
    this.#value = value;
  }
}

interface Repository<T extends { id: string }> {
  getById(id: string): T | undefined;
  save(entity: T): void;
}

// Generic constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Conditional types
type IsString<T> = T extends string ? "yes" : "no";
type ExtractResult = IsString<"hello">; // 'yes'

type Flatten<T> = T extends Array<infer U> ? U : T;
type Flattened = Flatten<string[]>; // string

// Mapped types
type Readonly2<T> = { readonly [P in keyof T]: T[P] };
type Optional<T> = { [P in keyof T]?: T[P] };
type Nullable<T> = { [P in keyof T]: T[P] | null };

// Mapped type with remapping (TS 4.1+)
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

// ── 8. Functions ────────────────────────────────────────────────
function add(a: number, b: number): number {
  return a + b;
}

const multiply: (a: number, b: number) => number = (x, y) => x * y;

function overloaded(x: string): number;
function overloaded(x: number): string;
function overloaded(x: string | number): string | number {
  if (typeof x === "string") return x.length;
  return x.toString();
}

async function asyncGeneric<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return res.json() as T;
}

function* gen(): Generator<number, void, unknown> {
  yield 1;
  yield 2;
}

// Rest parameters
function sumAll(...values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

// this parameter
function onClick(this: HTMLElement, event: MouseEvent): void {
  console.log(this.dataset);
}

// ── 9. Classes ──────────────────────────────────────────────────
abstract class Shape {
  abstract area(): number;

  describe(): string {
    return `Area: ${this.area()}`;
  }
}

class Circle extends Shape {
  readonly name: string = "Circle";
  #radius: number;

  constructor(radius: number) {
    super();
    this.#radius = radius;
  }

  // Parameter property shorthand
  constructor(
    private id: string,
    public name: string,
    protected age: number,
    readonly createdAt: Date = new Date(),
  ) {}

  area(): number {
    return Math.PI * this.#radius ** 2;
  }

  override describe(): string {
    return `Circle with radius ${this.#radius}`;
  }
}

// Generic class
class Stack<T> {
  #items: T[] = [];

  push(item: T): void {
    this.#items.push(item);
  }

  pop(): T | undefined {
    return this.#items.pop();
  }

  get size(): number {
    return this.#items.length;
  }
}

// ── 10. Decorators ───────────────────────────────────────────────
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${key} with`, args);
    return original.apply(this, args);
  };
}

function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class DecoratedClass {
  @log
  doSomething(arg: string): void {
    console.log(arg);
  }
}

// ── 11. Control Flow with Type Narrowing ────────────────────────
function narrow(value: string | number | null): string {
  if (value === null) return "null";
  if (typeof value === "string") return value.toUpperCase();
  return value.toFixed(2);
}

// Discriminated union
type Result<T> = { kind: "ok"; value: T } | { kind: "error"; message: string };

function handle<T>(result: Result<T>): string {
  switch (result.kind) {
    case "ok":
      return `Success: ${result.value}`;
    case "error":
      return `Error: ${result.message}`;
  }
}

// Type guards
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// Assertion function
function assertDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value == null) throw new Error("Unexpected null/undefined");
}

// ── 12. Modules & Namespaces ────────────────────────────────────
import defaultExport from "./module";
import { named, renamed as alias } from "./module";
import * as Namespace from "./module";
import type { TypeOnly } from "./module";
import { type Existing, other } from "./module";
export const exported = 42;
export default class ModuleClass {}
export { namedExport };
export type { ExportedType };
export * from "./re-export";
export * as subNs from "./submodule";

namespace Validation {
  export interface Validator {
    isValid(s: string): boolean;
  }

  export class EmailValidator implements Validator {
    isValid(s: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    }
  }
}

// ── 13. JSX / TSX ────────────────────────────────────────────────
import React, { useState, useEffect, createContext, type ReactNode } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggle: () => void;
}

const ThemeCtx = createContext<ThemeContextType>({
  theme: "light",
  toggle: () => {},
});

interface AppProps {
  title: string;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function App({ title, children, className, style }: AppProps) {
  // ── 1. Primitive Types & Declarations ───────────────────────────
  const num: number = 42;
  const str: string = "hello";
  const bool: boolean = true;
  const undef: undefined = undefined;
  const nil: null = null;
  const sym: symbol = Symbol("desc");
  const big: bigint = 9007199254740991n;
  const anyValue: any = "anything goes";
  const unknownVal: unknown = JSON.parse("{}");
  const neverVal: never = (() => {
    throw new Error();
  })();
  const voidVal: void = undefined;

  // ── 2. Literals ─────────────────────────────────────────────────
  const hex = 0xff;
  const binary = 0b1010;
  const octal = 0o77;
  const float = 3.14;
  const scientific = 6.022e23;
  const inf = Infinity;
  const nan = NaN;

  const single = "single";
  const double = "double";
  const template = `hello ${name}, count: ${num}`;
  const tagged = String.raw`C:\path\to\file`;
  const url = "https://example.com/path?q=search#hash";
  const re: RegExp = /[a-z]+/gi;

  const yes = true;
  const no = false;

  // ── 3. Type Annotations ─────────────────────────────────────────
  let inferred = "string";
  let annotated: string = "explicit";
  let union: string | number = "either";
  let intersection: { a: number } & { b: string } = { a: 1, b: "x" };
  let literal: "red" | "green" | "blue" = "red";
  let tuple: [string, number, boolean] = ["a", 1, true];

  // Tuples with labels & rest
  let labeled: [x: number, y: number, ...rest: string[]] = [1, 2, "a", "b"];

  // Readonly
  const readonlyArr: readonly number[] = [1, 2, 3];
  const readonlyTuple: readonly [number, string] = [1, "a"];

  // Type assertions
  const asserted1 = value as string;
  const nonNull = value!;
  const constAssertion = { x: 1, y: "hello" } as const;

  const config = { width: 100, height: 200 } satisfies Record<string, number>;

  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  const increment = (): void => setCount((c) => c + 1);

  return (
    <ThemeCtx.Provider value={{ theme: "dark", toggle: () => {} }}>
      <div className={`app ${className ?? ""}`} style={style}>
        <header title={<Title></Title>}>
          <h1>{title}</h1>
          {children}
        </header>
        <main title={<Title />}>
          <p>
            Count: <strong>{count}</strong>
          </p>
          <button onClick={increment} type="button">
            +1
          </button>
          {count > 10 && <span className="warning">High count!</span>}
        </main>
      </div>
    </ThemeCtx.Provider>
  );
}

const Memoized = React.memo(function Memoized(props: { value: number }) {
  return <div>{props.value}</div>;
});

// Generic React component
function List<T>({ items, render }: { items: T[]; render: (item: T) => ReactNode }) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{render(item)}</li>
      ))}
    </ul>
  );
}

// ── 14. Utility Types ────────────────────────────────────────────
type P = Partial<User>;
type R = Required<User>;
type Ro = Readonly<User>;
type Pi = Pick<User, "id" | "name">;
type Om = Omit<User, "metadata">;
type Ex = Extract<string | number | boolean, string | number>;
type NoEx = Exclude<string | number | boolean, boolean>;
type NonN = NonNullable<string | null | undefined>;
type Ret = ReturnType<typeof add>;
type Inst = InstanceType<typeof Box>;
type Param = Parameters<typeof add>;
type CtorParam = ConstructorParameters<typeof Box>;
type Awaited = Awaited<Promise<Promise<string>>>;

// ── 15. Advanced Patterns ────────────────────────────────────────
// Branded types
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

function getUser(id: UserId): User {
  return {} as User;
}

// This parameter type for fluent API
class Fluent {
  constructor(private value: number) {}
  add(n: number): this {
    this.value += n;
    return this;
  }
  multiply(n: number): this {
    this.value *= n;
    return this;
  }
}

// Declaration merging
interface AugmentedUser extends User {
  permissions: string[];
}

// satisfies with narrowing
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
} satisfies Record<string, string | number[]>;

// ── 16. Async / Promise Types ───────────────────────────────────
const p1: Promise<string> = Promise.resolve("done");
const p2: Promise<[number, number]> = Promise.all([Promise.resolve(1), Promise.resolve(2)]);

async function* asyncGenerator(): AsyncGenerator<number> {
  yield 1;
  await delay(100);
  yield 2;
}

for await (const value of asyncGenerator()) {
  console.log(value);
}
