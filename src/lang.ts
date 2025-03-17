export * as BigInt from "./bigint";

export type CompareFn<T> = (a: T, b: T) => number;

export type KeyFn<T, V = number | string> = (a: T) => V;

export type UnaryFn<T, U> = (x: T) => U;

export type PickNullableFields<
  T,
  NK extends keyof T = {
    [K in keyof T]: null extends T[K] ? K : never;
  }[keyof T],
  NP = Pick<T, NK>,
> = { [K in keyof NP]: NonNullable<NP[K]> };

export const compareNum: CompareFn<number> = (a, b) => {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
};

export const round = (num: number, decimals: number) =>
  Math.round((num + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;

export const roundUp = (num: number, decimals: number) =>
  Math.ceil((num + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;

export const roundDown = (num: number, decimals: number) =>
  Math.floor((num + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;

export const SortBy = <T>(...fns: ReadonlyArray<KeyFn<T>>): CompareFn<T> => {
  if (fns.length === 1) {
    const fn = fns[0];
    return (a, b) => compareWithKey(a, b, fn);
  }
  return (a, b) => {
    for (const fn of fns) {
      const diff = compareWithKey(a, b, fn);
      if (diff !== 0) {
        return diff;
      }
    }
    return 0;
  };
};

function compareWithKey<T, V = number | string>(
  a: T,
  b: T,
  keyFn: KeyFn<T, V>,
) {
  const aVal = keyFn(a);
  const bVal = keyFn(b);
  if (typeof aVal === "number" && typeof bVal === "number") {
    return aVal - bVal;
  } else if (aVal < bVal) {
    return -1;
  } else if (aVal > bVal) {
    return 1;
  } else {
    return 0;
  }
}

/**
 * Returns Unique Items in the list
 * @param items
 * @returns distinct items (preserves order)
 */
export const unique = <T>(items: ReadonlyArray<T>): T[] => {
  const seen = new Set<T>();
  const resp: T[] = [];
  for (const item of items) {
    if (seen.has(item)) {
      continue;
    }
    resp.push(item);
    seen.add(item);
  }
  return resp;
};

export const uniqueBy = <T, V = string | number>(
  items: ReadonlyArray<T>,
  fn: KeyFn<T, V>,
): T[] => {
  const seen = new Set<V>();
  const resp: T[] = [];
  for (const item of items) {
    const value = fn(item);
    if (seen.has(value)) {
      continue;
    }
    resp.push(item);
    seen.add(value);
  }
  return resp;
};

export const uniqueCount = <T>(items: ReadonlyArray<T>): number => {
  const seen = new Set<T>();
  for (const item of items) {
    if (seen.has(item)) {
      continue;
    }
    seen.add(item);
  }
  return seen.size;
};

export const intersection = <T>(
  items1: ReadonlyArray<T>,
  items2: ReadonlyArray<T>,
) => {
  const items2Set = new Set(items2);
  const inters = new Set<T>();
  for (const s1 of items1) {
    if (items2Set.has(s1)) {
      inters.add(s1);
    }
  }
  return [...inters];
};

export type IntSequence = [number, number];

export const arrayToIntSequence = (
  arr: ReadonlyArray<number>,
): IntSequence[] => {
  arr = [...arr].sort(SortBy((x) => x));
  const seqs: [number, number][] = [];
  for (const item of arr) {
    const last = seqs[seqs.length - 1];
    if (last && item === last[1]) {
      last[1] = item + 1;
    } else {
      seqs.push([item, item + 1]);
    }
  }
  return seqs;
};

export const areIntSequencesOverlapping = (
  s1: ReadonlyArray<IntSequence>,
  s2: ReadonlyArray<IntSequence>,
) => {
  for (const p1 of s1) {
    for (const p2 of s2) {
      if (p1[0] < p2[1] || p1[1] > p2[0]) {
        return true;
      }
    }
  }
  return false;
};

export const groupBy = <T, U, V = T[]>(
  iterable: Iterable<T>,
  keyFunc: (val: T) => U,
  groupTransform?: (group: T[]) => V,
): Map<U, V> => {
  const groupMap = new Map<U, T[]>();

  for (const item of iterable) {
    const key = keyFunc(item);

    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key)?.push(item);
  }

  if (!groupTransform) {
    return groupMap as Map<U, V>;
  }

  const map = new Map<U, V>();
  for (const [k, v] of groupMap) {
    map.set(k, groupTransform(v));
  }
  return map;
};

export const setEquals = <T>(
  items1: ReadonlyArray<T>,
  items2: ReadonlyArray<T>,
) => {
  for (const i1 of items1) {
    if (items2.indexOf(i1) === -1) {
      return false;
    }
  }
  for (const i2 of items2) {
    if (items1.indexOf(i2) === -1) {
      return false;
    }
  }
  return true;
};

export const minBy = <T>(
  items: ReadonlyArray<T>,
  ...fn: ReadonlyArray<KeyFn<T>>
): T | null => {
  let s: T | null = null;
  const comparator = SortBy(...fn);
  for (const item of items) {
    if (s === null || comparator(item, s) < 0) {
      s = item;
    }
  }
  return s;
};

export const maxBy = <T>(
  items: ReadonlyArray<T>,
  ...fn: ReadonlyArray<KeyFn<T>>
): T | null => {
  let s: T | null = null;
  const comparator = SortBy(...fn);
  for (const item of items) {
    if (s === null || comparator(item, s) > 0) {
      s = item;
    }
  }
  return s;
};

export const sumBy = <T>(
  items: ReadonlyArray<T>,
  fn: (x: T) => number,
): number => {
  let s = 0;
  for (const item of items) {
    s += fn(item);
  }
  return s;
};

export const countBy = <T>(
  items: ReadonlyArray<T>,
  fn: (x: T) => boolean,
): number => {
  let s = 0;
  for (const item of items) {
    if (fn(item)) {
      s++;
    }
  }
  return s;
};

export function shuffleArray<T>(array: ReadonlyArray<T>) {
  const output = [...array];
  for (let i = output.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = output[i];
    output[i] = output[j];
    output[j] = temp;
  }
  return output;
}

export function selectRandom<T>(array: ReadonlyArray<T>) {
  const index = Math.floor(Math.random() * (array.length + 1));
  return array[Math.min(index, array.length - 1)];
}

export interface DataStream {
  on(eventName: string | symbol, listener: (...args: any[]) => void): this;
}

export function streamToBuffer(stream: DataStream): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", (err) => reject(err));
    stream.on("end", () =>
      resolve(chunks.length === 1 ? chunks[0] : Buffer.concat(chunks)),
    );
  });
}

export const Memoize = <T, U>(fn: UnaryFn<T, U>): UnaryFn<T, U> => {
  const cache = new Map<T, U>();
  return (x) => {
    let value = cache.get(x);
    if (value == null) {
      value = fn(x);
    }
    cache.set(x, value);
    return value;
  };
};

export class MapWithKeyFn<K, V> implements Map<K, V> {
  private data = new Map<string, [K, V]>();
  constructor(
    entries: [K, V][],
    private keyfn: (k: K) => string,
  ) {
    for (const [k, v] of entries) {
      this.data.set(keyfn(k), [k, v]);
    }
  }
  get(k: K): V | undefined {
    return this.data.get(this.keyfn(k))?.[1];
  }
  set(k: K, v: V): this {
    this.data.set(this.keyfn(k), [k, v]);
    return this;
  }
  delete(k: K): boolean {
    return this.data.delete(this.keyfn(k));
  }
  has(k: K): boolean {
    return this.data.has(this.keyfn(k));
  }
  clear(): void {
    this.data.clear();
  }
  entries(): IterableIterator<[K, V]> {
    return this.data.values();
  }
  *keys(): IterableIterator<K> {
    for (const [k] of this.data.values()) {
      yield k;
    }
  }
  *values(): IterableIterator<V> {
    for (const [, v] of this.data.values()) {
      yield v;
    }
  }
  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.data.values();
  }
  [Symbol.toStringTag]: "MapWithKeyFn";
  get size(): number {
    return this.data.size;
  }
  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: any,
  ): void {
    for (const [k, v] of this.data.values()) {
      callbackfn.call(thisArg, v, k, this);
    }
  }
}

