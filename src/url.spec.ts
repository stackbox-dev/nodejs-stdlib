import { join as urljoin } from "./url";

describe("url join", function () {
  it("should work for simple case", function () {
    expect(urljoin("http://www.google.com/", "foo/bar", "?test=123")).toBe(
      "http://www.google.com/foo/bar?test=123",
    );
  });

  it("should work for simple case with new syntax", function () {
    expect(urljoin(["http://www.google.com/", "foo/bar", "?test=123"])).toBe(
      "http://www.google.com/foo/bar?test=123",
    );
  });

  it("should work for hashbang urls", function () {
    expect(
      urljoin(["http://www.google.com", "#!", "foo/bar", "?test=123"]),
    ).toBe("http://www.google.com/#!/foo/bar?test=123");
  });

  it("should be able to join protocol", function () {
    expect(urljoin("http:", "www.google.com/", "foo/bar", "?test=123")).toBe(
      "http://www.google.com/foo/bar?test=123",
    );
  });

  it("should be able to join protocol with slashes", function () {
    expect(urljoin("http://", "www.google.com/", "foo/bar", "?test=123")).toBe(
      "http://www.google.com/foo/bar?test=123",
    );
  });

  it("should remove extra slashes", function () {
    expect(urljoin("http:", "www.google.com///", "foo/bar", "?test=123")).toBe(
      "http://www.google.com/foo/bar?test=123",
    );
  });

  it("should not remove extra slashes in an encoded URL", function () {
    expect(
      urljoin(
        "http:",
        "www.google.com///",
        "foo/bar",
        "?url=http%3A//Ftest.com",
      ),
    ).toBe("http://www.google.com/foo/bar?url=http%3A//Ftest.com");

    expect(urljoin("http://a.com/23d04b3/", "/b/c.html")).toBe(
      "http://a.com/23d04b3/b/c.html",
    );
  });

  it("should support anchors in urls", function () {
    expect(
      urljoin("http:", "www.google.com///", "foo/bar", "?test=123", "#faaaaa"),
    ).toBe("http://www.google.com/foo/bar?test=123#faaaaa");
  });

  it("should support protocol-relative urls", function () {
    expect(urljoin("//www.google.com", "foo/bar", "?test=123")).toBe(
      "//www.google.com/foo/bar?test=123",
    );
  });

  it("should support file protocol urls", function () {
    expect(urljoin("file:/", "android_asset", "foo/bar")).toBe(
      "file://android_asset/foo/bar",
    );

    expect(urljoin("file:", "/android_asset", "foo/bar")).toBe(
      "file://android_asset/foo/bar",
    );
  });

  it("should support absolute file protocol urls", function () {
    expect(urljoin("file:", "///android_asset", "foo/bar")).toBe(
      "file:///android_asset/foo/bar",
    );

    expect(urljoin("file:///", "android_asset", "foo/bar")).toBe(
      "file:///android_asset/foo/bar",
    );

    expect(urljoin("file:///", "//android_asset", "foo/bar")).toBe(
      "file:///android_asset/foo/bar",
    );

    expect(urljoin("file:///android_asset", "foo/bar")).toBe(
      "file:///android_asset/foo/bar",
    );
  });

  it("should merge multiple query params properly", function () {
    expect(
      urljoin("http:", "www.google.com///", "foo/bar", "?test=123", "?key=456"),
    ).toBe("http://www.google.com/foo/bar?test=123&key=456");

    expect(
      urljoin(
        "http:",
        "www.google.com///",
        "foo/bar",
        "?test=123",
        "?boom=value",
        "&key=456",
      ),
    ).toBe("http://www.google.com/foo/bar?test=123&boom=value&key=456");

    expect(
      urljoin("http://example.org/x", "?a=1", "?b=2", "?c=3", "?d=4"),
    ).toBe("http://example.org/x?a=1&b=2&c=3&d=4");
  });

  it("should merge slashes in paths correctly", function () {
    expect(urljoin("http://example.org", "a//", "b//", "A//", "B//")).toBe(
      "http://example.org/a/b/A/B/",
    );
  });

  it("should merge colons in paths correctly", function () {
    expect(urljoin("http://example.org/", ":foo:", "bar")).toBe(
      "http://example.org/:foo:/bar",
    );
  });

  it("should merge just a simple path without URL correctly", function () {
    expect(urljoin("/", "test")).toBe("/test");
  });

  it("should merge a path with colon properly", function () {
    expect(urljoin("/users/:userId", "/cars/:carId")).toBe(
      "/users/:userId/cars/:carId",
    );
  });

  it("should merge slashes in protocol correctly", function () {
    expect(urljoin("http://example.org", "a")).toBe("http://example.org/a");
    expect(urljoin("http:", "//example.org", "a")).toBe("http://example.org/a");
    expect(urljoin("http:///example.org", "a")).toBe("http://example.org/a");
    expect(urljoin("file:///example.org", "a")).toBe("file:///example.org/a");

    expect(urljoin("file:example.org", "a")).toBe("file://example.org/a");

    expect(urljoin("file:/", "example.org", "a")).toBe("file://example.org/a");
    expect(urljoin("file:", "/example.org", "a")).toBe("file://example.org/a");
    expect(urljoin("file:", "//example.org", "a")).toBe("file://example.org/a");
  });

  it("should skip empty strings", function () {
    expect(urljoin("http://foobar.com", "", "test")).toBe(
      "http://foobar.com/test",
    );
    expect(urljoin("", "http://foobar.com", "", "test")).toBe(
      "http://foobar.com/test",
    );
  });

  it("should return an empty string if no arguments are supplied", function () {
    expect(urljoin()).toBe("");
  });
});
