import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../features/home/Home";
import RoomDetailsPage from "../features/rooms/RoomDetailsPage";
import LoginPage from "../features/auth/LoginPage";
import PlayPage from "../features/game/PlayPage";
import AdminRooms from "../features/admin/AdminRooms";
import NewRoom from "../features/admin/NewRoom";
import EditRoom from "../features/admin/EditRoom";
import NotFound from "../components/common/NotFound";
import RoomPage from "../features/rooms/RoomsPage";

export function AppRoutes() {
    return (
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<RoomPage />} />
          <Route path="/rooms/:id" element={<RoomDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/play/:id" element={<PlayPage />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/rooms/new" element={<NewRoom />} />
          <Route path="/admin/rooms/:id/edit" element={<EditRoom />} />
          <Route path="/" element={<Navigate to="/rooms" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>)

}