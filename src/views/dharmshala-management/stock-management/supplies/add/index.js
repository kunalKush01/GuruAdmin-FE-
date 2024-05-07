import React from "react";

import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { createSupplyItem } from "../../../../../api/cattle/cattleStock";
import arrowLeft from "../../../../../assets/images/icons/arrow-left.svg";
import AddSuppliesForm from "../../../../../components/cattleStockManagment/supplies/addForm";

const StockAddWraper = styled.div`
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

const AddSupplies = () => {
  const history = useHistory();
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
    <StockAddWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/cattle/management/supplies?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addEvent">
            <Trans i18nKey={"cattle_supplies_add"} />
          </div>
        </div>
      </div>
      <div className="ms-sm-3 mt-1">
        <AddSuppliesForm
          handleSubmit={handleCreateSupply}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="cattle_record_add"
        />
      </div>
    </StockAddWraper>
  );
};

export default AddSupplies;
