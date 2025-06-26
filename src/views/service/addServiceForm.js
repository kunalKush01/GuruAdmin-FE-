import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import * as Yup from "yup";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";

import "../../assets/scss/viewCommon.scss";
import ServiceForm from "./serviceForm.js";
import { addService, updateService } from "../../api/serviceApi.js";
import he from "he";
import moment from "moment";
export default function AddServiceForm() {
  const { t } = useTranslation();
  const location = useLocation();
  const record = location.state?.record;
  const type = location.state?.type;
  //   console.log(record, type);
  const handleAddService = async (payload) => {
    if (type && type == "edit") {
      return updateService({ ...payload, serviceId: record._id });
    } else {
      return addService(payload);
    }
  };
  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required").trim(),
    description: Yup.string().required("Description is required").trim(),
    frequency: Yup.mixed().required("Frequency is required"),
    amount: Yup.number().required("Amount is required"),
  });

  const initialValues = {
    name: "" || record ? record["name"] : "",
    description: "" || record ? he?.decode(record["description"] || "") : "",
    frequency:
      "" || record
        ? { value: record["frequency"], label: record["frequency"] }
        : "",
    dates: record?.serviceDates
      ? record.serviceDates.map((dateObj) => moment(dateObj.date))
      : [],
    amount: "" || record ? record["amount"] : "",
    countPerDay: "" || record ? record["countPerDay"] : "",
    images: null,
  };

  const navigate = useNavigate();
  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => navigate(`/service`)}
          />
          <div className="addAction">
            {type == "edit" ? (
              <Trans i18nKey={"editService"} />
            ) : (
              <Trans i18nKey={"addService"} />
            )}
          </div>
        </div>
      </div>
      <div className="mt-1">
        <ServiceForm
          handleSubmit={handleAddService}
          initialValues={initialValues}
          validationSchema={schema}
          showTimeInput
          buttonName={type == "edit" ? t("editService") : t("addService")}
        />
      </div>
    </div>
  );
}
