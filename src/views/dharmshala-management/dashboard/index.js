import moment from "moment";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import SpinnerComponent from "../../../@core/components/spinner/Fallback-spinner"

import {
  getAllChartData,
  getAllDashboardData,
<<<<<<< Updated upstream
} from "../../../api/cattle/dashboard";
import CattleDashboardCard from "../../../components/cattleDashboardCard";
=======
  getAllRecentDonationList,
  getAllTopDonor,
} from "../../../api/dashboard";
import custcardImage3 from "../../../assets/images/icons/dashBoard/Group 24887.svg";
import RecentDonationTable from "../../../components/dashboard/recentDonationTable";
import { TopDonerList } from "../../../components/dashboard/topDonerList";
>>>>>>> Stashed changes
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import CustomCard from "../../../components/partials/customCard";
import { setCookieWithMainDomain } from "../../../utility/formater";
import { RevenueChart } from "../../../utility/revenueChart";
import OrdersReceived from "../../../utility/ui-elements/cards/statistics/OrdersReceived";
const Home = () => {
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [dashboardData, setDashboardData] = useState();
  const [topDonorData, setTopDonorData] = useState();
  const [recentDonationData, setRecentDonationData] = useState();
  const [chartData, setChart] = useState();

  const { t } = useTranslation();
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

  const history = useHistory();

  useEffect(() => {
    const dashboardInfo = async () => {
      const res = await getAllDashboardData({
        startDate: dropDownName === "dashboard_all" ? "" : filterStartDate,
        endDate: dropDownName === "dashboard_all" ? "" : filterEndDate,
      });
      setDashboardData(res);
    };
    dashboardInfo();
  }, [filterStartDate, filterEndDate, dropDownName]);

  useEffect(() => {
    const chartInfo = async () => {
      const chartRes = await getAllChartData();
      setChart(chartRes);
    };
    chartInfo();
  }, []);

  useEffect(() => {
    const topDonorInfo = async () => {
      const topDonorRes = await getAllTopDonor();

      setTopDonorData(topDonorRes);
    };
    topDonorInfo();
  }, []);

  useEffect(() => {
    const recentDonationInfo = async () => {
      const recentDonationRes = await getAllRecentDonationList();

      setRecentDonationData(recentDonationRes);
    };
    recentDonationInfo();
  }, []);

  return (
<<<<<<< Updated upstream
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Gowshala Dashboard</title>
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
=======
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm | Dharmshala Dashboard</title>
      </Helmet>
      {dashboardData && chartData && topDonorData && recentDonationData ? (
        <div className="pb-4">
          <ChangePeriodDropDown
            allFilter
            dropDownName={dropDownName}
            setdropDownName={(e) => setdropDownName(e.target.name)}
          />
          <div className="d-flex flex-wrap gap-1 justify-content-between mt-1 mb-lg-3">
            <OrdersReceived
              statTitle={t("total_rooms_available")}
              stats={parseInt(
                dashboardData?.donationReceived === undefined
                  ? 0
                  : dashboardData?.donationReceived
              )}
              warning={"primary"}
              data={dashboardData?.donationReceivedArr}
              SeriesName={"Donation Received"}
            />
            <OrdersReceived
              statTitle={t("roomtypes_available")}
              stats={parseInt(
                dashboardData?.donationPending === undefined
                  ? 0
                  : dashboardData?.donationPending
              )}
              warning={"primary"}
              data={dashboardData?.donationPendingArr}
              SeriesName={"Donation Pending"}
            />
            <OrdersReceived
              statTitle={t("total_bookings")}
              stats={parseInt(
                dashboardData?.totalExpenses === undefined
                  ? 0
                  : dashboardData?.totalExpenses
              )}
              warning={"primary"}
              data={dashboardData?.totalExpensesArr}
              SeriesName={"Total Expenses"}
            />
            <div
              className="cursor-pointer"
              onClick={() => history.push("/dharmshala/info")}
            >
              <CustomCard
                cardTitle={t("buildings_registered")}
                cardNumber={parseInt(
                  dashboardData?.subscribedUsers === undefined
                    ? 0
                    : dashboardData?.subscribedUsers
                )}
                cardImage={custcardImage3}
              />
            </div>
          </div>

          
          
        </div>
      ) : (
        <SpinnerComponent />
      )}
    </>
>>>>>>> Stashed changes
  );
};

export default Home;
