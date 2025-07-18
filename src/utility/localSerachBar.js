import { useLocation } from "react-router-dom";

const serchablepath = [
  "/notification",
  "/subscribed-user",
  "/news",
  "/events",
  "/notices",
  "/configuration/categories",
  "/configuration/users",
  "/configuration/reportDispute",
  "/internal_expenses",
  "/financial_reports",
  "/punyarjak",
  "/donation",
  "/commitment",
  "/hundi",
  "/cattle/info",
  "/cattle/medical-info",
  "/cattle/pregnancy-reports",
  "/stock-management/stock",
  "/stock-management/supplies",
  "/stock-management/usage",
  "/stock-management/item",
  // "/dharmshala/dashboard",
  "/booking/info",
  "/dharmshala/info",
  "/roomtype/info",
  "/feedback"

];
export const isSerchable = () => {
  const pathName = useLocation().pathname;
  return serchablepath.includes(pathName);
};

export const setPlaceholderSerchbar = () => {
  const pathName = useLocation().pathname;

  switch (pathName) {
    case "/notification":
      return "search_notification";
    case "/subscribed-user":
      return "search_subscribe_user";
    case "/news":
      return "search_news";
    case "/events":
      return "search_events";
    case "/notices":
      return "search_notices";
    case "/configuration/categories":
      return "search_categories";
    case "/configuration/users":
      return "search_users";
    case "/configuration/reportDispute":
      return "search_disputes";
    case "/internal_expenses":
      return "search_expenses";
    case "/financial_reports":
      return "search_financial_reports";
    case "/donation":
      return "search_donation";
    case "/punyarjak":
      return "search_punyarjak";
    case "/hundi":
      return "search_donation_box_collection";
    case "/commitment":
      return "search_commitment";
    case "/cattle/info":
      return "search_cattles";
    case "/cattle/medical-info":
      return "search_cattles_medical";
    case "/cattle/pregnancy-reports":
      return "search_cattles_pregnancy";
    case "/stock-management/stock":
      return "search_cattles_stock";
    case "/stock-management/supplies":
      return "search_cattles_supplies";
    case "/stock-management/usage":
      return "search_cattles_usage";
    case "/stock-management/item":
      return "search_cattles_items";
    // case "/dharmshala/dashboard":
    //   return "search_dharmshala";
    case "/booking/info":
      return "search_bookings";
    case "/dharmshala/info":
      return "search_buildings";
    case "/roomtype/info":
      return "search_roomtypes"
    case "/feedback":
      return "search_feedback"
    default:
      return "Search";
  }
};
