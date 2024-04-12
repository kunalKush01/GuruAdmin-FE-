import React from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { createStockItem } from "../../../../../api/cattle/cattleStock";
import arrowLeft from "../../../../../assets/images/icons/arrow-left.svg";
import AddStockItemForm from "../../../../../components/cattleStockManagment/Items/addForm";

const StockItemAddWraper = styled.div`
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

const AddStockItem = () => {
  const history = useHistory();
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
    <StockItemAddWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/cattle/management/item?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addEvent">
            <Trans i18nKey={"cattle_items_add"} />
          </div>
        </div>
      </div>
      <div className="ms-sm-3 mt-1">
        <AddStockItemForm
          handleSubmit={handleCreateStockItem}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="cattle_record_add"
        />
      </div>
    </StockItemAddWraper>
  );
};

export default AddStockItem;
