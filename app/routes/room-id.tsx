import { data, isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/room-id";
import Game from "~/components/pages/Game";
import { checkRoomExists } from "~/services/firebase/room.service";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Tic-Tac-Toe" }, { name: "description", content: "Play!" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  if (!(await checkRoomExists(params.roomId))) {
    throw data(null, { status: 404, statusText: "Not Found" });
  }

  return { roomId: params.roomId };
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return <div>Room Not Found!</div>;
    else return <div>Something Error Occured! (status: {error.status})</div>;
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export default function RoomId({ loaderData }: Route.ComponentProps) {
  return <Game roomId={loaderData.roomId} />;
}
