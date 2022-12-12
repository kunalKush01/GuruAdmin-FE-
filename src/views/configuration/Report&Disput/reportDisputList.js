import moment from "moment";
import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import { ChangeStatus } from "../../../components/Report & Disput/changeStatus";
import ReportTable from "../../../components/Report & Disput/reportTable";

const ReportDisputWaraper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;

  .table_upper_row {
    margin-bottom: 2rem;
  }
  .addEvent {
    color: #583703;
    display: flex;
    align-items: center;
  }
  .category_heading {
    font-size: 20px;
    font-weight: bold;
    color: #583703;
  }
  .filterPeriod {
    color: #ff8744;
    font: normal normal bold 13px/20px noto sans;
  }
`;

const randomArray = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const TrustList = () => {
  const [dropDownName, setdropDownName] = useState("report_panding");
  const { t } = useTranslation();
  const history = useHistory();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  let filterStartDate = moment()
    .startOf("month")
    .utcOffset(0, true)
    .toISOString();
  let filterEndDate = moment().endOf("month").utcOffset(0, true).toISOString();

  let startDate = moment(filterStartDate).format("D MMM");
  let endDate = moment(filterEndDate).utcOffset(0).format("D MMM, YYYY");

  return (
    <ReportDisputWaraper>
      <div className="d-flex justify-content-between align-items-center table_upper_row">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2"
            onClick={() => history.push("/")}
          />
          <div className="addEvent">
            <div className="">
              <div>
                <Trans i18nKey={"report_Dispute"} />
              </div>
            </div>
          </div>
        </div>
        <ChangeStatus
          dropDownName={dropDownName}
          setdropDownName={(e) => setdropDownName(e.target.name)}
        />
      </div>
      <ReportTable />
    </ReportDisputWaraper>
  );
};

export default TrustList;
