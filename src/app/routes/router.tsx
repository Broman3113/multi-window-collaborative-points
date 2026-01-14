import {createBrowserRouter, type RouteObject} from "react-router-dom";
import {Main} from "@/pages/main";
import {CanvasPage} from "@/pages/canvas/CanvasPage.tsx";
import {RoomsPage} from "@/pages/rooms/RoomsPage.tsx";
import {RoomPage} from "@/pages/room/RoomPage.tsx";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Main/>
  },
  {
    path: "/canvas",
    element: <CanvasPage/>
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
