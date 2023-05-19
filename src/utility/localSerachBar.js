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
      return "Search All Notification";
    case "/subscribed-user":
      return "Search All Subscribed User";
    case "/news":
      return "Search All News";
    case "/events":
      return "Search All Events ";
    case "/notices":
      return "Search All Notices ";
    case "/configuration/categories":
      return "Search All Categories";
    case "/configuration/users":
      return "Search All Users";
    case "/configuration/reportDispute":
      return "Search All report and Dispute";
    case "/internal_expenses":
      return "Search All Expenses";
    case "/financial_reports":
      return "Search All Financial Reports";
    case "/donation":
      return "Search All Donation";
      case "/punyarjak":
      return "Search All Punyarjak";
    case "/hundi":
      return "Search All Donation Collection Box";
    case "/commitment":
      return "Search All Commitment ";
    default:
      return "Search";
  }
};
