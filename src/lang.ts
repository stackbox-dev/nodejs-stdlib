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

export const compareNum: CompareFn<number> = (a, b) =>
  a < b ? -1 : a > b ? 1 : 0;

export const round = (num: number, decimals: number) =>
  Math.round((num + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;

export const roundUp = (num: number, decimals: number) =>
  Math.ceil((num + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;

export const roundDown = (num: number, decimals: number) =>
  Math.floor((num + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;

export const SortBy = <T>(...fns: KeyFn<T>[]): CompareFn<T> => {
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
  } else {
    if (aVal < bVal) {
      return -1;
    } else if (aVal > bVal) {
      return 1;
    } else {
      return 0;
    }
  }
}

/**
 * Returns Unique Items in the list
 * @param items
 * @returns distinct items (preserves order)
 */
export const unique = <T>(items: T[]): T[] => {
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
  items: T[],
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

export const intersection = <T>(items1: T[], items2: T[]) => {
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

export const arrayToIntSequence = (arr: number[]): IntSequence[] => {
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
  s1: IntSequence[],
  s2: IntSequence[],
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

export const groupBy = <T, U, V>(
  iterable: Iterable<T>,
  keyFunc: (val: T) => U,
  groupTransform: (group: T[]) => V,
): Map<U, V> => {
  const groupMap = new Map<U, T[]>();

  for (const item of iterable) {
    const key = keyFunc(item);

    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }

    groupMap.get(key)?.push(item);
  }
  const map = new Map<U, V>();
  for (const [k, v] of groupMap) {
    map.set(k, groupTransform(v));
  }
  return map;
};

export const setEquals = <T>(items1: T[], items2: T[]) => {
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

export const minBy = <T>(items: T[], ...fn: KeyFn<T>[]): T | null => {
  let s: T | null = null;
  const comparator = SortBy(...fn);
  for (let item of items) {
    if (s === null || comparator(item, s) < 0) {
      s = item;
    }
  }
  return s;
};

export const maxBy = <T>(items: T[], ...fn: KeyFn<T>[]): T | null => {
  let s: T | null = null;
  const comparator = SortBy(...fn);
  for (const item of items) {
    if (s === null || comparator(item, s) > 0) {
      s = item;
    }
  }
  return s;
};

export const sumBy = <T>(items: T[], fn: (x: T) => number): number => {
  let s = 0;
  for (const item of items) {
    s += fn(item);
  }
  return s;
};

export function shuffleArray<T>(array: T[]) {
  const output = [...array];
  for (let i = output.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = output[i];
    output[i] = output[j];
    output[j] = temp;
  }
  return output;
}

export function selectRandom<T>(array: T[]) {
  const index = Math.floor(Math.random() * (array.length + 1));
  return array[Math.min(index, array.length - 1)];
}

export function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
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
