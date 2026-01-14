import type {Point} from "./point";

export interface Room {
  id: string;
  name: string;
  points: Point[];
}
