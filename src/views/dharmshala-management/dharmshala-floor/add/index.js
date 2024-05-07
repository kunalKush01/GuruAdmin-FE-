import React from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { createDharmshalaFloor } from "../../../../api/dharmshala/dharmshalaInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddDharmshalaFloorForm from "../../../../components/dharmshalaFloor/addForm";

const DharmshalaFloorAddWraper = styled.div`
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

const AddDharmshalaFloor = () => {
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  const handleCreateDharmshalaFloor = async (payload) => {
    return createDharmshalaFloor(payload);
  };

  const schema = Yup.object().shape({
    name: Yup.string().required("dharmshala_floor_name_required"),
    description: Yup.mixed().required("dharmshala_floor_description_required"),
    number: Yup.mixed().required("dharmshala_floor_number_required"),
  });

  const initialValues = {
    name: "",
    description: "",
    number: "",
  };

  return (
    <DharmshalaFloorAddWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/dharmshala/info?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}`
              )
            }
          />
          <div className="addEvent">
            <Trans i18nKey={"dharmshala_floor_add"} />
          </div>
        </div>
      </div>
      <div className="ms-sm-3 mt-1">
        <AddDharmshalaFloorForm
          handleSubmit={handleCreateDharmshalaFloor}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="dharmshala_floor_add"
        />
      </div>
    </DharmshalaFloorAddWraper>
  );
};

export default AddDharmshalaFloor;
