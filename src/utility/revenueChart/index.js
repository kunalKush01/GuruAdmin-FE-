import ReactApexChart from "react-apexcharts";
import { useTranslation, Trans } from "react-i18next";
import styled from "styled-components";
const RevenueChartWarrper = styled.div`
    .apexcharts-toolbar {
      display: none;
    }
    .apexcharts-legend {
      position: relative !important;
      justify-content: end !important;
    }
    p {
      color: #583703;
      font: normal normal bold 25px/50px Noto Sans;
    }
    .apexcharts-legend-text {
      color: #583703 !important;
    }
    .apexcharts-xaxis-label {
      fill: #583703 !important;
      font: normal normal bold 11px/24px Noto Sans;
    }
    .apexcharts-yaxis-label {
      fill: #583703 !important;
      font: normal normal bold 11px/24px Noto Sans;
    }
  `;
export const RevenueChart = ({
  DonationData = [],
  TotalExpensesData = [],
  CommittmentData = [],
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
      name: t("commitment"),
      data: CommittmentData?.map((item) => {
        return {
          x: item.month,
          y: item.amount,
        };
      }),
    },
    {
      name: t("dashboard_totalExpenses"),
      data: TotalExpensesData?.map((item) => {
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
      fontFamily: " Noto Sans",
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
    colors: ["#FF8744", "#FFDEB8", "#FF0700"],
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      type: "category",
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          // Customize the label value based on your requirements
          // const formattedValue = value.toFixed(2).replace(/\d(?=(\d{2})+\d{3})/g, '$&,');
          // return `₹${formattedValue}`;
          return `₹${value.toLocaleString('en-IN')}`; // Add a dollar sign to the label value
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => {
          return "₹" + val.toLocaleString('en-IN');
        },
      },
    },
  };

  return (
    <RevenueChartWarrper id="chart">
      <p>
        {" "}
        <Trans i18nKey={"dashboard_RevenueReport"} />
      </p>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={"450"}
      />
    </RevenueChartWarrper>
  );
};
