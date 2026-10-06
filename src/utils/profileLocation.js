export function formatCurrentLocation(currentLocation = {}) {
  return [currentLocation?.city, currentLocation?.state, currentLocation?.country]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");
}
