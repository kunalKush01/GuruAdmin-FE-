import ReactApexChart from "react-apexcharts";
import styled from "styled-components";

export const RevenueChart = () => {
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
    
  `;

  const series = [
    {
      name: "Donation",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66,100,55,99],
    },
    {
      name: "Commitment",
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94,50,95,50],
    },
    {
      name: "Total Expenses",
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41,100,60,22],
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 350,
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
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
    yaxis: {
      title: {
        text: "$ (thousands)",
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
      <p>Revenue Report</p>
      <ReactApexChart            
        options={options}
        series={series}
        type="bar"
        height={"400"}
      />
    </RevenueChartWarrper>
  );
};
