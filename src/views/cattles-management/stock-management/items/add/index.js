import React from "react";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { createStockItem } from "../../../../../api/cattle/cattleStock";
import arrowLeft from "../../../../../assets/images/icons/arrow-left.svg";
import AddStockItemForm from "../../../../../components/cattleStockManagment/Items/addForm";

import "../../../../../assets/scss/viewCommon.scss";
import "../../../../../assets/scss/common.scss";

const AddStockItem = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const handleCreateStockItem = async (payload) => {
    return createStockItem(payload);
  };

  const schema = Yup.object().shape({
    name: Yup.string().required("cattle_name_required"),
    unit: Yup.mixed().required("cattle_unit_required"),
    unitType: Yup.mixed().required("cattle_unit_type_required"),
  });

  const initialValues = {
    name: "",
    unit: "",
    unitType: "",
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
                `/stock-management/item?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addAction">
            <Trans i18nKey={"cattle_items_add"} />
          </div>
        </div>
      </div>
      <div className="FormikWrapper">
        <AddStockItemForm
          handleSubmit={handleCreateStockItem}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="cattle_record_add"
        />
      </div>
    </div>
  );
};

export default AddStockItem;
