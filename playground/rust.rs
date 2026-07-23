// Single-line comment
/* Multi-line
   block comment */
/// Doc comment for the crate-level documentation.
//!
//! This is a comprehensive example file demonstrating all Rust syntax
//! features for the Kanagawa Zed theme preview.
//!
//! # Examples
//!
//! ```
//! let result = add(2, 3);
//! assert_eq!(result, 5);
//! ```
//!
//! <https://doc.rust-lang.org/stable/reference/>
//! `self` `Self` `super` `crate`

// Attribute macros
#![crate_type = "lib"]
#![deny(missing_docs)]
#![allow(unused_variables)]
#![cfg_attr(not(test), no_std)]

// ── 1. Variables & Mutability ────────────────────────────────────
let x: i32 = 5;
let mut y: i32 = 10;
y += 1;
const MAX_POINTS: u32 = 100_000;
static APP_NAME: &str = "Kanagawa";
static mut COUNTER: u64 = 0;
let shadowed = "original";
let shadowed = shadowed.len();

// ── 2. Scalar Types ─────────────────────────────────────────────
let integer: i8 = -128;
let unsigned: u64 = 184_467_440_737_095_516_15;
let float: f64 = 3.141_592_653_589_793;
let float32: f32 = 2.71828;
let boolean: bool = true;
let falsy: bool = false;
let character: char = 'Z';
let emoji: char = '🎨';

// ── 3. Compound Types ───────────────────────────────────────────
let tuple: (i32, f64, u8) = (500, 6.4, 1);
let (a, b, c) = tuple;
let single = (42,); // unit-like tuple
let unit: () = ();

let array: [i32; 5] = [1, 2, 3, 4, 5];
let repeated = [0; 10];
let first = array[0];
let slice: &[i32] = &array[1..3];

// ── 4. Strings ──────────────────────────────────────────────────
let str_lit: &str = "hello, world";
let raw_str: &str = r"C:\path\to\file";
let raw_hash: &str = r##"no "# escaping needed"##;
let byte_str: &[u8; 5] = b"hello";
let byte_lit: b'a' = b'a';
let owned: String = String::from("hello");
let mut mutable_string: String = String::new();
mutable_string.push_str("world");

// ── 5. Functions ────────────────────────────────────────────────
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn diverging() -> ! {
    panic!("this function never returns");
}

fn with_default_param(x: i32, y: i32) -> i32 {
    x + y
}

fn explicit_return(x: i32) -> i32 {
    if x > 0 {
        return x;
    }
    0
}

// ── 6. Closures ─────────────────────────────────────────────────
let closure = |x: i32| -> i32 { x + 1 };
let infer_closure = |x| x * 2;
let multi_arg = |a, b, c| a + b + c;
let capturing = {
    let captured = 42;
    move |x| x + captured
};

// ── 7. Control Flow ─────────────────────────────────────────────
// if / else if / else
if x > 0 {
    println!("positive");
} else if x < 0 {
    println!("negative");
} else {
    println!("zero");
}

// if-let
if let Some(value) = optional {
    println!("got {value}");
}

// while
let mut counter = 0;
while counter < 10 {
    counter += 1;
}

// while-let
let mut stack = Vec::new();
while let Some(top) = stack.pop() {
    println!("{top}");
}

// for
for i in 0..10 {
    println!("{i}");
}

for i in (0..=10).step_by(2) {
    println!("{i}");
}

for (index, value) in iterable.iter().enumerate() {
    println!("{index}: {value}");
}

// loop
let result = loop {
    counter += 1;
    if counter == 10 {
        break counter * 2;
    }
};

// match
match value {
    1 => println!("one"),
    2 | 3 => println!("two or three"),
    4..=10 => println!("four through ten"),
    n if n % 2 == 0 => println!("even: {n}"),
    _ => println!("catch-all"),
}

// match with destructuring
let pair = (0, -1);
match pair {
    (0, y) => println!("x=0, y={y}"),
    (x, 0) => println!("x={x}, y=0"),
    (x, y) => println!("x={x}, y={y}"),
}

