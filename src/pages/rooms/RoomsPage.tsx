import type {Room} from "@/shared/types";
import {RoomItem} from "@/features/room/components";

export const RoomsPage = () => {
  const rooms: Room[] = [
    {
      id: '1',
      name: "Комната 1",
      points: [{
        id: "123",
        screenX: 1,
        screenY: 3,
        color: 'red',
      }]
    },
    {
      id: '2',
      name: "Комната 2",
      points: [{
        id: "123",
        screenX: 1,
        screenY: 3,
        color: 'red',
      }]
    },
  ]
  return (
    <div>
      {rooms.map(r => <RoomItem room={r}/>)}
    </div>
  )
}
