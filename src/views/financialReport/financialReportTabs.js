import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const FinancialReportTabsWarapper = styled.div`
  .tabName {
    font: normal normal bold 18px/28px Noto Sans;
    padding-left: 1rem;
    color: #583703;
    opacity: 70%;
    padding-right: 1rem;
    white-space: nowrap;
    cursor: pointer;
    padding-bottom: 0.2rem;
  }
  hr {
    margin-top: -0.52rem;
    height: 1.5px;
    color: #583703;
    opacity: 25%;
    z-index: 1;
  }
  .allTabBox {
    margin-left: 2.3rem;
    overflow-x: scroll;
    ::-webkit-scrollbar{
      height: 5px;
    }
    ::-webkit-scrollbar-thumb{
      background-color: gray;
      border-radius: 25px;
    }

  }
  .activeTab {
    z-index: 2;
    border-bottom: 5px solid;
    border-color: #ff8744;
    border-radius: 5px;
    color: #583703;
    opacity: 100%;
    font-weight: bold;
  }
`;
const FinancialReportTabs = ({ setActive, active,setPagination }) => {
  const { t } = useTranslation();
  const FinancialTabs = [
    { id: 1, name: t("report_expences") },
    { id: 2, name: t("donation_Donation") },
    { id: 3, name: t("report_commitment") },
    { id: 4, name: t("report_donation_box") },
  ];
  return (
    <FinancialReportTabsWarapper>
      <div className="d-flex flex-lg-wrap  gap-3 mt-2 allTabBox ">
        {FinancialTabs.map((item,idx) => {
          return (
            <div
            key={idx}
              className={`tabName ${
                active?.name == item.name ? "activeTab" : ""
              }`}
              onClick={() => {                
                setActive(item);
              }}
            >
              {item.name}
            </div>
          );
        })}
      </div>
      <div>
        {" "}
        <hr />{" "}
      </div>
    </FinancialReportTabsWarapper>
  );
};

export default FinancialReportTabs;
