import HomeIcon from "../../assets/images/icons/home.svg";
import HomeActiveIcon from "../../assets/images/icons/home-active.svg";
import PunyarjakIcon from "../../assets/images/icons/punyarjak.svg";
import PunyarjakIconActive from "../../assets/images/icons/punyarjak-active.svg";
import GowshalaIcon from "../../assets/images/icons/gowshala.svg";
import GowshalaIconActive from "../../assets/images/icons/gowshala-active.svg";
import DonationIcon from "../../assets/images/icons/donation.svg";
import DonationIconActive from "../../assets/images/icons/donation-active.svg";
import DonationBoxIcon from "../../assets/images/icons/donationbox.svg";
import DonationBoxIconActive from "../../assets/images/icons/donationbox-active.svg";
import CommitmentIcon from "../../assets/images/icons/commitment.svg";
import CommitmentIconActive from "../../assets/images/icons/commitment-active.svg";
import FinancialReportsIcon from "../../assets/images/icons/financialreport.svg";
import FinancialReportsIconActive from "../../assets/images/icons/financialreport-active.svg";
import ExpensesIcon from "../../assets/images/icons/expenses.svg";
import ExpensesIconActive from "../../assets/images/icons/expenses-active.svg";
import EventsIcon from "../../assets/images/icons/event.svg";
import EventsIconActive from "../../assets/images/icons/event-active.svg";
import NewsIcon from "../../assets/images/icons/news.svg";
import NewsIconActive from "../../assets/images/icons/news-active.svg";
import NoticeIcon from "../../assets/images/icons/notice.svg";
import NoticeIconActive from "../../assets/images/icons/notice-active.svg";
import CategoryIcon from "../../assets/images/icons/configuration.svg";
import CategoryIconActive from "../../assets/images/icons/configuration-active.svg";
import SubadminIcon from "../../assets/images/icons/subadmin.svg";
import SubadminIconActive from "../../assets/images/icons/subadmin-active.svg";
import ReportDisputeIcon from "../../assets/images/icons/reportdispute.svg";
import ReportDisputeIconActive from "../../assets/images/icons/reportdispute-active.svg";
import ConfigurationIcon from "../../assets/images/icons/configuration.svg";
import ConfigurationIconActive from "../../assets/images/icons/configuration-active.svg";

import BookingIcon from "../../assets/images/icons/dharmshala/booking.svg";
import BuildingIcon from "../../assets/images/icons/dharmshala/building.svg";
import DharmshalaIcon from "../../assets/images/icons/dharmshala/dharmshala.svg";
import FeedbackIcon from "../../assets/images/icons/dharmshala/feedback.svg";
import RoomTypeIcon from "../../assets/images/icons/dharmshala/roomtype.svg";

export const subHeaderContent = [
  {
    name: "dashboard",
    url: "/dashboard",
    activeTab: "/dashboard",
    icon: HomeIcon,
    activeIcon: HomeActiveIcon,
  },

  {
    name: "cattles_management",
    url: "/cattle/dashboard",
    activeTab: "/cattle",
    isCattle: "Gaushala",
    innerPermissions: [
      "cattle-dashboard",
      "cattle-medical",
      "cattle-pregnancy",
      "cattle-stock",
      "cattle-supplies",
      "cattle-item",
      "cattle-usage",
      "cattle-category",
      "cattle-breed",
    ],
  },
  {
    name: "dharmshala_management",
    url: "/dharmshala/dashboard",
    activeTab: "/dharmshala",
    innerPermissions: [
      "dharmshala-dashboard",
      "dharmshala-bookings",
      "dharmshala-buildings",
      "dharmshala-roomtypes",
      "dharmshala-feedback",
    ],
    icon: DharmshalaIcon,
  },

  {
    name: "donation",
    url: "/donation",
    activeTab: "/donation",
    icon: DonationIcon,
  },

  {
    name: "commitment",
    url: "/commitment",
    activeTab: "/commitment",
    icon: CommitmentIcon,
  },
  {
    name: "hundi",
    url: "/hundi",
    activeTab: "/hundi",
    icon: DonationBoxIcon,
  },

  {
    name: "financial_reports",
    url: "/financial_reports",
    activeTab: "/financial_reports",
    icon: FinancialReportsIcon,
  },

  {
    name: "internal_expenses",
    url: "/internal_expenses",
    activeTab: "/internal_expenses",
    icon: ExpensesIcon,
  },

  {
    name: "events",
    url: "/events",
    activeTab: "/events",
    icon: EventsIcon,
  },

  {
    name: "news",
    url: "/news",
    activeTab: "/news",
    icon: NewsIcon,
  },

  {
    name: "notices",
    url: "/notices",
    activeTab: "/notices",
    icon: NoticeIcon,
  },
  {
    name: "punyarjak",
    url: "/punyarjak",
    activeTab: "/punyarjak",
    icon: PunyarjakIcon,
  },
  {
    name: "configuration",
    url: "/configuration",
    activeTab: "/configuration",
    icon: ConfigurationIcon,
    children: [
      {
        name: "category",
        url: "/configuration/categories",
        icon: CategoryIcon,
        icon: CategoryIconActive,
      },
      {
        name: "user",
        url: "/configuration/users",
        icon: SubadminIcon,
        icon: SubadminIconActive,
      },
    ],
  },
  {
    name: "report_Dispute",
    url: "/configuration/reportDispute",
    icon: ReportDisputeIcon,
    icon: ReportDisputeIconActive,
  },
];

