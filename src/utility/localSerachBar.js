import { findKey } from "lodash";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

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
      return "search_donation_box";
    case "/commitment":
      return "search_commitment";
    default:
      return "Search";
  }
};
