import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import "../../assets/scss/viewCommon.scss";

const FinancialReportTabs = ({ setActive, active, setPagination }) => {
  const { t } = useTranslation();
  const FinancialTabs = [
    { id: 1, name: t("report_expences") },
    { id: 2, name: t("donation_Donation") },
    { id: 3, name: t("report_commitment") },
    { id: 4, name: t("report_donation_box") },
  ];
  return (
    <div className="financialreporttabswrapper">
      <div className="d-flex flex-lg-wrap gap-3 mt-2 allTabBox ">
        {FinancialTabs.map((item, idx) => {
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
    </div>
  );
};

export default FinancialReportTabs;