export const subHeaderContentResponsive = [
  {
    name: "dashboard",
    url: "/dashboard",
    activeTab: "/dashboard",
    icon: HomeIcon,
    activeIcon: HomeActiveIcon,
  },

  {
    name: "cattles_management",
    url: "/cattle/dashboard",
    activeTab: "/cattle",
    isCattle: "Gaushala",
    icon: GowshalaIcon,
    activeIcon: GowshalaIconActive,
  },
  {
    name: "dharmshala_management",
    //url: "/dharmshala/dashboard",
    //activeTab: "/dharmshala",
    icon: DharmshalaIcon,
    activeIcon: DharmshalaIcon,
    children: [
      {
        name: "Overview",
        url: "/dharmshala/dashboard",
        icon: DharmshalaIcon,
        activeIcon: DharmshalaIcon,
      },
      {
        name: "Bookings",
        url: "/booking/info",
        icon: BookingIcon,
        activeIcon: BookingIcon,
      },
      {
        name: "Buildings",
        url: "/dharmshala/info",
        icon: BuildingIcon,
        activeIcon: BuildingIcon,
      },
      {
        name: "Room Types",
        url: "/roomtype/info",
        icon: RoomTypeIcon,
        activeIcon: RoomTypeIcon,
      },
      {
        name: "Feedback",
        url: "/feedback",
        icon: FeedbackIcon,
        activeIcon: FeedbackIcon,
      },
    ],
  },
  {
    name: "donation",
    url: "/donation",
    activeTab: "/donation",
    icon: DonationIcon,
    activeIcon: DonationIconActive,
  },

  {
    name: "commitment",
    url: "/commitment",
    activeTab: "/commitment",
    icon: CommitmentIcon,
    activeIcon: CommitmentIconActive,
  },
  {
    name: "hundi",
    url: "/hundi",
    activeTab: "/hundi",
    icon: DonationBoxIcon,
    activeIcon: DonationBoxIconActive,
  },

  {
    name: "financial_reports",
    url: "/financial_reports",
    activeTab: "/financial_reports",
    icon: FinancialReportsIcon,
    activeIcon: FinancialReportsIconActive,
  },

  {
    name: "internal_expenses",
    url: "/internal_expenses",
    activeTab: "/internal_expenses",
    icon: ExpensesIcon,
    activeIcon: ExpensesIconActive,
  },

  {
    name: "events",
    url: "/events",
    activeTab: "/events",
    icon: EventsIcon,
    activeIcon: EventsIconActive,
  },

  {
    name: "news",
    url: "/news",
    activeTab: "/news",
    icon: NewsIcon,
    activeIcon: NewsIconActive,
  },

  {
    name: "notices",
    url: "/notices",
    activeTab: "/notices",
    icon: NoticeIcon,
    activeIcon: NoticeIconActive,
  },
  {
    name: "punyarjak",
    url: "/punyarjak",
    activeTab: "/punyarjak",
    icon: PunyarjakIcon,
    activeIcon: PunyarjakIconActive,
  },
  {
    name: "configuration",
    activeTab: "/configuration",
    icon: ConfigurationIcon,
    activeIcon: ConfigurationIcon,
    children: [
      {
        name: "category",
        url: "/configuration/categories",
        icon: CategoryIcon,
        activeIcon: CategoryIconActive,
      },
      {
        name: "user",
        url: "/configuration/users",
        icon: SubadminIcon,
        activeIcon: SubadminIconActive,
      },
    ],
    // url: "/configuration",
  },
  {
    name: "report_Dispute",
    url: "/configuration/reportDispute",
    icon: ReportDisputeIcon,
    activeIcon: ReportDisputeIconActive,
  },
];
