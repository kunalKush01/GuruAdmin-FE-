import "../../../../assets/scss/variables/_variables.scss";

// ** React Imports

// ** Third Party Components

// ** Custom Components
import StatsWithAreaChart from "@components/widgets/stats/StatsWithAreaChart";

const getCssVariableValue = (variable) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
};

// Example of accessing bar colors
// useEffect(() => {
//   const primaryColor = getCssVariableValue("--primary-color");
//   console.log(primaryColor); // Should log the primary color from your CSS variable
// }, []);

const DashboardStatsCard = ({
  statTitle,
  stats,
  SeriesName = "",
  data = [],
}) => {
  const primarycolor = getCssVariableValue("--primary-color");
  const options = {
    chart: {
      id: "revenue",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    grid: {
      show: false,
    },

    colors: [primarycolor],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.1,
        opacityFrom: 1,
        opacityTo: 0.3,
      },
    },

    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
        formatter: function (value) {
          // Customize the label value based on your requirements
          // const formattedValue = value.toFixed(2).replace(/\d(?=(\d{2})+\d{3})/g, '$&,');
          // return `₹${formattedValue}`;
          return `₹${value.toLocaleString("en-IN")}`; // Add a dollar sign to the label value
        },
      },
    },
    tooltip: {
      x: { show: false },
    },
  };

  const series = [
    {
      name: SeriesName,
      data: data?.map((item) => {
        return {
          x: item.month,
          y: item?.amount,
        };
      }),
    },
  ];

  return (
    <StatsWithAreaChart
      // icon={<Package size={21} />}
      //color="warning"
      stats={stats}
      statTitle={statTitle}
      options={options}
      //   series={[{
      //     name: "series-1",
      //     data: [30, 40, 45, 50, 49, 60, 70, 91]
      //  }]}
      series={series}
      type="area"
    />
  );
};
export default DashboardStatsCard;
