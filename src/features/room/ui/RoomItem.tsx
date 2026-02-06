import type {FC} from "react";
import {Box, ChevronRightIcon} from "lucide-react";
import type {Room} from "@/shared/types";
import {Item, ItemActions, ItemContent, ItemMedia, ItemTitle} from "@/shared/ui";
import {Link} from "react-router-dom";

interface RoomCardProps {
  room: Room
}

export const RoomItem: FC<RoomCardProps> = ({room}) => {
  return <Item variant="outline" size="sm" asChild>
    <Link to={`/rooms/${room.id}`}>
      <ItemMedia>
        <Box className="size-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{room.name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <ChevronRightIcon className="size-4" />
      </ItemActions>
    </Link>
  </Item>
}
