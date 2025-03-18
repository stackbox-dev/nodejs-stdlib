import { Item, Size, firstFitDecreasing } from "./binpack";

describe("firstFitDecreasing", () => {
  it("should pack items into bins correctly", () => {
    const capacity = new Size([10]);
    const items: Item<string>[] = [
      { obj: "item1", size: new Size([4]) },
      { obj: "item2", size: new Size([3]) },
      { obj: "item3", size: new Size([2]) },
      { obj: "item4", size: new Size([1]) },
    ];

    const bins = firstFitDecreasing(capacity, items);

    expect(bins.length).toBe(1);
    expect(bins[0].items.length).toBe(4);
  });

  it("should create new bin if item does not fit in existing bins", () => {
    const capacity = new Size([5]);
    const items: Item<string>[] = [
      { obj: "item1", size: new Size([4]) },
      { obj: "item2", size: new Size([3]) },
      { obj: "item3", size: new Size([2]) },
      { obj: "item4", size: new Size([1]) },
    ];

    const bins = firstFitDecreasing(capacity, items);

    expect(bins.length).toBe(2);
    expect(bins[0].items.length).toBe(2);
    expect(bins[1].items.length).toBe(2);
  });

  it("should handle empty items list", () => {
    const capacity = new Size([10]);
    const items: Item<string>[] = [];

    const bins = firstFitDecreasing(capacity, items);

    expect(bins.length).toBe(0);
  });

  it("should handle items larger than capacity", () => {
    const capacity = new Size([5]);
    const items: Item<string>[] = [{ obj: "item1", size: new Size([6]) }];

    const bins = firstFitDecreasing(capacity, items);

    expect(bins.length).toBe(0);
  });

  it("should pack items with multiple dimensions correctly", () => {
    const capacity = new Size([10, 10]);
    const items: Item<string>[] = [
      { obj: "item1", size: new Size([4, 4]) },
      { obj: "item2", size: new Size([3, 3]) },
      { obj: "item3", size: new Size([2, 2]) },
      { obj: "item4", size: new Size([1, 1]) },
    ];

    const bins = firstFitDecreasing(capacity, items);

    expect(bins.length).toBe(1);
    expect(bins[0].items.length).toBe(4);
  });
});
