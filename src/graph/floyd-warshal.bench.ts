import { buildDMUsingFloydWarshal } from "./floyd-warshal";

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
const EDGE_PROB = 0.5;
const ITERS = 10;
const edges = generateSampleData(N, EDGE_PROB);

let result: any;
// warmup
for (let i = 0; i < ITERS; i++) {
  result = buildDMUsingFloydWarshal(N, edges);
}
const start = Date.now();
for (let i = 0; i < ITERS; i++) {
  result = buildDMUsingFloydWarshal(N, edges);
}
const end = Date.now();
console.log(
  "Benchmarking buildDMUsingFloydWarshal",
  (end - start) / ITERS,
  "ms",
);
console.log(result.length);
