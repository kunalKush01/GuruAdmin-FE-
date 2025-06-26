import React from "react";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { createRoomType } from "../../../../api/dharmshala/dharmshalaInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddRoomTypeForm from "../../../../components/roomType/addForm";
import "../../../../assets/scss/common.scss";
import "../../../../assets/scss/dharmshala.scss";

const AddRoomType = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  const handleCreateRoomType = async (payload) => {
    return createRoomType(payload);
  };

  const schema = Yup.object().shape({
    name: Yup.string().required("dharmshala_roomtype_name_required"),
    description: Yup.mixed().required(
      "dharmshala_roomtype_description_required"
    ),
    capacity: Yup.number()
      .typeError("Capacity must be a number")
      .positive("Capacity must be greater than zero")
      .integer("Capacity must be a whole number")
      .max(999999, "Capacity is too large")
      .required("dharmshala_roomtype_capacity_required"),
    price: Yup.number()
      .typeError("Price must be a number") // Ensures only numbers are allowed
      .positive("Price must be greater than 0") // Ensures value is greater than 0
      .integer("Price must be a whole number") // Ensures no decimals
      .required("dharmshala_roomtype_price_required"),
  });

  const initialValues = {
    name: "",
    description: "",
    capacity: "",
    price: "",
  };

  return (
    <div className="DharmshalaComponentAddWrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => navigate(`/roomtype/info`)}
          />
          <div className="addEvent">
            <Trans i18nKey={"dharmshala_roomtype_add"} />
          </div>
        </div>
      </div>
      <div className="listviewwrapper">
        <AddRoomTypeForm
          handleSubmit={handleCreateRoomType}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="dharmshala_roomtype_add"
        />
      </div>
    </div>
  );
};

export default AddRoomType;