class Node<T> {
  value?: T;
  children = new Map<string, Node<T>>();
}

/**
 * Represents a hierarchical map data structure backed by a tree of nodes.
 *
 * The internal data is stored as a tree where:
 * - The root node is an instance of an internal Node<T> class.
 * - Each Node<T> holds:
 *   - An optional value of type T.
 *   - A Map of children nodes keyed by strings, representing the next level in the hierarchy.
 *
 * As keys are provided in an array (e.g., ["level1", "level2", ...]), the corresponding path in the tree is
 * traversed or dynamically created. This design allows efficient insertion, retrieval, querying (with support
 * for wildcards using undefined), and deletion of values at various levels.
 *
 * @template T - The type of values stored in the MultiLevelMap.
 */
export class MultiLevelMap<T> {
  private root = new Node<T>();

  set(keys: string[], value: T): void {
    let node = this.root;
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      let child = node.children.get(key);
      if (child === undefined) {
        child = new Node<T>();
        node.children.set(key, child);
      }
      node = child;
    }
    node.value = value;
  }

  get(keys: string[]): T | undefined {
    let node: Node<T> | undefined = this.root;
    for (let i = 0, len = keys.length; i < len; i++) {
      node = node.children.get(keys[i]);
      if (node === undefined) return undefined;
    }
    return node.value;
  }

  getAll(keys: string[]): T[] {
    let node: Node<T> | undefined = this.root;
    for (let i = 0, len = keys.length; i < len; i++) {
      node = node.children.get(keys[i]);
      if (node === undefined) return [];
    }
    const results: T[] = [];
    const stack: Node<T>[] = [node];
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (current.value !== undefined) {
        results.push(current.value);
      }
      for (const child of current.children.values()) {
        stack.push(child);
      }
    }
    return results;
  }

  /**
   * Given an array of keys (or undefined), returns an array of values.
   *
   * For each defined key, it returns values corresponding to that key.
   * For each undefined key, it returns values from all nodes at that level.
   *
   * For example:
   * - Input: ["a", undefined] returns all values under the node "a" at the first level.
   * - Input: [undefined] returns values from all top-level nodes.
   *
   * Example with at least three levels and second key undefined:
   *
   * Suppose we insert the following entries:
   *   mlMap.set(["fruit", "apple", "red"], "Red Apple");
   *   mlMap.set(["fruit", "orange", "red"], "Red Orange");
   *   mlMap.set(["fruit", "apple", "green"], "Green Apple");
   *   mlMap.set(["vegetable", "leafy", "spinach"], "Spinach");
   *
   * Then:
   *   mlMap.query(["fruit", undefined, "red"])
   * will return:
   *   ["Red Apple", "Red Orange"]
   */
  query(keys: (string | undefined)[]): T[] {
    let currentLevel = [this.root];

    // Traverse levels
    for (const key of keys) {
      const nextLevel: Node<T>[] = [];
      if (key === undefined) {
        // Include all children
        for (const node of currentLevel) {
          nextLevel.push(...node.children.values());
        }
      } else {
        // Only children matching the key
        for (const node of currentLevel) {
          const child = node.children.get(key);
          if (child) {
            nextLevel.push(child);
          }
        }
      }
      if (nextLevel.length === 0) return [];
      currentLevel = nextLevel;
    }

    // Gather all descendants
    const stack = [...currentLevel];
    const results: T[] = [];
    while (stack.length) {
      const node = stack.pop()!;
      if (node.value !== undefined) {
        results.push(node.value);
      }
      stack.push(...node.children.values());
    }
    return results;
  }

  has(keys: string[]): boolean {
    let node: Node<T> | undefined = this.root;
    for (let i = 0, len = keys.length; i < len; i++) {
      node = node.children.get(keys[i]);
      if (node === undefined) return false;
    }
    return node.value !== undefined;
  }

  delete(keys: string[]): boolean {
    const stack: Array<{ node: Node<T>; key: string }> = [];
    let node = this.root;
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      const child = node.children.get(key);
      if (child === undefined) return false;
      stack.push({ node, key });
      node = child;
    }
    if (node.value === undefined) return false;
    node.value = undefined;

    // Cleanup any nodes that no longer hold value or children.
    for (let i = stack.length - 1; i >= 0; i--) {
      const { node: parent, key } = stack[i];
      const child = parent.children.get(key)!;
      if (child.value === undefined && child.children.size === 0) {
        parent.children.delete(key);
      } else {
        break;
      }
    }
    return true;
  }
}

