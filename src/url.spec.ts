import { join as urlJoin } from "./url";

function assertEqual(actual: string, expected: string) {
  expect(actual).toBe(expected);
}

test("joins a simple URL", () => {
  assertEqual(
    urlJoin("http://www.google.com/", "foo/bar", "?test=123"),
    "http://www.google.com/foo/bar?test=123",
  );
});

test("joins a simple URL with new syntax", () => {
  assertEqual(
    urlJoin(["http://www.google.com/", "foo/bar", "?test=123"]),
    "http://www.google.com/foo/bar?test=123",
  );
});

test("joins a hashbang", () => {
  assertEqual(
    urlJoin(["http://www.google.com", "#!", "foo/bar", "?test=123"]),
    "http://www.google.com/#!/foo/bar?test=123",
  );
});

test("joins a protocol", () => {
  assertEqual(
    urlJoin("http:", "www.google.com/", "foo/bar", "?test=123"),
    "http://www.google.com/foo/bar?test=123",
  );
});

test("joins a protocol with slashes", () => {
  assertEqual(
    urlJoin("http://", "www.google.com/", "foo/bar", "?test=123"),
    "http://www.google.com/foo/bar?test=123",
  );
});

test("removes extra slashes", () => {
  assertEqual(
    urlJoin("http:", "www.google.com///", "foo/bar", "?test=123"),
    "http://www.google.com/foo/bar?test=123",
  );
});

test("removes extra slashes in an encoded URL", () => {
  assertEqual(
    urlJoin("http:", "www.google.com///", "foo/bar", "?url=http%3A//Ftest.com"),
    "http://www.google.com/foo/bar?url=http%3A//Ftest.com",
  );

  assertEqual(
    urlJoin("http://a.com/23d04b3/", "/b/c.html"),
    "http://a.com/23d04b3/b/c.html",
  );

  assertEqual(urlJoin("/foo", "/", "bar", "?test=123"), "/foo/bar?test=123");
});

test("joins anchors in URLs", () => {
  assertEqual(
    urlJoin("http:", "www.google.com///", "foo/bar", "?test=123", "#faaaaa"),
    "http://www.google.com/foo/bar?test=123#faaaaa",
  );
});

test("joins protocol-relative URLs", () => {
  assertEqual(
    urlJoin("//www.google.com", "foo/bar", "?test=123"),
    "//www.google.com/foo/bar?test=123",
  );
});

test("joins file protocol URLs", () => {
  assertEqual(
    urlJoin("file:/", "android_asset", "foo/bar"),
    "file://android_asset/foo/bar",
  );

  assertEqual(
    urlJoin("file:", "/android_asset", "foo/bar"),
    "file://android_asset/foo/bar",
  );
});

test("joins absolute file protocol URLs", () => {
  assertEqual(
    urlJoin("file:", "///android_asset", "foo/bar"),
    "file:///android_asset/foo/bar",
  );

  assertEqual(
    urlJoin("file:///", "android_asset", "foo/bar"),
    "file:///android_asset/foo/bar",
  );

  assertEqual(
    urlJoin("file:///", "//android_asset", "foo/bar"),
    "file:///android_asset/foo/bar",
  );

  assertEqual(
    urlJoin("file:///android_asset", "foo/bar"),
    "file:///android_asset/foo/bar",
  );
});

test("joins multiple query params", () => {
  assertEqual(
    urlJoin("http:", "www.google.com///", "foo/bar", "?test=123", "?key=456"),
    "http://www.google.com/foo/bar?test=123&key=456",
  );

  assertEqual(
    urlJoin(
      "http:",
      "www.google.com///",
      "foo/bar",
      "?test=123",
      "?boom=value",
      "&key=456",
    ),
    "http://www.google.com/foo/bar?test=123&boom=value&key=456",
  );

  assertEqual(
    urlJoin("http://example.org/x", "?a=1", "?b=2", "?c=3", "?d=4"),
    "http://example.org/x?a=1&b=2&c=3&d=4",
  );

  assertEqual(
    urlJoin("http:", "www.google.com///", "foo/bar", "&test=123", "&key=456"),
    "http://www.google.com/foo/bar?test=123&key=456",
  );

  assertEqual(
    urlJoin("http:", "www.google.com///", "foo/bar", "&test=123", "?key=456"),
    "http://www.google.com/foo/bar?test=123&key=456",
  );
});

