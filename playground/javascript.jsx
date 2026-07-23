// @ts-nocheck
// Single-line comment
/* Multi-line
   block comment */
/**
 * JSDoc comment — documentation
 * @param {string} name — parameter description
 * @returns {Promise<void>}
 */

// ── 1. Variables & Declarations ──────────────────────────────────
const PI = 3.14159;
let counter = 0;
var legacy = 'avoid';
const sym = Symbol('unique');
const big = 9007199254740991n;

// ── 2. Literals ─────────────────────────────────────────────────
// Numbers
const decimal = 42;
const hex = 0xff;
const binary = 0b1010;
const octal = 0o77;
const float = 3.14;
const scientific = 6.022e23;
const inf = Infinity;
const nan = NaN;

// Strings
const single = 'single quotes';
const double = "double quotes";
const template = `hello ${name}, count: ${counter + 1}`;
const tagged = String.raw`C:\path\to\file`;
const url = 'https://example.com/path?q=search#hash';

// Regex
const re1 = /[a-z]+/gi;
const re2 = new RegExp('^\\d{3}-\\d{4}$', 'i');

// Booleans & nullish
const yes = true;
const no = false;
const nothing = null;
const undef = undefined;

// ── 3. Arrays & Objects ──────────────────────────────────────────
const arr = [1, 2, 3, ...others];
const matrix = [[1, 0], [0, 1]];
const obj = {
  key: 'value',
  [computed]: true,
  shorthand,
  method() {},
  get full() { return `${this.first} ${this.last}`; },
  set full(v) { [this.first, this.last] = v.split(' '); },
};

// Destructuring
const { a, b: renamed, ...restProps } = source;
const [head, , third, ...tail] = list;
function options({ enabled = true, timeout = 1000 } = {}) {}

// ── 4. Functions ────────────────────────────────────────────────
function declaration(a, b) {
  return a + b;
}

const expression = function (x) { return x * x; };

const arrow = (x) => x * 2;
const asyncArrow = async (url) => {
  const res = await fetch(url);
  return res.json();
};

function* generator() {
  yield 1;
  yield* innerGenerator();
}

