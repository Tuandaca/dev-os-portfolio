"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createOsStore, type OsState, type OsStore } from "./os-store";
import type { WorkspaceAppId } from "@/lib/workspace-registry";

const OsStoreContext = createContext<OsStore | null>(null);

export function OsStoreProvider({ initialApp, children }: { initialApp: WorkspaceAppId; children: ReactNode }) {
  const [store] = useState(() => createOsStore(initialApp));
  return <OsStoreContext.Provider value={store}>{children}</OsStoreContext.Provider>;
}

export function useOsStore<T>(selector: (state: OsState) => T): T {
  const store = useContext(OsStoreContext);
  if (!store) throw new Error("useOsStore must be used within OsStoreProvider");
  return useStore(store, selector);
}
