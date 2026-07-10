"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "coach-eehuan:session:v1";

export type Role = "client" | "coach";

export interface Session {
  role: Role | null;
  clientId?: string;
}

const emptySession: Session = { role: null };

let cache: Session | null = null;
const listeners = new Set<() => void>();

function persist(s: Session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

function load(): Session {
  if (typeof window === "undefined") return emptySession;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Session;
  } catch {
    // ignore
  }
  return emptySession;
}

function getSnapshot(): Session {
  if (!cache) cache = load();
  return cache;
}

function getServerSnapshot(): Session {
  return emptySession;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function setSession(next: Session) {
  cache = next;
  persist(next);
  listeners.forEach((l) => l());
}

export function setCurrentClient(clientId: string) {
  setSession({ role: "client", clientId });
}

export function setCoach() {
  setSession({ role: "coach" });
}

export function clearSession() {
  setSession(emptySession);
}

export function useSession(): Session {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
