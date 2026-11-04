import { registerSchema } from "./schemas";

const valid = {
  name: "דנה",
  email: "dana@example.com",
  password: "1234567890",
  confirmPassword: "1234567890",
};

describe("registerSchema", () => {
  it("accepts valid input", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ["short name", { name: "ד" }],
    ["bad email", { email: "not-an-email" }],
    ["short password", { password: "123456789", confirmPassword: "123456789" }],
    ["too long password", { password: "x".repeat(73), confirmPassword: "x".repeat(73) }],
    ["mismatched confirmation", { confirmPassword: "0987654321" }],
  ])("rejects %s", (_label, override) => {
    expect(registerSchema.safeParse({ ...valid, ...override }).success).toBe(false);
  });
});
