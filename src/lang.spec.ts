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

test("MultiLevelMap set and get", () => {
  const map = new Lang.MultiLevelMap<number>();
  map.set(["a", "b", "c"], 42);
  expect(map.get(["a", "b", "c"])).toBe(42);
  // Attempt to get a value with an incomplete key path should return undefined.
  expect(map.get(["a", "b"])).toBeUndefined();
});

test("MultiLevelMap getAll returns all values under a branch", () => {
  const map = new Lang.MultiLevelMap<string>();
  map.set(["user", "alice"], "AliceData");
  map.set(["user", "bob"], "BobData");
  map.set(["user", "charlie"], "CharlieData");
  map.set(["system", "config"], "SysConfig");

  const userValues = map.getAll(["user"]);
  expect(userValues.sort()).toEqual(
    ["AliceData", "BobData", "CharlieData"].sort(),
  );

  // For a key path that doesn't exist, getAll should return an empty array.
  expect(map.getAll(["nonexistent"])).toEqual([]);
});

test("MultiLevelMap has function", () => {
  const map = new Lang.MultiLevelMap<boolean>();
  expect(map.has(["settings", "theme"])).toBe(false);
  map.set(["settings", "theme"], true);
  expect(map.has(["settings", "theme"])).toBe(true);
});

test("MultiLevelMap delete function removes entry and cleans up empty nodes", () => {
  const map = new Lang.MultiLevelMap<number>();
  map.set(["a", "b", "c"], 100);
  map.set(["a", "b", "d"], 200);
  expect(map.get(["a", "b", "c"])).toBe(100);
  expect(map.get(["a", "b", "d"])).toBe(200);

  // Delete one entry
  expect(map.delete(["a", "b", "c"])).toBe(true);
  expect(map.get(["a", "b", "c"])).toBeUndefined();
  // The other entry should still exist
  expect(map.get(["a", "b", "d"])).toBe(200);

  // Attempt deleting a non-existent key path
  expect(map.delete(["a", "b", "c"])).toBe(false);
});

test("MultiLevelMap delete cleans up nodes without values", () => {
  const map = new Lang.MultiLevelMap<string>();
  map.set(["x", "y", "z"], "deepValue");
  // Delete the deep value.
  expect(map.delete(["x", "y", "z"])).toBe(true);
  // After deletion, getAll from the branch should be empty.
  expect(map.getAll(["x"])).toEqual([]);
});
test("MultiLevelMap overwrites value if set with same keys", () => {
  const map = new Lang.MultiLevelMap<number>();
  map.set(["a", "b"], 1);
  expect(map.get(["a", "b"])).toBe(1);
  // Overwrite the value at the same key path.
  map.set(["a", "b"], 2);
  expect(map.get(["a", "b"])).toBe(2);
});

test("MultiLevelMap getAll returns only values under branch", () => {
  const map = new Lang.MultiLevelMap<string>();
  map.set(["section", "item1"], "value1");
  map.set(["section", "subsection", "item2"], "value2");
  map.set(["section", "subsection", "item3"], "value3");
  map.set(["section", "other"], "value4");
  map.set(["otherSection", "item"], "value5");

  const results = map.getAll(["section"]);
  expect(results.sort()).toEqual(
    ["value1", "value2", "value3", "value4"].sort(),
  );
});

test("MultiLevelMap deleting branch cleans intermediate nodes", () => {
  const map = new Lang.MultiLevelMap<number>();
  map.set(["a", "b", "c", "d"], 10);
  map.set(["a", "b", "c", "e"], 20);
  expect(map.get(["a", "b", "c", "d"])).toBe(10);
  expect(map.get(["a", "b", "c", "e"])).toBe(20);

  // Delete one leaf value and ensure the other remains.
  expect(map.delete(["a", "b", "c", "d"])).toBe(true);
  let items = map.getAll(["a", "b", "c"]);
  expect(items).toContain(20);
  expect(items).not.toContain(10);

  // Delete the other leaf value; now the branch should be cleaned up.
  expect(map.delete(["a", "b", "c", "e"])).toBe(true);
  items = map.getAll(["a", "b", "c"]);
  expect(items).toEqual([]);
});

