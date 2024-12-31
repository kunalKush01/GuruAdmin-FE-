export const sevaHeader = (permission) => {
    return [
      {
        name: "Bookings",
        url: "/service-booking",
        active: "/service-booking",
        permissionKey: ["service-booking"],
      },
      {
        name: "Services",
        url: "/service",
        active: "service",
        permissionKey: ["service"],
      }
    ].filter(
      (item) =>
        permission?.includes("all") ||
        item.permissionKey.some((key) => permission?.includes(key))
    );
  };