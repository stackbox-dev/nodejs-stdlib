// DG - Directed Graph
// DAG - Directed Acyclic Graph

// [parent, child, distance]
export type Edge<T> = [T, T, number];

export type TransitiveClosure<T> = {
  parent: T;
  child: T;
  distance: number;
};

export const INF = Number.MAX_SAFE_INTEGER;

export function add(x: number, y: number): number {
  if (x === INF || y === INF) {
    return INF;
  }
  return x + y;
}
