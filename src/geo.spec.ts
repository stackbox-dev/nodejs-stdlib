import { haversine, bearing } from "./geo";

test("haversine", () => {
  const lat1 = 17.408992;
  const lon1 = 78.490229;
  const lat2 = 17.41583;
  const lon2 = 78.498372;
  expect(haversine(lat1, lon1, lat2, lon2)).toBe(1150.9015135733925);
});

test("bearing", () => {
  expect((bearing(52.205, 0.119, 48.857, 2.351) * 180) / Math.PI).toBe(
    156.16658258153174,
  );
});
