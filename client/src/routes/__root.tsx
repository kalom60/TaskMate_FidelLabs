import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <Link to="/" />
      <hr className="mb-10" />
      <Outlet />
    </>
  ),
});
