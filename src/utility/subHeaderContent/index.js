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
import MembershipIcon from "../../assets/images/icons/membership.svg";
import ReportDisputeIconActive from "../../assets/images/icons/reportdispute-active.svg";
import ConfigurationIcon from "../../assets/images/icons/configuration.svg";
import ConfigurationIconActive from "../../assets/images/icons/configuration-active.svg";

import BookingIcon from "../../assets/images/icons/dharmshala/booking.svg";
import BuildingIcon from "../../assets/images/icons/dharmshala/building.svg";
import DharmshalaIcon from "../../assets/images/icons/dharmshala/dharmshala.svg";
import FeedbackIcon from "../../assets/images/icons/dharmshala/feedback.svg";
import RoomTypeIcon from "../../assets/images/icons/dharmshala/roomtype.svg";
import GaushalaInfo from "../../assets/images/icons/gaushalaInfo.svg";
import GaushalaOverview from "../../assets/images/icons/gaushalaOverview.svg";
import Gaushala from "../../assets/images/icons/gaushala.svg";
import Inventory from "../../assets/images/icons/inventory.svg";
import items from "../../assets/images/icons/items.svg";
import MedicalRecords from "../../assets/images/icons/medicalRecord.svg";
import PashudhanBreed from "../../assets/images/icons/pashudhanBreed.svg";
import PashudhanCategory from "../../assets/images/icons/pashudhanCategory.svg";
import PregnancyRecords from "../../assets/images/icons/pregnancyRecords.svg";
import Stock from "../../assets/images/icons/stock.svg";
import Supplies from "../../assets/images/icons/supplies.svg";
import Usage from "../../assets/images/icons/usage.svg";

import GaushalaInfoActiveIcon from "../../assets/images/icons/gaushalaInfo.svg";
import GaushalaOverviewActiveIcon from "../../assets/images/icons/gaushalaOverview.svg";
import GaushalaActiveIcon from "../../assets/images/icons/gaushala.svg";
import InventoryActiveIcon from "../../assets/images/icons/inventory.svg";
import itemsActiveIcon from "../../assets/images/icons/items.svg";
import MedicalRecordsActiveIcon from "../../assets/images/icons/medicalRecord.svg";
import PashudhanBreedActiveIcon from "../../assets/images/icons/pashudhanBreed.svg";
import PashudhanCategoryActiveIcon from "../../assets/images/icons/pashudhanCategory.svg";
import PregnancyRecordsActiveIcon from "../../assets/images/icons/pregnancyRecords.svg";
import StockActiveIcon from "../../assets/images/icons/stock.svg";
import SuppliesActiveIcon from "../../assets/images/icons/supplies.svg";
import UsageActiveIcon from "../../assets/images/icons/usage.svg";

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
    activeTab: "/dharmshala/dashboard",
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
    children: [
      {
        name: "cattle-dashboard",
        customLabel: "Overview",
        url: "/cattle/dashboard",
        icon: GaushalaOverview,
        activeIcon: GaushalaOverviewActiveIcon,
      },
      {
        name: "cattle-info",
        customLabel: "Pashudhan",
        url: "/cattle/info",
        icon: GaushalaInfo,
        activeIcon: GaushalaInfoActiveIcon,
      },
      {
        name: "cattle-medical",
        customLabel: "Medical",
        url: "/cattle/medical-info",
        icon: MedicalRecords,
        activeIcon: MedicalRecordsActiveIcon,
      },
      {
        name: "cattle-pregnancy",
        customLabel: "Pregnancy",
        url: "/cattle/pregnancy-reports",
        icon: PregnancyRecords,
        activeIcon: PregnancyRecordsActiveIcon,
      },
      // {
      //   name: "cattle-stock",
      //   customLabel: "Stock Management",
      //   url: "/cattle/management/stock",
      //   icon: GowshalaIcon,
      //   activeIcon: GowshalaIconActive,
      // },
    ],
  },
  {
    name: "dharmshala/dashboard",
    customLabel: "Dharmshala",
    activeTab: "/dharmshala/dashboard",
    icon: DharmshalaIcon,
    activeIcon: DharmshalaIcon,
    children: [
      {
        name: "dharmshala/dashboard",
        customLabel: "Overview",
        url: "/dharmshala/dashboard",
        icon: DharmshalaIcon,
        activeIcon: DharmshalaIcon,
      },
      {
        name: "dharmshala/bookings",
        customLabel: "Bookings",
        url: "/booking/info",
        icon: BookingIcon,
        activeIcon: BookingIcon,
      },
      {
        name: "dharmshala/buildings",
        customLabel: "Buildings",
        url: "/dharmshala/info",
        icon: BuildingIcon,
        activeIcon: BuildingIcon,
      },
      {
        name: "dharmshala/roomtypes",
        customLabel: "Room Types",
        url: "/roomtype/info",
        icon: RoomTypeIcon,
        activeIcon: RoomTypeIcon,
      },
      {
        name: "dharmshala/feedback",
        customLabel: "Feedback",
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
    name: "membership",
    url: "/membership",
    icon: MembershipIcon,
    activeIcon: MembershipIcon,
  },
  {
    name: "financial_reports",
    url: "/financial_reports",
    activeTab: "/financial_reports",
    icon: FinancialReportsIcon,
    activeIcon: FinancialReportsIconActive,
  },
  {
    name: "cattles",
    customLabel: "Inventory",
    activeTab: "/cattle/management/stock",
    icon: Inventory,
    activeIcon: InventoryActiveIcon,
    children: [
      {
        name: "cattle-stock",
        customLabel: "Stock",
        url: "/cattle/management/stock",
        icon: Stock,
        activeIcon: StockActiveIcon,
      },
      {
        name: "cattle-supplies",
        customLabel: "Supplies",
        url: "/cattle/management/supplies",
        icon: Supplies,
        activeIcon: SuppliesActiveIcon,
      },
      {
        name: "cattle-usage",
        customLabel: "Usage",
        url: "/cattle/management/usage",
        icon: Usage,
        activeIcon: UsageActiveIcon,
      },
      {
        name: "cattle-item",
        customLabel: "Items",
        url: "/cattle/management/item",
        icon: items,
        activeIcon: itemsActiveIcon,
      },
    ],
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
        name: "masters",
        url: "/configuration/masters",
        icon: ConfigurationIcon,
        activeIcon: ConfigurationIcon,
      },
      {
        name: "custom_field",
        url: "/configuration/custom-fields",
        icon: ConfigurationIcon,
        activeIcon: ConfigurationIcon,
      },
      {
        name: "user",
        url: "/configuration/users",
        icon: SubadminIcon,
        activeIcon: SubadminIconActive,
      },
      {
        name: "cattle-breed",
        customLabel: "Pashu Breed",
        url: "/configuration/cattle-breed",
        icon: PashudhanBreed,
        activeIcon: PashudhanBreedActiveIcon,
      },
      {
        name: "cattle-category",
        customLabel: "Pashu Category",
        url: "/configuration/cattle-category",
        icon: PashudhanCategory,
        activeIcon: PashudhanCategoryActiveIcon,
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
