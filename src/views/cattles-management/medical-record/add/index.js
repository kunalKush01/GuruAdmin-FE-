import React from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { createCattleMedicalRecord } from "../../../../api/cattle/cattleMedical";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddMedicalInfoForm from "../../../../components/cattleMedicalInfo/addForm";
import "../../../../assets/scss/viewCommon.scss";
import "../../../../assets/scss/common.scss";

const AddMedicalInfo = () => {
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const handleCreateMedicalInfo = async (payload) => {
    return createCattleMedicalRecord(payload);
  };

  const schema = Yup.object().shape({
    cattleCalfId: Yup.mixed().required("cattle_id_required"),
    treatmentMedicine: Yup.string().required(
      "cattle_treatment_medicine_required"
    ),
    dosage: Yup.string().required("cattle_dosage_required"),
    DrName: Yup.string().required("cattle_DrName_required"),
    Mobile: Yup.string().required("expenses_mobile_required"),
    price: Yup.number().required("cattle_price_required"),
    cattleSymptoms: Yup.string().required("cattle_symptoms_required"),
  });

  const initialValues = {
    cattleCalfId: "",
    treatmentMedicine: "",
    dosage: "",
    DrName: "",
    countryCode: "",
    dialCode: "",
    Mobile: "",
    price: "",
    cattleSymptoms: "",
    startDate: new Date(),
  };

  return (
    <div className="medicalinfoaddwraper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/cattle/medical-info?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addAction">
            <Trans i18nKey={"cattle_medical_add"} />
          </div>
        </div>
      </div>
      <div className="FormikWrapper">
        <AddMedicalInfoForm
          handleSubmit={handleCreateMedicalInfo}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="cattle_record_add"
        />
      </div>
    </div>
  );
};

export default AddMedicalInfo;
