const API_BASE_URL = "http://localhost:8000/api";

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      (body && typeof body === "object" && (body.message || body.detail)) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, body);
  }

  return body;
}

function post(path, payload) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(payload ?? {}),
  });
}

export function getQuestions({
  subject = "",
  concept = "",
  difficulty = "",
  mode = "",
} = {}) {
  const params = new URLSearchParams({ subject, concept, difficulty, mode });
  return request(`/questions?${params.toString()}`);
}

export function submitAnswerStep(payload) {
  return post("/answers/step", payload);
}

export function submitCode(payload) {
  return post("/submit-code", payload);
}

export function finalizeResults(payload) {
  return post("/results/finalize", payload);
}

export function getProgress(userId) {
  if (!userId) {
    throw new TypeError("userId is required to fetch progress.");
  }
  return request(`/progress/${encodeURIComponent(userId)}`);
}

export function getAdvisor(userId) {
  if (!userId) {
    throw new TypeError("userId is required to fetch advisor recommendations.");
  }
  return request(`/advisor/${encodeURIComponent(userId)}`);
}

export function getLeaderboard(subject = "") {
  const params = new URLSearchParams({ subject });
  return request(`/leaderboard?${params.toString()}`);
}