async function asyncFn() {
  try {
    const data = await promise;
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function callback(err, result) {
  if (err) throw err;
  return result;
}

// ── 5. Classes ──────────────────────────────────────────────────
class Animal {
  static count = 0;
  #privateField = 42;

  constructor(name) {
    this.name = name;
    Animal.count++;
  }

  speak() {
    return `${this.name} makes a noise.`;
  }

  static create(name) {
    return new Animal(name);
  }
}

class Dog extends Animal {
  #privateMethod() {
    return super.speak();
  }

  get breed() { return this.#breed; }
  set breed(v) { this.#breed = v; }

  static {
    // Static initialisation block
    this.family = 'Canidae';
  }
}

// ── 6. Control Flow ─────────────────────────────────────────────
// if / else if / else
if (x > 0) {
  console.log('positive');
} else if (x < 0) {
  console.log('negative');
} else {
  console.log('zero');
}

// switch / case / default
switch (status) {
  case 200:
    return 'OK';
  case 404:
    return 'Not Found';
  default:
    return 'Unknown';
}

// for
for (let i = 0; i < arr.length; i++) {
  arr[i] *= 2;
}

// for-of
for (const value of iterable) {
  console.log(value);
}

// for-in
for (const key in object) {
  if (Object.hasOwn(object, key)) {
    console.log(key, object[key]);
  }
}

// while
while (queue.length > 0) {
  process(queue.shift());
}

// do-while
do {
  input = readLine();
} while (input !== null);

// for-await-of
for await (const chunk of stream) {
  buffer += chunk;
}

// ── 7. Error Handling ──────────────────────────────────────────
try {
  riskyOperation();
} catch (e) {
  if (e instanceof TypeError) {
    handleTypeError(e);
  } else {
    throw e;
  }
} finally {
  cleanup();
}

// ── 8. Operators ────────────────────────────────────────────────
// Arithmetic
const sum = 1 + 2;
const diff = 5 - 3;
const prod = 4 * 6;
const quot = 10 / 3;
const rem = 10 % 3;
const pow = 2 ** 10;
let n = 5;
n++; n--;

// Comparison
const eq = a === b;
const neq = a !== b;
const lt = a < b;
const gt = a > b;
const lte = a <= b;
const gte = a >= b;

// Logical
const and = a && b;
const or = a || b;
const not = !a;
const nullish = a ?? b;
const optional = obj?.prop?.nested;

// Assignment
let x = 1;
x += 2; x -= 1; x *= 3; x /= 2; x %= 2;
x **= 2; x &&= true; x ||= false; x ??= 'default';

// Bitwise
const band = 5 & 3;
const bor = 5 | 3;
const bxor = 5 ^ 3;
const bnot = ~5;
const lshift = 5 << 1;
const rshift = 5 >> 1;
const urshift = 5 >>> 1;

// Spread / Rest
const combined = { ...obj1, ...obj2 };
function variadic(...args) {}

// Ternary
const result = condition ? 'yes' : 'no';

// in / instanceof
const hasKey = 'key' in obj;
const isInstance = obj instanceof Array;

// delete / void
delete obj.prop;
const voidResult = void expression;

// ── 9. Promises & Async ────────────────────────────────────────
Promise.resolve(1)
  .then((val) => val + 1)
  .then((val) => Promise.reject(new Error('fail')))
  .catch((err) => {
    console.warn(err);
    return fallback;
  })
  .finally(() => hideSpinner());

const settled = await Promise.allSettled([p1, p2]);
const raced = await Promise.race([p1, p2]);
const anyOf = await Promise.any([p1, p2]);

// ── 10. Modules ─────────────────────────────────────────────────
import defaultExport from './module.js';
import { named, renamed as alias } from './module.js';
import * as namespace from './module.js';
import { default as Default, named } from './module.js';
import './side-effect.js';
export default class ModuleClass {}
export { namedExport };
export { orig as exported };
export * from './re-export.js';
export * as submodule from './submodule.js';
export const exportedConst = 42;
export function exportedFn() {}
const dynamic = import('./lazy.js');

// ── 11. Symbols & Iteration ──────────────────────────────────────
const sym1 = Symbol('desc');
const sym2 = Symbol.for('global');
const iterator = iterable[Symbol.iterator]();
const asyncIterator = asyncIterable[Symbol.asyncIterator]();

// ── 12. Label Statements ─────────────────────────────────────────
outer: for (const item of list) {
  for (const sub of item.children) {
    if (sub === target) break outer;
    continue outer;
  }
}

// ── 13. with / debugger
debugger;
// (with intentionally omitted — deprecated)

// ── 14. JSX ──────────────────────────────────────────────────────
import React, { useState, useEffect, createContext } from 'react';

const ThemeContext = createContext('light');

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <ThemeContext.Provider value="dark">
      <div className="app-container" data-testid="app">
        <header>
          <h1>Kanagawa Theme Demo</h1>
          <p className="subtitle">
            A port of the Kanagawa NeoVim color scheme
          </p>
        </header>

        <main>
          <CounterDisplay count={count} />
          <button onClick={() => setCount((c) => c + 1)}>
            Increment
          </button>
          {count > 10 && <WarningBanner />}
          {count === 0 ? (
            <EmptyState />
          ) : (
            <Stats count={count} />
          )}
        </main>

        <footer>
          <span>&copy; {new Date().getFullYear()}</span>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}

function CounterDisplay({ count, ...rest }) {
  return (
    <>
      <span {...rest} aria-label="Counter value">
        {count}
      </span>
    </>
  );
}

function WarningBanner() {
  return <div className="warning" role="alert">Threshold exceeded</div>;
}

function EmptyState() {
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <p>No data yet — start clicking!</p>
    </div>
  );
}

function Stats({ count }) {
  const isEven = count % 2 === 0;
  return (
    <dl>
      <dt>Value</dt>
      <dd>{count}</dd>
      <dt>Parity</dt>
      <dd>{isEven ? 'Even' : 'Odd'}</dd>
      <dt>Type</dt>
      <dd>{typeof count}</dd>
    </dl>
  );
}

export default App;
