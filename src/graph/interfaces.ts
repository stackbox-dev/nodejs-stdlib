// DG - Directed Graph
// DAG - Directed Acyclic Graph

// [parent, child, distance]
export type Edge<T> = [T, T, number];

export interface EdgeDef<T> {
  from: T;
  to: T;
  distance: number;
}

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

export interface ShortestPath<T> {
  path: T[];
  distance: number;
}

export interface ShortestPathAlgo<T, E extends EdgeDef<T>> {
  calculate(
    srcNode: T,
    dstNode: T,
    distFn: (edge: E) => number,
  ): ShortestPath<T>;
}

export interface PriorityQueue<T> {
  push(node: T): void;
  pop(): T | undefined;
  size: number;
}
