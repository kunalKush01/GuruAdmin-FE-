import React, { useState } from "react";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { createRoom } from "../../../../api/dharmshala/dharmshalaInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddRoomForm from "../../../../components/dharmshalaRoom/addForm";
import "../../../../assets/scss/common.scss";

const AddDharmshalaRoom = () => {
  const navigate = useNavigate();
  const { floorId } = useParams();
  const { buildingId } = useParams();
  const trustId = localStorage.getItem("trustId");
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  const handleCreateDharmshalaRoom = async (payload) => {
    return createRoom(payload);
  };

  const schema = Yup.object().shape({
    //name: Yup.string().required("dharmshala_floor_name_required"),
    //description: Yup.mixed().required("dharmshala_floor_description_required"),
    number: Yup.mixed().required("dharmshala_room_number_required"),
    floorId: Yup.mixed().required("dharmshala_room_number_required"),
    buildingId: Yup.mixed().required("dharmshala_room_number_required"),
    dharmshalaId: Yup.mixed().required("dharmshala_room_number_required"),
    roomType: Yup.mixed().required("room_type_required"),
  });

  const initialValues = {
    //name: "",
    //description: "",
    number: "",
    buildingId: buildingId,
    floorId: floorId,
    dharmshalaId: trustId,
  };

  const URLParams = useParams("");

  return (
    <div className="DharmshalaComponentAddWrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              navigate(`/room/${URLParams.floorId}/${URLParams.buildingId}`)
            }
          />
          <div className="addEvent">
            <Trans i18nKey={"dharmshala_room_add"} />
          </div>
        </div>
      </div>
      <div className="listviewwrapper">
        <AddRoomForm
          handleSubmit={handleCreateDharmshalaRoom}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="dharmshala_room_add"
        />
      </div>
    </div>
  );
};

export default AddDharmshalaRoom;
