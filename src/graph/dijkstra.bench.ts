import * as mnemonist from "mnemonist";
import { HeapNode, DijkstraShortestPath } from "./dijkstra";

export const createSPA = (edges: any[]) => {
  return new DijkstraShortestPath(
    edges,
    () => new mnemonist.Heap<HeapNode>((a, b) => a.distance - b.distance),
    1e9,
  );
};

function generateSampleData(
  N: number,
  edgeProb: number,
): [number, number, number][] {
  const edges: [number, number, number][] = [];

  // For simplicity, we will just generate a random set of edges.
  // There is no guarantee every node will be connected.
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (Math.random() < edgeProb && i !== j) {
        // 5% probability of an edge between any two nodes.
        const distance = Math.floor(Math.random() * 10) + 1;
        if (distance !== 0) {
          edges.push([i, j, distance]);
        }
      }
    }
  }

  return edges;
}

const N = 300;
const EDGE_PROB = 0.1;
const ITERS = 10000;
const edges = generateSampleData(N, EDGE_PROB);

let result: any;
// warmup
const spa = createSPA(
  edges.map((e) => ({ from: e[0], to: e[1], distance: e[2] })),
);
for (let i = 0; i < ITERS; i++) {
  const a = Math.floor(Math.random() * N);
  const b = Math.floor(Math.random() * N);
  result = spa.calculate(a, b);
}
const start = Date.now();
for (let i = 0; i < ITERS; i++) {
  const a = Math.floor(Math.random() * N);
  const b = Math.floor(Math.random() * N);
  result = spa.calculate(a, b);
}
const end = Date.now();
console.log("Benchmarking dijsktra", (end - start) / ITERS, "ms");
console.log(result.distance);
