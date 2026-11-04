import { ApiError, errorMessage, request, tokenStore } from "./client";

const respond = (status: number, body?: unknown) =>
  vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response(body === undefined ? null : JSON.stringify(body), { status }));

afterEach(() => {
  vi.restoreAllMocks();
  tokenStore.clear();
});

describe("request", () => {
  it("sends the bearer token, JSON body and query string", async () => {
    tokenStore.set("abc");
    const fetchMock = respond(200, { ok: true });

    await request("/rooms", { method: "POST", body: { a: 1 }, query: { page: 2, search: "" } });

    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.pathname).toMatch(/\/rooms$/);
    expect(url.search).toBe("?page=2"); // empty values are skipped
    expect(init.headers).toMatchObject({
      Authorization: "Bearer abc",
      "Content-Type": "application/json",
    });
    expect(init.body).toBe('{"a":1}');
  });

  it("turns server errors into ApiError", async () => {
    respond(409, { error: { code: "PUZZLE_LOCKED", message: "Solve first" } });
    await expect(request("/x")).rejects.toMatchObject({ status: 409, code: "PUZZLE_LOCKED" });
  });

  it("returns undefined for 204", async () => {
    respond(204);
    await expect(request("/x", { method: "DELETE" })).resolves.toBeUndefined();
  });

  it("reports network failures", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("down"));
    await expect(request("/x")).rejects.toMatchObject({ code: "NETWORK_ERROR" });
  });
});

describe("errorMessage", () => {
  it("maps known codes to Hebrew and falls back otherwise", () => {
    expect(errorMessage(new ApiError(409, "PUZZLE_LOCKED", "x"))).toContain("נעולה");
    expect(errorMessage(new ApiError(400, "SOMETHING_NEW", "x"), "ברירת מחדל")).toBe(
      "ברירת מחדל (SOMETHING_NEW)",
    );
    expect(errorMessage(new Error("boom"), "ברירת מחדל")).toBe("ברירת מחדל");
  });
});
