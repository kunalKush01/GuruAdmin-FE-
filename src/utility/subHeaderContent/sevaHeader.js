export const sevaHeader = (permission) => {
  return [
    {
      name: "serviceBooked",
      url: "/service-booked",
      active: "serviceBooked",
      permissionKey: ["serviceBooked"],
    },
    {
      name: "Services",
      url: "/service",
      active: "service",
      permissionKey: ["service"],
    },
  ].filter(
    (item) =>
      permission?.includes("all") ||
      item.permissionKey.some((key) => permission?.includes(key))
  );
};
