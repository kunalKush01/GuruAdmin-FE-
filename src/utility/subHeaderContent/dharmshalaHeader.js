export const dharmshalaHeader = (Permission) =>{
return[
  {
    name: "Dharmshalas",
    url: "/dharmshala/dashboard",
    active: "/dharmshala/dashboard",
    permissionKey: ["dharmshala-dashboard"],
  },
  {
    name: "Bookings",
    url: "/booking/info",
    active: "/booking/info",
    permissionKey: ["dharmshala-bookings"],
  },
  {
    name: "Buildings",
    url: "/dharmshala/info",
    active: "/dharmshala/info",
    permissionKey: ["dharmshala-buildings"],
  },
  {
    name: "Room Types",
    url: "/roomtype/info",
    active: "/roomtype/info",
    permissionKey: ["dharmshala-roomtypes"],
  },
  {
    name: "Feedback",
    url: "/feedback",
    active: "/feedback",
    permissionKey: ["dharmshala-feedback"],
  }
];}
