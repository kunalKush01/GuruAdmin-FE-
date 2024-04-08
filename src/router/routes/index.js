import { exact } from "prop-types";
import { lazy } from "react";
import { EDIT, READ, WRITE } from "../../utility/permissionsVariable.js";

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/dashboard";

// ** Merge Routes
const Routes = [
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
    path: "/cattle/dashboard",
    component: lazy(() =>
      import("../../views/cattles-management/dashboard/index.js")
    ),
    exact: true,
    type: "cattle-dashboard",
    subPermission: READ,
  },
  {
    path: "/cattle/info",
    component: lazy(() =>
      import("../../views/cattles-management/cattles-info/index.js")
    ),
    exact: true,
    type: "cattle-info",
    subPermission: READ,
  },

  {
    path: "/cattle/info/add",
    component: lazy(() =>
      import("../../views/cattles-management/cattles-info/add/index.js")
    ),
    exact: true,
    type: "cattle-info",
    subPermission: WRITE,
  },

  {
    path: "/cattle/info/:cattleId",
    component: lazy(() =>
      import("../../views/cattles-management/cattles-info/edit/index.js")
    ),
    exact: true,
    type: "cattle-info",
    subPermission: WRITE,
  },

  {
    path: "/cattle/medical-info",
    component: lazy(() =>
      import("../../views/cattles-management/medical-record/index.js")
    ),
    exact: true,
    type: "cattle-medical",
    subPermission: READ,
  },

  {
    path: "/cattle/medical-info/add",
    component: lazy(() =>
      import("../../views/cattles-management/medical-record/add/index.js")
    ),
    exact: true,
    type: "cattle-medical",
    subPermission: WRITE,
  },

  {
    path: "/cattle/medical-info/:medicalInfoId",
    component: lazy(() =>
      import("../../views/cattles-management/medical-record/edit/index.js")
    ),
    exact: true,
    type: "cattle-medical",
    subPermission: WRITE,
  },

  {
    path: "/cattle/pregnancy-reports",
    component: lazy(() =>
      import("../../views/cattles-management/pregnancy-report/index.js")
    ),
    exact: true,
    type: "cattle-pregnancy",
    subPermission: READ,
  },

  {
    path: "/cattle/pregnancy-reports/add",
    component: lazy(() =>
      import("../../views/cattles-management/pregnancy-report/add/index.js")
    ),
    exact: true,
    type: "cattle-pregnancy",
    subPermission: WRITE,
  },

  {
    path: "/cattle/pregnancy-reports/:pregnancyReportId",
    component: lazy(() =>
      import("../../views/cattles-management/pregnancy-report/edit/index.js")
    ),
    exact: true,
    type: "cattle-pregnancy",
    subPermission: WRITE,
  },

  {
    path: "/cattle/expenses",
    component: lazy(() =>
      import("../../views/cattles-management/Expense-management/index.js")
    ),
    exact: true,
    type: "cattle-expense",
    subPermission: READ,
  },

  {
    path: "/cattle/expenses/add",
    component: lazy(() =>
      import("../../views/cattles-management/Expense-management/add/index.js")
    ),
    exact: true,
    type: "cattle-expense",
    subPermission: WRITE,
  },

  {
    path: "/cattle/management/stock",
    component: lazy(() =>
      import("../../views/cattles-management/stock-management/index.js")
    ),
    exact: true,
    type: "cattle-stock",
    subPermission: WRITE,
  },

  {
    path: "/cattle/management/supplies",
    component: lazy(() =>
      import("../../views/cattles-management/stock-management/index.js")
    ),
    exact: true,
    type: "cattle-supplies",
    subPermission: READ,
  },
  {
    path: "/cattle/management/supplies/add",
    component: lazy(() =>
      import(
        "../../views/cattles-management/stock-management/supplies/add/index.js"
      )
    ),
    exact: true,
    type: "cattle-supplies",
    subPermission: WRITE,
  },

  {
    path: "/cattle/management/supplies/:supplyId",
    component: lazy(() =>
      import(
        "../../views/cattles-management/stock-management/supplies/edit/index.js"
      )
    ),
    exact: true,
    type: "cattle-supplies",
    subPermission: WRITE,
  },

  {
    path: "/cattle/management/items",
    component: lazy(() =>
      import("../../views/cattles-management/stock-management/index.js")
    ),
    exact: true,
    type: "cattle-item",
    subPermission: READ,
  },

  {
    path: "/cattle/management/items/add",
    component: lazy(() =>
      import(
        "../../views/cattles-management/stock-management/items/add/index.js"
      )
    ),
    exact: true,
    type: "cattle-item",
    subPermission: WRITE,
  },

  {
    path: "/cattle/management/items/:itemId",
    component: lazy(() =>
      import(
        "../../views/cattles-management/stock-management/items/edit/index.js"
      )
    ),
    exact: true,
    type: "cattle-item",
    subPermission: WRITE,
  },

  {
    path: "/cattle/management/usage",
    component: lazy(() =>
      import("../../views/cattles-management/stock-management/index.js")
    ),
    exact: true,
    type: "cattle-usage",
    subPermission: READ,
  },

  {
    path: "/cattle/management/usage/add",
    component: lazy(() =>
      import(
        "../../views/cattles-management/stock-management/usage/add/index.js"
      )
    ),
    exact: true,
    type: "cattle-usage",
    subPermission: WRITE,
  },

  {
    path: "/cattle/management/usage/:itemUsageId",
    component: lazy(() =>
      import(
        "../../views/cattles-management/stock-management/usage/edit/index.js"
      )
    ),
    exact: true,
    type: "cattle-usage",
    subPermission: WRITE,
  },

  {
    path: "/events/about/:eventId",
    component: lazy(() => import("../../views/events/eventDetailPage")),
    exact: true,
    type: "events",
    subPermission: READ,
  },
  {
    path: "/notices/about/:noticeId",
    component: lazy(() => import("../../views/notices/noticeDetailPage")),
    exact: true,
    type: "notices",
    subPermission: READ,
  },
  {
    path: "/news/about/:newsId",
    component: lazy(() => import("../../views/news/newsDetailPage")),
    exact: true,
    type: "news",
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

  {
    path: "/news",
    component: lazy(() => import("../../views/news/newsList")),
    exact: true,
    type: "news",
    subPermission: READ,
  },
  {
    path: "/news/add",
    component: lazy(() => import("../../views/news/addNews")),
    // exact:true
    type: "news",
    subPermission: WRITE,
  },
  {
    path: "/news/edit/:newsId",
    component: lazy(() => import("../../views/news/editNews")),
    // exact:true
    type: "news",
    subPermission: EDIT,
  },
  {
    path: "/news/add-language/:newsId",
    component: lazy(() => import("../../views/news/addNewsLanguage")),
    // exact:true
    type: "news",
    subPermission: WRITE,
  },
  {
    path: "/events",
    component: lazy(() => import("../../views/events/eventList")),
    exact: true,
    type: "events",
    subPermission: READ,
  },
  {
    path: "/events/add",
    component: lazy(() => import("../../views/events/addEvent")),
    exact: true,
    type: "events",
    subPermission: WRITE,
  },
  {
    path: "/events/add-language/:eventId",
    component: lazy(() => import("../../views/events/addEventLanguage")),
    // exact:true
    type: "events",
    subPermission: WRITE,
  },
  {
    path: "/events/edit/:eventId",
    component: lazy(() => import("../../views/events/editEvent")),
    // exact:true
    type: "events",
    subPermission: EDIT,
  },
  {
    path: "/notices",
    component: lazy(() => import("../../views/notices/noticeList")),
    exact: true,
    type: "notices",
    subPermission: READ,
  },
  {
    path: "/notices/add",
    component: lazy(() => import("../../views/notices/addNotice")),
    exact: true,
    type: "notices",
    subPermission: WRITE,
  },
  {
    path: "/notices/add-language/:noticeId",
    component: lazy(() => import("../../views/notices/addNoticeLanguage")),
    // exact:true
    type: "notices",
    subPermission: WRITE,
  },
  {
    path: "/notices/edit/:noticeId",
    component: lazy(() => import("../../views/notices/editNotice")),
    // exact:true
    type: "notices",
    subPermission: EDIT,
  },
  {
    path: "/configuration/categories",
    component: lazy(() =>
      import("../../views/configuration/categories/categoryList")
    ),
    exact: true,
    type: "configuration",
    subPermission: READ,
  },

  {
    path: "/configuration/categories/add",
    component: lazy(() =>
      import("../../views/configuration/categories/addCategory")
    ),
    // exact:true
    type: "configuration",
    subPermission: WRITE,
  },
  {
    path: "/configuration/categories/edit/:subCategoryId",
    component: lazy(() =>
      import("../../views/configuration/categories/editCategory")
    ),
    // exact:true
    type: "configuration",
    subPermission: EDIT,
  },
  {
    path: "/configuration/categories/add-language/:subCategoryId",
    component: lazy(() =>
      import("../../views/configuration/categories/addCategoryLanguage")
    ),
    // exact:true
    type: "configuration",
    subPermission: WRITE,
  },
  {
    path: "/configuration/users",
    component: lazy(() => import("../../views/configuration/users/userList")),
    exact: true,
    type: "configuration",
    subPermission: READ,
  },

  {
    path: "/configuration/users/add",
    component: lazy(() => import("../../views/configuration/users/addUser")),
    // exact:true
    type: "configuration",
    subPermission: WRITE,
  },
  {
    path: "/configuration/users/edit/:subAdminId",
    component: lazy(() => import("../../views/configuration/users/editUser")),
    // exact:true
    type: "configuration",
    subPermission: EDIT,
  },
  {
    path: "/configuration/reportDispute",
    component: lazy(() =>
      import("../../views/configuration/Report&Disput/reportDisputList")
    ),
    // exact:true
    type: "configuration",
    subPermission: READ,
  },

  {
    path: "/configuration/cattle-breed",
    component: lazy(() =>
      import("../../views/cattles-management/cattle-breed/index.js")
    ),
    exact: true,
    type: "configuration",
    subPermission: READ,
  },

  {
    path: "/configuration/cattle-category",
    component: lazy(() =>
      import("../../views/cattles-management/cattle-category/index.js")
    ),
    exact: true,
    type: "configuration",
    subPermission: READ,
  },

  {
    path: "/internal_expenses",
    component: lazy(() => import("../../views/internalExpenses/expensesList")),
    exact: true,
    type: "internal_expenses",
    subPermission: READ,
  },
  {
    path: "/internal_expenses/add",
    component: lazy(() =>
      import("../../views/internalExpenses/addExpenses.js")
    ),
    // exact:true
    type: "internal_expenses",
    subPermission: WRITE,
  },
  {
    path: "/internal_expenses/edit/:expensesId",
    component: lazy(() =>
      import("../../views/internalExpenses/editExpenses.js")
    ),
    // exact:true
    type: "internal_expenses",
    subPermission: EDIT,
  },
  {
    path: "/financial_reports",
    component: lazy(() => import("../../views/financialReport/reportList.js")),
    exact: true,
    type: "financial_reports",
    subPermission: READ,
  },
  {
    path: "/donation",
    component: lazy(() => import("../../views/donation/donationList.js")),
    exact: true,
    type: "donation",
    subPermission: READ,
  },
  {
    path: "/donation/add",
    component: lazy(() => import("../../views/donation/addDonation")),
    exact: true,
    type: "donation",
    subPermission: WRITE,
  },
  {
    path: "/commitment",
    component: lazy(() => import("../../views/commitments/commitmentList.js")),
    exact: true,
    type: "commitment",
    subPermission: READ,
  },
  {
    path: "/commitment/pay-donation/:commitmentId",
    component: lazy(() => import("../../views/donation/payDonation")),
    exact: true,
    type: "commitment",
    subPermission: READ,
  },
  {
    path: "/commitment/add",
    component: lazy(() => import("../../views/commitments/addCommitment")),
    exact: true,
    type: "commitment",
    subPermission: WRITE,
  },
  {
    path: "/commitment/edit/:commitmentId",
    component: lazy(() => import("../../views/commitments/editCommitment")),
    exact: true,
    type: "commitment",
    subPermission: EDIT,
  },
  {
    path: "/donations/paid/:commitmentId",
    component: lazy(() => import("../../views/donation/paidDonationList")),
    exact: true,
    type: "commitment",
    subPermission: READ,
  },

  {
    path: "/hundi",
    component: lazy(() => import("../../views/DonationBox/donationBoxList.js")),
    exact: true,
    type: "hundi",
    subPermission: READ,
  },
  {
    path: "/hundi/add",
    component: lazy(() => import("../../views/DonationBox/addDonationBox.js")),
    // exact:true
    type: "hundi",
    subPermission: WRITE,
  },
  {
    path: "/hundi/edit/:donationBoxId",
    component: lazy(() => import("../../views/DonationBox/editDonationBox")),
    // exact:true

    type: "hundi",
    subPermission: EDIT,
  },
  // {
  //   path: "/financial_reports/Hundi/Logs/:collectionId",
  //   component: lazy(() =>
  //     import("../../views/financialReport/donationBoxLogsList")
  //   ),
  //   // exact:true
  // },
  // {
  //   path: "/financial_reports/Expenses/Logs/:expensesId",
  //   component: lazy(() =>
  //     import("../../views/internalExpenses/expensesLogsList")
  //   ),
  //   // exact:true
  // },
  {
    path: "/punyarjak",
    component: lazy(() => import("../../views/Punyarjak/PunyarjakList")),
    exact: true,
    type: "punyarjak",
    subPermission: READ,
  },
  {
    path: "/punyarjak/add",
    component: lazy(() => import("../../views/Punyarjak/AddPunyarjak")),
    exact: true,
    type: "punyarjak",
    subPermission: WRITE,
  },
  {
    path: "/punyarjak/edit/:punyarjakId",
    component: lazy(() => import("../../views/Punyarjak/EditPunyarjak")),
    exact: true,
    type: "punyarjak",
    subPermission: EDIT,
  },
  {
    path: "/punyarjak/add-language/:punyarjakId",
    component: lazy(() =>
      import("../../views/Punyarjak/addPunyarjakLanguage.js")
    ),
    exact: true,
    type: "punyarjak",
    subPermission: EDIT,
  },
];

export { DefaultRoute, Routes, TemplateTitle };
