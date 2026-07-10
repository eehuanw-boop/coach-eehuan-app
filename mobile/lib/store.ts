import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import { AppData, Client, DailyLog, Feedback } from "./types";
import { buildSeedData } from "./seed";

const STORAGE_KEY = "coach-eehuan:data:v1";
const emptyData: AppData = { clients: [], logs: [], feedback: [] };

let cache: AppData = emptyData;
let hydrated = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function persist(data: AppData) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — in-memory cache still works for this session
  }
}

/** Call once near app boot. Safe to call multiple times. */
export async function hydrateStore(): Promise<void> {
  if (hydrated) return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as AppData) : buildSeedData();
    if (!raw) await persist(cache);
  } catch {
    cache = buildSeedData();
  }
  hydrated = true;
  notify();
}

export function isStoreHydrated(): boolean {
  return hydrated;
}

function getSnapshot(): AppData {
  return cache;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function mutate(updater: (data: AppData) => AppData) {
  cache = updater(cache);
  persist(cache);
  notify();
}

export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function addClient(client: Client) {
  mutate((d) => ({ ...d, clients: [...d.clients, client] }));
}

export function updateClient(clientId: string, patch: Partial<Client>) {
  mutate((d) => ({
    ...d,
    clients: d.clients.map((c) => (c.id === clientId ? { ...c, ...patch } : c)),
  }));
}

export function upsertLog(log: DailyLog) {
  mutate((d) => {
    const idx = d.logs.findIndex((l) => l.clientId === log.clientId && l.date === log.date);
    if (idx === -1) return { ...d, logs: [...d.logs, log] };
    const logs = d.logs.slice();
    logs[idx] = log;
    return { ...d, logs };
  });
}

export function addFeedback(fb: Feedback) {
  mutate((d) => ({ ...d, feedback: [...d.feedback, fb] }));
}

export function getClient(data: AppData, clientId: string): Client | undefined {
  return data.clients.find((c) => c.id === clientId);
}

export function getLog(data: AppData, clientId: string, date: string): DailyLog | undefined {
  return data.logs.find((l) => l.clientId === clientId && l.date === date);
}

export function getLogsForClient(data: AppData, clientId: string): DailyLog[] {
  return data.logs
    .filter((l) => l.clientId === clientId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeedbackForClient(data: AppData, clientId: string): Feedback[] {
  return data.feedback
    .filter((f) => f.clientId === clientId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
