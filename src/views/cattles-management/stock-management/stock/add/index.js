import React from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { createStock } from "../../../../../api/cattle/cattleStock";
import arrowLeft from "../../../../../assets/images/icons/arrow-left.svg";
import AddStockForm from "../../../../../components/cattleStockManagment/stocks/addForm";

import '../../../styles/viewCommon.scss';;
;

const AddStock = () => {
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const handleCreateStock = async (payload) => {
    return createStock(payload);
  };

  // const schema = Yup.object().shape({
  //   Title: Yup.string()
  //     .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
  //     .required("events_title_required")
  //     .trim(),
  //   // tagsInit:Yup.array().max(15 ,"tags_limit"),
  //   Body: Yup.string().required("events_desc_required").trim(),
  //   DateTime: Yup.object().shape({
  //     start: Yup.string().required("events_startDate_required"),
  //     // end: Yup.mixed().required("events_endDate_required"),
  //   }),
  //   startTime: Yup.mixed().required("events_startTime_required"),
  //   endTime: Yup.mixed().required("events_endTime_required"),
  //   SelectedEvent: Yup.mixed(),
  // });

  const initialValues = {
    itemId: "",
    name: "",
    orderQuantity: "",
    currentQuantity: "",
    unit: "",
  };

  return (
    <div className="stockaddwraper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/cattle/items?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addEvent">
            <Trans i18nKey={"cattle_stock_add"} />
          </div>
        </div>
      </div>
      <div className="ms-sm-3 mt-1">
        <AddStockForm
          handleSubmit={handleCreateStock}
          initialValues={initialValues}
          // validationSchema={schema}
          buttonName="cattle_record_add"
        />
      </div>
    </div>
  );
};

export default AddStock;
