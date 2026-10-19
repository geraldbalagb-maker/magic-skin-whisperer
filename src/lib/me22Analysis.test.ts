import { describe, expect, it } from "vitest";
import { concernsFromAnalysis, describeAnalysis } from "./me22Analysis";

const analysis = { likely_skin_profile: { skin_type_hypothesis: "oily" }, visible_observations: { redness: "moderate", pores_visibility: "high", spots: "none" }, mapped_me22_concerns: ["acne", "pori dilatati", "inventato"] };

describe("ME-22 photo analysis pre-fill", () => {
  it("pre-selects only engine-mapped concerns from the supported list", () => {
    expect(concernsFromAnalysis(analysis)).toEqual(["acne", "pori dilatati"]);
  });
  it("leaves fields empty when the analysis is missing", () => {
    expect(concernsFromAnalysis(null)).toEqual([]);
    expect(describeAnalysis(null)).toBe("");
  });
  it("describes only what the engine observed", () => {
    const text = describeAnalysis(analysis);
    expect(text).toContain("grassa");
    expect(text).toContain("rossori moderati");
    expect(text).not.toContain("macchie");
  });
});
