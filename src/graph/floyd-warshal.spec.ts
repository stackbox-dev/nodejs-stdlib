import { buildDAGTransitiveClosure } from "./floyd-warshal";

const t1: [string, string][] = [
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
  ],
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "f03626f2-1852-45b8-b6ad-b59bde38b3fd",
  ],
  [
    "9c550989-3e19-4cf5-ab28-b8e0881e2dac",
    "5c1a9dca-f58a-4f49-9909-576c48ab20c1",
  ],
  [
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    "322c07a4-06ce-4766-964c-2ccc7d977cbc",
  ],
];

test("success topo - t1", () => {
  expect(buildDAGTransitiveClosure(t1)).toMatchSnapshot();
});

const t2: [string, string][] = [
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
  ],
  [
    "5ab489c9-824c-4f2b-a021-54dedd2db6bd",
    "f03626f2-1852-45b8-b6ad-b59bde38b3fd",
  ],
  [
    "57fea751-6c21-4eb1-9262-ea97ff45553c",
    "322c07a4-06ce-4766-964c-2ccc7d977cbc",
  ],
];

test("success topo - t2", () => {
  expect(buildDAGTransitiveClosure(t2)).toMatchSnapshot();
});
