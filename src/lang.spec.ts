import * as Lang from "./lang";

describe("Lang.*", () => {
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
    expect(Lang.maxBy(arr, (x) => x.score)).toEqual({
      name: "David",
      score: 95,
    });
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
    expect(Lang.uniqueBy(mixedArr, (x) => x)).toEqual([
      null,
      undefined,
      1,
      2,
      3,
    ]);

    // Object array with complex key function
    const objArr = [
      { id: 1, value: "a" },
      { id: 2, value: "b" },
      { id: 1, value: "c" },
      { id: 3, value: "a" },
    ];
    expect(Lang.uniqueBy(objArr, (item) => `${item.id}-${item.value}`)).toEqual(
      [
        { id: 1, value: "a" },
        { id: 2, value: "b" },
        { id: 1, value: "c" },
        { id: 3, value: "a" },
      ],
    );
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
});

describe("Lang.MapWithKeyFn", () => {
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
});

describe("Lang.MultiLevelMap", () => {
  describe("simple", () => {
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
  });

  describe("complex", () => {
    let mlm: Lang.MultiLevelMap<number>;

    beforeEach(() => {
      mlm = new Lang.MultiLevelMap<number>();
      // Set up a more complex nested data structure.
      mlm.set(["a", "b", "c", "d"], 1);
      mlm.set(["a", "b", "c", "e"], 2);
      mlm.set(["a", "b", "x", "y"], 3);
      mlm.set(["a", "z", "c", "d"], 4);
      mlm.set(["m", "n", "o"], 5);
      mlm.set(["m", "n", "p"], 6);
      mlm.set(["x", "y", "z"], 7);
      mlm.set(["x", "y", "w"], 8);
    });

    it("should return all items matching deep levels with mixed wildcards", () => {
      // Query pattern: first key "a", second key "b", wildcard at third, specific at fourth "d"
      // Expected to match: ["a", "b", "c", "d"] => 1
      const result = mlm.query(["a", "b", undefined, "d"]);
      expect(result).toEqual([1]);
    });

    it("should return multiple items when wildcards match different sub-branches", () => {
      // Query pattern: first key "a", wildcard for second, then "c", then wildcard.
      // Expected to match: ["a", "b", "c", "d"] => 1, ["a", "b", "c", "e"] => 2, and ["a", "z", "c", "d"] => 4
      const result = mlm.query(["a", undefined, "c", undefined]);
      expect(result.sort()).toEqual([1, 2, 4].sort());
    });

    it("should return all items when wildcards are used at the beginning", () => {
      // Query pattern: wildcard at first, then "y", then wildcard.
      // Expected to match: ["x", "y", "z"] => 7 and ["x", "y", "w"] => 8
      const result = mlm.query([undefined, "y", undefined]);
      expect(result.sort()).toEqual([7, 8].sort());
    });

    it("should return only the branch specific items when no wildcards are used", () => {
      // Query exact match: ["m", "n", "o"]
      const result = mlm.query(["m", "n", "o"]);
      expect(result).toEqual([5]);
    });

    it("should return empty array if the query pattern does not match any branch", () => {
      // Query pattern that does not exist.
      const result = mlm.query(["a", "b", "nonexistent", undefined]);
      expect(result).toEqual([]);
    });

    it("should handle queries longer than the depth of the map gracefully", () => {
      // Query with extra undefined levels should return empty.
      const result = mlm.query(["m", "n", "o", undefined]);
      expect(result).toEqual([]);
    });

    it("should return all items when querying with all wildcards in a deeper map", () => {
      // Query with all wildcards and longer depth.
      const result = mlm.query([undefined, undefined, undefined, undefined]);
      expect(result.sort()).toEqual([1, 2, 3, 4].sort());
      // Note: items with depth less than 4 (5,6,7,8) are not included.
    });
  });
});

