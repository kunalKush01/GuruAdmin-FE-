import { lazy } from "react";

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
    path: "/dashboard",
    component: lazy(() => import("../../views/dashboard/dashboard")),
    
  },
  {
    path: "/notification",
    component: lazy(() => import("../../views/Notification/notificationList")),
    
  },
  {
    path: "/edit-profile",
    component: lazy(() => import("../../views/Profile/userProfile")),
    
  },
  {
    path:"/subscribed-user",
    component:lazy(()=> import("../../views/subscribedUser/subscribedUserList")),
    exact:true
  },
  {
    path:"/subscribed-user/add",
    component:lazy(()=> import("../../views/subscribedUser/addSubscribedUser"))
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
    exact:true
  },
  
  {
    path: '/configuration/categories/add',
    component: lazy(() => import('../../views/configuration/categories/addCategory')),
    // exact:true
  },
  {
    path: '/configuration/categories/edit/:subCategoryId',
    component: lazy(() => import('../../views/configuration/categories/editCategory')),
    // exact:true
  },
  {
    path: '/configuration/categories/add-language/:subCategoryId',
    component: lazy(() => import('../../views/configuration/categories/addCategoryLanguage')),
    // exact:true
  },
  {
    path: '/configuration/users',
    component: lazy(() => import('../../views/configuration/users/userList')),
    exact:true
  },
  
  {
    path: '/configuration/users/add',
    component: lazy(() => import('../../views/configuration/users/addUser')),
    // exact:true
  },
  {
    path: '/configuration/reportDispute',
    component: lazy(() => import('../../views/configuration/Report&Disput/reportDisputList')),
    // exact:true
  },
  {
    path: '/internal_expenses',
    component: lazy(() => import('../../views/internalExpenses/expensesList')),
    exact:true
  },
  {
    path: '/internal_expenses/add',
    component: lazy(() => import('../../views/internalExpenses/addExpenses.js')),
    // exact:true
  },
  {
    path: '/internal_expenses/edit/:expensesId',
    component: lazy(() => import('../../views/internalExpenses/editExpenses.js')),
    // exact:true
  },
  {
    path: '/financial_reports',
    component: lazy(() => import('../../views/financialReport/reportList.js')),
    exact:true
  },
  {
    path: '/donation',
    component: lazy(() => import('../../views/donation/donationList.js')),
    exact:true
  },
  {
    path: '/donation/add',
    component: lazy(() => import('../../views/donation/addDonation')),
    exact:true
  },
  {
    path: '/commitment',
    component: lazy(() => import('../../views/commitments/commitmentList.js')),
    exact:true
  },
  {
    path: '/commitment/add',
    component: lazy(() => import('../../views/commitments/addCommitment')),
    exact:true
  },
  {
    path: '/commitment/edit/:commitmentId',
    component: lazy(() => import('../../views/commitments/editCommitment')),
    exact:true
  },
  {
    path: '/Hundi',
    component: lazy(() => import('../../views/DonationBox/donationBoxList.js')),
    exact:true
  },
  {
    path: '/Hundi/add',
    component: lazy(() => import('../../views/DonationBox/addDonationBox.js')),
    // exact:true
  },
  {
    path: '/Hundi/edit/:donationBoxId',
    component: lazy(() => import('../../views/DonationBox/editDonationBox')),
    // exact:true
  },
  {
    path: '/financial_reports/Logs/:collectionId',
    component: lazy(() => import('../../views/financialReport/donationBoxLogsList')),
    // exact:true
  },
];

export { DefaultRoute, TemplateTitle, Routes };
