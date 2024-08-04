/**
 * Trims leading and trailing whitespace and
 * replaces internal multiple spaces with a single space.
 *
 * @param {string} text
 * @returns {string}
 */

export const trimAndNormalizeSpaces = (text: string) => {
  const normalizedText = text.trim().replace(/\s+/g, ' ');

  return normalizedText;
};
