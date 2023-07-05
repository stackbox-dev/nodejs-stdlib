import { unique } from "../lang";
import { topoSort } from "./topo-sort";

const t1: [string, string, number][] = [
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    1
  ],
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "f03626f2-1852-45b8-b6ad-b59bde38b3fd",
    1
  ],
  [
    "9c550989-3e19-4cf5-ab28-b8e0881e2dac",
    "5c1a9dca-f58a-4f49-9909-576c48ab20c1",
    1
  ],
  [
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    "322c07a4-06ce-4766-964c-2ccc7d977cbc",
    1
  ],
];

test("success topo - t1", () => {
  expect(topoSort(unique(t1.flatMap((x) => x.slice(0, 2))), t1)).toStrictEqual([
    "9c550989-3e19-4cf5-ab28-b8e0881e2dac",
    "5c1a9dca-f58a-4f49-9909-576c48ab20c1",
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "f03626f2-1852-45b8-b6ad-b59bde38b3fd",
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    "322c07a4-06ce-4766-964c-2ccc7d977cbc",
  ]);
});

const t2: [string, string, number][] = [
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    1
  ],
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "f03626f2-1852-45b8-b6ad-b59bde38b3fd",
    1
  ],
  [
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    "322c07a4-06ce-4766-964c-2ccc7d977cbc",
    1
  ],
];

test("success topo - t2", () => {
  expect(topoSort(unique(t2.flatMap((x) => x.slice(0, 2))), t2)).toStrictEqual([
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "f03626f2-1852-45b8-b6ad-b59bde38b3fd",
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    "322c07a4-06ce-4766-964c-2ccc7d977cbc",
  ]);
});

const t3: [string, string, number][] = [
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    1
  ],
  [
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    "f03626f2-1852-45b8-b6ad-b59bde38b3fd",
    1
  ],
  [
    "f03626f2-1852-45b8-b6ad-b59bde38b3fd",
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    1
  ],
];

test("cycle in dag - t3", () => {
  expect(() => topoSort(unique(t3.flatMap((x) => x)), t3)).toThrow();
});
