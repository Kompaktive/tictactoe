import type { Route } from "./+types/home";
import GameAgainstAi from "~/components/pages/GameAgainstAi";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tic-Tac-Toe" },
    { name: "description", content: "Play against AI" },
  ];
}

export default function Ai() {
  return <GameAgainstAi />;
}
