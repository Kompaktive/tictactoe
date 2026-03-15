import type { Route } from "./+types/home";
import Menu from "~/components/pages/Menu";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tic-Tac-Toe" },
    { name: "description", content: "Welcome!" },
  ];
}

export default function Home() {
  return <Menu />;
}