/**
 * Represents a set of numeric indices.
 *
 * @interface IndexSet
 *
 * @property {number} size - The number of indices in the set.
 *
 * @method has - Checks if a specific index exists in the set.
 * @param {number} index - The index to check.
 * @returns {boolean} True if the index exists in the set, false otherwise.
 *
 * @method [Symbol.iterator] - Makes the set iterable.
 * @returns {IterableIterator<number>} An iterator that yields the indices in the set.
 */
export interface IndexSet {
  has(index: number): boolean;
  size: number;
  [Symbol.iterator](): IterableIterator<number>;
}

const EmptySet: IndexSet = {
  has: () => false,
  size: 0,
  [Symbol.iterator]: function* () {},
};

const LenIndexSet: (len: number) => IndexSet = (len) => ({
  has: (index) => index < len,
  size: len,
  [Symbol.iterator]: function* () {
    for (let i = 0; i < len; i++) {
      yield i;
    }
  },
});

/**
 * Converts a sorted array of numbers into an IndexSet data structure.
 * sortedArr shouldn't have duplicate elements.
 * The resulting set provides efficient lookup operations using binary search.
 *
 * @param sortedArr - An array of numbers in ascending order
 * @returns An IndexSet object with the following properties:
 *  - `has(index)`: A method that checks if a number exists in the set using binary search (O(log n))
 *  - `size`: The number of elements in the set
 *  - `[Symbol.iterator]`: Makes the set iterable, returning the original sorted array iterator
 *
 * @example
 * ```typescript
 * const set = sortedArrToIndexSet([1, 2, 3, 4, 5]);
 * console.log(set.has(3)); // true
 * console.log(set.has(6)); // false
 * console.log(set.size); // 5
 * for (const num of set) {
 *   console.log(num); // prints 1, 2, 3, 4, 5
 * }
 * ```
 */
