// src/lib/schemaOrg.ts
export function toPostalAddress(addr: any) {
  if (!addr) return null;
  return {
    '@type': 'PostalAddress',
    streetAddress: addr.streetAddress,
    addressLocality: addr.addressLocality,
    addressRegion: addr.addressRegion,
    postalCode: addr.postalCode,
    addressCountry: addr.addressCountry,
  };
}

export function toGeoCoordinates(lat: any, long: any) {
  if (!lat || !long) return null;
  return {
    '@type': 'GeoCoordinates',
    latitude: typeof lat === 'object' ? lat.toNumber() : lat,
    longitude: typeof long === 'object' ? long.toNumber() : long,
  };
}