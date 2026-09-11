import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("AI Support Triage Agent")).toBe("ai-support-triage-agent");
  });

  it("strips punctuation", () => {
    expect(slugify("n8n & Claude API: A Love Story!")).toBe("n8n-claude-api-a-love-story");
  });

  it("collapses repeated separators", () => {
    expect(slugify("too   many---spaces")).toBe("too-many-spaces");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  -Leading and trailing-  ")).toBe("leading-and-trailing");
  });
});
