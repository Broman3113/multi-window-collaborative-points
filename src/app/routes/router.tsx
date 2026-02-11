import {createBrowserRouter, Navigate, type RouteObject} from "react-router-dom";
import {RoomsPage} from "@/pages/rooms/RoomsPage.tsx";
import {RoomPage} from "@/pages/room/RoomPage.tsx";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to={"/rooms"}/>
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
