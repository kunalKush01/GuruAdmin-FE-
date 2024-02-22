import React from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { createPregnancyReport } from "../../../../api/cattle/cattlePregnancy";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddPregnancyForm from "../../../../components/cattlePregnancy/addForm";

const PregnancyAddWraper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addEvent {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const AddPregnancy = () => {
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
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
    pregnancyStatus: "",
    pregnancyDate: new Date(),
    conceivingDate: new Date(),
  };

  return (
    <PregnancyAddWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/cattle/pregnancy-reports?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addEvent">
            <Trans i18nKey={"cattle_pregnancy_report_add"} />
          </div>
        </div>
      </div>
      <div className="ms-sm-3 mt-1">
        <AddPregnancyForm
          handleSubmit={handleCreatePregnancyReport}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="cattle_record_add"
        />
      </div>
    </PregnancyAddWraper>
  );
};

export default AddPregnancy;
