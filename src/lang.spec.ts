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
