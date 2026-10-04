import { describe, expect, it } from "vitest";
import { applyExplicitRequestRule, combineRequests, splitRequests } from "./requests";
import type { ClassificationResult } from "./classifier";

describe("splitRequests", () => {
  it("splits several requests in EN/FR/DE", () => {
    expect(splitRequests("I want to see the harvest, how much does the tour cost and how do I get to the bus station?")).toEqual([
      "I want to see the harvest", "how much does the tour cost", "how do I get to the bus station",
    ]);
    expect(splitRequests("Nous voulons voir la récolte. Combien coûte la visite ?")).toEqual(["Nous voulons voir la récolte", "Combien coûte la visite"]);
    expect(splitRequests("Wir möchten die Ernte sehen und wie viel kostet die Tour?")).toEqual(["Wir möchten die Ernte sehen", "wie viel kostet die Tour"]);
  });
  it("keeps a single request whole", () => {
    expect(splitRequests("We would love to see how the coffee is harvested.")).toEqual(["We would love to see how the coffee is harvested"]);
    expect(splitRequests("Can I pay by card for the coffee tasting and the taxi?")).toEqual(["Can I pay by card for the coffee tasting and the taxi"]);
  });
  it("splits parallel requests without repeating the subject", () => {
    expect(splitRequests("I want to see the harvest, know the cost of a tour and ask for directions to the farm.")).toEqual([
      "I want to see the harvest", "know the cost of a tour", "ask for directions to the farm",
    ]);
    expect(splitRequests("Je veux voir la récolte, savoir le prix et demander le chemin vers la ferme.")).toEqual([
      "Je veux voir la récolte", "savoir le prix", "demander le chemin vers la ferme",
    ]);
    expect(splitRequests("Ich möchte die Ernte sehen, den Preis wissen und den Weg zur Farm finden.")).toEqual([
      "Ich möchte die Ernte sehen", "den Preis wissen", "den Weg zur Farm finden",
    ]);
  });
});

const r = (label: ClassificationResult["label"], best: number): ClassificationResult =>
  ({ label, bestCategory: label === "not_sure" ? "other" : label, best, secondCategory: "other", second: 0, scores: {} as never });

describe("combineRequests", () => {
  it("keeps distinct confident categories", () => {
    const c = combineRequests([r("harvest_walk", 0.9), r("prices", 0.88), r("harvest_walk", 0.92), r("not_sure", 0.8)], r("not_sure", 0.8));
    expect(c.labels).toEqual(["harvest_walk", "prices"]);
  });
  it("falls back to the whole message", () => {
    expect(combineRequests([r("not_sure", 0.8)], r("not_sure", 0.8)).labels).toEqual(["not_sure"]);
  });
});

describe("applyExplicitRequestRule", () => {
  it("recovers clear labels from short clauses that the model marks not sure", () => {
    const uncertain = r("not_sure", 0.82);
    expect(applyExplicitRequestRule("I want to see the harvest", uncertain).label).toBe("harvest_walk");
    expect(applyExplicitRequestRule("How to get there", uncertain).label).toBe("transport");
    expect(applyExplicitRequestRule("how much does it cost", uncertain).label).toBe("prices");
  });
});
