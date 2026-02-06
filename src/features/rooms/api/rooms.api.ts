import type { Room } from "@/shared/types";
import { apiJson } from "@/shared/api/http";

export const roomsApi = {
  list: () => apiJson<Room[]>("/api/rooms"),
  create: (payload: { name: string }) =>
    apiJson<Room>("/api/rooms", { method: "POST", body: JSON.stringify(payload) }),
};