export function sortedArrToIndexSet(sortedArr: number[]): IndexSet {
  return {
    has: (index: number) => {
      let left = 0;
      let right = sortedArr.length - 1;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (sortedArr[mid] === index) return true;
        if (sortedArr[mid] < index) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      return false;
    },
    size: sortedArr.length,
    [Symbol.iterator]: () => sortedArr[Symbol.iterator](),
  };
}

/**
 * Returns the intersection of two sorted arrays of numbers.
 * The function assumes that both input arrays are sorted in ascending order.
 * Doesn't handle duplicate elements in the input arrays.
 * Time complexity: O(n + m) where n and m are lengths of input arrays.
 * Space complexity: O(min(n, m)) for the result array.
 * The result maintains the sorted order of the input arrays.
 *
 * @param a - First sorted array of numbers
 * @param b - Second sorted array of numbers
 * @returns An array containing elements that appear in both input arrays
 *
 * @example
 * ```typescript
 * intersectSorted([1, 2, 3, 4], [2, 4, 6, 8]) // returns [2, 4]
 * intersectSorted([1, 2, 3], [4, 5, 6]) // returns []
 * ```
 */
export function intersectSorted(a: number[], b: number[]): number[] {
  const result: number[] = [];
  let i = 0,
    j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      result.push(a[i]);
      i++;
      j++;
    } else if (a[i] < b[j]) {
      i++;
    } else {
      j++;
    }
  }
  return result;
}

/**
 * The `InvertedIndexMap` class stores records of type `R` and allows quick lookups by a primary key and
 * by any other fields in the record. You supply a function that extracts the primary key from each record,
 * and then you can:
 *
 * 1. Add new records by calling `add(record)`.
 * 2. Retrieve a record by its primary key with `get(key)`.
 * 3. Use `query(partialRecord)` to find all records that match the specified field-value pairs.
 *
 * Example usage:
 *
 * ```ts
 * interface Person {
 *   id: string;
 *   name: string;
 *   age: number;
 * }
 *
 * // Create an index using the 'id' field as the primary key
 * const peopleIndex = new InvertedIndexMap<Person>((r) => r.id);
 *
 * // Add some records
 * peopleIndex.add({ id: "p1", name: "Alice", age: 30 });
 * peopleIndex.add({ id: "p2", name: "Bob", age: 25 });
 *
 * // Retrieve by primary key
 * const person = peopleIndex.get("p1");
 *
 * // Query by other fields
 * const results = peopleIndex.query({ age: 25 });
 * ```
 */
export class InvertedIndexMap<R extends Record<keyof R, unknown>> {
  private primaryIdx = new Map<string, number>();
  private data: R[] = [];
  private invIdxes: Partial<Record<keyof R, Map<R[keyof R], number[]>>> = {};
  private fieldOrderStale = true;
  private fieldOrder: { field: keyof R; score: number }[] = [];

  constructor(
    private keyfn: (r: R) => string,
    fieldsToIdx: (keyof R)[],
  ) {
    for (const field of fieldsToIdx) {
      this.invIdxes[field] = new Map();
    }
    this.fieldOrder = fieldsToIdx.map((f) => ({
      field: f,
      score: 0,
    }));
  }

  get(key: string): R | undefined {
    const i = this.primaryIdx.get(key);
    return i != null ? this.data[i] : undefined;
  }

  get size(): number {
    return this.data.length;
  }

  private updateFieldOrder() {
    if (!this.fieldOrderStale) {
      return;
    }
    for (const field of this.fieldOrder) {
      field.score = this.invIdxes[field.field]?.size ?? 0;
    }
    // Sort fields by selectivity (smaller value sets first)
    this.fieldOrder.sort((a, b) => a.score - b.score);
    this.fieldOrderStale = false;
  }

