import React from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { createItemUsage } from "../../../../../api/cattle/cattleUsage";
import arrowLeft from "../../../../../assets/images/icons/arrow-left.svg";
import AddItemUsageForm from "../../../../../components/cattleUsage/addForm";

import "../../../../../assets/scss/viewCommon.scss";
import "../../../../../assets/scss/common.scss";

const AddItemUsage = () => {
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const handleCreateItemUsage = async (payload) => {
    return createItemUsage(payload);
  };

  const schema = Yup.object().shape({
    itemId: Yup.mixed().required("cattle_itemID_required"),
    name: Yup.mixed().required("cattle_name_required"),
    quantity: Yup.number().required("cattle_quantity_required"),
    unit: Yup.mixed().required("cattle_unit_required"),
    purpose: Yup.mixed().required("cattle_purpose_required"),
  });

  const initialValues = {
    itemId: "",
    name: "",
    Date: new Date(),
    quantity: "",
    unit: "",
    purpose: "",
  };

  return (
    <div className="itemusageaddwraper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/cattle/management/usage?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addAction">
            <Trans i18nKey={"cattle_usage_add"} />
          </div>
        </div>
      </div>
      <div className="FormikWrapper">
        <AddItemUsageForm
          handleSubmit={handleCreateItemUsage}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="cattle_record_add"
        />
      </div>
    </div>
  );
};

export default AddItemUsage;
