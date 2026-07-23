#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Module docstring — Kanagawa playground."""

from __future__ import annotations
import asyncio, sys, re
from typing import (
    Optional, Union, Callable, TypeVar, Generic,
    Protocol, overload, Literal,
)
from dataclasses import dataclass, field
from enum import Enum, auto
from abc import ABC, abstractmethod

T = TypeVar("T")
U = TypeVar("U", bound="Comparable")

# ── 1. Variables & Literals ──────────────────────────────────────
NAME = "Kanagawa"
VERSION = 0.0.2
is_ready: bool = True
counter: int = 42
ratio: float = 3.14159
complex_num: complex = 1 + 2j
long_num: int = 9_007_199_254_740_991
hex_val: int = 0xFF
octal_val: int = 0o77
binary_val: int = 0b1010
nothing: None = None
any_val: object = None

# Strings
single = 'single quotes'
double = "double quotes"
triple_single = '''multi-line
string content'''
triple_double = """another
multi-line"""
raw_str = r"C:\path\to\file"
bytes_val = b"binary data"
f_str = f"Hello {NAME}, count: {counter + 1}"
f_str_raw = rf"Raw f-string: \n {NAME}"
f_str_nested = f"{f'{NAME}'} nested"

# ── 2. Operators ─────────────────────────────────────────────────
arithmetic = 1 + 2 - 3 * 4 / 5 // 6 % 7 ** 8
bitwise = a & b | c ^ d << 2 >> 3
comparison = a == b != c < d > e <= f >= g
logical = True and False or not maybe
assignment = 1; walrus := expression
identity = x is y; x is not y
membership = x in y; x not in y

# ── 3. Control Flow ──────────────────────────────────────────────
if x > 0:
    pass
elif x == 0 and y is not None:
    pass
else:
    pass

match status_code:
    case 200 | 204:
        print("OK")
    case 400:
        print("Bad request")
    case 500 as err:
        print(f"Error: {err}")
    case _:
        print("Unknown")

for i in range(10):
    if i == 3:
        continue
    if i == 7:
        break
else:
    print("Completed")

while counter > 0:
    counter -= 1
    if counter == 5:
        break
else:
    print("Done")

# ── 4. Comprehensions ────────────────────────────────────────────
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
nested = [(x, y) for x in range(3) for y in range(3)]
dict_comp = {x: x**2 for x in range(5) if x > 2}
set_comp = {x % 3 for x in range(10)}
gen_expr = (x**2 for x in range(10))

# ── 5. Functions ─────────────────────────────────────────────────
def simple(a, b, c=1, *args, kw=None, **kwargs) -> str:
    """Docstring."""
    return f"{a}, {b}"

def typed(name: str, count: int = 0) -> Optional[str]:
    return name if count > 0 else None

def variadic(*items: T, **opts: U) -> list[T]:
    return list(items)

@overload
def process(data: str) -> str: ...
@overload
def process(data: list[int]) -> int: ...
def process(data):
    return data

