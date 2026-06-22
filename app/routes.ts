import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/home.tsx"),
  route("dashboard/*", "routes/dashboard.tsx"),
] satisfies RouteConfig;
