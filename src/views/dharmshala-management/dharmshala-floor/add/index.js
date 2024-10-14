import React from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { createDharmshalaFloor } from "../../../../api/dharmshala/dharmshalaInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddDharmshalaFloorForm from "../../../../components/dharmshalaFloor/addForm";
import "../../../../assets/scss/common.scss";
import "../../../../assets/scss/dharmshala.scss";

const AddDharmshalaFloor = () => {
  const history = useHistory();
  const { buildingId } = useParams();
  const trustId = localStorage.getItem("trustId");
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
    buildingId: Yup.mixed().required("dharmshala_floor_number_required"),
    dharmshalaId: Yup.mixed().required("dharmshala_floor_number_required"),
  });

  const initialValues = {
    name: "",
    description: "",
    number: "",
    buildingId: buildingId,
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
            onClick={() => history.push(`/floors/${URLParams.buildingId}`)}
          />
          <div className="addEvent">
            <Trans i18nKey={"dharmshala_floor_add"} />
          </div>
        </div>
      </div>
      <div className="listviewwrapper">
        <AddDharmshalaFloorForm
          handleSubmit={handleCreateDharmshalaFloor}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="dharmshala_floor_add"
        />
      </div>
    </div>
  );
};

export default AddDharmshalaFloor;
