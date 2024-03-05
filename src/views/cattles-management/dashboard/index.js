import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import {
  getAllChartData,
  getAllDashboardData,
} from "../../../api/cattle/dashboard";
import CattleDashboardCard from "../../../components/cattleDashboardCard";
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import { RevenueChart } from "../../../utility/revenueChart";
import RecentRegisteredCattlesTable from "./recentRegisteredCattle";
import { Helmet } from "react-helmet";

const CattlesDashboard = () => {
  const { t } = useTranslation();

  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const periodDropDown = () => {
    switch (dropDownName) {
      case "dashboard_monthly":
        return "month";
      case "dashboard_yearly":
        return "year";
      case "dashboard_weekly":
        return "week";

      default:
        return "month";
    }
  };

  let filterStartDate = moment()
    .startOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();
  let filterEndDate = moment()
    .endOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();

  const dashboardData = useQuery(
    ["dashboardData", filterStartDate, filterEndDate, dropDownName],
    () =>
      getAllDashboardData({
        startDate: filterStartDate,
        endDate: filterEndDate,
      })
  );

  const chartData = useQuery(
    ["dashboardChartData", filterStartDate, filterEndDate, dropDownName],
    () =>
      getAllChartData({ startDate: filterStartDate, endDate: filterEndDate })
  );

  console.log("dashboardData", dashboardData, chartData);

  const series = [
    {
      name: t("cattles"),
      data: chartData?.data?.cattleArr?.map((item) => {
        console.log("item?.", item);
        return {
          x: item?.month,
          y: item?.data,
        };
      }),
    },

    {
      name: t("cattles_feed"),
      data: chartData?.data?.feedArr?.map((item) => {
        return {
          x: item?.month,
          y: item.quantity,
        };
      }),
    },

    {
      name: t("cattles_medical"),
      data: chartData?.data?.cattleMedicalArr?.map((item) => {
        return {
          x: item?.month,
          y: item.data,
        };
      }),
    },

    {
      name: t("cattles_death"),
      data: chartData?.data?.cattleDeathArr?.map((item) => {
        return {
          x: item?.month,
          y: item?.data,
        };
      }),
    },

    // {
    //   name: t("report_expences"),
    //   data: chartData?.data?.expenseArr?.map((item) => {
    //     return {
    //       x: item?.month,
    //       y: item?.amount,
    //     };
    //   }),
    // },
  ];

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharam Admin | Cattle Management Dashboard</title>
      </Helmet>

      <ChangePeriodDropDown
        allFilter
        dropDownName={dropDownName}
        setdropDownName={(e) => setdropDownName(e.target.name)}
      />

      <div className="d-flex gap-5 mt-2 mb-3">
        <CattleDashboardCard
          // ShowSubDetails
          title="Total Registered Cattles"
          number={dashboardData?.data?.totalCattles?.totalCattle ?? 0}
          data={[
            {
              heading: "Cow",
              value: dashboardData?.data?.totalCattles?.cow ?? 0,
            },
            {
              heading: "Calf",
              value: dashboardData?.data?.totalCattles?.calf ?? 0,
            },
            {
              heading: "Bull",
              value: dashboardData?.data?.totalCattles?.bull ?? 0,
            },
            {
              heading: "Others",
              value: dashboardData?.data?.totalCattles?.other ?? 0,
            },
          ]}
        />

        {/* <CattleDashboardCard
          title="Total Expense for Cattles"
          number={dashboardData?.data?.itemExpense ?? 0}
          showRupeesSymbol
        /> */}

        <CattleDashboardCard
          showRupeesSymbol
          ShowSubDetails
          title="Total Donation for Cattles"
          number={dashboardData?.data?.donationReceived ?? 0}
          data={[
            {
              heading: " Private Donors",
              value: dashboardData?.data?.privateDonationReceived ?? 0,
            },
            {
              heading: "Govt aid",
              value: dashboardData?.data?.govDonationReceived ?? 0,
            },
          ]}
        />

        <CattleDashboardCard
          title="Cattles Death Registered"
          number={dashboardData?.data?.deathCattle ?? 0}
        />
      </div>
      {chartData?.isFetching && chartData?.isLoading ? (
        <Skeleton height="450px" />
      ) : (
        <RevenueChart
          chartHeading="cattle_revenueHeading"
          cattleSeries={series}
          barColors={["#FF8744", "#00D20E", "#00A2FF", "#FF0700", "#FFE600"]}
          // TotalExpensesData={chartData?.expenseAmountArr}
        />
      )}

      {/* <RecentRegisteredCattlesTable data={[]} /> */}
    </div>
  );
};

export default CattlesDashboard;
