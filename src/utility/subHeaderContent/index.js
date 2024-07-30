import BookingIcon from '../../assets/images/icons/dharmshala/booking.svg';
import BuildingIcon from '../../assets/images/icons/dharmshala/building.svg';
import DharmshalaIcon from '../../assets/images/icons/dharmshala/dharmshala.svg';
import FeedbackIcon from '../../assets/images/icons/dharmshala/feedback.svg';
import RoomTypeIcon from '../../assets/images/icons/dharmshala/roomtype.svg';
import HomeIcon from '../../assets/images/icons/home.svg';
import PunyarjakIcon from '../../assets/images/icons/punyarjak.svg';
import GowshalaIcon from '../../assets/images/icons/gowshala.svg';
import DonationIcon from '../../assets/images/icons/donation.svg';
import DonationBoxIcon from '../../assets/images/icons/donationbox.svg';
import CommitmentIcon from '../../assets/images/icons/commitment.svg';
import FinancialReportsIcon from '../../assets/images/icons/financialreport.svg';
import ExpensesIcon from '../../assets/images/icons/expenses.svg';
import EventsIcon from '../../assets/images/icons/event.svg';
import NewsIcon from '../../assets/images/icons/news.svg';
import NoticeIcon from '../../assets/images/icons/notice.svg';
import CategoryIcon from '../../assets/images/icons/configuration.svg';
import SubadminIcon from '../../assets/images/icons/subadmin.svg';
import ReportDisputeIcon from '../../assets/images/icons/reportdispute.svg';
import ConfigurationIcon from '../../assets/images/icons/configuration.svg';

export const subHeaderContent = [
  {
    name: "dashboard",
    url: "/dashboard",
    activeTab: "/dashboard",
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
  },

  {
    name: "donation",
    url: "/donation",
    activeTab: "/donation",
  },

  {
    name: "commitment",
    url: "/commitment",
    activeTab: "/commitment",
  },
  {
    name: "hundi",
    url: "/hundi",
    activeTab: "/hundi",
  },

  {
    name: "financial_reports",
    url: "/financial_reports",
    activeTab: "/financial_reports",
  },

  {
    name: "internal_expenses",
    url: "/internal_expenses",
    activeTab: "/internal_expenses",
  },

  {
    name: "events",
    url: "/events",
    activeTab: "/events",
  },

  {
    name: "news",
    url: "/news",
    activeTab: "/news",
  },

  {
    name: "notices",
    url: "/notices",
    activeTab: "/notices",
  },
  {
    name: "punyarjak",
    url: "/punyarjak",
    activeTab: "/punyarjak",
  },
  {
    name: "configuration",
    url: "/configuration",
    activeTab: "/configuration",
  },
];

export const subHeaderContentResponsive = [
  {
    name: "dashboard",
    url: "/dashboard",
    activeTab: "/dashboard",
    icon:HomeIcon,
  },

  {
    name: "cattles_management",
    url: "/cattle/dashboard",
    activeTab: "/cattle",
    isCattle: "Gaushala",
    icon:GowshalaIcon,
  },
  {
    name: "dharmshala_management",
    //url:"/dharmshala/dashboard",
    activeTab: "/dharmshala",
    //icon:DharmshalaIcon,
    children: [
      {
        name: "Bookings",
        url: "/booking/info",
        icon:BookingIcon,
      },
      {
        name: "Buildings",
        url: "/dharmshala/info",
        icon:BuildingIcon,

      },
      {
        name: "Room Types",
        url: "/roomtype/info",
        icon:RoomTypeIcon,

      },
      {
        name: "Feedback",
        url: "/feedback",
        icon:FeedbackIcon,

      }
    ],
  },
  {
    name: "donation",
    url: "/donation",
    activeTab: "/donation",
    icon:DonationIcon,
  },

  {
    name: "commitment",
    url: "/commitment",
    activeTab: "/commitment",
    icon:CommitmentIcon,
  },
  {
    name: "hundi",
    url: "/hundi",
    activeTab: "/hundi",
    icon:DonationBoxIcon,
  },

  {
    name: "financial_reports",
    url: "/financial_reports",
    activeTab: "/financial_reports",
    icon:FinancialReportsIcon,
  },

  {
    name: "internal_expenses",
    url: "/internal_expenses",
    activeTab: "/internal_expenses",
    icon:ExpensesIcon,
  },

  {
    name: "events",
    url: "/events",
    activeTab: "/events",
    icon:EventsIcon,
  },

  {
    name: "news",
    url: "/news",
    activeTab: "/news",
    icon:NewsIcon,
  },

  {
    name: "notices",
    url: "/notices",
    activeTab: "/notices",
    icon:NoticeIcon,
  },
  {
    name: "punyarjak",
    url: "/punyarjak",
    activeTab: "/punyarjak",
    icon:PunyarjakIcon,
  },
  {
    name: "configuration",
    activeTab: "/configuration",
    //icon:ConfigurationIcon,
    children: [
      {
        name: "category",
        url: "/configuration/categories",
        icon:CategoryIcon,
      },
      {
        name: "user",
        url: "/configuration/users",
        icon:SubadminIcon,
      },
      {
        name: "report_Dispute",
        url: "/configuration/reportDispute",
        icon:ReportDisputeIcon,
      },
    ],
    // url: "/configuration",
  },
];
