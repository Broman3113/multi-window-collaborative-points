import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Room } from "@/shared/types";

// shadcn/ui
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Skeleton } from "@/shared/ui/skeleton";
import { Separator } from "@/shared/ui/separator";
import {Badge} from "@/shared/ui/badge.tsx";
import {roomsApi} from "@/features/rooms";
import {RoomItem} from "@/features/room";


export const RoomsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: rooms, isLoading, isError, error } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: roomsApi.list,
    staleTime: 10_000,
  });

  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");

  const canCreate = useMemo(() => roomName.trim().length >= 2, [roomName]);

  const createMutation = useMutation({
    mutationFn: roomsApi.create,
    onSuccess: async (createdRoom) => {
      // чтобы список обновился (и/или подтянулся актуальный)
      await queryClient.invalidateQueries({ queryKey: ["rooms"] }); // стандартный паттерн после мутации [web:56]
      setOpen(false);
      setRoomName("");

      // подстрой под свои роуты (пример: /room/:id)
      navigate(`/rooms/${createdRoom.id}`);
    },
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Rooms</h1>
            <p className="text-sm text-muted-foreground">Choose the room or create a new one.</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>New room</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create room</DialogTitle>
                <DialogDescription>Name would be visible to all participants.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-2">
                <Label htmlFor="roomName">Room name</Label>
                <Input
                  id="roomName"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Example: Team A / Demo / My room"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">Min 2 symbols required.</p>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>

                <Button
                  onClick={() => createMutation.mutate({ name: roomName.trim() })}
                  disabled={!canCreate || createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create & open"}
                </Button>
              </div>

              {createMutation.isError && (
                <p className="text-sm text-destructive">
                  {(createMutation.error as Error)?.message ?? "Create failed"}
                </p>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <Separator className="my-6" />

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base leading-none">
              Available rooms
              <Badge variant="secondary" className="h-5 px-2 text-xs">
                {rooms?.length ?? 0}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-3">
            {isLoading && (
              <div className="grid gap-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            )}

            {isError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm font-medium">Couldn't load the rooms</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {(error as Error)?.message ?? "Unknown error"}
                </p>
                <div className="mt-3">
                  <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["rooms"] })}>
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {!isLoading && !isError && rooms?.length === 0 && (
              <div className="rounded-md border bg-background p-6 text-center">
                <p className="text-sm font-medium">No rooms for now</p>
                <p className="mt-1 text-sm text-muted-foreground">Create first room for collaborative points</p>
                <div className="mt-4">
                  <Button onClick={() => setOpen(true)}>Create room</Button>
                </div>
              </div>
            )}

            {!isLoading && !isError && rooms && rooms.length > 0 && (
              <div className="grid gap-2">
                {rooms.map((r) => (
                  <RoomItem key={r.id} room={r} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
