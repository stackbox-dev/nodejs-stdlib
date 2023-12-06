import {
  Edge,
  PriorityQueue,
  ShortestPath,
  ShortestPathAlgo,
} from "./interfaces";

export class HeapNode {
  constructor(
    public node: number,
    public distance: number,
  ) {}
}

export class DijkstraShortestPath<T, E extends Edge<T>>
  implements ShortestPathAlgo<T, E>
{
  private readonly nodeToIndex = new Map<T, number>();
  private readonly nodes: T[] = [];
  private readonly adjacencyList: { edge: E; node: number }[][] = [];

  constructor(
    public edges: E[],
    public priorityQueueFactory: () => PriorityQueue<HeapNode>,
    public readonly INF = 1e9,
  ) {
    const nodeSet = new Set(edges.flatMap((e) => [e[0], e[1]]));
    let index = 0;
    for (const node of nodeSet) {
      this.nodes[index] = node;
      this.nodeToIndex.set(node, index);
      this.adjacencyList[index] = [];
      index++;
    }
    for (const edge of edges) {
      const fromId = this.nodeToIndex.get(edge[0]);
      if (fromId == null) {
        throw new Error();
      }
      const toId = this.nodeToIndex.get(edge[1]);
      if (toId == null) {
        throw new Error();
      }
      this.adjacencyList[fromId].push({
        edge,
        node: toId,
      });
    }
  }

  calculate(
    srcNode: T,
    dstNode: T,
    distFn: (edge: E) => number = (e) => e[2],
  ): ShortestPath<T> {
    const src = this.nodeToIndex.get(srcNode)!;
    if (src == null) {
      throw new Error(`Invalid source node ${srcNode}`);
    }
    const dst = this.nodeToIndex.get(dstNode)!;
    if (dst == null) {
      throw new Error(`Invalid destination node ${dstNode}`);
    }

    const nodesPQ = this.priorityQueueFactory();
    const distances: number[] = [];
    const previous: number[] = [];

    for (let node = 0; node < this.adjacencyList.length; node++) {
      distances[node] = node === src ? 0 : this.INF;
      nodesPQ.push(new HeapNode(node, distances[node]));
      previous[node] = -1;
    }

    let node = -1;
    // as long as there is something to visit
    while (nodesPQ.size > 0) {
      node = nodesPQ.pop()!.node;

      if (node === dst) {
        break;
      }
      if (distances[node] === this.INF) {
        // not reachable
        continue;
      }

      for (const neighbor of this.adjacencyList[node]) {
        // calculate new distance to neighboring node
        const dist = distFn(neighbor.edge);
        if (dist === this.INF) {
          // essentially disconnected
          continue;
        }
        if (dist < 0) {
          throw new Error(
            `Negative distance ${dist} for edge ${neighbor.edge[0]} -> ${neighbor.edge[1]}`,
          );
        }
        const candidate = distances[node] + dist;
        if (candidate < distances[neighbor.node]) {
          distances[neighbor.node] = candidate;
          previous[neighbor.node] = node;
          nodesPQ.push(new HeapNode(neighbor.node, candidate));
        }
      }
    }

    if (distances[dst] === this.INF) {
      return {
        path: [],
        distance: this.INF,
      };
    }

    return {
      path: this.buildPathTo(dst, previous),
      distance: distances[dst],
    };
  }

  private buildPathTo(node: number, previous: number[]) {
    const path: T[] = [];
    while (node !== -1) {
      path.push(this.nodes[node]);
      node = previous[node]!;
    }
    path.reverse();
    return path;
  }
}
