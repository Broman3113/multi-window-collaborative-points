import {useParams} from "react-router-dom";
import type {Room} from "@/shared/types";

export const RoomPage = () => {
  const {roomId} = useParams();
  const room: Room = {
    id: roomId as string,
    name: "Комната 1",
    points: [{
      id: "123",
      screenX: 1,
      screenY: 3,
      color: 'red',
    }]
  }
  return (
    <div>
      room:
      {room.name}
      points:
      {room.points.map(p => <div>{JSON.stringify(p, null, 2)}</div>)}
    </div>
  )
}
