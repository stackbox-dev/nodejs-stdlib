import { Edge } from "./interfaces";

// Kahn's algorithm
export function topoSort<T>(nodes: T[], edges: Edge<T>[]) {
  for (const [p, c] of edges) {
    if (nodes.indexOf(p) === -1) {
      throw new Error("edge has unknown parent");
    }
    if (nodes.indexOf(c) === -1) {
      throw new Error("edge has unknown child");
    }
  }
  const inDegrees = new Map(nodes.map((n) => [n, 0]));
  const dependents = new Map(nodes.map((n) => [n, Array<T>()]));
  for (const edge of edges) {
    inDegrees.set(edge[1], inDegrees.get(edge[1])! + 1);
    dependents.get(edge[0])!.push(edge[1]);
  }

  // S ← Set of all nodes with no incoming edge
  const nodeSet: T[] = [];

  // find a list of "start nodes" which have no incoming edges
  for (const [node, indegree] of inDegrees) {
    if (indegree === 0) {
      nodeSet.push(node);
    }
  }

  const orderedVisits: T[] = [];
  while (nodeSet.length) {
    const node = nodeSet.pop()!;
    orderedVisits.push(node);
    for (const child of dependents.get(node)!) {
      const newIndegree = inDegrees.get(child)! - 1;
      inDegrees.set(child, newIndegree);
      if (newIndegree === 0) {
        nodeSet.push(child);
      }
    }
  }

  // if visited is less than count of nodes, then some of the nodes
  // were not visited due to their in-degree not becoming zero
  // this will happen if there is a cycle in the graph
  if (orderedVisits.length !== nodes.length) {
    throw new Error("DG has cycle");
  }

  return orderedVisits;
}
