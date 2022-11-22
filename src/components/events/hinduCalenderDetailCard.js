import React from "react";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import moonIcon from "../../assets/images/icons/event/moon.png";
import sunriseIcon from "../../assets/images/icons/event/Icon feather-sunrise.svg";
import sunsetIcon from "../../assets/images/icons/event/Icon feather-sunset.svg";

const HinduCalenderDetailCardWraper = styled(Row)`
  background: #fff7e8;
  border-radius: 10px;
  padding: 10px;

  .calender-title {
    font: normal normal bold 13px/20px noto sans;
  }
  .calender-date {
    font: normal normal bold 11px/15px noto sans;
  }
  .calender-tithi {
    color: #ff8744;
    font: normal normal normal 9px/12px noto sans;
  }
  .calender-time {
    font: normal normal bold 9px/12px noto sans;
  }
`;
export default function HinduCalenderDetailCard() {
  return (
    <HinduCalenderDetailCardWraper>
      <Col xs={5}  >
        <Row>
          <Col className="calender-title   ">Today's Date</Col>
        </Row>

        <Row>
          <Col className="calender-date  ">11 August 2022</Col>
        </Row>
        <Row>
          <Col className="calender-tithi   ">Bhadrapad, Krishna Paksha</Col>
        </Row>
      </Col>
      <Col xs={5}>
        <Row>
          <Col xs={6}>
            <Row  >
              <Col  >
                <img className="w-100" src={sunriseIcon} />
              </Col>
            </Row>
            <Row>
              <Col className="calender-tithi p-0 text-center ">Sunrise</Col>
            </Row>
            <Row>
              <Col className="calender-time p-0 text-center ">time</Col>
            </Row>
          </Col>
          <Col xs={6}>
            <Row>
              <Col>
                <img className="w-100" src={sunsetIcon} />
              </Col>
            </Row>
            <Row>
              <Col className="calender-tithi p-0 text-center ">Sunset</Col>
            </Row>
            <Row>
              <Col className="calender-time p-0 text-center ">time</Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col xs={2} className="p-0 d-flex align-items-center " >
        <img className="w-100  " src={moonIcon} />
      </Col>
    </HinduCalenderDetailCardWraper>
  );
}
