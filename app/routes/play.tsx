import type { Route } from "./+types/play";
import Game from "~/components/pages/Game";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Tic-Tac-Toe" }, { name: "description", content: "Play!" }];
}

export default function Play() {
  return <Game />;
}