// match with @ bindings
match value {
    x @ 1..=5 => println!("small: {x}"),
    x @ 6..=10 => println!("medium: {x}"),
    _ => println!("large"),
}

// ── 8. Pattern Matching ─────────────────────────────────────────
struct Point { x: i32, y: i32 }

let p = Point { x: 0, y: 7 };
let Point { x: a, y: b } = p;
let Point { x, y } = p;
let Point { x, .. } = p;

let numbers = (1, 2, 3, 4, 5);
let (first, .., last) = numbers;

// ref / mut patterns
let mut value = 42;
match value {
    ref r => println!("ref: {r}"),
}
match value {
    mut m => *m += 1,
}

// ── 9. Ownership & Borrowing ────────────────────────────────────
fn take_ownership(s: String) {
    println!("{s}");
} // s dropped

fn borrow(s: &String) -> &str {
    &s[..]
}

fn borrow_mut(s: &mut String) {
    s.push_str(" appended");
}

let s = String::from("hello");
let r1 = &s;
let r2 = &s; // multiple immutable borrows OK
let r3 = &mut s; // NOPE — already borrowed immutably

// ── 10. Lifetimes ───────────────────────────────────────────────
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

struct Excerpt<'a> {
    part: &'a str,
}

impl<'a> Excerpt<'a> {
    fn announce_and_return(&self, announcement: &str) -> &str {
        println!("Attention please: {announcement}");
        self.part
    }
}

// Static lifetime
const HELLO: &'static str = "hello";

// ── 11. Structs ─────────────────────────────────────────────────
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

// Tuple struct
struct Color(i32, i32, i32);
struct Point3D(f64, f64, f64);

// Unit struct
struct AlwaysEqual;

let user1 = User {
    active: true,
    username: String::from("kanagawa"),
    email: String::from("kanagawa@example.com"),
    sign_in_count: 1,
};

let user2 = User {
    email: String::from("another@example.com"),
    ..user1
};

let black = Color(0, 0, 0);
let subject = AlwaysEqual;

// ── 12. Enums ───────────────────────────────────────────────────
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

enum Option<T> {
    None,
    Some(T),
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}

let msg = Message::Move { x: 10, y: 20 };
match msg {
    Message::Quit => println!("quit"),
    Message::Move { x, y } => println!("move ({x}, {y})"),
    Message::Write(text) => println!("{text}"),
    Message::ChangeColor(r, g, b) => println!("rgb({r}, {g}, {b})"),
}

// ── 13. Error Handling ──────────────────────────────────────────
fn read_file(path: &str) -> Result<String, std::io::Error> {
    std::fs::read_to_string(path)
}

fn unwrap_example() -> String {
    read_file("Cargo.toml").unwrap()
}

fn expect_example() -> String {
    read_file("Cargo.toml").expect("Failed to read Cargo.toml")
}

fn propagate_error() -> Result<(), std::io::Error> {
    let content = read_file("Cargo.toml")?;
    println!("{content}");
    Ok(())
}

fn combinators() {
    let result: Result<i32, &str> = Ok(42);
    let mapped = result.map(|v| v * 2);
    let and_then = result.and_then(|v| Ok(v + 1));
    let recovered = result.or_else(|_| Ok(0));
    let unwrapped = result.unwrap_or(0);
}

// ── 14. Traits ──────────────────────────────────────────────────
trait Summary {
    fn summarize(&self) -> String;

    fn default_summary(&self) -> String {
        String::from("(Read more...)")
    }
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{}, by {}", self.headline, self.author)
    }
}

// Trait bounds
fn notify<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}

fn notify2(item: &impl Summary) {
    println!("{}", item.summarize());
}

fn multi_bound<T: Summary + Display>(item: &T) {}

fn where_clause<T, U>(t: &T, u: &U)
where
    T: Summary + Clone,
    U: Summary + Debug,
{
}

// Trait objects
let trait_obj: Box<dyn Summary> = Box::new(article);
let dynamic: &dyn Summary = &article;

// ── 15. Generics ────────────────────────────────────────────────
struct Pair<T> {
    x: T,
    y: T,
}

impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self { x, y }
    }
}

impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("x: {}", self.x);
        } else {
            println!("y: {}", self.y);
        }
    }
}

