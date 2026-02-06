import {useParams, useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {socket} from "@/shared/api/socket.ts";
import {Canvas} from "@/features/canvas";

export const RoomPage = () => {
  const {roomId} = useParams();
  const [searchParams] = useSearchParams();

  const canvasColor = searchParams.get("canvasColor");

  useEffect(() => {
    socket.connect();

    if(!socket.connected) socket.connect(); // no-op if already connected

    const onConnect = () => {
      console.log("connected", socket.id);
      socket.emit("join_room", roomId);
    };
    const onDisconnect = () => console.log("disconnected");
    const onRoomNotFound = () => console.log("room_not_found");

    socket.on("disconnect", onDisconnect);
    socket.on("connect", onConnect);
    socket.on("room_not_found", onRoomNotFound);


    return () => {
      socket.off("disconnect", onDisconnect);
      socket.off("connect", onConnect);
      socket.off("room_not_found", onRoomNotFound);
      socket.disconnect();
    }
  }, [roomId]);

  return (
    <div>
      {roomId && <Canvas roomId={roomId} canvasColor={canvasColor || undefined}/>}
    </div>
  )
}
