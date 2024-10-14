import { cacheGetter } from "./cache-getter";

test("cacheGetter should ensure getter is called only first time - primitive", () => {
  let callCount = 0;
  class Sample {
    private readonly data: number[] = [1, 2, 3, 4, 5];

    @cacheGetter
    get sum(): number {
      callCount++;
      return this.data.reduce((acc, curr) => acc + curr, 0);
    }
  }

  let s = new Sample();
  expect(callCount).toBe(0);
  expect(s.sum).toBe(15);
  expect(callCount).toBe(1);
  expect(s.sum).toBe(15);
  expect(callCount).toBe(1);
});

test("cacheGetter should ensure getter is called only first time - object", () => {
  let callCount = 0;
  const obj = {
    a: 1,
    b: "A",
    c: { x: 1 },
  };
  class Sample {
    @cacheGetter
    get obj() {
      callCount++;
      return obj;
    }
  }

  let s = new Sample();
  expect(callCount).toBe(0);
  expect(s.obj).toBe(obj);
  expect(callCount).toBe(1);
  expect(s.obj).toBe(obj);
  expect(callCount).toBe(1);
  expect(s.obj).toBe(obj);
  expect(callCount).toBe(1);
});

test("cacheGetter should work with destructuring", () => {
  let callCount = 0;
  const obj = {
    a: 1,
    b: "A",
    c: { x: 1 },
  };
  class Sample {
    @cacheGetter
    get obj() {
      callCount++;
      return obj;
    }
  }

  let s = new Sample();
  let { obj: obj1 } = s;
  expect(obj1).toStrictEqual(obj);
  let { obj: obj2 } = s;
  expect(obj2).toStrictEqual(obj);
});

test("cacheGetter should work with inheritance", () => {
  let parentCallCount = 0;
  let childCallCount = 0;

  class Parent {
    @cacheGetter
    get parentValue() {
      parentCallCount++;
      return "parent";
    }
  }

  class Child extends Parent {
    @cacheGetter
    get childValue() {
      childCallCount++;
      return "child";
    }
  }

  const child = new Child();
  expect(parentCallCount).toBe(0);
  expect(childCallCount).toBe(0);

  expect(child.parentValue).toBe("parent");
  expect(parentCallCount).toBe(1);
  expect(child.childValue).toBe("child");
  expect(childCallCount).toBe(1);

  expect(child.parentValue).toBe("parent");
  expect(parentCallCount).toBe(1);
  expect(child.childValue).toBe("child");
  expect(childCallCount).toBe(1);
});

test("cacheGetter should work with multiple instances", () => {
  let callCount = 0;

  class MultiInstance {
    private id: number;

    constructor(id: number) {
      this.id = id;
    }

    @cacheGetter
    get value() {
      callCount++;
      return `Instance ${this.id}`;
    }
  }

  const instance1 = new MultiInstance(1);
  const instance2 = new MultiInstance(2);

  expect(callCount).toBe(0);

  expect(instance1.value).toBe("Instance 1");
  expect(callCount).toBe(1);

  expect(instance2.value).toBe("Instance 2");
  expect(callCount).toBe(2);

  expect(instance1.value).toBe("Instance 1");
  expect(callCount).toBe(2);

  expect(instance2.value).toBe("Instance 2");
  expect(callCount).toBe(2);
});

test("cacheGetter should work with getters that use 'this'", () => {
  let callCount = 0;

  class ThisUser {
    private name: string;

    constructor(name: string) {
      this.name = name;
    }

    @cacheGetter
    get greeting() {
      callCount++;
      return `Hello, ${this.name}!`;
    }
  }

  const user = new ThisUser("Alice");
  expect(callCount).toBe(0);

  expect(user.greeting).toBe("Hello, Alice!");
  expect(callCount).toBe(1);

  expect(user.greeting).toBe("Hello, Alice!");
  expect(callCount).toBe(1);
});

test("cacheGetter should not cache errors", () => {
  let callCount = 0;

  class ErrorThrower {
    @cacheGetter
    get problematic() {
      callCount++;
      throw new Error("This is an error");
    }
  }

  const instance = new ErrorThrower();
  expect(callCount).toBe(0);

  expect(() => instance.problematic).toThrow("This is an error");
  expect(callCount).toBe(1);

  expect(() => instance.problematic).toThrow("This is an error");
  expect(callCount).toBe(2);
});
