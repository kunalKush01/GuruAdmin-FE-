import React from "react";

import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { createSupplyItem } from "../../../../../api/cattle/cattleStock";
import arrowLeft from "../../../../../assets/images/icons/arrow-left.svg";
import AddSuppliesForm from "../../../../../components/cattleStockManagment/supplies/addForm";

import "../../../../../assets/scss/viewCommon.scss";
import "../../../../../assets/scss/common.scss";

const AddSupplies = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const handleCreateSupply = async (payload) => {
    return createSupplyItem(payload);
  };

  const schema = Yup.object().shape({
    itemId: Yup.mixed().required("cattle_itemID_required"),
    name: Yup.mixed().required("cattle_name_required"),
    orderQuantity: Yup.number().required("cattle_order_quantity_required"),
    unit: Yup.mixed().required("cattle_unit_required"),
  });

  const initialValues = {
    itemId: "",
    name: "",
    orderQuantity: "",
    unit: "",
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
                `/stock-management/supplies?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addAction">
            <Trans i18nKey={"cattle_supplies_add"} />
          </div>
        </div>
      </div>
      <div className="FormikWrapper">
        <AddSuppliesForm
          handleSubmit={handleCreateSupply}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="cattle_record_add"
        />
      </div>
    </div>
  );
};

export default AddSupplies;