test("filters out empty query parameters", () => {
  assertEqual(urlJoin("http://google.com", "?"), "http://google.com");

  assertEqual(urlJoin("http://google.com", "&"), "http://google.com");
});

test("joins slashes in paths", () => {
  assertEqual(
    urlJoin("http://example.org", "a//", "b//", "A//", "B//"),
    "http://example.org/a/b/A/B/",
  );
});

test("joins colons in paths", () => {
  assertEqual(
    urlJoin("http://example.org/", ":foo:", "bar"),
    "http://example.org/:foo:/bar",
  );
});

test("joins a simple path without a URL", () => {
  assertEqual(urlJoin("/", "test"), "/test");
});

test("joins a path with a colon", () => {
  assertEqual(
    urlJoin("/users/:userId", "/cars/:carId"),
    "/users/:userId/cars/:carId",
  );
});

test("joins slashes in the protocol", () => {
  assertEqual(urlJoin("http://example.org", "a"), "http://example.org/a");

  assertEqual(urlJoin("http:", "//example.org", "a"), "http://example.org/a");

  assertEqual(urlJoin("http:///example.org", "a"), "http://example.org/a");

  assertEqual(urlJoin("file:///example.org", "a"), "file:///example.org/a");

  assertEqual(urlJoin("file:example.org", "a"), "file://example.org/a");

  assertEqual(urlJoin("file:/", "example.org", "a"), "file://example.org/a");

  assertEqual(urlJoin("file:", "/example.org", "a"), "file://example.org/a");

  assertEqual(urlJoin("file:", "//example.org", "a"), "file://example.org/a");
});

test("skips empty strings", () => {
  assertEqual(
    urlJoin("http://foobar.com", "", "test"),
    "http://foobar.com/test",
  );

  assertEqual(
    urlJoin("", "http://foobar.com", "", "test"),
    "http://foobar.com/test",
  );
});

test("returns an empty string if no arguments are supplied", () => {
  assertEqual(urlJoin(), "");
});

test("does not mutate the original input", () => {
  const input = ["http:", "www.google.com/", "foo/bar", "?test=123"];
  const expected = Array.from(input);

  urlJoin(input);

  expect(input).toStrictEqual(expected);
});

test("does not replace query params after the hash", () => {
  assertEqual(
    urlJoin("http://example.com", "#a?b?c"),
    "http://example.com#a?b?c",
  );
});

test("joins broken up query params", () => {
  assertEqual(
    urlJoin("http://example.com", "/foo/bar?", "test=123"),
    "http://example.com/foo/bar?test=123",
  );
});

test("joins broken up hash", () => {
  assertEqual(
    urlJoin("http://example.com", "/foo/bar#", "some-hash"),
    "http://example.com/foo/bar#some-hash",
  );
});

test("joins leading empty string", () => {
  assertEqual(urlJoin("", "/test"), "/test");
});

test("joins a leading IPv6 hostname", () => {
  assertEqual(
    urlJoin("[2601:195:c381:3560::f42a]/", "/test"),
    "[2601:195:c381:3560::f42a]/test",
  );
});

test("joins a leading IPv6 host with an IPv4 address in the least significant 32 bits", () => {
  assertEqual(
    urlJoin("[2601:195:c381:3560::0.0.244.42]", "/test"),
    "[2601:195:c381:3560::0.0.244.42]/test",
  );
});

test("joins a protocol followed by an IPv6 host", () => {
  assertEqual(
    urlJoin("https://", "[2601:195:c381:3560::f42a]/", "/test"),
    "https://[2601:195:c381:3560::f42a]/test",
  );
});
