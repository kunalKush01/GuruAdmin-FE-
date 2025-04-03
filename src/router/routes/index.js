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
    isGaushala: "Gaushala",
  },
  {
    path: "/cattle/info",
    component: lazy(() =>
      import("../../views/cattles-management/cattles-info/index.js")
    ),
    exact: true,
    type: "cattle-info",
    subPermission: READ,
    isGaushala: "Gaushala",
  },

  {
    path: "/cattle/info/add",
    component: lazy(() =>
      import("../../views/cattles-management/cattles-info/add/index.js")
    ),
    exact: true,
    type: "cattle-info",
    subPermission: WRITE,
    isGaushala: "Gaushala",
  },

  {
    path: "/cattle/info/:cattleId",
    component: lazy(() =>
      import("../../views/cattles-management/cattles-info/edit/index.js")
    ),
    exact: true,
    type: "cattle-info",
    subPermission: WRITE,
    isGaushala: "Gaushala",
  },

  {
    path: "/cattle/medical-info",
    component: lazy(() =>
      import("../../views/cattles-management/medical-record/index.js")
    ),
    exact: true,
    type: "cattle-medical",
    subPermission: READ,
    isGaushala: "Gaushala",
  },

  {
    path: "/cattle/medical-info/add",
    component: lazy(() =>
      import("../../views/cattles-management/medical-record/add/index.js")
    ),
    exact: true,
    type: "cattle-medical",
    subPermission: WRITE,
    isGaushala: "Gaushala",
  },

  {
    path: "/cattle/medical-info/:medicalInfoId",
    component: lazy(() =>
      import("../../views/cattles-management/medical-record/edit/index.js")
    ),
    exact: true,
    type: "cattle-medical",
    subPermission: WRITE,
    isGaushala: "Gaushala",
  },

  {
    path: "/cattle/pregnancy-reports",
    component: lazy(() =>
      import("../../views/cattles-management/pregnancy-report/index.js")
    ),
    exact: true,
    type: "cattle-pregnancy",
    subPermission: READ,
    isGaushala: "Gaushala",
  },

  {
    path: "/cattle/pregnancy-reports/add",
    component: lazy(() =>
      import("../../views/cattles-management/pregnancy-report/add/index.js")
    ),
    exact: true,
    type: "cattle-pregnancy",
    subPermission: WRITE,
    isGaushala: "Gaushala",
  },

  {
    path: "/cattle/pregnancy-reports/:pregnancyReportId",
    component: lazy(() =>
      import("../../views/cattles-management/pregnancy-report/edit/index.js")
    ),
    exact: true,
    type: "cattle-pregnancy",
    subPermission: WRITE,
    isGaushala: "Gaushala",
  },

  {
    path: "/cattle/expenses",
    component: lazy(() =>
      import("../../views/cattles-management/Expense-management/index.js")
    ),
    exact: true,
    type: "cattle-expense",
    subPermission: READ,
    isGaushala: "Gaushala",
  },

  {
    path: "/cattle/expenses/add",
    component: lazy(() =>
      import("../../views/cattles-management/Expense-management/add/index.js")
    ),
    exact: true,
    type: "cattle-expense",
    subPermission: WRITE,
    isGaushala: "Gaushala",
  },

  {
    path: "/stock-management/stock",
    component: lazy(() =>
      import("../../views/cattles-management/stock-management/index.js")
    ),
    exact: true,
    type: "stock-management/stock",
    subPermission: WRITE,
    // isGaushala: "Gaushala",
  },

  {
    path: "/stock-management/supplies",
    component: lazy(() =>
      import("../../views/cattles-management/stock-management/index.js")
    ),
    exact: true,
    type: "stock-management/supplies",
    subPermission: READ,
    // isGaushala: "Gaushala",
  },
  {
    path: "/stock-management/supplies/add",
    component: lazy(() =>
      import(
        "../../views/cattles-management/stock-management/supplies/add/index.js"
      )
    ),
    exact: true,
    type: "stock-management/supplies",
    subPermission: WRITE,
    // isGaushala: "Gaushala",
  },

  {
    path: "/stock-management/supplies/:supplyId",
    component: lazy(() =>
      import(
        "../../views/cattles-management/stock-management/supplies/edit/index.js"
      )
    ),
    exact: true,
    type: "stock-management/supplies",
    subPermission: WRITE,
    // isGaushala: "Gaushala",
  },

  {
    path: "/stock-management/item",
    component: lazy(() =>
      import("../../views/cattles-management/stock-management/index.js")
    ),
    exact: true,
    type: "stock-management/item",
    subPermission: READ,
    // isGaushala: "Gaushala",
  },

  {
    path: "/stock-management/item/add",
    component: lazy(() =>
      import(
        "../../views/cattles-management/stock-management/items/add/index.js"
      )
    ),
    exact: true,
    type: "stock-management/item",
    subPermission: WRITE,
    // isGaushala: "Gaushala",
  },

  {
    path: "/stock-management/item/:itemId",
    component: lazy(() =>
      import(
        "../../views/cattles-management/stock-management/items/edit/index.js"
      )
    ),
    exact: true,
    type: "stock-management/item",
    subPermission: WRITE,
    // isGaushala: "Gaushala",
  },

  {
    path: "/stock-management/usage",
    component: lazy(() =>
      import("../../views/cattles-management/stock-management/index.js")
    ),
    exact: true,
    type: "stock-management/usage",
    subPermission: READ,
    // isGaushala: "Gaushala",
  },

  {
    path: "/stock-management/usage/add",
    component: lazy(() =>
      import(
        "../../views/cattles-management/stock-management/usage/add/index.js"
      )
    ),
    exact: true,
    type: "stock-management/usage",
    subPermission: WRITE,
    // isGaushala: "Gaushala",
  },

  {
    path: "/stock-management/usage/:itemUsageId",
    component: lazy(() =>
      import(
        "../../views/cattles-management/stock-management/usage/edit/index.js"
      )
    ),
    exact: true,
    type: "stock-management/usage",
    subPermission: WRITE,
    // isGaushala: "Gaushala",
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
    type: "configuration/reportDispute",
    subPermission: READ,
  },
  {
    path: "/membership",
    component: lazy(() =>
      // import("../../views/membership/MembershipProfileView.js")
      import("../../views/membership/MemberShipListView.js")
    ),
    // exact:true
    type: "membership",
    subPermission: READ,
  },
  {
    path: "/member/profile/:id",
    component: lazy(() =>
      import("../../views/membership/MembershipProfileView.js")
    ),
    exact: true,
    type: "membership",
    subPermission: READ,
  },
  {
    path: "/member/addMember",
    component: lazy(() => import("../../views/membership/AddMemberForm.js")),
    exact: true,
    type: "membership",
    subPermission: WRITE,
  },
  {
    path: "/member/editMember/:id",
    component: lazy(() => import("../../views/membership/AddMemberForm.js")),
    exact: true,
    type: "membership",
    subPermission: EDIT,
  },
  {
    path: "/service",
    component: lazy(() => import("../../views/service/serviceListView.js")),
    // exact:true
    type: "service",
    subPermission: READ,
  },
  {
    path: "/service-booking",
    component: lazy(() => import("../../views/service/serviceListView.js")),
    // exact:true,
    type: "service",
    subPermission: READ,
  },
  {
    path: "/service-booked",
    component: lazy(() => import("../../views/service/serviceListView.js")),
    // exact:true,
    type: "service",
    subPermission: READ,
  },
  {
    path: "/services/addService",
    component: lazy(() => import("../../views/service/addServiceForm.js")),
    // exact:true
    type: "service",
    subPermission: WRITE,
  },
  {
    path: "/editBooking/:bookingId/:serviceId",
    component: lazy(() => import("../../views/service/editBookingService.js")),
    // exact:true
    type: "service",
    subPermission: EDIT,
  },
  {
    path: "/configuration/cattle-breed",
    component: lazy(() =>
      import("../../views/cattles-management/cattle-breed/index.js")
    ),
    exact: true,
    type: "configuration",
    subPermission: READ,
    isGaushala: "Gaushala",
  },

  {
    path: "/configuration/cattle-category",
    component: lazy(() =>
      import("../../views/cattles-management/cattle-category/index.js")
    ),
    exact: true,
    type: "configuration",
    subPermission: READ,
    isGaushala: "Gaushala",
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
    // component: lazy(() => import("../../views/donation/donationList.js")),
    component: lazy(() => import("../../views/donation/donationTabList.js")),
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
    path: "/donation/edit",
    component: lazy(() => import("../../views/donation/editDonation.js")),
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
  {
    path: "/configuration/masters",
    component: lazy(() =>
      import("../../views/configuration/Masters/mastersList.js")
    ),
    exact: true,
    type: "configuration",
    subPermission: READ,
  },
  {
    path: "/configuration/masters/info/:masterId",
    component: lazy(() =>
      import("../../views/configuration/Masters/masterDataList.js")
    ),
    exact: true,
    type: "configuration",
    subPermission: READ,
  },
  {
    path: "/configuration/custom-fields",
    component: lazy(() =>
      import("../../views/configuration/Custom-Fields/customFieldsView.js")
    ),
    exact: true,
    type: "configuration",
    subPermission: READ,
  },
  // {
  //   path: "/dharmshala/dashboard",
  //   component: lazy(() =>
  //     import("../../views/dharmshala-management/dashboard/index.js")
  //   ),
  //   //exact: true,
  //   type: "dharmshala",
  //   subPermission: READ,
  // },
  {
    path: "/dharmshala/dashboard",
    component: lazy(() =>
      import("../../views/dharmshala-management/dashboard/index.js")
    ),
    // exact: true,
    type: "dharmshala/dashboard",
    subPermission: READ,
  },
  {
    path: "/dharmshala/info",
    component: lazy(() =>
      import("../../views/dharmshala-management/dharmshala-info/index.js")
    ),
    //exact: true,
    type: "dharmshala/buildings",
    subPermission: READ,
  },
  {
    path: "/building/edit/:buildingId",
    component: lazy(() =>
      import("../../views/dharmshala-management/dharmshala-info/edit/index.js")
    ),
    //exact: true,
    type: "dharmshala/buildings",
    subPermission: READ,
  },
  {
    path: "/building/info/add",
    component: lazy(() =>
      import("../../views/dharmshala-management/dharmshala-info/add/index.js")
    ),
    //exact: true,
    type: "dharmshala/buildings",
    subPermission: WRITE,
  },

  {
    path: "/dharmshala/info/:buildingId",
    component: lazy(() =>
      import("../../views/dharmshala-management/dharmshala-info/edit/index.js")
    ),
    exact: true,
    type: "dharmshala/buildings",
    subPermission: WRITE,
  },
  {
    path: "/roomtype/info",
    component: lazy(() =>
      import("../../views/dharmshala-management/room-type/index.js")
    ),
    exact: true,
    type: "dharmshala/roomtypes",
    subPermission: READ,
  },
  {
    path: "/roomtype/info/add",
    component: lazy(() =>
      import("../../views/dharmshala-management/room-type/add/index.js")
    ),
    exact: true,
    type: "dharmshala/roomtypes",
    subPermission: WRITE,
  },

  {
    path: "/roomtype/info/:roomTypeId",
    component: lazy(() =>
      import("../../views/dharmshala-management/room-type/edit/index.js")
    ),
    exact: true,
    type: "dharmshala/roomtypes",
    subPermission: WRITE,
  },
  {
    path: "/floors/:buildingId",
    component: lazy(() =>
      import("../../views/dharmshala-management/dharmshala-floor/index.js")
    ),
    //exact: true,
    type: "dharmshala/roomtypes",
    subPermission: READ,
  },
  {
    path: "/room/:floorId/:buildingId",
    component: lazy(() =>
      import("../../views/dharmshala-management/dharmshala-room/index.js")
    ),
    //exact: true,
    type: "dharmshala/roomtypes",
    subPermission: READ,
  },
  // {
  //   path: "/dharmshala/info/:buildingId/floor",
  //   component: lazy(() =>
  //     import("../../views/dharmshala-management/dharmshala-floor/index.js")
  //   ),
  //   exact: true,
  //   type: "dharmshala-floor",
  //   subPermission: READ,
  // },
  {
    path: "/floor/add/:buildingId",
    component: lazy(() =>
      import("../../views/dharmshala-management/dharmshala-floor/add/index.js")
    ),
    //exact: true,
    type: "dharmshala/roomtypes",
    subPermission: READ,
  },
  {
    path: "/rooms/add/:floorId/:buildingId",
    component: lazy(() =>
      import("../../views/dharmshala-management/dharmshala-room/add/index.js")
    ),
    //exact: true,
    type: "dharmshala/roomtypes",
    subPermission: READ,
  },
  {
    path: "/floor/edit/:floorId/:buildingId", //originally /dharmshala/info/:buildingId/floor/:floorId
    component: lazy(() =>
      import("../../views/dharmshala-management/dharmshala-floor/edit/index.js")
    ),
    exact: true,
    type: "dharmshala/roomtypes",
    subPermission: READ,
  },

  {
    path: "/rooms/edit/:roomId/:floorId/:buildingId",
    component: lazy(() =>
      import("../../views/dharmshala-management/dharmshala-room/edit/index.js")
    ),
    exact: true,
    type: "dharmshala/roomtypes",
    subPermission: READ,
  },
  {
    path: "/feedback",
    component: lazy(() =>
      import("../../views/dharmshala-management/feedback/index.js")
    ),
    exact: true,
    type: "dharmshala/feedback",
    subPermission: READ,
  },

  //Booking Routes
  {
    path: "/booking/info",
    component: lazy(() =>
      import("../../views/dharmshala-management/dharmshala-booking/index.js")
    ),
    exact: true,
    type: "dharmshala/bookings",
    subPermission: READ,
  },
  {
    path: "/booking/add",
    component: lazy(() =>
      import(
        "../../views/dharmshala-management/dharmshala-booking/add/index.js"
      )
    ),
    exact: true,
    type: "dharmshala/bookings",
    subPermission: WRITE,
  },

  {
    path: "/booking/edit/:bookingId",
    component: lazy(() =>
      import(
        "../../views/dharmshala-management/dharmshala-booking/add/index.js"
      )
    ),
    exact: true,
    type: "dharmshala/bookings",
    subPermission: WRITE,
  },
  {
    path: "/booking/view/:bookingId",
    component: lazy(() =>
      import(
        "../../views/dharmshala-management/dharmshala-booking/add/index.js"
      )
    ),
    exact: true,
    type: "dharmshala/bookings",
    subPermission: READ,
  },

  // {
  //   path: "/booking/calendar",
  //   component: lazy(() =>
  //     import("../../views/dharmshala-management/dharmshala-booking/calendar/index.js")

  //   ),
  //   exact: true,
  //   type: "booking-info",
  //   subPermission: WRITE,
  // },
  {
    path: "/booking/calendar",
    component: lazy(() =>
      import("../../components/dharmshalaBooking/Calendar.js")
    ),
    exact: true,
    type: "dharmshala/dashboard",
    subPermission: WRITE,
  },
  {
    path: "/service-booking",
    component: lazy(() => import("../../views/service/serviceListView.js")),
    exact: true,
    type: "service-booking",
    subPermission: READ,
  },
  {
    path: "/service",
    component: lazy(() => import("../../views/service/bookingService.js")),
    exact: true,
    type: "service",
    subPermission: READ,
  },
  {
    path: "/message",
    component: lazy(() =>
      import("../../components/messageIntegration/messageIntegration.js")
    ),
    exact: true,
    type: "message",
    subPermission: READ,
  },
];

export { DefaultRoute, Routes, TemplateTitle };
