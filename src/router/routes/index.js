import { lazy } from "react";

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/dashboard";

// ** Merge Routes
const Routes = [
  {
    path: "/dashboard",
    component: lazy(() => import("../../views/dashboard")),
  },
  // {
  //   path: '/donation',
  //   component: lazy(() => import('../../views/SecondPage'))
  // },
  // {
  //   path: '/committment',
  //   component: lazy(() => import('../../views/SecondPage'))
  // },
  // {
  //   path: '/daan_peti_collections',
  //   component: lazy(() => import('../../views/SecondPage'))
  // },
  // {
  //   path: '/financial_reports',
  //   component: lazy(() => import('../../views/SecondPage'))
  // },
  // {
  //   path: '/internal_expenses',
  //   component: lazy(() => import('../../views/SecondPage'))
  // },
  // {
  //   path: '/events',
  //   component: lazy(() => import('../../views/SecondPage'))
  // },
  // {
  //   path: '/news',
  //   component: lazy(() => import('../../views/SecondPage'))
  // },
  // {
  //   path: '/notices',
  //   component: lazy(() => import('../../views/SecondPage'))
  // },
  // {
  //   path: '/configuration',
  //   component: lazy(() => import('../../views/SecondPage'))
  // },

  {
    path: "/login",
    component: lazy(() => import("../../views/login.js")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
];

export { DefaultRoute, TemplateTitle, Routes };
