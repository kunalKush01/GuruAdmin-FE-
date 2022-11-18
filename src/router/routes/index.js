import { lazy } from "react";

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/dashboard";

// ** Merge Routes
const Routes = [
  {
    path: "/dashboard",
    component: lazy(() => import("../../views/dashboard/dashboard")),
    
  },
  {
    path: '/news',
    component: lazy(() => import('../../views/news/newsList')),
    exact:true
  },
  {
    path: '/news/add',
    component: lazy(() => import('../../views/news/addNews')),
    // exact:true
  },
  {
    path: '/news/edit/:newsId',
    component: lazy(() => import('../../views/news/editNews')),
    // exact:true
  },
  {
    path: '/news/add-language/:newsId',
    component: lazy(() => import('../../views/news/addNewsLanguage')),
    // exact:true
  },
  {
    path: '/events',
    component: lazy(() => import('../../views/events/eventList')),
    exact:true
  },
  {
    path: '/events/add',
    component: lazy(() => import('../../views/events/addEvent')),
    exact:true
  },
  {
    path: "/login",
    component: lazy(() => import("../../views/login/login.js")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
];

export { DefaultRoute, TemplateTitle, Routes };
