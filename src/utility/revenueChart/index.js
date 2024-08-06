import ReactApexChart from "react-apexcharts";
import { Trans, useTranslation } from "react-i18next";
import "../../assets/scss/viewCommon.scss";

const getCssVariableValue = (variable) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
};

const defaultBarColors = [
  getCssVariableValue("--green"),
  getCssVariableValue("--yellow"),
  getCssVariableValue("--red"),
];

export const RevenueChart = ({
  DonationData = [],
  CommitmentData = [],
  ExpenseData = [],
  chartHeading,
  cattleSeries,
  barColors = defaultBarColors,
}) => {
  const { t } = useTranslation();

  const series = [
    {
      name: t("donation_hundi"),
      data: DonationData?.map((item) => {
        return {
          x: item.month,
          y: item?.amount,
        };
      }),
    },
    {
      name: t("Pledge"),
      data: CommitmentData?.map((item) => {
        return {
          x: item.month,
          y: item.amount,
        };
      }),
    },
    {
      name: t("Expense"),
      data: ExpenseData?.map((item) => {
        return {
          x: item.month,
          y: item.amount,
        };
      }),
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 350,
      fontFamily: "Noto Sans",
      fontColors: "#583703",
      background: "#FFFFFF",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: barColors,
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return `₹${value.toLocaleString("en-IN")}`;
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => {
          return !cattleSeries ? "₹" + val.toLocaleString("en-IN") : val;
        },
      },
    },
  };

  return (
    <div className="revenue-chart-wrapper" id="chart">
      <p>
        <Trans i18nKey={chartHeading} />
      </p>
      <ReactApexChart
        options={options}
        series={cattleSeries ? cattleSeries : series}
        type="bar"
        height={"300"}
      />
    </div>
  );
};
