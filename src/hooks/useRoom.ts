import { useQuery } from "@tanstack/react-query";
import {getRoomById} from "../data/roomRepository.ts";

export function useRoom(id:string) {
    return useQuery({
        queryKey: ['rooms', id], queryFn:() => getRoomById(id)});
    }