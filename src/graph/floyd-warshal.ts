import { Edge, TransitiveClosure, INF, add } from "./interfaces";
import { getNodesFromEdges } from "./utils";

export function buildDAGTransitiveClosure<T>(
  edges: Edge<T>[],
): TransitiveClosure<T>[] {
  const nodes = getNodesFromEdges(edges);
  const N = nodes.length;
  if (N > INF / 2) {
    throw new Error("too many nodes " + N);
  }
  const nodeIndex = new Map(nodes.map((n, i) => [n, i]));
  const indexedEdges = edges.map((e) => {
    const from = nodeIndex.get(e[0])!;
    const to = nodeIndex.get(e[1])!;
    return [from, to, e[2]] as [number, number, number];
  });

  const dm = buildDMUsingFloydWarshal(nodes.length, indexedEdges);
  return buildClosureFromDM(nodes, dm);
}

// build Distance Matrix using Floyd Warshal
// https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
// N - number of nodes/vertexes, edges - array of [from, to, distance]
export function buildDMUsingFloydWarshal(
  N: number,
  edges: [number, number, number][],
): number[][] {
  const dm: number[][] = [];
  for (let i = 0; i < N; i++) {
    const row: number[] = [];
    dm[i] = row;
    for (let j = 0; j < N; j++) {
      row[j] = INF;
    }
  }

  for (const [from, to, distance] of edges) {
    dm[from][to] = distance;
  }
  for (let i = 0; i < N; i++) {
    dm[i][i] = 0;
  }

  for (let k = 0; k < N; k++) {
    for (let from = 0; from < N; from++) {
      for (let to = 0; to < N; to++) {
        const oldDist = dm[from][to];
        const newDist = add(dm[from][k], dm[k][to]);
        if (newDist < oldDist) {
          dm[from][to] = newDist;
        }
      }
    }
  }
  return dm;
}

export function buildClosureFromDM<T>(nodes: T[], dm: number[][]) {
  const closure: TransitiveClosure<T>[] = [];
  const N = nodes.length;
  for (let from = 0; from < N; from++) {
    for (let to = 0; to < N; to++) {
      const distance = dm[from][to];
      if (distance === INF) {
        continue;
      }
      closure.push({ child: nodes[to], parent: nodes[from], distance });
    }
  }
  return closure;
}