async def async_func(url: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return await resp.json()

async def async_gen() -> AsyncGenerator[int, None]:
    for i in range(10):
        yield i
        await asyncio.sleep(0.1)

def generator() -> Generator[int, None, str]:
    yield 1
    yield 2
    return "done"

def closure_factory(x: int) -> Callable[[int], int]:
    return lambda y: x + y

def decorator(fn: Callable) -> Callable:
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        print("before")
        result = fn(*args, **kwargs)
        print("after")
        return result
    return wrapper

# ── 6. Classes ───────────────────────────────────────────────────
class Simple:
    class_attr = "shared"

    def __init__(self, name: str) -> None:
        self.name = name
        self._private = "hidden"
        self.__mangled = "mangled"

    @property
    def computed(self) -> str:
        return self.name.upper()

    @computed.setter
    def computed(self, value: str) -> None:
        self.name = value

    @classmethod
    def create(cls, name: str) -> Simple:
        return cls(name)

    @staticmethod
    def validate(name: str) -> bool:
        return bool(name)

class Derived(Simple, ABC):
    @abstractmethod
    def abstract_method(self) -> None: ...

    @override
    def computed(self) -> str:
        return super().computed + "!"

@dataclass
class Point:
    x: float = 0.0
    y: float = 0.0
    label: Optional[str] = None
    _hidden: int = field(default=0, repr=False)

class Comparable(Protocol):
    def __lt__(self, other) -> bool: ...

class Repository(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def add(self, item: T) -> None:
        self._items.append(item)

    def get(self, index: int) -> T:
        return self._items[index]

class Meta(type):
    def __new__(cls, name, bases, namespace):
        return super().__new__(cls, name, bases, namespace)

class WithMeta(metaclass=Meta):
    pass

# ── 7. Enums ─────────────────────────────────────────────────────
class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
    HEX = "#FF9E3B"

class Status(Enum):
    PENDING = auto()
    RUNNING = auto()
    DONE = auto()

class StrEnum(str, Enum):
    FOO = "foo"
    BAR = "bar"

# ── 8. Error Handling ────────────────────────────────────────────
try:
    risky()
except ValueError as e:
    print(f"Value error: {e}")
except (TypeError, RuntimeError):
    print("Type or runtime error")
except Exception:
    print("Generic error")
else:
    print("No error")
finally:
    cleanup()

raise ValueError("invalid")
raise RuntimeError from cause

# ── 9. Context Managers ──────────────────────────────────────────
with open("file.txt", "r") as f:
    content = f.read()

async def use_async_cm():
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return resp

class Managed:
    def __enter__(self): return self
    def __exit__(self, *exc): pass

# ── 10. Type Hints ───────────────────────────────────────────────
Vector = list[float]
Matrix = list[list[float]]
Nullable = Optional[str]
Either = Union[int, str, None]
Callback = Callable[[int, int], int]
Registry = dict[str, list[tuple[int, str]]]

def generic[T](item: T) -> T: ...
def bounded[T: Comparable](a: T, b: T) -> bool: ...

type Vector2D = tuple[float, float]
type Handler = Callable[[str], None]

# ── 11. Decorators ───────────────────────────────────────────────
@property
@staticmethod
@classmethod
@abstractmethod
@dataclass
@functools.lru_cache(maxsize=128)
@functools.singledispatch
@contextlib.contextmanager
@asyncio.coroutine

# ── 12. Async / Await ────────────────────────────────────────────
async def main() -> None:
    task1 = asyncio.create_task(fetch("url1"))
    task2 = asyncio.create_task(fetch("url2"))
    results = await asyncio.gather(task1, task2)
    async for chunk in stream_data():
        process(chunk)
    async with semaphore:
        await worker()

# ── 13. Lambdas ──────────────────────────────────────────────────
add = lambda a, b: a + b
sort_key = lambda item: item[1]
zero_args = lambda: 42

# ── 14. Built-in Functions & Types ───────────────────────────────
print(len([1, 2, 3]))
print(type(42), isinstance(42, int))
print(list(range(10)), sum(range(5)))
print(str(42), int("42"), float("3.14"))
print(bool(1), None, True, False, Ellipsis)
print(hash("hello"), id(object()))
print(sorted([3, 1, 2]), reversed([1, 2, 3]))
print(zip([1, 2], ["a", "b"]), enumerate(["a", "b"]))
print(filter(None, [0, 1, None]), map(str, [1, 2]))
print(any([True, False]), all([True, True]))
print(open("file.txt"))  # check warning

# ── 15. Imports ──────────────────────────────────────────────────
import os, sys, json, math, re
from pathlib import Path
from collections.abc import Iterable, Sequence
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from some_module import SomeType

# ── 16. Magic Methods ────────────────────────────────────────────
class WithDunder:
    def __init__(self): pass
    def __repr__(self): return "WithDunder()"
    def __str__(self): return "WithDunder"
    def __eq__(self, other): return True
    def __hash__(self): return 42
    def __call__(self, *args): pass
    def __getitem__(self, key): pass
    def __setitem__(self, key, val): pass
    def __iter__(self): return iter([])
    def __next__(self): raise StopIteration
    def __len__(self): return 0
    def __bool__(self): return True
    def __enter__(self): return self
    def __exit__(self, *a): pass
    async def __aenter__(self): return self
    async def __aexit__(self, *a): pass
    def __await__(self): return self
    async def __aiter__(self): return self
    async def __anext__(self): raise StopAsyncIteration
