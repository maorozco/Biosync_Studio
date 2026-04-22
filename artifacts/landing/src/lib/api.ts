// Thin API client with mock mode. When VITE_API_URL is unset, all calls
// short-circuit with simulated responses so UI/flow can be tested without
// a backend. Do NOT rely on these mocks in production — the api-server
// project owns the real endpoints.

import type { ScoringInput, ScoringResult } from "./scoring";
import { computeScore } from "./scoring";

const API_URL: string = import.meta.env.VITE_API_URL ?? "";
const COUNTER_BASELINE = Number(
  import.meta.env.VITE_COUNTER_BASELINE ?? 25,
);

export const isMockMode: boolean = !API_URL || API_URL.trim() === "";

export interface WaitlistSignup {
  email: string;
  lang: "es" | "en";
}

export interface WaitlistSignupResponse {
  ok: boolean;
  alreadyExists?: boolean;
  count: number;
}

export async function signupToWaitlist(
  payload: WaitlistSignup,
): Promise<WaitlistSignupResponse> {
  if (isMockMode) {
    await fakeDelay();
    const persisted = readMockList();
    if (!persisted.includes(payload.email)) {
      persisted.push(payload.email);
      writeMockList(persisted);
    }
    return { ok: true, count: Math.max(persisted.length, COUNTER_BASELINE) };
  }
  const res = await fetch(`${API_URL}/waitlist`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`waitlist signup failed: ${res.status}`);
  return (await res.json()) as WaitlistSignupResponse;
}

export interface WaitlistResponsePayload extends ScoringInput {
  email: string;
  lang: "es" | "en";
}

export interface WaitlistResponseResult extends ScoringResult {
  ok: boolean;
}

export async function submitWaitlistResponses(
  payload: WaitlistResponsePayload,
): Promise<WaitlistResponseResult> {
  if (isMockMode) {
    await fakeDelay();
    const scoring = computeScore(payload);
    return { ok: true, ...scoring };
  }
  const res = await fetch(`${API_URL}/waitlist-responses`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`waitlist responses failed: ${res.status}`);
  return (await res.json()) as WaitlistResponseResult;
}

export async function fetchWaitlistCount(): Promise<number> {
  if (isMockMode) {
    const persisted = readMockList();
    return Math.max(persisted.length, COUNTER_BASELINE);
  }
  try {
    const res = await fetch(`${API_URL}/waitlist/count`);
    if (!res.ok) return COUNTER_BASELINE;
    const data = (await res.json()) as { count: number };
    return Math.max(data.count, COUNTER_BASELINE);
  } catch {
    return COUNTER_BASELINE;
  }
}

// ------------------------------------------------------------------
// Mock persistence — localStorage so refresh keeps the demo counter.
// ------------------------------------------------------------------

const MOCK_KEY = "biosync_landing_mock_waitlist_v1";

function readMockList(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MOCK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function writeMockList(list: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MOCK_KEY, JSON.stringify(list));
  } catch {
    // storage full/disabled — silently ignore in mock mode
  }
}

async function fakeDelay() {
  await new Promise<void>((r) => setTimeout(r, 260));
}