// Generic function with turbofish
let result = std::mem::replace::<i32>(&mut val, 42);

// ── 16. impl Blocks ─────────────────────────────────────────────
impl User {
    fn new(email: String, username: String) -> Self {
        Self {
            active: true,
            username,
            email,
            sign_in_count: 1,
        }
    }

    fn is_active(&self) -> bool {
        self.active
    }
}

// ── 17. Associated Types ────────────────────────────────────────
trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        self.count += 1;
        if self.count < 6 {
            Some(self.count)
        } else {
            None
        }
    }
}

// ── 18. Collections & Iterators ─────────────────────────────────
let mut vec: Vec<i32> = vec![1, 2, 3];
vec.push(4);

let mut map: std::collections::HashMap<&str, i32> = std::collections::HashMap::new();
map.insert("key", 42);

let set: std::collections::HashSet<i32> = [1, 2, 3].into();
let deque: std::collections::VecDeque<i32> = std::collections::VecDeque::from(vec![1, 2, 3]);

let sum: i32 = vec.iter()
    .filter(|&x| x > 1)
    .map(|x| x * 2)
    .take(5)
    .skip(2)
    .fold(0, |acc, x| acc + x);

let any_gt = vec.iter().any(|&x| x > 10);
let all_gt = vec.iter().all(|&x| x > 0);
let found = vec.iter().find(|&&x| x == 3);
let position = vec.iter().position(|&x| x == 3);
let max = vec.iter().max();
let min = vec.iter().min();

// ── 19. Smart Pointers ─────────────────────────────────────────
// Box
let boxed: Box<i32> = Box::new(5);
let box_list: Box<List> = Box::new(Cons(1, Box::new(Cons(2, Box::new(Nil)))));

// Rc (reference counted)
use std::rc::Rc;
let rc: Rc<i32> = Rc::new(5);
let rc2 = Rc::clone(&rc);

// Arc (atomic reference counted)
use std::sync::Arc;
let arc: Arc<i32> = Arc::new(5);
let arc2 = Arc::clone(&arc);

// RefCell (interior mutability)
use std::cell::RefCell;
let refcell: RefCell<i32> = RefCell::new(5);
*refcell.borrow_mut() += 1;
let value = refcell.borrow();

// Cell (for Copy types)
use std::cell::Cell;
let cell: Cell<i32> = Cell::new(42);
cell.set(100);

// Cow (clone-on-write)
use std::borrow::Cow;
fn describe(input: Cow<'_, str>) -> String {
    if input.starts_with("hello") {
        input.into_owned()
    } else {
        input.into_owned()
    }
}

// ── 20. Macros ──────────────────────────────────────────────────
macro_rules! create_function {
    ($name:ident, $val:expr) => {
        fn $name() -> i32 {
            println!("called {} yields {}", stringify!($name), $val);
            $val
        }
    };
}

create_function!(foo, 42);

macro_rules! vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}

let v = vec![1, 2, 3];

// Built-in macros
println!("Hello, {}!", "world");
eprintln!("error: {}", message);
format!("formatted: {value}");
write!(io::stdout(), "Hello")?;
writeln!(io::stdout(), "Hello")?;
assert!(true);
assert_eq!(1, 1);
assert_ne!(1, 2);
debug_assert!(true);
unimplemented!();
todo!("implement this");
unreachable!();
panic!("unexpected state");
concat!("a", "b", "c");
stringify!(1 + 2);
include_str!("data.txt");
include_bytes!("data.bin");
include!("generated.rs");
file!();
line!();
column!();
cfg!(target_os = "windows");
env!("HOME");
option_env!("PATH");

// ── 21. Attributes ──────────────────────────────────────────────
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct Derived {
    field: i32,
}

#[cfg(target_os = "linux")]
fn platform_specific() {}

#[cfg(not(test))]
fn non_test_fn() {}

#[test]
fn test_add() {
    assert_eq!(add(2, 2), 4);
}

#[should_panic(expected = "overflow")]
fn test_panic() {
    let _ = [1, 2, 3][10];
}

#[ignore]
fn slow_test() {}

