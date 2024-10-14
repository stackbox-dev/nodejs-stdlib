import { isThereCycleInDG } from "./detect-cycle";

const t1: [string, string, number][] = [
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    1,
  ],
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "f03626f2-1852-45b8-b6ad-b59bde38b3fd",
    1,
  ],
  [
    "9c550989-3e19-4cf5-ab28-b8e0881e2dac",
    "5c1a9dca-f58a-4f49-9909-576c48ab20c1",
    1,
  ],
  [
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    "322c07a4-06ce-4766-964c-2ccc7d977cbc",
    1,
  ],
];

test("no cycle in dag - t1", () => {
  expect(isThereCycleInDG(t1)).toBe(false);
});

const t2: [string, string, number][] = [
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    2,
  ],
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "f03626f2-1852-45b8-b6ad-b59bde38b3fd",
    2,
  ],
  [
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    "322c07a4-06ce-4766-964c-2ccc7d977cbc",
    2,
  ],
];

test("no cycle in dag - t2", () => {
  expect(isThereCycleInDG(t2)).toBe(false);
});

const t3: [string, string, number][] = [
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    3,
  ],
  [
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    "f03626f2-1852-45b8-b6ad-b59bde38b3fd",
    3,
  ],
  [
    "f03626f2-1852-45b8-b6ad-b59bde38b3fd",
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    3,
  ],
];

test("cycle in dag - t3", () => {
  expect(isThereCycleInDG(t3)).toBe(true);
});

const t4: [string, string, number][] = [
  ["A", "B", 1],
  ["B", "C", 1],
  ["C", "D", 1],
  ["D", "E", 1],
  ["E", "F", 1],
  ["F", "C", 1], // Creates a cycle C -> D -> E -> F -> C
  ["G", "H", 1],
  ["H", "I", 1],
  ["I", "J", 1],
];

test("complex graph with cycle - t4", () => {
  expect(isThereCycleInDG(t4)).toBe(true);
});

const t5: [string, string, number][] = [
  ["A", "B", 1],
  ["B", "C", 1],
  ["C", "D", 1],
  ["D", "E", 1],
  ["E", "F", 1],
  ["G", "H", 1],
  ["H", "I", 1],
  ["I", "J", 1],
  ["J", "K", 1],
  ["K", "L", 1],
  ["L", "M", 1],
  ["M", "N", 1],
  ["N", "O", 1],
  ["O", "P", 1],
];

test("complex graph without cycle - t5", () => {
  expect(isThereCycleInDG(t5)).toBe(false);
});

const t6: [string, string, number][] = [
  ["A", "B", 1],
  ["B", "C", 1],
  ["C", "D", 1],
  ["D", "E", 1],
  ["E", "A", 1], // Creates a large cycle A -> B -> C -> D -> E -> A
  ["F", "G", 1],
  ["G", "H", 1],
  ["H", "I", 1],
  ["I", "F", 1], // Creates another cycle F -> G -> H -> I -> F
  ["J", "K", 1],
  ["K", "L", 1],
  ["L", "M", 1],
];

test("complex graph with multiple cycles - t6", () => {
  expect(isThereCycleInDG(t6)).toBe(true);
});

const t7: [string, string, number][] = [
  ["A", "B", 1],
  ["B", "C", 1],
  ["C", "D", 1],
  ["D", "E", 1],
  ["E", "F", 1],
  ["F", "G", 1],
  ["G", "H", 1],
  ["H", "I", 1],
  ["I", "J", 1],
  ["J", "K", 1],
  ["K", "L", 1],
  ["L", "A", 1], // Creates a very large cycle A -> B -> ... -> L -> A
];

test("graph with one large cycle - t7", () => {
  expect(isThereCycleInDG(t7)).toBe(true);
});

const t8: [string, string, number][] = [
  ["A", "B", 1],
  ["A", "C", 1],
  ["B", "D", 1],
  ["C", "D", 1],
  ["D", "E", 1],
  ["D", "F", 1],
  ["E", "G", 1],
  ["F", "G", 1],
  ["G", "H", 1],
  ["G", "I", 1],
  ["H", "J", 1],
  ["I", "J", 1],
];

test("complex DAG without cycles - t8", () => {
  expect(isThereCycleInDG(t8)).toBe(false);
});