test("MultiLevelMap complex nested structure with interleaved keys", () => {
  const map = new Lang.MultiLevelMap<string>();
  map.set(["level1", "a", "x"], "ax");
  map.set(["level1", "a", "y"], "ay");
  map.set(["level1", "b"], "b-main");
  map.set(["level1", "a", "z", "nested"], "az-nested");

  // Direct retrievals.
  expect(map.get(["level1", "b"])).toBe("b-main");
  expect(map.get(["level1", "a", "x"])).toBe("ax");
  expect(map.get(["level1", "a", "z", "nested"])).toBe("az-nested");

  // getAll at the top level.
  const all = map.getAll(["level1"]);
  expect(all.sort()).toEqual(["ax", "ay", "b-main", "az-nested"].sort());

  // getAll for a specific branch.
  const aBranch = map.getAll(["level1", "a"]);
  expect(aBranch.sort()).toEqual(["ax", "ay", "az-nested"].sort());
});

test("MultiLevelMap non-existent keys behavior", () => {
  const map = new Lang.MultiLevelMap<number>();
  // Retrieval on a key path that doesn't exist returns undefined.
  expect(map.get(["non", "existent"])).toBeUndefined();
  // getAll should return an empty array when no branch exists.
  expect(map.getAll(["non"])).toEqual([]);
  // Deleting a non-existent key path returns false.
  expect(map.delete(["non", "existent"])).toBe(false);
});

test("MapWithKeyFn basic set and get", () => {
  type Item = { id: number; name: string };
  const keyFn = (item: Item) => item.id.toString();
  const map = new Lang.MapWithKeyFn<Item, string>([], keyFn);
  const item1: Item = { id: 1, name: "Alice" };
  const item2: Item = { id: 2, name: "Bob" };

  // Initially, get should return undefined and has should return false.
  expect(map.get(item1)).toBeUndefined();
  expect(map.has(item2)).toBe(false);

  // Set values.
  map.set(item1, "value1");
  map.set(item2, "value2");

  expect(map.get(item1)).toBe("value1");
  expect(map.get(item2)).toBe("value2");
  expect(map.has(item1)).toBe(true);
  expect(map.has(item2)).toBe(true);
});

test("MapWithKeyFn update value for existing key", () => {
  type Item = { id: number; name: string };
  const keyFn = (item: Item) => item.id.toString();
  const map = new Lang.MapWithKeyFn<Item, string>([], keyFn);
  const original: Item = { id: 1, name: "Alice" };

  map.set(original, "initial");
  expect(map.get(original)).toBe("initial");

  // Update using a different instance with the same key.
  const updated: Item = { id: 1, name: "Alice Updated" };
  map.set(updated, "updated");
  expect(map.get(original)).toBe("updated");
  expect(map.get(updated)).toBe("updated");
});

test("MapWithKeyFn iteration and clear", () => {
  type Item = { id: number; name: string };
  const keyFn = (item: Item) => item.id.toString();
  const items: Item[] = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];
  const map = new Lang.MapWithKeyFn<Item, string>([], keyFn);
  items.forEach((item, idx) => map.set(item, `value${idx + 1}`));

  // Test keys, values, and entries iteration.
  const keys = [...map.keys()];
  const values = [...map.values()];
  const entries = [...map.entries()];

  expect(keys).toHaveLength(3);
  expect(values).toHaveLength(3);
  expect(entries).toHaveLength(3);

  // Iterating over the map itself should yield the same entries.
  expect([...map]).toEqual(entries);

  // Test deletion of a key.
  expect(map.delete(items[0])).toBe(true);
  expect(map.get(items[0])).toBeUndefined();

  // Clear the map.
  map.clear();
  expect(map.size).toBe(0);
});

test("MapWithKeyFn duplicate keys handling", () => {
  type User = { id: number; username: string };
  const keyFn = (user: User) => user.id.toString();

  // Two separate objects with the same id should be treated as the same key.
  const user1: User = { id: 1, username: "alice" };
  const userDuplicate: User = { id: 1, username: "aliceClone" };
  const user2: User = { id: 2, username: "bob" };

  const map = new Lang.MapWithKeyFn<User, string>([], keyFn);
  map.set(user1, "first");
  // Setting a duplicate should overwrite the previous value.
  map.set(userDuplicate, "updated");

  expect(map.get(user1)).toBe("updated");
  expect(map.get(userDuplicate)).toBe("updated");
  expect(map.has(user1)).toBe(true);

  // Insert another distinct element.
  map.set(user2, "second");
  expect(map.get(user2)).toBe("second");

  // Confirm iteration reflects unique keys.
  const entries = [...map.entries()];
  expect(entries.length).toBe(2);
});
