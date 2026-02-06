import { io } from "socket.io-client";
import {env} from "@/shared/config/env.ts";

console.log(env.API_URL)


export const socket = io(env.API_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'] // Принудительно разреши WS
});
