import { Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
import PublicLayout from "../layouts/public-layout";
import RootLayout from "../layouts/root-layout";
import { WebhookFormLayout } from "@/layouts/webhook-form-layout";
import { WebhookFormLoading } from "@/pages/(protected)/webhooks/_components/webhook-form/loading";
import { NotificationDetailsLayout } from "@/layouts/notification-details-layout";
import { NotificationDetailsLoading } from "@/pages/(protected)/notifications/_components/notification-details/loading";
import Loading from "@/pages/loading";

const Home = lazy(() => import("@/pages/(protected)/home"));
const Notifications = lazy(() => import("@/pages/(protected)/notifications"));
const Webhooks = lazy(() => import("@/pages/(protected)/webhooks"));
const Settings = lazy(() => import("@/pages/(protected)/settings"));
const NotFound = lazy(() => import("@/pages/not-found"));
const SignIn = lazy(() => import("@/pages/sign-in"));
const SignUp = lazy(() => import("@/pages/sign-up"));
const CreateWebhook = lazy(() => import("@/pages/(protected)/webhooks/create"));
const EditWebhook = lazy(
  () => import("@/pages/(protected)/webhooks/edit/[id]")
);
const NotificationDetails = lazy(
  () => import("@/pages/(protected)/notifications/details/[id]")
);

export enum AppRoutes {
  HOME = "/",
  NOTIFICATIONS = "/notifications",
  SETTINGS = "/settings",
  WEBHOOKS = "/webhooks",
  CREATE = "create",
  EDIT = "edit/:id",
  DETAILS = "details/:id",
  SIGN_IN = "/sign-in",
  SIGN_UP = "/sign-up",
  NOT_FOUND = "/404",
  CATCH_ALL = "*",
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={AppRoutes.SIGN_IN} element={<PublicLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<Loading />}>
              <SignIn />
            </Suspense>
          }
        />
      </Route>
      <Route path={AppRoutes.SIGN_UP} element={<PublicLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<Loading />}>
              <SignUp />
            </Suspense>
          }
        />
      </Route>

      {/* Protected routes */}
      <Route path={AppRoutes.HOME} element={<RootLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          }
        />

        <Route
          path={AppRoutes.NOTIFICATIONS}
          element={
            <Suspense fallback={<Loading />}>
              <Notifications />
            </Suspense>
          }
        >
          <Route
            path={AppRoutes.DETAILS}
            element={<NotificationDetailsLayout />}
          >
            <Route
              index
              element={
                <Suspense fallback={<NotificationDetailsLoading />}>
                  <NotificationDetails />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route
          path={AppRoutes.SETTINGS}
          element={
            <Suspense fallback={<Loading />}>
              <Settings />
            </Suspense>
          }
        />

        <Route
          path={AppRoutes.WEBHOOKS}
          element={
            <Suspense fallback={<Loading />}>
              <Webhooks />
            </Suspense>
          }
        >
          <Route path={AppRoutes.CREATE} element={<WebhookFormLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<WebhookFormLoading mode="create" />}>
                  <CreateWebhook />
                </Suspense>
              }
            />
          </Route>
          <Route path={AppRoutes.EDIT} element={<WebhookFormLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<WebhookFormLoading mode="edit" />}>
                  <EditWebhook />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route
          path={AppRoutes.NOT_FOUND}
          element={
            <Suspense fallback={<Loading />}>
              <NotFound />
            </Suspense>
          }
        />

        <Route
          path={AppRoutes.CATCH_ALL}
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
