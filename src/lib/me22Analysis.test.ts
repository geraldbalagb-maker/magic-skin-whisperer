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
  it("preserves mild concerns explicitly mapped by ME-22 with profile support", () => {
    expect(concernsFromAnalysis({
      mapped_me22_concerns: ["pelle secca", "colorito spento"],
      mapped_me22_concern_intensities: { "pelle secca": "low", "colorito spento": "low" },
    })).toEqual(["pelle secca", "colorito spento"]);
  });
  it("does not infer wrinkles from moderate fine lines omitted by ME-22", () => {
    expect(concernsFromAnalysis({
      likely_skin_profile: { perceived_age: 40 },
      visible_observations: { fine_lines: "moderate" },
      mapped_me22_concerns: ["pelle secca"],
    })).toEqual(["pelle secca"]);
  });
  it("describes only what the engine observed", () => {
    const text = describeAnalysis(analysis);
    expect(text).toContain("grassa");
    expect(text).toContain("rossori moderati");
    expect(text).not.toContain("macchie");
  });
});
