import { describe, expect, it } from "vitest";
import { createOsStore } from "./os-store";

describe("workspace window state", () => {
  it("opens once, focuses, minimizes, restores, and closes an app", () => {
    const store = createOsStore("about");
    store.getState().openApp("projects");
    store.getState().openApp("projects");
    expect(store.getState().openApps).toEqual(["about", "projects"]);
    expect(store.getState().focusedApp).toBe("projects");

    store.getState().minimizeApp("projects");
    expect(store.getState().focusedApp).toBe("about");
    expect(store.getState().minimizedApps).toEqual(["projects"]);

    store.getState().focusApp("projects");
    expect(store.getState().minimizedApps).toEqual([]);
    store.getState().closeApp("projects");
    expect(store.getState().openApps).toEqual(["about"]);
    expect(store.getState().focusedApp).toBe("about");
  });

  it("keeps separate workspace instances independent", () => {
    const first = createOsStore();
    const second = createOsStore();
    first.getState().openApp("terminal");
    expect(second.getState().openApps).toEqual(["about"]);
  });
});
