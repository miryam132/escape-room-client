import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../features/home/Home";
import RoomDetailsPage from "../features/rooms/RoomDetailsPage";
import RoomsPage from "../features/rooms/RoomsPage";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import PlayPage from "../features/game/PlayPage";
import AdminRooms from "../features/admin/AdminRooms";
import NewRoom from "../features/admin/NewRoom";
import EditRoom from "../features/admin/EditRoom";
import NotFound from "../components/common/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rooms" element={<RoomsPage />} />
      <Route path="/rooms/:id" element={<RoomDetailsPage />} />
      <Route path="/play/:id" element={<PlayPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<Navigate to="/admin/rooms" replace />} />
      <Route path="/admin/rooms" element={<AdminRooms />} />
      <Route path="/admin/rooms/new" element={<NewRoom />} />
      <Route path="/admin/rooms/:id/edit" element={<EditRoom />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
