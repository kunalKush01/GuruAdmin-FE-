// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Components
import axios from 'axios'
import { Package } from 'react-feather'

// ** Custom Components
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { useTranslation } from 'react-i18next'
import { ConverFirstLatterToCapital } from '../../../formater'

const OrdersReceived = ({ statTitle,stats,SeriesName="",data=[] }) => {
  // ** State
  const {t}= useTranslation()
  

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
      // categories: [
      //   t("monthName_January"),
      //   t("monthName_February"),
      //   t("monthName_March"),
      //   t("monthName_April"),
      //   t("monthName_May"),
      //   t("monthName_June"),
      //   t("monthName_July"),
      //   t("monthName_August"),
      //   t("monthName_September"),
      //   t("monthName_October"),
      //   t("monthName_November"),
      //   t("monthName_December"),
      // ],
      type:"category",
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: true
      }
    },
    tooltip: {
      x: { show: false }
    },
    
  }

  const series = [
    {
      name:SeriesName,
      data:data?.map((item)=>{
        return {
          x:ConverFirstLatterToCapital(item?.month),
          y:parseInt(item?.amount)
        }
      })
    }
  ] 



  return data == null ? (
    <StatsWithAreaChart
      // icon={<Package size={21} />}
      color='warning'
      stats={stats}
      statTitle={statTitle}
      options={options}
      series={series}
      type='area'
      
    />
  ) : null
}
export default OrdersReceived
