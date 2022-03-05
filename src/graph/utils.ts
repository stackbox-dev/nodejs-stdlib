import { Edge } from "./interfaces";

export function getNodesFromEdges<T>(edges: Edge<T>[]) {
  return [...new Set([...edges.map((e) => e[0]), ...edges.map((e) => e[1])])];
}
