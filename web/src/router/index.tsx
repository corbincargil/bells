import { Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
import RootLayout from "../layouts/root-layout";
import Loading from "@/pages/loading";

const Home = lazy(() => import("@/pages/home"));
const Notifications = lazy(() => import("@/pages/notifications"));
const Webhooks = lazy(() => import("@/pages/webhooks"));
const Settings = lazy(() => import("@/pages/settings"));
const NotFound = lazy(() => import("@/pages/not-found"));

export enum AppRoutes {
  ROOT = "/",
  NOTIFICATIONS = "/notifications",
  SETTINGS = "/settings",
  WEBHOOKS = "/webhooks",
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />

        <Route
          path="notifications"
          element={
            <Suspense fallback={<Loading />}>
              <Notifications />
            </Suspense>
          }
        />

        <Route
          path="settings"
          element={
            <Suspense fallback={<Loading />}>
              <Settings />
            </Suspense>
          }
        />

        <Route
          path="webhooks"
          element={
            <Suspense fallback={<Loading />}>
              <Webhooks />
            </Suspense>
          }
        />

        <Route
          path="404"
          element={
            <Suspense fallback={<Loading />}>
              <NotFound />
            </Suspense>
          }
        />

        <Route
          path="*"
          element={
            <Suspense fallback={<Loading />}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
