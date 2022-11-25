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
    path: '/events/add-language/:eventId',
    component: lazy(() => import('../../views/events/addEventLanguage')),
    // exact:true
  },
  {
    path: '/events/edit/:eventId',
    component: lazy(() => import('../../views/events/editEvent')),
    // exact:true
  },
  {
    path: '/notices',
    component: lazy(() => import('../../views/notices/noticeList')),
    exact:true
  },
  {
    path: '/notices/add',
    component: lazy(() => import('../../views/notices/addNotice')),
    exact:true
  },
  {
    path: '/notices/add-language/:noticeId',
    component: lazy(() => import('../../views/notices/addNoticeLanguage')),
    // exact:true
  },
  {
    path: '/notices/edit/:noticeId',
    component: lazy(() => import('../../views/notices/editNotice')),
    // exact:true
  },
  {
    path: '/configuration/categories',
    component: lazy(() => import('../../views/configuration/categories/categoryList')),
    // exact:true
  },
  
  // {
  //   path: '/configuration/categories/add',
  //   component: lazy(() => import('../../views/configuration/categories/addCategory')),
  //   // exact:true
  // },
  // {
  //   path: '/configuration/categories/edit',
  //   component: lazy(() => import('../../views/configuration/categories/editCategory')),
  //   // exact:true
  // },
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
