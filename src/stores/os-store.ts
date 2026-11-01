import { createStore } from "zustand/vanilla";
import { defaultWorkspaceApp, type WorkspaceAppId } from "@/lib/workspace-registry";

export interface OsState {
  openApps: WorkspaceAppId[];
  focusedApp: WorkspaceAppId | null;
  minimizedApps: WorkspaceAppId[];
  launcherOpen: boolean;
  paletteOpen: boolean;
  openApp: (id: WorkspaceAppId) => void;
  focusApp: (id: WorkspaceAppId) => void;
  minimizeApp: (id: WorkspaceAppId) => void;
  closeApp: (id: WorkspaceAppId) => void;
  setLauncherOpen: (open: boolean) => void;
  setPaletteOpen: (open: boolean) => void;
}

function lastVisible(openApps: WorkspaceAppId[], minimizedApps: WorkspaceAppId[]) {
  const visible = openApps.filter((id) => !minimizedApps.includes(id));
  return visible[visible.length - 1] ?? null;
}

/** A new store per workspace avoids shared mutable state during server rendering. */
export function createOsStore(initialApp: WorkspaceAppId = defaultWorkspaceApp) {
  return createStore<OsState>()((set) => ({
    openApps: [initialApp],
    focusedApp: initialApp,
    minimizedApps: [],
    launcherOpen: false,
    paletteOpen: false,
    openApp: (id) => set((state) => ({
      openApps: state.openApps.includes(id) ? state.openApps : [...state.openApps, id],
      minimizedApps: state.minimizedApps.filter((app) => app !== id),
      focusedApp: id,
      launcherOpen: false,
      paletteOpen: false,
    })),
    focusApp: (id) => set((state) => ({
      openApps: state.openApps.includes(id) ? state.openApps : [...state.openApps, id],
      minimizedApps: state.minimizedApps.filter((app) => app !== id),
      focusedApp: id,
    })),
    minimizeApp: (id) => set((state) => {
      if (!state.openApps.includes(id) || state.minimizedApps.includes(id)) return state;
      const minimizedApps = [...state.minimizedApps, id];
      return {
        minimizedApps,
        focusedApp: state.focusedApp === id ? lastVisible(state.openApps, minimizedApps) : state.focusedApp,
      };
    }),
    closeApp: (id) => set((state) => {
      const openApps = state.openApps.filter((app) => app !== id);
      const minimizedApps = state.minimizedApps.filter((app) => app !== id);
      return {
        openApps,
        minimizedApps,
        focusedApp: state.focusedApp === id ? lastVisible(openApps, minimizedApps) : state.focusedApp,
      };
    }),
    setLauncherOpen: (open) => set({ launcherOpen: open, ...(open ? { paletteOpen: false } : {}) }),
    setPaletteOpen: (open) => set({ paletteOpen: open, ...(open ? { launcherOpen: false } : {}) }),
  }));
}

export type OsStore = ReturnType<typeof createOsStore>;
