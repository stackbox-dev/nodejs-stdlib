const { sin, cos, atan2, sqrt, PI } = Math;

const PIBy180 = PI / 180;
const _180ByPI = 180 / PI;

export const convToRad = (degrees: number) => degrees * PIBy180;
export const convToDeg = (rads: number) => rads * _180ByPI;
const sq = (num: number) => num * num;

export const R = 6371e3; // Radius of earth in metres

export const validate = (lat: number, lon: number) => {
  if (!Number.isFinite(lat)) {
    return false;
  }
  if (!Number.isFinite(lon)) {
    return false;
  }
  if (lat > 90 || lat < -90) {
    return false;
  }
  if (lon > 180 || lon < -180) {
    return false;
  }
  // pathological case. (0, 0) is water
  if (lon === 0 && lat === 0) {
    return false;
  }
  return true;
};

export const haversine = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  // in degrees
  // convert to radians
  lat1 = convToRad(lat1);
  lon1 = convToRad(lon1);
  lat2 = convToRad(lat2);
  lon2 = convToRad(lon2);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a = sq(sin(dLat / 2)) + cos(lat1) * cos(lat2) * sq(sin(dLon / 2));

  const c = 2 * atan2(sqrt(a), sqrt(1 - a));

  return R * c;
};

export const bearing = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  // convert to radians
  lat1 = convToRad(lat1);
  lon1 = convToRad(lon1);
  lat2 = convToRad(lat2);
  lon2 = convToRad(lon2);

  const dLon = lon2 - lon1;
  let bearing = atan2(
    sin(dLon) * cos(lat2),
    cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(dLon),
  );

  // Normalize the bearing to be in the range [0, 2π]
  bearing = (bearing + 2 * PI) % (2 * PI);

  return bearing;
};

export const normaliseDegs = (degs: number) => (degs + 360) % 360;

export const bearingInDegs = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const rads = bearing(lat1, lon1, lat2, lon2);
  const degs = convToDeg(rads);
  return normaliseDegs(degs);
};
