import React from "react";
import { Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import defaultIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import he from "he"
import {
  ConverFirstLatterToCapital,
} from "../../utility/formater";
import moment from "moment";
import { ConvertToString } from "../financeReport/reportJsonExport";

const NotificationWarapper = styled.div`
  .dateTime {
    color: #909090;
    font: normal normal bold 16px/27px Noto Sans;
  }
  .heading {
    font: normal normal bold 20px/38px Noto Sans;
  }
  .notificationPara {
    font: normal normal normal 14px/27px Noto Sans;
  }
`;

const NotificationList = ({ data }) => {
  return (
    <NotificationWarapper>
      <Row className="mt-2">
        {/*<Col xs={1} className="align-items-center d-flex" >*/}
        {/*  <img src={defaultIcon} className="m-auto" />*/}
        {/*</Col>*/}
        {data?.map((item) => (
          <>
            <Col xs={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="heading">
                  {ConverFirstLatterToCapital(item?.notifyTitle ?? "")}
                </div>
                <div className="dateTime d-flex">
                  {moment(item?.createdAt).format("hh:mm A, DD MMMM YYYY ")}
                  {!item?.isSeen && (
                    <div className="ms-2">
                      <Spinner type="grow" size="sm" color="primary" />
                    </div>
                  )}
                </div>
              </div>
              <div className="notificationPara">
                {ConvertToString(item?.notifyMessage ?? "")}
              </div>
            </Col>
            <hr className="mt-1" />
          </>
        ))}
      </Row>
    </NotificationWarapper>
  );
};

export default NotificationList;
