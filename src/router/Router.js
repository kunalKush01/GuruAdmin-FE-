// ** React Imports
import { Suspense, lazy, Fragment } from "react";

// ** Utils
import { useLayout } from "@hooks/useLayout";
import { useRouterTransition } from "@hooks/useRouterTransition";

// ** Custom Components
import LayoutWrapper from "@layouts/components/layout-wrapper";

// ** Router Components
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

// ** Routes & Default Routes
import { DefaultRoute, AllRoutes } from "./routes";

// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import Permission from "../components/Permissions/Permission";
import Notification from "../fireBase/Notification";

const NotAuthorized = lazy(() => import("@src/views/NotAuthorized"));
const Error = lazy(() => import("@src/views/Error"));

const Router = () => {
  const { layout, setLayout, setLastLayout } = useLayout();
  const { transition, setTransition } = useRouterTransition();

  const DefaultLayout =
    layout === "horizontal" ? "HorizontalLayout" : "VerticalLayout";

  const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout };
  const currentActiveItem = null;

  const LayoutRoutesAndPaths = (layout) => {
    const LayoutRoutes = [];

    AllRoutes.forEach((route) => {
      if (
        route.layout === layout ||
        (route.layout === undefined && DefaultLayout === layout)
      ) {
        LayoutRoutes.push(route);
      }
    });

    return { LayoutRoutes };
  };

  const ResolveRoutes = () => {
    return Object.entries(Layouts).flatMap(([layoutKey, LayoutComponent]) => {
      const { LayoutRoutes } = LayoutRoutesAndPaths(layoutKey);

      return LayoutRoutes.map((route) => {
        const Component = route.component;

        const Wrapper = (
          <LayoutComponent
            layout={layoutKey}
            setLayout={setLayout}
            transition={transition}
            setLastLayout={setLastLayout}
            setTransition={setTransition}
            currentActiveItem={currentActiveItem}
          >
            {/* <Notification /> */}
            {/* <Suspense fallback={null}> */}
              {route.layout === "BlankLayout" ? (
                <Component />
              ) : (
                <>
                  <LayoutWrapper
                    layout={DefaultLayout}
                    transition={transition}
                    setTransition={setTransition}
                    {...(route.appLayout ? { appLayout: route.appLayout } : {})}
                    {...(route.meta ? { routeMeta: route.meta } : {})}
                    {...(route.className
                      ? { wrapperClass: route.className }
                      : {})}
                  >
                    <Component />
                  </LayoutWrapper>
                </>
              )}
            {/* </Suspense> */}
          </LayoutComponent>
        );

        return <Route key={route.path} path={route.path} element={Wrapper} />;
      });
    });
  };

  return (
    <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
      <Routes>
        <Route path="/" element={<Navigate to={DefaultRoute} replace />} />
        <Route
          path="/misc/not-authorized"
          element={
            <BlankLayout>
              <NotAuthorized />
            </BlankLayout>
          }
        />
        {ResolveRoutes()}
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
