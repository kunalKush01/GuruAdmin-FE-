import ReactApexChart from "react-apexcharts";
import { Trans, useTranslation } from "react-i18next";
import '../../styles/viewCommon.scss';

export const RevenueChart = ({
  DonationData = [],
  CommitmentData = [],
  chartHeading,
  cattleSeries,
  barColors = ["#FF8744", "#FFDEB8", "#FF0700"],
}) => {
  const { t } = useTranslation();

  const series = [
    {
      name: t("donation_hundi"),
      data: DonationData?.map((item) => ({
        x: item.month,
        y: item?.amount,
      })),
    },
    {
      name: t("commitment"),
      data: CommitmentData?.map((item) => ({
        x: item.month,
        y: item.amount,
      })),
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 350,
      fontFamily: "Noto Sans",
      fontColors: "#583703",
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
        height={"450"}
      />
    </div>
  );
};