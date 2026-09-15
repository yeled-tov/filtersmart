import { describe, expect, it } from "vitest";
import { recommend, summariseAnswers, type AdvisorAnswers } from "./advisor";

const base: AdvisorAnswers = {
  whoFor: "adult",
  device: "android",
  strictness: "medium",
  mustKeep: [],
  removability: "prefer-locked",
  budget: "open",
  dataState: "can-wipe",
};

const answers = (over: Partial<AdvisorAnswers> = {}): AdvisorAnswers => ({ ...base, ...over });

describe("recommend", () => {
  it("always returns at least one ranked option", () => {
    const result = recommend(answers());
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].match).toBe(99);
  });

  it("returns options sorted by descending score", () => {
    const scores = recommend(answers({ whoFor: "child" })).map((r) => r.score);
    expect([...scores].sort((a, b) => b - a)).toEqual(scores);
  });

  it("puts Hadran first for a child who needs a strict, unremovable filter", () => {
    const [top] = recommend(
      answers({ whoFor: "child", strictness: "strict", removability: "locked" }),
    );
    expect(top.slug).toBe("hadran");
    expect(top.reasons.length).toBeGreaterThan(0);
  });

  it("puts Askan first for a business user who must keep work apps", () => {
    const [top] = recommend(answers({ whoFor: "business", mustKeep: ["work"] }));
    expect(top.slug).toBe("askan");
  });

  it("prefers basic filtering when the ask is light and the budget is tight", () => {
    const [top] = recommend(answers({ strictness: "light", budget: "tight" }));
    expect(top.slug).toBe("basic-filtering");
  });

  it("only offers Qin flashing options for a Qin device", () => {
    const slugs = recommend(answers({ device: "qin" })).map((r) => r.slug);
    expect(slugs).toContain("qin-f21-pro");
    expect(slugs).not.toContain("hadran");
  });

  it("never offers Kosher Play on an iPhone", () => {
    const slugs = recommend(answers({ device: "iphone" })).map((r) => r.slug);
    expect(slugs).not.toContain("kosher-play");
  });

  it("warns about data loss when the visitor needs to keep what is on the phone", () => {
    const hadran = recommend(answers({ dataState: "keep" })).find((r) => r.slug === "hadran");
    expect(hadran?.cautions.join(" ")).toMatch(/גיבוי/);
  });

  it("flags options that break the stated budget", () => {
    const hadran = recommend(answers({ budget: "tight" })).find((r) => r.slug === "hadran");
    expect(hadran?.cautions.join(" ")).toMatch(/מעל התקציב/);
  });

  it("keeps the match score within a sane range", () => {
    for (const rec of recommend(answers({ whoFor: "teen", budget: "tight" }))) {
      expect(rec.match).toBeGreaterThanOrEqual(35);
      expect(rec.match).toBeLessThanOrEqual(99);
    }
  });
});

describe("summariseAnswers", () => {
  it("lists every answer, including an empty must-keep list", () => {
    const text = summariseAnswers(answers());
    expect(text).toContain("למי:");
    expect(text).toContain("אין דרישה מיוחדת");
    expect(text.split("\n")).toHaveLength(7);
  });

  it("joins multiple must-keep choices", () => {
    const text = summariseAnswers(answers({ mustKeep: ["whatsapp", "work"] }));
    expect(text).toContain("וואטסאפ, אפליקציות עבודה ובנק");
  });
});

describe("reason de-duplication", () => {
  it("never repeats the same point twice in one recommendation", () => {
    const results = recommend(
      answers({ whoFor: "child", strictness: "strict", removability: "locked", mustKeep: ["whatsapp"] }),
    );
    for (const rec of results) {
      expect(new Set(rec.reasons).size).toBe(rec.reasons.length);
      // The removability point must appear at most once per card.
      const lockMentions = rec.reasons.filter((r) => r.includes("הסרה") || r.includes("נעול"));
      expect(lockMentions.length).toBeLessThanOrEqual(1);
    }
  });

  it("uses Hadran-specific wording only for Hadran", () => {
    const results = recommend(answers({ removability: "locked" }));
    for (const rec of results) {
      if (rec.slug !== "hadran") {
        expect(rec.reasons.join(" ")).not.toContain("איפוס להגדרות יצרן");
      }
    }
  });
});
