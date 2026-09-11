export interface ApiUser {
  id: string;
  email: string;
  role: "PATIENT" | "PRACTITIONER" | "ADMIN";
  practitionerId: string | null;
}

interface AuthPayload { user: ApiUser; accessToken: string }
interface ApiEnvelope<T> { data: T }

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api";
let accessToken: string | null = null;

async function requestJson<T>(path: string, init: RequestInit = {}, allowRefresh = true): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers, credentials: "include" });
  if (response.status === 401 && allowRefresh && path !== "/auth/refresh") {
    const refreshed = await refreshSession();
    if (refreshed) return requestJson<T>(path, init, false);
  }
  if (!response.ok) throw new Error(`API request failed with status ${response.status}.`);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function acceptAuth(payload: ApiEnvelope<AuthPayload>): ApiUser {
  accessToken = payload.data.accessToken;
  return payload.data.user;
}

export async function loginWithPassword(email: string, password: string): Promise<ApiUser> {
  return acceptAuth(await requestJson<ApiEnvelope<AuthPayload>>("/auth/login", {
    method: "POST", body: JSON.stringify({ email: email.trim(), password }),
  }, false));
}

export async function registerPatient(email: string, password: string): Promise<ApiUser> {
  return acceptAuth(await requestJson<ApiEnvelope<AuthPayload>>("/auth/register", {
    method: "POST", body: JSON.stringify({ email: email.trim(), password, role: "PATIENT" }),
  }, false));
}

export async function refreshSession(): Promise<ApiUser | null> {
  try {
    return acceptAuth(await requestJson<ApiEnvelope<AuthPayload>>("/auth/refresh", { method: "POST" }, false));
  } catch {
    accessToken = null;
    return null;
  }
}

export async function logoutSession(): Promise<void> {
  try {
    await requestJson<void>("/auth/logout", { method: "POST" }, false);
  } finally {
    accessToken = null;
  }
}

export async function createAppointment(input: {
  patientId: string; practitionerId: string; startAt: string; endAt: string; reason?: string;
}) {
  return requestJson("/appointments", { method: "POST", body: JSON.stringify(input) });
}
