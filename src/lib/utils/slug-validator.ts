import { RESERVED_SLUGS } from "@/constants/reserved-slugs";

export interface SlugValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateSlug(slug: string): SlugValidationResult {
  if (!slug) {
    return { isValid: false, error: "Slug is required" };
  }

  const normalized = slug.toLowerCase().trim();

  if (normalized.length < 3 || normalized.length > 30) {
    return { isValid: false, error: "Slug must be between 3 and 30 characters" };
  }

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(normalized)) {
    return {
      isValid: false,
      error: "Slug must contain only lowercase letters, numbers, and single hyphens",
    };
  }

  if (RESERVED_SLUGS.includes(normalized as any)) {
    return { isValid: false, error: `"${normalized}" is a reserved URL path` };
  }

  return { isValid: true };
}
