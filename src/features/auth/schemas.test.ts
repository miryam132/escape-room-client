import { describe, expect, it } from "vitest";
import { registerSchema } from "./schemas";

const valid = {
  name: "דנה",
  email: "dana@example.com",
  password: "12345678",
  confirmPassword: "12345678",
};

describe("registerSchema", () => {
  it("accepts valid input", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ["short name", { name: "ד" }],
    ["bad email", { email: "not-an-email" }],
    ["short password", { password: "1234567", confirmPassword: "1234567" }],
    ["password with spaces", { password: "1234 5678", confirmPassword: "1234 5678" }],
    ["mismatched confirmation", { confirmPassword: "87654321" }],
  ])("rejects %s", (_label, override) => {
    expect(registerSchema.safeParse({ ...valid, ...override }).success).toBe(false);
  });
});
