import { useQuery } from "@tanstack/react-query";
import {getRooms} from "../data/roomRepository.ts";

export function useRooms() {
    return useQuery({queryKey:['rooms'],queryFn:getRooms})
}