import React, { useState } from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { createRoom } from "../../../../api/dharmshala/dharmshalaInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddRoomForm from "../../../../components/dharmshalaRoom/addForm";
import { DharmshalaRoomAddWrapper } from "../../dharmshalaStyles";

const AddDharmshalaRoom = () => {
  const history = useHistory();
  const { floorId } = useParams();
  const { buildingId } = useParams();
  console.log("building id", buildingId);
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
    <DharmshalaRoomAddWrapper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(`/room/${URLParams.floorId}/${URLParams.buildingId}`)
            }
          />
          <div className="addEvent">
            <Trans i18nKey={"dharmshala_room_add"} />
          </div>
        </div>
      </div>
      <div className="ms-sm-3 mt-1">
        <AddRoomForm
          handleSubmit={handleCreateDharmshalaRoom}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="dharmshala_room_add"
        />
      </div>
    </DharmshalaRoomAddWrapper>
  );
};

export default AddDharmshalaRoom;
