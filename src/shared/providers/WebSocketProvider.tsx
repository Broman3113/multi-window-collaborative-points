import {createContext, useContext, useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";

const WebSocketContext = createContext<Socket | null>(null);

export const WebSocketProvider = ({children}: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    }
  }, [])

  return (
    <WebSocketContext value={socket}>
      {children}
    </WebSocketContext>
  )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("useWebSocket must be used within a WebSocketProvider");
  return (
    context
  )
}
