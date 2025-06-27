// ** React Imports
import { Suspense, lazy } from 'react';

// ** Router Components
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

// ** Layouts
import BlankLayout from '@layouts/BlankLayout';
import VerticalLayout from '@layouts/VerticalLayout';
import HorizontalLayout from '@layouts/HorizontalLayout';
import LayoutWrapper from '@layouts/components/layout-wrapper';

// ** Routes & Defaults
import { DefaultRoute, AllRoutes } from './routes';

const NotAuthorized = lazy(() => import('@src/views/NotAuthorized'));
const Error = lazy(() => import('@src/views/Error'));

const Router = () => {
  const Layouts = {
    BlankLayout,
    VerticalLayout,
    HorizontalLayout
  };

  const DefaultLayout = 'VerticalLayout'; // Fallback default layout

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
          <LayoutComponent layout={layoutKey}>
            <Suspense fallback={null}>
              {layoutKey === 'BlankLayout' ? (
                <Component />
              ) : (
                <LayoutWrapper
                  layout={layoutKey}
                  {...(route.appLayout ? { appLayout: route.appLayout } : {})}
                  {...(route.meta ? { routeMeta: route.meta } : {})}
                  {...(route.className ? { wrapperClass: route.className } : {})}
                >
                  <Component />
                </LayoutWrapper>
              )}
            </Suspense>
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
