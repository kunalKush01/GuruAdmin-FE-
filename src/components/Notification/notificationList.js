import React from "react";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import defaultIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg"
import { ConverFirstLatterToCapital } from "../../utility/formater";

const NotificationWarapper = styled.div`
  .dateTime {
    color: #909090;
    font:  normal normal bold 16px/27px Noto Sans;;
  }
  .heading{
    font: normal normal bold 20px/38px Noto Sans;
  }
  .notificationPara{
    font: normal normal normal 14px/27px Noto Sans;
  }
`;

const NotificationList = ({ data }) => {
  return (
    <NotificationWarapper>
      <Row className="mt-2">
        <Col xs={1} className="align-items-center d-flex" >
          <img src={defaultIcon} className="m-auto" />
        </Col>
        <Col xs={11}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="heading">{ConverFirstLatterToCapital("lorem Ipsum")}</div>
            <div className="dateTime">03:02 PM, 21 Aug 2022</div>
          </div>
          <div className="notificationPara">
            
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
          </div>
        </Col>
        <hr className="mt-1"/>
      </Row>
      <Row className="mt-2">
        <Col xs={1} className="align-items-center d-flex" >
          <img src={defaultIcon} className="m-auto" />
        </Col>
        <Col xs={11}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="heading">{ConverFirstLatterToCapital("Lorem Ipsum")}</div>
            <div className="dateTime">03:02 PM, 21 Aug 2022</div>
          </div>
          <div className="notificationPara">
            
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
          </div>
        </Col>
        <hr className="mt-1"/>
      </Row>
      <Row className="mt-2">
        <Col xs={1} className="align-items-center d-flex" >
          <img src={defaultIcon} className="m-auto" />
        </Col>
        <Col xs={11}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="heading">{ConverFirstLatterToCapital("Lorem Ipsum")}</div>
            <div className="dateTime">03:02 PM, 21 Aug 2022</div>
          </div>
          <div className="notificationPara">
            
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
          </div>
        </Col>
        <hr className="mt-1"/>
      </Row>
      <Row className="mt-2">
        <Col xs={1} className="align-items-center d-flex" >
          <img src={defaultIcon} className="m-auto" />
        </Col>
        <Col xs={11}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="heading">{ConverFirstLatterToCapital("Lorem Ipsum")}</div>
            <div className="dateTime">03:02 PM, 21 Aug 2022</div>
          </div>
          <div className="notificationPara">
            
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
          </div>
        </Col>
        <hr className="mt-1"/>
      </Row>
      <Row className="mt-2">
        <Col xs={1} className="align-items-center d-flex" >
          <img src={defaultIcon} className="m-auto" />
        </Col>
        <Col xs={11}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="heading">{ConverFirstLatterToCapital("Lorem Ipsum")}</div>
            <div className="dateTime">03:02 PM, 21 Aug 2022</div>
          </div>
          <div className="notificationPara">
            
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
          </div>
        </Col>
        <hr className="mt-1"/>
      </Row>
      <Row className="mt-2">
        <Col xs={1} className="align-items-center d-flex" >
          <img src={defaultIcon} className="m-auto" />
        </Col>
        <Col xs={11}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="heading">{ConverFirstLatterToCapital("Lorem Ipsum")}</div>
            <div className="dateTime">03:02 PM, 21 Aug 2022</div>
          </div>
          <div className="notificationPara">
            
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
          </div>
        </Col>
        <hr className="mt-1"/>
      </Row>
      <Row className="mt-2">
        <Col xs={1} className="align-items-center d-flex" >
          <img src={defaultIcon} className="m-auto" />
        </Col>
        <Col xs={11}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="heading">{ConverFirstLatterToCapital("lorem Ipsum")}</div>
            <div className="dateTime">03:02 PM, 21 Aug 2022</div>
          </div>
          <div className="notificationPara">
            
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
          </div>
        </Col>
        <hr className="mt-1"/>
      </Row>
    </NotificationWarapper>
  );
};

export default NotificationList;
