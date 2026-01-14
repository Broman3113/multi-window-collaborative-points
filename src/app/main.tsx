import { createRoot } from 'react-dom/client'
import '@/app/styles/index.css'
import {RouterProvider} from "react-router-dom";
import {router} from "@/app/routes";
import {WebSocketProvider} from "@/shared/providers/WebSocketProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <WebSocketProvider>
    <RouterProvider router={router}/>
  </WebSocketProvider>
)
