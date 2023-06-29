// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Components
import axios from 'axios'
import { Package } from 'react-feather'

// ** Custom Components
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'

const OrdersReceived = ({ statTitle,stats,SeriesName="",data=[] }) => {
  // ** State
  

  const options = {
    chart: {
      id: 'revenue',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      }
    },
    grid: {
      show: false
    },
    
    colors: ["#FF8744"],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 1
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: .1,
        opacityFrom: 1,
        opacityTo: .3,
        
      }
    },

    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      }
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
    tooltip: {
      x: { show: false }
    },
    
  }
  
  const  series = [{
    name:SeriesName,
    data:data?.map((item)=>{
      return {
        x:item.month,
        y:item?.amount
      }
    }),
  }]
  console.log('stats',stats);

  return  (
    <StatsWithAreaChart
      // icon={<Package size={21} />}
      color='warning'
      stats={stats}
      statTitle={statTitle}
      options={options}
    //   series={[{
    //     name: "series-1",
    //     data: [30, 40, 45, 50, 49, 60, 70, 91]
    //  }]}
      series={series}
      type='area'
      
    />
  ) 
}
export default OrdersReceived
