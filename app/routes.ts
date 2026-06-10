import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/menu.tsx"),
  route("/:roomId", "routes/room-id.tsx"),
  route("/ai", "routes/ai.tsx"),
] satisfies RouteConfig;
