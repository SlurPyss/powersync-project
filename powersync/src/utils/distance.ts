/**
 * Menghitung jarak garis lurus antara dua titik koordinat menggunakan rumus Haversine.
 * @param lat1 Latitude titik awal
 * @param lon1 Longitude titik awal
 * @param lat2 Latitude titik tujuan
 * @param lon2 Longitude titik tujuan
 * @returns Jarak dalam kilometer (km)
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // radius bumi dalam kilometer
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}
