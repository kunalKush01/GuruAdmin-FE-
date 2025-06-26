import { exact } from "prop-types";
import { lazy } from "react";
import { EDIT, READ, WRITE } from "../../utility/permissionsVariable.js";

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/dashboard";

// ** Merge Routes
const AllRoutes = [
  {
    path: "/login",
    component: lazy(() => import("../../views/login/login.js")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/reset-password",
    component: lazy(() => import("../../views/ResetPassword/index")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/set-password",
    component: lazy(() => import("../../views/SetPassword/index")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/dashboard",
    component: lazy(() => import("../../views/dashboard/dashboard")),
    type: "dashboard",
    subPermission: READ,
  },
  {
    path: "/notification",
    component: lazy(() => import("../../views/Notification/notificationList")),
    type: "notification",
  },
  {
    path: "/edit-profile",
    component: lazy(() => import("../../views/Profile/userProfile")),
    type: "editProfile",
    exact: true,
  },
  {
    path: "/edit-profile/add-language/:profileId",
    component: lazy(() => import("../../views/Profile/addProfileLanguage.js")),
    type: "editProfile",
    exact: true,
  },
  // {
  //   path: "/facilities",
  //   component: lazy(() => import("../../views/Profile/facilityForm")),
  //   exact: true,
  // },
  {
    path: "/subscribed-user",
    component: lazy(() =>
      import("../../views/subscribedUser/subscribedUserList")
    ),
    exact: true,
    type: "dashboard",
    subPermission: READ,
  },
  {
    path: "/subscribed-user/add",
    component: lazy(() =>
      import("../../views/subscribedUser/addSubscribedUser")
    ),
    type: "dashboard",
    subPermission: WRITE,
  },
  {
    path: "/add-user",
    component: lazy(() => import("../../views/subscribedUser/addUser")),
    type: "donation" || "commitment",
    subPermission: WRITE,
  },
];

export { DefaultRoute, AllRoutes, TemplateTitle };
