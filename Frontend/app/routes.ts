import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/gamesync", "routes/gamesync.tsx"),
    route("/login", "routes/login.tsx"),
    route("/register", "routes/register.tsx"),
    route("/leaderboards", "routes/leaderboards.tsx"),
    route("/profile", "routes/profile.tsx"),
] satisfies RouteConfig;
