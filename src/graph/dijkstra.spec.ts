import * as mnemonist from "mnemonist";
import { DijkstraShortestPath, HeapNode } from "./dijkstra";

const INF = 1e9;

const createSPAlgoUndirected = (edges: any[]) => {
  return new DijkstraShortestPath(
    edges.flatMap((e) => [
      { from: e[0], to: e[1], distance: e[2] },
      { from: e[1], to: e[0], distance: e[2] },
    ]),
    () => new mnemonist.Heap<HeapNode>((a, b) => a.distance - b.distance),
    INF,
  );
};

const createSPAlgoDirected = (edges: any[]) => {
  return new DijkstraShortestPath(
    edges.map((e) => ({ from: e[0], to: e[1], distance: e[2] })),
    () => new mnemonist.Heap<HeapNode>((a, b) => a.distance - b.distance),
    INF,
  );
};

test("simple graph 1", () => {
  const edges = [
    ["A", "B", 4],
    ["A", "C", 2],
    ["B", "E", 3],
    ["C", "D", 2],
    ["C", "F", 4],
    ["D", "E", 3],
    ["D", "F", 1],
    ["F", "E", 1],
  ];
  createSPAlgoUndirected(edges);
  expect(createSPAlgoUndirected(edges).calculate("A", "E")).toStrictEqual({
    path: ["A", "C", "D", "F", "E"],
    distance: 6,
  });
});

test("graph with loops and multiple equal paths", () => {
  const edges = [
    ["A", "B", 7],
    ["A", "D", 5],
    ["B", "C", 8],
    ["B", "D", 9],
    ["B", "E", 7],
    ["C", "E", 5],
    ["D", "E", 15],
    ["D", "F", 6],
    ["E", "F", 8],
    ["E", "G", 9],
    ["F", "G", 11],
  ];
  expect(createSPAlgoUndirected(edges).calculate("A", "G")).toStrictEqual({
    path: ["A", "D", "F", "G"],
    distance: 22,
  });
});

test("graph with a disconnected node", () => {
  const edges = [
    ["A", "B", 6],
    ["A", "C", 3],
    ["B", "C", 2],
    ["B", "D", 5],
    ["C", "D", 3],
    // "E" is disconnected
    ["F", "G", 1],
    ["E", "N", 1],
  ];
  expect(createSPAlgoUndirected(edges).calculate("A", "D")).toStrictEqual({
    path: ["A", "C", "D"],
    distance: 6,
  });
  // Should return null or equivalent for disconnected nodes
  expect(createSPAlgoUndirected(edges).calculate("A", "E")).toStrictEqual({
    path: [],
    distance: INF,
  });
});

test("graph with zero-distance edges", () => {
  const edges = [
    ["A", "B", 0],
    ["A", "C", 0],
    ["B", "C", 0],
    ["B", "D", 1],
    ["C", "D", 1],
    ["D", "E", 1],
  ];
  expect(
    createSPAlgoUndirected(edges).calculate("A", "E").distance,
  ).toStrictEqual(2);
});

test("larger graph with multiple routes and varying distances", () => {
  const edges = [
    ["A", "B", 10],
    ["A", "C", 20],
    ["B", "D", 10],
    ["B", "C", 5],
    ["C", "D", 30],
    ["C", "E", 75],
    ["D", "E", 50],
    ["D", "F", 100],
    ["E", "G", 60],
    ["F", "G", 10],
  ];
  expect(createSPAlgoUndirected(edges).calculate("A", "G")).toStrictEqual({
    path: ["A", "B", "D", "E", "G"],
    distance: 130,
  });
});

test("graph with a negative distance edge", () => {
  const edges = [
    ["A", "B", 2],
    ["A", "C", 5],
    ["B", "C", -3],
    ["C", "D", 4],
  ];
  // Dijkstra's algorithm should not allow negative distance edges
  // Depending on how your algorithm is designed to handle this,
  // it should throw an error, or you can test for a specific error message.
  expect(() => createSPAlgoUndirected(edges).calculate("A", "D")).toThrow();
});

test("directed graph with multiple paths and dead ends", () => {
  const edges = [
    ["A", "B", 5],
    ["A", "D", 1],
    ["B", "C", 1],
    ["D", "B", 1],
    ["C", "E", 2],
    ["D", "E", 12], // Longer path, but direct to E
    ["C", "F", 3], // Dead end
  ];
  expect(createSPAlgoDirected(edges).calculate("A", "E")).toStrictEqual({
    path: ["A", "D", "B", "C", "E"],
    distance: 5,
  });
});

test("simple directed graph", () => {
  const edges = [
    ["A", "B", 3],
    ["A", "C", 6],
    ["B", "C", 2],
    ["B", "D", 1],
    ["C", "D", 1],
    ["D", "E", 5],
  ];
  expect(createSPAlgoDirected(edges).calculate("A", "E")).toStrictEqual({
    path: ["A", "B", "D", "E"],
    distance: 9,
  });
});

test("directed graph with no path", () => {
  const edges = [
    ["A", "B", 1],
    ["B", "C", 2],
    ["C", "D", 3],
    // No edge leading to E directly or indirectly from A
    ["E", "Z", 20],
  ];
  expect(createSPAlgoDirected(edges).calculate("A", "E")).toStrictEqual({
    distance: INF,
    path: [],
  });
});

test("directed acyclic graph (DAG)", () => {
  const edges = [
    ["A", "B", 2],
    ["A", "C", 6],
    ["B", "D", 1],
    ["B", "E", 2],
    ["C", "E", 2],
    ["D", "E", 1],
    ["D", "F", 4],
    ["E", "F", 2],
  ];
  expect(createSPAlgoDirected(edges).calculate("A", "F")).toStrictEqual({
    path: ["A", "B", "E", "F"],
    distance: 6,
  });
});

test("complex directed graph", () => {
  const edges = [
    ["A", "B", 3],
    ["A", "C", 8],
    ["B", "D", 7],
    ["B", "C", 1],
    ["C", "E", 3],
    ["D", "E", 2],
    ["D", "F", 5],
    ["E", "G", 2],
    ["F", "G", 1],
  ];
  expect(createSPAlgoDirected(edges).calculate("A", "G")).toStrictEqual({
    path: ["A", "B", "C", "E", "G"],
    distance: 9,
  });
});
