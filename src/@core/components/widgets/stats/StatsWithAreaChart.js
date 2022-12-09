// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import { Card, CardBody } from 'reactstrap'

// ** Default Options
import { areaChartOptions } from './ChartOptions'
import styled from 'styled-components'
import { numberWithCommas } from '../../../../utility/formater'

const StatsWithAreaChart = props => {
  // ** Props
  const { icon, color, stats, statTitle, series, options, type, height, className, ...rest } = props
  const ChartCardWarraper = styled.div`
      
      font: normal normal bold 25px/20px Noto Sans;
      .chartCard{
        background-color: #FFF7E8;
        width: auto;
        height: auto;
        color: #583703;
      }
      
      .card-text{
        font: normal normal normal 16px/20px Noto Sans
      }
  
  `

  const sta=numberWithCommas(stats)
  return (
    <ChartCardWarraper>
    <Card {...rest} className="chartCard mb-0" >
      <CardBody
        className={classnames('pb-0', {
          [className]: className
        })}
      >
        {/* <Avatar className='avatar-stats p-50 m-0' color={`light-${color}`} icon={icon} /> */}
        <p className='card-text'>{statTitle}</p>
        <p className='fw-bolder mt-1  '>₹ {sta}</p>
      </CardBody>
      <Chart options={options}  series={series} type={type} height={height ? height : 100}  />
    </Card>
    </ChartCardWarraper>
  )
}

export default StatsWithAreaChart

// ** PropTypes
StatsWithAreaChart.propTypes = {
  type: PropTypes.string,
  height: PropTypes.string,
  options: PropTypes.object,
  className: PropTypes.string,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  stats: PropTypes.string.isRequired,
  series: PropTypes.array.isRequired,
  statTitle: PropTypes.string.isRequired
}

// ** Default Props
StatsWithAreaChart.defaultProps = {
  color: 'primary',
  options: areaChartOptions
}
