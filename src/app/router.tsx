import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loading } from "../components/common/Common";
import NotFound from "../components/common/NotFound";
import RequireRole from "../features/auth/RequireRole";
import { Home } from "../features/home/Home";
import RoomDetailsPage from "../features/rooms/RoomDetailsPage";
import RoomsPage from "../features/rooms/RoomsPage";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage";

// Loaded on demand — keeps the main bundle small.
const PlayPage = lazy(() => import("../features/game/PlayPage"));
const ProfilePage = lazy(() => import("../features/auth/ProfilePage"));
const AdminRooms = lazy(() => import("../features/admin/AdminRooms"));
const AdminUsers = lazy(() => import("../features/admin/AdminUsers"));
const NewRoom = lazy(() => import("../features/admin/NewRoom"));
const EditRoom = lazy(() => import("../features/admin/EditRoom"));

export function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* The server requires a login for everything except the auth endpoints. */}
        <Route element={<RequireRole />}>
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailsPage />} />
          <Route path="/play/:id" element={<PlayPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<RequireRole role="ADMIN" />}>
          <Route path="/admin" element={<Navigate to="/admin/rooms" replace />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/rooms/new" element={<NewRoom />} />
          <Route path="/admin/rooms/:id/edit" element={<EditRoom />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
