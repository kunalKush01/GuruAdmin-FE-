import React from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { createRoomType } from "../../../../api/dharmshala/dharmshalaInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddRoomTypeForm from "../../../../components/roomType/addForm";
import { RoomTypeAddWrapper } from "../../dharmshalaStyles";

const AddRoomType = () => {
  const history = useHistory();
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
    capacity: Yup.mixed().required("dharmshala_roomtype_capacity_required"),
    price: Yup.mixed().required("dharmshala_roomtype_price_required"),
  });

  const initialValues = {
    name: "",
    description: "",
    capacity: "",
    price: "",
  };

  return (
    <RoomTypeAddWrapper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push(`/roomtype/info`)}
          />
          <div className="addEvent">
            <Trans i18nKey={"dharmshala_roomtype_add"} />
          </div>
        </div>
      </div>
      <div className="ms-sm-3 mt-1">
        <AddRoomTypeForm
          handleSubmit={handleCreateRoomType}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="dharmshala_roomtype_add"
        />
      </div>
    </RoomTypeAddWrapper>
  );
};

export default AddRoomType;
