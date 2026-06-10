import type { Route } from "./+types/menu";
import MenuPage from "~/components/pages/MenuPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tic-Tac-Toe" },
    { name: "description", content: "Welcome!" },
  ];
}

export default function Menu() {
  return <MenuPage />;
}
