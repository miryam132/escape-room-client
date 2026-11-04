import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { Role } from "../../types/user";
import { AuthContext } from "./authContext";
import RequireRole from "./RequireRole";

function renderAt(role: Role | null, requiredRole?: Role) {
  const user = role && { id: "1", name: "x", email: "x@x.co", role };
  const noop = async () => {};

  render(
    <AuthContext
      value={{
        user,
        isLoading: false,
        login: noop,
        register: noop,
        logout: () => {},
        updateName: noop,
        changePassword: noop,
      }}
    >
      <MemoryRouter initialEntries={["/secret"]}>
        <Routes>
          <Route element={<RequireRole role={requiredRole} />}>
            <Route path="/secret" element={<p>סודי</p>} />
          </Route>
          <Route path="/login" element={<p>דף התחברות</p>} />
          <Route path="/rooms" element={<p>דף חדרים</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext>,
  );
}

describe("RequireRole", () => {
  it("sends guests to login", () => {
    renderAt(null);
    expect(screen.getByText("דף התחברות")).toBeTruthy();
  });

  it("lets any logged-in user through when no role is required", () => {
    renderAt("PLAYER");
    expect(screen.getByText("סודי")).toBeTruthy();
  });

  it("keeps regular users out of admin routes", () => {
    renderAt("PLAYER", "ADMIN");
    expect(screen.getByText("דף חדרים")).toBeTruthy();
  });

  it("lets the admin into admin routes", () => {
    renderAt("ADMIN", "ADMIN");
    expect(screen.getByText("סודי")).toBeTruthy();
  });
});
