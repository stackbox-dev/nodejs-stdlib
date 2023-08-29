export class Size {
  private readonly dims: number[];

  constructor(dims: number[]) {
    this.dims = [...dims];
  }

  get(dim: number): number {
    return this.dims[dim] ?? 0;
  }

  add(that: Size): Size {
    const newSize = new Size(this.dims);
    for (let i = 0; i < this.dims.length; i++) {
      newSize.dims[i] += that.get(i);
    }
    return newSize;
  }

  compare(that: Size): number {
    for (let i = 0; i < this.dims.length; i++) {
      const t1 = this.get(i);
      const t2 = that.get(i);
      if (t1 < t2) {
        return -1;
      }
      if (t1 > t2) {
        return 1;
      }
    }
    return 0;
  }

  canContain(that: Size): boolean {
    for (let i = 0; i < this.dims.length; i++) {
      const t1 = this.get(i);
      const t2 = that.get(i);
      if (t2 > t1) {
        return false;
      }
    }
    return true;
  }
}

export type Item<T> = {
  obj: T;
  size: Size;
};

export function firstFitDecreasing<T>(capacity: Size, items: Item<T>[]) {
  // sort in decreasing order of required capacity
  const sorted = [...items].sort((a, b) => -a.size.compare(b.size));

  const bins: { items: Item<T>[]; used: Size }[] = [];

  for (const item of sorted) {
    let fit = false;
    for (const bin of bins) {
      // search for first bin which can fit
      if (capacity.canContain(bin.used.add(item.size))) {
        // assign to bin
        bin.items.push(item);
        bin.used = bin.used.add(item.size);
        fit = true;
        break;
      }
    }
    // if no existing bins can fit the item
    // create a new bin
    if (!fit && capacity.canContain(item.size)) {
      bins.push({
        items: [item],
        used: item.size,
      });
    }
  }

  return bins;
}
