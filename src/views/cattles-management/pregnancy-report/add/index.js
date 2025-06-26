import React from "react";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { createPregnancyReport } from "../../../../api/cattle/cattlePregnancy";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddPregnancyForm from "../../../../components/cattlePregnancy/addForm";
import "../../../../assets/scss/viewCommon.scss";
import "../../../../assets/scss/common.scss";

const AddPregnancy = () => {
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentPregnancyStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  const handleCreatePregnancyReport = async (payload) => {
    return createPregnancyReport(payload);
  };

  const schema = Yup.object().shape({
    cattleId: Yup.mixed().required("cattle_id_required"),
    pregnancyStatus: Yup.string().required("cattle_pregnancy_status_required"),
  });

  const initialValues = {
    cattleId: "",
    calfId: "",
    pregnancyStatus: "NO",
    pregnancyDate: new Date(),
    conceivingDate: new Date(),
  };

  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              navigate(
                `/cattle/pregnancy-reports?page=${currentPage}&status=${currentPregnancyStatus}&filter=${currentFilter}`
              )
            }
          />
          <div className="addAction">
            <Trans i18nKey={"cattle_pregnancy_report_add"} />
          </div>
        </div>
      </div>
      <AddPregnancyForm
        handleSubmit={handleCreatePregnancyReport}
        initialValues={initialValues}
        validationSchema={schema}
        buttonName="cattle_record_add"
      />
    </div>
  );
};

export default AddPregnancy;
