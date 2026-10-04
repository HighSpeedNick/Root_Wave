import { describe, expect, it } from "vitest";
import { extractDetails, topDetails } from "./details";

describe("extractDetails", () => {
  it("finds time, group and diet across languages", () => {
    expect(extractDetails("Could we join the pickers tomorrow morning with the kids?")).toEqual(["morning", "children"]);
    expect(extractDetails("Un déjeuner végétarien pour un groupe")).toEqual(["group", "vegetarian"]);
    expect(extractDetails("Am Wochenende abends")).toEqual(["evening", "weekend"]);
    expect(extractDetails("Somos 8 personas")).toEqual(["group"]);
    expect(extractDetails("Grazie di tutto")).toEqual([]);
  });
  it("counts each detail once per session", () => {
    const r = topDetails([
      { sessionId: "a", details: ["morning"] },
      { sessionId: "a", details: ["morning"] },
      { sessionId: "b", details: ["morning", "children"] },
    ]);
    expect(r).toEqual([{ detail: "morning", count: 2 }, { detail: "children", count: 1 }]);
  });
});
