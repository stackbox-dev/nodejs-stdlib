import {
  R,
  bearing,
  bearingInDegs,
  convToDeg,
  convToRad,
  haversine,
  normaliseDegs,
  validate,
} from "./geo";

describe("Geo functions", () => {
  describe("convToRad", () => {
    it("should convert degrees to radians", () => {
      expect(convToRad(180)).toBeCloseTo(Math.PI, 5);
      expect(convToRad(90)).toBeCloseTo(Math.PI / 2, 5);
      expect(convToRad(0)).toBeCloseTo(0, 5);
    });
  });

  describe("convToDeg", () => {
    it("should convert radians to degrees", () => {
      expect(convToDeg(Math.PI)).toBeCloseTo(180, 5);
      expect(convToDeg(Math.PI / 2)).toBeCloseTo(90, 5);
      expect(convToDeg(0)).toBeCloseTo(0, 5);
    });
  });

  describe("R", () => {
    it("should be the radius of the Earth in meters", () => {
      expect(R).toBe(6371000);
    });
  });

  describe("validate", () => {
    it("should return true for valid coordinates", () => {
      expect(validate(0, 1)).toBe(true);
      expect(validate(90, 180)).toBe(true);
      expect(validate(-90, -180)).toBe(true);
    });

    it("should return false for invalid coordinates", () => {
      expect(validate(91, 0)).toBe(false);
      expect(validate(-91, 0)).toBe(false);
      expect(validate(0, 181)).toBe(false);
      expect(validate(0, -181)).toBe(false);
      expect(validate(0, 0)).toBe(false);
      expect(validate(NaN, 0)).toBe(false);
      expect(validate(0, NaN)).toBe(false);
      expect(validate(Infinity, 0)).toBe(false);
      expect(validate(0, Infinity)).toBe(false);
    });
  });

  describe("haversine", () => {
    it("should calculate the distance between two points", () => {
      // New York City to Los Angeles
      const distance = haversine(40.7128, -74.006, 34.0522, -118.2437);
      expect(distance).toBeCloseTo(3935746.25, 0); // Approximately 3935.7 km
    });

    it("should return 0 for the same point", () => {
      expect(haversine(0, 0, 0, 0)).toBeCloseTo(0, 5);
    });
  });

  describe("bearing", () => {
    it("should calculate the bearing between two points in radians", () => {
      // New York City to Los Angeles
      const bearingRad = bearing(40.7128, -74.006, 34.0522, -118.2437);
      expect(bearingRad).toBeCloseTo(4.776, 2);
    });
  });

  describe("normaliseDegs", () => {
    it("should normalize degrees to 0-360 range", () => {
      expect(normaliseDegs(0)).toBe(0);
      expect(normaliseDegs(360)).toBe(0);
      expect(normaliseDegs(720)).toBe(0);
      expect(normaliseDegs(-90)).toBe(270);
      expect(normaliseDegs(450)).toBe(90);
    });
  });

  describe("bearingInDegs", () => {
    it("should calculate the bearing between two points in degrees", () => {
      // New York City to Los Angeles
      const bearingDeg = bearingInDegs(40.7128, -74.006, 34.0522, -118.2437);
      expect(bearingDeg).toBeCloseTo(273.68, 1);
    });

    it("should return a value between 0 and 360", () => {
      const bearingDeg = bearingInDegs(0, 0, 0, 180);
      expect(bearingDeg).toBeGreaterThanOrEqual(0);
      expect(bearingDeg).toBeLessThan(360);
    });
  });
});
