import {createBrowserRouter, type RouteObject} from "react-router-dom";
import {Main} from "@/pages/main";
import {RoomsPage} from "@/pages/rooms/RoomsPage.tsx";
import {RoomPage} from "@/pages/room/RoomPage.tsx";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Main/>
  },
  {

  },
  {
    path: "/rooms",
    element: <RoomsPage/>
  },
  {
    path: "/rooms/:roomId",
    element: <RoomPage/>
  }
]

export const router = createBrowserRouter(routes);
