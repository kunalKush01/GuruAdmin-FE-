import React from "react";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { createBuilding } from "../../../../api/dharmshala/dharmshalaInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddDharmshalaForm from "../../../../components/dharmshalaInfo/addForm";
import "../../../../assets/scss/common.scss";
import "../../../../assets/scss/dharmshala.scss";

const AddDharmshala = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  const handleCreateDharmshala = async (payload) => {
    return createBuilding(payload);
  };

  const schema = Yup.object().shape({
    name: Yup.string().required("building_name_required"),
    description: Yup.mixed().required("building_description_required"),
    location: Yup.mixed().required("building_location_required"),
  });

  const initialValues = {
    name: "",
    description: "",
    location: "",
  };

  return (
    <div className="DharmshalaComponentAddWrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => navigate(`/dharmshala/info`)}
          />
          <div className="addEvent">
            <Trans i18nKey={"building_add"} />
          </div>
        </div>
      </div>
      <div className="listviewwrapper">
        <AddDharmshalaForm
          handleSubmit={handleCreateDharmshala}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="building_add"
        />
      </div>
    </div>
  );
};

export default AddDharmshala;
