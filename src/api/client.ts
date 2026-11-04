const BASE_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const TOKEN_KEY = "mysteria:token";

// The token lives in sessionStorage so a refresh keeps you logged in (see FRONTEND-API-GUIDE).
export const tokenStore = {
  get: () => {
    try {
      return sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string) => {
    try {
      sessionStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage unavailable: the user just has to log in again after a refresh */
    }
  },
  clear: () => {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

let unauthorizedHandler: (() => void) | null = null;
export const onUnauthorized = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

export class ApiError extends Error {
  status: number;
  code: string;
  details: { path: string; message: string }[];

  constructor(status: number, code: string, message: string, details: ApiError["details"] = []) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  form?: FormData;
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, form } = options;

  const url = new URL(BASE_URL + path, window.location.origin);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const token = tokenStore.get();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      // For FormData the browser sets Content-Type (with the multipart boundary) itself.
      body: form ?? (body === undefined ? undefined : JSON.stringify(body)),
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Cannot reach the server");
  }

  if (response.status === 401 && token) {
    tokenStore.clear();
    unauthorizedHandler?.();
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      data?.error?.code ?? "UNKNOWN",
      data?.error?.message ?? response.statusText,
      data?.error?.details,
    );
  }

  return response.status === 204 ? (undefined as T) : response.json();
}

const MESSAGES: Record<string, string> = {
  NETWORK_ERROR: "אין חיבור לשרת. נסה שוב מאוחר יותר.",
  VALIDATION_ERROR: "הנתונים שהוזנו אינם תקינים.",
  INVALID_CREDENTIALS: "אימייל או סיסמה שגויים.",
  EMAIL_TAKEN: "כתובת האימייל כבר רשומה.",
  EMAIL_EXISTS: "כתובת האימייל כבר רשומה.",
  FORBIDDEN: "אין לך הרשאה לפעולה הזו.",
  PUZZLE_LOCKED: "החידה עדיין נעולה.",
  ROOM_CHANGED: "החדר עודכן. נטען מחדש.",
  GAME_NOT_STARTED: "המשחק עדיין לא התחיל.",
  HAS_DEPENDENTS: "חידות אחרות תלויות בנקודה הזו. הסר קודם את התלויות.",
  CYCLIC_DEPENDENCY: "תלויות בין נקודות לא יכולות ליצור מעגל.",
  WRONG_PASSWORD: "הסיסמה הנוכחית שגויה.",
  CANNOT_DELETE_ADMIN: "אי אפשר למחוק את המנהל.",
  CONFLICT: "הפריט כבר קיים (למשל תמונה שכבר משמשת חדר אחר).",
  RATE_LIMITED: "יותר מדי בקשות. נסה שוב מאוחר יותר.",
};

/** A Hebrew message for the user, based on the server error code. */
export function errorMessage(error: unknown, fallback = "אירעה שגיאה. נסה שוב.") {
  if (!(error instanceof ApiError)) return fallback;
  if (error.status === 401 && error.code !== "INVALID_CREDENTIALS")
    return "ההתחברות פגה. התחבר מחדש.";
  if (error.status === 413) return "התמונה גדולה מדי (עד 5MB).";
  if (error.status === 429) return MESSAGES.RATE_LIMITED;
  if (error.status >= 500) return "תקלה בשרת. נסה שוב מאוחר יותר.";
  // Unknown codes: keep the Hebrew fallback but show the server code to make problems easy to report.
  return MESSAGES[error.code] ?? `${fallback} (${error.code})`;
}
