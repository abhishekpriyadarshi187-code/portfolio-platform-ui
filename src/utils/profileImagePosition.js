export const DEFAULT_PROFILE_IMAGE_POSITION = 18;

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

export function normalizeProfileImagePosition(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return clamp(value);
  }

  const normalized = `${value || ""}`.trim().toLowerCase();

  if (!normalized) {
    return DEFAULT_PROFILE_IMAGE_POSITION;
  }

  if (normalized === "top") return 18;
  if (normalized === "center") return 50;
  if (normalized === "bottom") return 82;

  const parsed = Number.parseFloat(normalized.replace("%", ""));
  if (Number.isFinite(parsed)) {
    return clamp(parsed);
  }

  return DEFAULT_PROFILE_IMAGE_POSITION;
}

export function getProfileImageObjectPosition(value) {
  return `center ${normalizeProfileImagePosition(value)}%`;
}
