import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "coach-eehuan:session:v1";

export interface Session {
  clientId: string | null;
}

const emptySession: Session = { clientId: null };

let cache: Session = emptySession;
let hydrated = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function persist(s: Session) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export async function hydrateSession(): Promise<void> {
  if (hydrated) return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as Session) : emptySession;
  } catch {
    cache = emptySession;
  }
  hydrated = true;
  notify();
}

function getSnapshot(): Session {
  return cache;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function setCurrentClient(clientId: string) {
  cache = { clientId };
  persist(cache);
  notify();
}

export function clearSession() {
  cache = emptySession;
  persist(cache);
  notify();
}

export function useSession(): Session {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
