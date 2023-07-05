import { isThereCycleInDG } from "./detect-cycle";

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

test("no cycle in dag - t1", () => {
  expect(isThereCycleInDG(t1)).toBe(false);
});

const t2: [string, string, number][] = [
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    2
  ],
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "f03626f2-1852-45b8-b6ad-b59bde38b3fd",
    2
  ],
  [
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    "322c07a4-06ce-4766-964c-2ccc7d977cbc",
    2
  ],
];

test("no cycle in dag - t2", () => {
  expect(isThereCycleInDG(t2)).toBe(false);
});

const t3: [string, string, number][] = [
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    3
  ],
  [
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    "f03626f2-1852-45b8-b6ad-b59bde38b3fd",
    3
  ],
  [
    "f03626f2-1852-45b8-b6ad-b59bde38b3fd",
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    3
  ],
];

test("cycle in dag - t3", () => {
  expect(isThereCycleInDG(t3)).toBe(true);
});
