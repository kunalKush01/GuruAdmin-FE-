// ** Custom Components

// ** Third Party Components
import classnames from "classnames";
import PropTypes from "prop-types";
import Chart from "react-apexcharts";

// ** Reactstrap Imports
import { Card, CardBody } from "reactstrap";

// ** Default Options
import "../../../../assets/scss/viewCommon.scss";
import { numberWithCommas } from "../../../../utility/formater";
import { areaChartOptions } from "./ChartOptions";

const StatsWithAreaChart = (props) => {
  // ** Props
  const {
    icon,
    color,
    stats,
    statTitle,
    series,
    options,
    type,
    height,
    className,
    ...rest
  } = props;

  const sta = numberWithCommas(stats);
  return (
    <div className="chart-card-wrapper">
      <Card {...rest} className="chart-card mb-0">
        <CardBody
          className={classnames("pb-0", {
            [className]: className,
          })}
        >
          <p className="card-text">{statTitle}</p>
          <p className="fw-bolder mt-1 overflow-hidden" title={`₹ ${sta}`}>
            ₹{sta}
          </p>
        </CardBody>
        <Chart
          options={options}
          series={series}
          type={type}
          height={height ? height : 100}
        />
      </Card>
    </div>
  );
};

export default StatsWithAreaChart;

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
  statTitle: PropTypes.string.isRequired,
};

// ** Default Props
StatsWithAreaChart.defaultProps = {
  color: "primary",
  options: areaChartOptions,
};