#[inline]
fn fast_function() {}

#[cold]
fn cold_path() {}

#[allow(dead_code)]
fn unused_fn() {}

#[repr(C)]
struct CCompatible {
    a: u8,
    b: i32,
}

#[repr(align(16))]
struct Aligned {
    data: [u8; 16],
}

// ── 22. Unsafe ──────────────────────────────────────────────────
unsafe fn dangerous() {}

unsafe {
    let raw_ptr: *const i32 = &42 as *const i32;
    let mut_raw: *mut i32 = &mut 42 as *mut i32;
    let deref = *raw_ptr;

    std::ptr::write(mut_raw, 100);
    std::ptr::read(raw_ptr);

    // FFI call in unsafe block
    extern "C" {
        fn abs(input: i32) -> i32;
    }
    abs(-3);
}

// ── 23. FFI ─────────────────────────────────────────────────────
extern "C" {
    fn printf(fmt: *const u8, ...) -> i32;
    fn malloc(size: usize) -> *mut u8;
}

extern "C" fn callback_from_c(data: i32) {
    println!("C called us with {data}");
}

#[no_mangle]
pub extern "C" fn rust_function() -> i32 {
    42
}

// ── 24. Concurrency ─────────────────────────────────────────────
use std::thread;

let handle = thread::spawn(move || {
    println!("Hello from a thread!");
});

handle.join().unwrap();

use std::sync::Mutex;
let counter_mutex = Arc::new(Mutex::new(0));
let mut handles = vec![];

for _ in 0..10 {
    let counter = Arc::clone(&counter_mutex);
    handles.push(thread::spawn(move || {
        let mut num = counter.lock().unwrap();
        *num += 1;
    }));
}

for handle in handles {
    handle.join().unwrap();
}

use std::sync::mpsc;
let (tx, rx) = mpsc::channel();
tx.send(42).unwrap();
rx.recv().unwrap();

// ── 25. Async / Await ───────────────────────────────────────────
use std::future::Future;
use std::pin::Pin;

async fn fetch_data(url: &str) -> Result<String, reqwest::Error> {
    let response = reqwest::get(url).await?;
    let body = response.text().await?;
    Ok(body)
}

fn async_block() -> impl Future<Output = i32> {
    async {
        println!("running async block");
        42
    }
}

async fn combinator() {
    let (a, b) = tokio::join!(
        fetch_data("https://example.com/a"),
        fetch_data("https://example.com/b"),
    );
}

// ── 26. Operator Overloading ────────────────────────────────────
use std::ops::Add;

impl Add for Point {
    type Output = Point;
    fn add(self, other: Point) -> Point {
        Point {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

// ── 27. Deref & Drop ────────────────────────────────────────────
impl std::ops::Deref for MyBox<T> {
    type Target = T;
    fn deref(&self) -> &T {
        &self.0
    }
}

impl std::ops::Drop for CustomDrop {
    fn drop(&mut self) {
        println!("Dropping CustomDrop!");
    }
}

// ── 28. Type Aliases ────────────────────────────────────────────
type Kilometers = i32;
type Thunk = Box<dyn Fn() + Send + 'static>;
type Result<T> = std::result::Result<T, std::io::Error>;

// ── 29. Unions ──────────────────────────────────────────────────
#[repr(C)]
union IntOrFloat {
    i: i32,
    f: f32,
}

let mut u = IntOrFloat { i: 42 };
unsafe {
    println!("{}", u.i);
    u.f = 3.14;
    println!("{}", u.f);
}

// ── 30. Range Patterns ──────────────────────────────────────────
let range = 1..=10;
let half_open = 1..10;
let range_from = 1..;
let range_to = ..=10;
let full_range = ..;

for i in 1..=5 {}
let slice = &arr[2..5];
let all = &arr[..];

// ── 31. let chains (Rust 1.64+) ────────────────────────────────
fn let_chain() {
    if let Some(x) = optional && x > 5 {
        println!("big optional: {x}");
    }
}

// ── 32. let-else (Rust 1.65+) ───────────────────────────────────
fn let_else() -> i32 {
    let Some(val) = optional else {
        return 0;
    };
    val
}
