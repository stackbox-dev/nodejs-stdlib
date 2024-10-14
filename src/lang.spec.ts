import * as Lang from "./lang";

test("number field object array", () => {
  const arr = [
    { a: 1, b: 2 },
    { a: 3, b: 3 },
    { a: 3, b: 2 },
    { a: 1, b: 3 },
  ];

  expect(
    Lang.minBy(
      arr,
      (x) => x.a,
      (x) => x.b,
    ),
  ).toStrictEqual({ a: 1, b: 2 });

  expect(
    Lang.maxBy(
      arr,
      (x) => x.a,
      (x) => x.b,
    ),
  ).toStrictEqual({ a: 3, b: 3 });

  expect(
    [...arr].sort(
      Lang.SortBy(
        (x) => x.a,
        (x) => x.b,
      ),
    ),
  ).toStrictEqual([
    { a: 1, b: 2 },
    { a: 1, b: 3 },
    { a: 3, b: 2 },
    { a: 3, b: 3 },
  ]);
});

test("groupBy function", () => {
  const arr = [
    { id: 1, category: "A" },
    { id: 2, category: "B" },
    { id: 3, category: "A" },
    { id: 4, category: "C" },
    { id: 5, category: "B" },
  ];

  const grouped = Object.fromEntries([
    ...Lang.groupBy(
      arr,
      (item) => item.category,
      (g) => g,
    ),
  ]);

  expect(grouped).toEqual({
    A: [
      { id: 1, category: "A" },
      { id: 3, category: "A" },
    ],
    B: [
      { id: 2, category: "B" },
      { id: 5, category: "B" },
    ],
    C: [{ id: 4, category: "C" }],
  });
});

test("uniqueBy function", () => {
  const arr = [1, 2, 2, 3, 4, 4, 5];
  expect(Lang.uniqueBy(arr, (x) => x)).toEqual([1, 2, 3, 4, 5]);

  const objArr = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 1, name: "Alice" },
    { id: 3, name: "Charlie" },
  ];
  expect(Lang.uniqueBy(objArr, (item) => item.id)).toEqual([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ]);
});

test("sortBy function", () => {
  const arr = [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 },
    { name: "Charlie", age: 35 },
    { name: "David", age: 25 },
  ];

  const sorted = [...arr].sort(
    Lang.SortBy(
      (x) => x.age,
      (x) => x.name,
    ),
  );

  expect(sorted).toEqual([
    { name: "Bob", age: 25 },
    { name: "David", age: 25 },
    { name: "Alice", age: 30 },
    { name: "Charlie", age: 35 },
  ]);
});

test("minBy and maxBy functions", () => {
  const arr = [
    { name: "Alice", score: 85 },
    { name: "Bob", score: 92 },
    { name: "Charlie", score: 78 },
    { name: "David", score: 95 },
  ];

  expect(Lang.minBy(arr, (x) => x.score)).toEqual({
    name: "Charlie",
    score: 78,
  });
  expect(Lang.maxBy(arr, (x) => x.score)).toEqual({ name: "David", score: 95 });
});

test("uniqueBy function with edge cases", () => {
  // Empty array
  expect(Lang.uniqueBy([], (x) => x)).toEqual([]);

  // Array with all unique elements
  const uniqueArr = [1, 2, 3, 4, 5];
  expect(Lang.uniqueBy(uniqueArr, (x) => x)).toEqual(uniqueArr);

  // Array with all identical elements
  const identicalArr = [1, 1, 1, 1, 1];
  expect(Lang.uniqueBy(identicalArr, (x) => x)).toEqual([1]);

  // Array with null and undefined values
  const mixedArr = [null, undefined, 1, null, 2, undefined, 3];
  expect(Lang.uniqueBy(mixedArr, (x) => x)).toEqual([null, undefined, 1, 2, 3]);

  // Object array with complex key function
  const objArr = [
    { id: 1, value: "a" },
    { id: 2, value: "b" },
    { id: 1, value: "c" },
    { id: 3, value: "a" },
  ];
  expect(Lang.uniqueBy(objArr, (item) => `${item.id}-${item.value}`)).toEqual([
    { id: 1, value: "a" },
    { id: 2, value: "b" },
    { id: 1, value: "c" },
    { id: 3, value: "a" },
  ]);
});

test("sortBy function with edge cases", () => {
  // Empty array
  expect([].sort(Lang.SortBy((x) => x))).toEqual([]);

  // Array with all identical elements
  const identicalArr = [1, 1, 1, 1, 1];
  expect(identicalArr.sort(Lang.SortBy((x) => x))).toEqual(identicalArr);

  // Sorting by multiple criteria with some identical values
  const complexArr = [
    { name: "Alice", age: 30, score: 85 },
    { name: "Bob", age: 25, score: 92 },
    { name: "Charlie", age: 30, score: 78 },
    { name: "David", age: 25, score: 92 },
  ];
  expect(
    complexArr.sort(
      Lang.SortBy(
        (x) => x.age,
        (x) => x.score,
        (x) => x.name,
      ),
    ),
  ).toEqual([
    { name: "Bob", age: 25, score: 92 },
    { name: "David", age: 25, score: 92 },
    { name: "Charlie", age: 30, score: 78 },
    { name: "Alice", age: 30, score: 85 },
  ]);
});

test("minBy and maxBy functions with edge cases", () => {
  // Empty array
  expect(Lang.minBy([], (x) => x)).toBeNull();
  expect(Lang.maxBy([], (x) => x)).toBeNull();

  // Array with one element
  const singleElementArr = [{ value: 42 }];
  expect(Lang.minBy(singleElementArr, (x) => x.value)).toEqual({ value: 42 });
  expect(Lang.maxBy(singleElementArr, (x) => x.value)).toEqual({ value: 42 });

  // Array with all identical elements
  const identicalArr = [
    { value: 10 },
    { value: 10 },
    { value: 10 },
    { value: 10 },
  ];
  expect(Lang.minBy(identicalArr, (x) => x.value)).toEqual({ value: 10 });
  expect(Lang.maxBy(identicalArr, (x) => x.value)).toEqual({ value: 10 });

  // Array with NaN values
  const nanArr = [
    { value: NaN },
    { value: 1 },
    { value: 2 },
    { value: NaN },
    { value: 3 },
  ];
  expect(Lang.minBy(nanArr, (x) => x.value)).toEqual({ value: NaN });
  expect(Lang.maxBy(nanArr, (x) => x.value)).toEqual({ value: NaN });
});