  add(record: R) {
    const key = this.keyfn(record);
    let i = this.primaryIdx.get(key);
    if (i != null) {
      const exstRecord = this.data[i];
      // Only update indices where values have changed
      for (const { field } of this.fieldOrder) {
        const oldVal = exstRecord[field];
        const newVal = record[field];
        if (oldVal === newVal) {
          continue;
        }
        const idx = this.invIdxes[field]!;
        // Remove old posting
        const posting = idx.get(oldVal);
        if (posting) {
          const pos = posting.indexOf(i);
          if (pos !== -1) {
            posting.splice(pos, 1);
          }
        }
        // Add new posting
        if (!idx.has(newVal)) {
          idx.set(newVal, []);
        }
        idx.get(newVal)!.push(i);
      }
    } else {
      i = this.data.length;
      this.primaryIdx.set(key, i);
      // For new records, just add to indices
      for (const { field } of this.fieldOrder) {
        const v = record[field];
        const idx = this.invIdxes[field]!;
        if (!idx.has(v)) {
          idx.set(v, []);
        }
        idx.get(v)!.push(i);
      }
    }
    this.data[i] = record;
    this.fieldOrderStale = true;
  }

  /**
   * Retrieves an IndexSet based on a partial record query.
   *
   * This method performs optimized index lookups based on query complexity:
   * - Empty queries return an IndexSet covering all records
   * - Single field queries use direct index lookup
   * - Multiple field queries use field order optimization and set intersection
   *
   * @param q - Partial record containing field values to query
   * @returns {IndexSet} An IndexSet containing indexes of matching records with:
   *   - has(index): Method to check if an index exists in the set
   *   - size: Number of matching indexes
   *   - [Symbol.iterator]: Iterator to traverse matching indexes
   *
   * @example
   * ```ts
   * // Single field query
   * queryIndexSet({ name: "John" })
   *
   * // Multiple field query
   * queryIndexSet({ name: "John", age: 30 })
   * ```
   *
   * @remarks
   * - Returns EmptySet if no matches found
   * - Undefined query values are ignored
   * - Performance is optimized using field ordering for multiple field queries
   */
  queryIndexSet(q: Partial<R>): IndexSet {
    const qfields = Object.keys(q) as (keyof R)[];
    if (qfields.length === 0) {
      return LenIndexSet(this.data.length);
    }
    if (qfields.length === 1) {
      const qfield = qfields[0];
      const idx = this.invIdxes[qfield];
      const qv = q[qfield];
      if (!idx || qv === undefined) {
        return LenIndexSet(this.data.length);
      }
      const posting = idx.get(qv);
      return posting ? sortedArrToIndexSet(posting) : EmptySet;
    }

    this.updateFieldOrder();
    let intersected: number[] | null = null;
    // Iterate over fields in optimized order.
    for (const { field } of this.fieldOrder) {
      const qv = q[field];
      if (qv === undefined) continue;
      const posting = this.invIdxes[field]!.get(qv);
      if (!posting || posting.length === 0) {
        return EmptySet;
      }
      if (intersected === null) {
        // Copy the posting array.
        intersected = posting.slice();
      } else {
        // Merge two sorted arrays.
        intersected = intersectSorted(intersected, posting);
        if (intersected.length === 0) {
          return EmptySet;
        }
      }
    }
    return sortedArrToIndexSet(intersected ?? []);
  }

  query(q: Partial<R>, filter?: (r: R) => boolean): R[] {
    const matched = this.queryIndexSet(q);
    if (matched.size === 0) {
      return [];
    }
    if (matched.size === this.data.length) {
      if (!filter) {
        return this.data;
      } else {
        return this.data.filter(filter);
      }
    }
    const output: R[] = [];
    for (const idx of matched) {
      const row = this.data[idx];
      if (filter && !filter(row)) {
        continue;
      }
      output.push(row);
    }
    return output;
  }

  count(q: Partial<R>, filter?: (r: R) => boolean): number {
    const matched = this.queryIndexSet(q);
    if (matched.size === 0) {
      return 0;
    }
    if (matched.size === this.data.length) {
      if (!filter) {
        return this.data.length;
      } else {
        return countBy(this.data, filter);
      }
    }
    if (!filter) {
      return matched.size;
    }
    let count = 0;
    for (const idx of matched) {
      const row = this.data[idx];
      if (filter(row)) {
        count++;
      }
    }
    return count;
  }
}
