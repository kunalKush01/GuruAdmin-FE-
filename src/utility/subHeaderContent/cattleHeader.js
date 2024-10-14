export const cattleHeader = (permission) => {
  return [
    {
      name: "dashboard",
      url: "/cattle/dashboard",
      active: "/cattle/dashboard",
      permissionKey: ["cattle-dashboard"],
    },
    {
      name: "cattle_info",
      url: "/cattle/info",
      active: "/cattle/info",
      permissionKey: ["cattle-info"],
    },
    {
      name: "cattle_medical_record",
      url: "/cattle/medical-info",
      active: "/cattle/medical-info",
      permissionKey: ["cattle-medical"],
    },
    {
      name: "cattle_pregnancy_record",
      url: "/cattle/pregnancy-reports",
      active: "/cattle/pregnancy-reports",
      permissionKey: ["cattle-pregnancy"],
    },
    // {
    //   name: "cattle_expense",
    //   url: "/cattle/expenses",
    // },
    // {
    //   name: "cattle_stock_management",
    //   url: permission?.includes("all")
    //     ? "/cattle/management/stock"
    //     : "/cattle/management",
    //   active: "/cattle/management",
    //   isManagment: true,
    //   permissionKey: [
    //     "cattle-stock",
    //     "cattle-supplies",
    //     "cattle-item",
    //     "cattle-usage",
    //   ],
    // },
    // {
    //   name: "cattle_usage",
    //   url: "/cattle/usage",
    // },
  ];
};
