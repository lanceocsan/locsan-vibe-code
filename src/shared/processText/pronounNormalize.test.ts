import { describe, expect, test } from "vitest";
import {
  normalizeEnglishThirdPersonSingularToThey,
  containsResidualGenderedPronounsEnglish,
} from "../processText/pronounNormalize.js";

describe("pronounNeutralizer", () => {
  test("swaps masculine third-person determiners", () => {
    const { text: normalizedSample } =
      normalizeEnglishThirdPersonSingularToThey(
        "He solved the blocker and shipped his prototype.",
      );
    expect(normalizedSample).toContain("They");
    expect(normalizedSample).toContain("their");
    expect(normalizedSample).not.toContain("his");
  });

  test("scanner flags residual masculine tokens post-pass", () => {
    expect(containsResidualGenderedPronounsEnglish("still he wrote")).toBe(true);
    expect(
      containsResidualGenderedPronounsEnglish("they authored the changelog"),
    ).toBe(false);
  });
});
