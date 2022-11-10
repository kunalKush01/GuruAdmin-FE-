import ReactApexChart from "react-apexcharts";
import { useTranslation,Trans } from "react-i18next";
import styled from "styled-components";

export const RevenueChart = () => {
  const {t}= useTranslation()

  const RevenueChartWarrper = styled.div`
    .apexcharts-toolbar{
      display: none;
    }
    .apexcharts-legend{
      position: relative !important;
      justify-content: end !important;
    }
    p{
      color: #583703;
      font: normal normal bold 25px/50px Noto Sans
    }
    .apexcharts-legend-text {
      color: #583703 !important;
    }
    .apexcharts-xaxis-label  {
      fill: #583703 !important;
      font: normal normal bold 11px/24px Noto Sans;
    }
    .apexcharts-yaxis-label  {
      fill: #583703 !important;
      font: normal normal bold 11px/24px Noto Sans;
    }
    
  `;

  const series = [
    {
      name: t("donation"),
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66,100,55,99],
    },
    {
      name: t("committment"),
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94,50,95,50],
    },
    {
      name: t("dashboard_totalExpenses"),
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41,100,60,22],
    },
  ];

  const options = {
    
    
    chart: {
      type: "bar",
      height: 350,
      fontFamily: " Noto Sans",
      fontColors:"#583703",
      
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
      
      categories: [
        t("monthName_January"),
        t("monthName_February"),
        t("monthName_March"),
        t("monthName_April"),
        t("monthName_May"),
        t("monthName_June"),
        t("monthName_July"),
        t("monthName_August"),
        t("monthName_September"),
        t("monthName_October"),
        t("monthName_November"),
        t("monthName_December"),
      ],
    },
    yaxis: {
      title: {
        // text: "$ (thousands)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => {
          return "$ " + val + " thousands";
        },
      },
    },
  };

  return (
    <RevenueChartWarrper id="chart">
     <p> <Trans  i18nKey={"dashboard_RevenueReport"}  /></p>
      <ReactApexChart  
              
        options={options}
        series={series}
        type="bar"
        height={"400"}
      />
    </RevenueChartWarrper>
  );
};