describe("Lang.InvertedIndexMap", () => {
  interface Person {
    id: string;
    name: string;
    age: number;
  }
  let peopleIndex: Lang.InvertedIndexMap<Person>;

  beforeEach(() => {
    peopleIndex = new Lang.InvertedIndexMap<Person>((r) => r.id);
  });

  test("should add and retrieve records by primary key", () => {
    const alice: Person = { id: "p1", name: "Alice", age: 30 };
    const bob: Person = { id: "p2", name: "Bob", age: 25 };
    peopleIndex.add(alice);
    peopleIndex.add(bob);

    expect(peopleIndex.get("p1")).toEqual(alice);
    expect(peopleIndex.get("p2")).toEqual(bob);
    expect(peopleIndex.size).toBe(2);
  });

  test("should update a record when added with the same primary key", () => {
    const alice: Person = { id: "p1", name: "Alice", age: 30 };
    peopleIndex.add(alice);
    expect(peopleIndex.get("p1")).toEqual(alice);

    // Update Alice with new age
    const aliceUpdated: Person = { id: "p1", name: "Alice", age: 35 };
    peopleIndex.add(aliceUpdated);
    expect(peopleIndex.get("p1")).toEqual(aliceUpdated);
    // Size remains the same as it is an update.
    expect(peopleIndex.size).toBe(1);
  });

  test("should perform query based on a single field", () => {
    const alice: Person = { id: "p1", name: "Alice", age: 30 };
    const bob: Person = { id: "p2", name: "Bob", age: 25 };
    const charlie: Person = { id: "p3", name: "Charlie", age: 30 };
    peopleIndex.add(alice);
    peopleIndex.add(bob);
    peopleIndex.add(charlie);

    // Query people with age 30
    const result = peopleIndex.query({ age: 30 });
    expect(result.sort((a, b) => a.id.localeCompare(b.id))).toEqual(
      [alice, charlie].sort((a, b) => a.id.localeCompare(b.id)),
    );
  });

  test("should perform query using multiple fields", () => {
    const alice: Person = { id: "p1", name: "Alice", age: 30 };
    const bob: Person = { id: "p2", name: "Bob", age: 25 };
    const charlie: Person = { id: "p3", name: "Alice", age: 30 };
    peopleIndex.add(alice);
    peopleIndex.add(bob);
    peopleIndex.add(charlie);

    // Query for persons named "Alice" with age 30
    const result = peopleIndex.query({ name: "Alice", age: 30 });
    expect(result.sort((a, b) => a.id.localeCompare(b.id))).toEqual(
      [alice, charlie].sort((a, b) => a.id.localeCompare(b.id)),
    );
  });

  test("should return an empty array when no records match query", () => {
    const alice: Person = { id: "p1", name: "Alice", age: 30 };
    const bob: Person = { id: "p2", name: "Bob", age: 25 };
    peopleIndex.add(alice);
    peopleIndex.add(bob);

    const result = peopleIndex.query({ name: "Nonexistent" });
    expect(result).toEqual([]);
  });

  test("should return all records when query is empty", () => {
    const alice: Person = { id: "p1", name: "Alice", age: 30 };
    const bob: Person = { id: "p2", name: "Bob", age: 25 };
    const charlie: Person = { id: "p3", name: "Charlie", age: 40 };
    peopleIndex.add(alice);
    peopleIndex.add(bob);
    peopleIndex.add(charlie);

    const result = peopleIndex.query({});
    expect(result.sort((a, b) => a.id.localeCompare(b.id))).toEqual(
      [alice, bob, charlie].sort((a, b) => a.id.localeCompare(b.id)),
    );
  });

  test("should handle queries for fields that have not been indexed", () => {
    const alice: Person = { id: "p1", name: "Alice", age: 30 };
    peopleIndex.add(alice);

    // Since "unknown" is not a field in the record, query should return empty.
    const result = peopleIndex.query({ unknown: "value" } as any);
    expect(result).toEqual([]);
  });

  test("should handle updates of indexed fields correctly", () => {
    const alice: Person = { id: "p1", name: "Alice", age: 30 };
    peopleIndex.add(alice);

    // Update Alice's age
    const aliceUpdated = { id: "p1", name: "Alice", age: 35 };
    peopleIndex.add(aliceUpdated);

    // Old query should no longer return results
    expect(peopleIndex.query({ age: 30 })).toEqual([]);

    // New query should return updated record
    expect(peopleIndex.query({ age: 35 })).toEqual([aliceUpdated]);
  });

  test("should handle multiple updates of the same record", () => {
    const person: Person = { id: "p1", name: "Alice", age: 30 };
    peopleIndex.add(person);

    // Multiple updates
    peopleIndex.add({ id: "p1", name: "Alice", age: 35 });
    peopleIndex.add({ id: "p1", name: "Alicia", age: 35 });
    peopleIndex.add({ id: "p1", name: "Alicia", age: 40 });

    const final = { id: "p1", name: "Alicia", age: 40 };
    expect(peopleIndex.get("p1")).toEqual(final);
    expect(peopleIndex.query({ name: "Alice" })).toEqual([]);
    expect(peopleIndex.query({ name: "Alicia", age: 40 })).toEqual([final]);
  });

  test("should maintain consistency across all indexes after updates", () => {
    const alice: Person = { id: "p1", name: "Alice", age: 30 };
    const bob: Person = { id: "p2", name: "Bob", age: 30 };
    peopleIndex.add(alice);
    peopleIndex.add(bob);

    // Update Alice
    const aliceUpdated = { id: "p1", name: "Alice", age: 35 };
    peopleIndex.add(aliceUpdated);

    // Check queries on different fields
    expect(peopleIndex.query({ age: 30 })).toEqual([bob]);
    expect(peopleIndex.query({ age: 35 })).toEqual([aliceUpdated]);
    expect(peopleIndex.query({ name: "Alice" })).toEqual([aliceUpdated]);
  });

  test("should handle edge cases in field values", () => {
    const records: Person[] = [
      { id: "p1", name: "", age: 0 },
      { id: "p2", name: "   ", age: -1 },
      { id: "p3", name: "Bob", age: Number.MAX_SAFE_INTEGER },
      { id: "p4", name: "Charlie", age: Number.MIN_SAFE_INTEGER },
    ];

    records.forEach((r) => peopleIndex.add(r));

    expect(peopleIndex.query({ name: "" })).toEqual([records[0]]);
    expect(peopleIndex.query({ name: "   " })).toEqual([records[1]]);
    expect(peopleIndex.query({ age: 0 })).toEqual([records[0]]);
    expect(peopleIndex.query({ age: Number.MAX_SAFE_INTEGER })).toEqual([
      records[2],
    ]);
  });

  test("should handle queries with multiple matching records efficiently", () => {
    // Add 100 records with alternating ages
    for (let i = 0; i < 100; i++) {
      peopleIndex.add({
        id: `p${i}`,
        name: `Person${i}`,
        age: i % 2 === 0 ? 30 : 40,
      });
    }

    const age30Results = peopleIndex.query({ age: 30 });
    const age40Results = peopleIndex.query({ age: 40 });

    expect(age30Results.length).toBe(50);
    expect(age40Results.length).toBe(50);
    expect(peopleIndex.size).toBe(100);
  });

  test("should return undefined for non-existent keys", () => {
    const alice: Person = { id: "p1", name: "Alice", age: 30 };
    peopleIndex.add(alice);

    expect(peopleIndex.get("nonexistent")).toBeUndefined();
  });

  test("should ignore undefined values in query", () => {
    const alice: Person = { id: "p1", name: "Alice", age: 30 };
    const bob: Person = { id: "p2", name: "Bob", age: 25 };
    peopleIndex.add(alice);
    peopleIndex.add(bob);

    // Query with undefined field should ignore that field
    const result = peopleIndex.query({ name: "Alice", age: undefined });
    expect(result).toEqual([alice]);
  });

  test("should handle multiple fields with same value", () => {
    const alice1: Person = { id: "p1", name: "Alice", age: 30 };
    const alice2: Person = { id: "p2", name: "Alice", age: 30 };
    const bob: Person = { id: "p3", name: "Bob", age: 30 };

    peopleIndex.add(alice1);
    peopleIndex.add(alice2);
    peopleIndex.add(bob);

    const result = peopleIndex.query({ name: "Alice", age: 30 });
    expect(result.sort((a, b) => a.id.localeCompare(b.id))).toEqual(
      [alice1, alice2].sort((a, b) => a.id.localeCompare(b.id)),
    );
  });

  test("should maintain index integrity with multiple add/remove operations", () => {
    const alice: Person = { id: "p1", name: "Alice", age: 30 };
    const bob: Person = { id: "p2", name: "Bob", age: 25 };

    peopleIndex.add(alice);
    peopleIndex.add(bob);
    peopleIndex.add({ ...alice, age: 31 }); // Update alice
    peopleIndex.add({ ...bob, name: "Bobby" }); // Update bob

    expect(peopleIndex.query({ age: 30 })).toEqual([]);
    expect(peopleIndex.query({ age: 31 })).toEqual([{ ...alice, age: 31 }]);
    expect(peopleIndex.query({ name: "Bob" })).toEqual([]);
    expect(peopleIndex.query({ name: "Bobby" })).toEqual([
      { ...bob, name: "Bobby" },
    ]);
  });

  test("should handle field values changing between numeric and string types", () => {
    interface FlexibleRecord {
      id: string;
      value: string | number;
    }

    const flexIndex = new Lang.InvertedIndexMap<FlexibleRecord>((r) => r.id);

    const record = { id: "r1", value: "123" };
    flexIndex.add(record);
    expect(flexIndex.query({ value: "123" })).toEqual([record]);

    const updated = { id: "r1", value: 123 };
    flexIndex.add(updated);
    expect(flexIndex.query({ value: 123 })).toEqual([updated]);
  });

  test("queryIndexSet behavior with filtered fields", () => {
    interface Product {
      id: string;
      category: string;
      price: number;
      stock: number;
    }

    // Only index category and price fields
    const idx = new Lang.InvertedIndexMap<Product>(
      (r) => r.id,
      new Set(["category", "price"]),
    );

    const products = [
      { id: "p1", category: "electronics", price: 100, stock: 5 },
      { id: "p2", category: "books", price: 20, stock: 10 },
      { id: "p3", category: "electronics", price: 200, stock: 3 },
      { id: "p4", category: "books", price: 15, stock: 8 },
    ];

    products.forEach((p) => idx.add(p));

    // Test querying indexed fields
    const electronicsSet = idx.queryIndexSet({ category: "electronics" });
    expect(electronicsSet.size).toBe(2);
    expect([...electronicsSet].map((i) => products[i].id).sort()).toEqual(
      ["p1", "p3"].sort(),
    );

    // Test querying unindexed fields (should return empty set)
    const stockSet = idx.queryIndexSet({ stock: 5 });
    expect(stockSet.size).toBe(4);

    // Test querying combination of indexed and unindexed fields (unindexed fields are ignored)
    const mixedSet = idx.queryIndexSet({ category: "books", stock: 10 });
    expect(mixedSet.size).toBe(2); // Should match p2 and p4 as they are in "books" category

    // Test querying empty object returns set of all indices
    const allSet = idx.queryIndexSet({});
    expect(allSet.size).toBe(4);

    // Test querying non-existent values
    const emptySet = idx.queryIndexSet({ category: "nonexistent" });
    expect(emptySet.size).toBe(0);

    // Test querying multiple indexed fields
    const booksUnder20Set = idx.queryIndexSet({
      category: "books",
      price: 15,
    });
    expect([...booksUnder20Set].map((i) => products[i].id)).toEqual(["p4"]);
  });

  test("queryIndexSet handles updates correctly", () => {
    interface User {
      id: string;
      role: string;
      active: boolean;
    }

    const idx = new Lang.InvertedIndexMap<User>((r) => r.id);

    // Add initial users
    const users = [
      { id: "u1", role: "admin", active: true },
      { id: "u2", role: "user", active: true },
      { id: "u3", role: "user", active: false },
    ];

    users.forEach((u) => idx.add(u));

    // Initial queries
    let activeUsers = idx.queryIndexSet({ active: true });
    expect(activeUsers.size).toBe(2);

    // Update a user
    idx.add({ id: "u2", role: "admin", active: false });

    // Check updated queries
    activeUsers = idx.queryIndexSet({ active: true });
    expect(activeUsers.size).toBe(1);

    const adminUsers = idx.queryIndexSet({ role: "admin" });
    expect(adminUsers.size).toBe(2);

    // Test combined queries after update
    const activeAdmins = idx.queryIndexSet({ role: "admin", active: true });
    expect(activeAdmins.size).toBe(1);
  });

  test("queryIndexSet performance with large datasets", () => {
    interface Record {
      id: string;
      type: string;
      value: number;
    }

    const idx = new Lang.InvertedIndexMap<Record>((r) => r.id);
    const types = ["A", "B", "C", "D"];
    const values = [10, 20, 30, 40, 50];

    // Add 1000 records
    for (let i = 0; i < 1000; i++) {
      idx.add({
        id: `r${i}`,
        type: types[i % types.length],
        value: values[i % values.length],
      });
    }

    // Measure time for single field query
    const start1 = performance.now();
    const typeASet = idx.queryIndexSet({ type: "A" });
    const duration1 = performance.now() - start1;
    expect(typeASet.size).toBe(250); // 1000/4 records
    expect(duration1).toBeLessThan(50); // Should be fast

    // Measure time for multiple field query
    const start2 = performance.now();
    const typeAValue10Set = idx.queryIndexSet({ type: "A", value: 10 });
    const duration2 = performance.now() - start2;
    expect(typeAValue10Set.size).toBe(50); // 250/5 records
    expect(duration2).toBeLessThan(50); // Should still be fast
  });

  test("query respects fieldsToIdx constructor parameter", () => {
    interface Product {
      id: string;
      name: string;
      category: string;
      price: number;
      inStock: boolean;
    }

    const productsIndex = new Lang.InvertedIndexMap<Product>(
      (r) => r.id,
      new Set(["category", "price"]), // Only index category and price
    );

    const products = [
      {
        id: "p1",
        name: "Laptop",
        category: "electronics",
        price: 999,
        inStock: true,
      },
      {
        id: "p2",
        name: "Phone",
        category: "electronics",
        price: 599,
        inStock: false,
      },
      { id: "p3", name: "Book", category: "books", price: 29, inStock: true },
      {
        id: "p4",
        name: "Tablet",
        category: "electronics",
        price: 399,
        inStock: true,
      },
    ];

    products.forEach((p) => productsIndex.add(p));

    // Should work for indexed fields
    expect(productsIndex.query({ category: "electronics" }).length).toBe(3);
    expect(productsIndex.query({ price: 599 }).length).toBe(1);
    expect(
      productsIndex.query({ category: "electronics", price: 999 }).length,
    ).toBe(1);

    // Should ignore non-indexed fields
    expect(productsIndex.query({ name: "Laptop" }).length).toBe(4);
    expect(productsIndex.query({ inStock: true }).length).toBe(4);

    // Should ignore non-indexed fields when combined with indexed fields
    expect(
      productsIndex.query({ category: "electronics", name: "Laptop" }).length,
    ).toBe(3);
    expect(productsIndex.query({ price: 599, inStock: false }).length).toBe(1);

    // Should handle updates correctly for indexed fields
    productsIndex.add({
      id: "p2",
      name: "Phone Updated",
      category: "accessories",
      price: 499,
      inStock: true,
    });

    expect(productsIndex.query({ category: "electronics" }).length).toBe(2);
    expect(productsIndex.query({ category: "accessories" }).length).toBe(1);
    expect(productsIndex.query({ price: 599 }).length).toBe(0);
    expect(productsIndex.query({ price: 499 }).length).toBe(1);
  });
});
