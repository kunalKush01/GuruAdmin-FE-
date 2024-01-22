import moment from "moment";
import React from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddCattleForm from "../../../../components/cattleInfo/addForm";

const CattleAddWraper = styled.div`
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

const AddCattle = () => {
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const handleCreateCattleInfo = async (payload) => {
    return createCattleInfo(payload);
  };

  const schema = Yup.object().shape({
    Title: Yup.string()
      .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
      .required("events_title_required")
      .trim(),
    // tagsInit:Yup.array().max(15 ,"tags_limit"),
    Body: Yup.string().required("events_desc_required").trim(),
    DateTime: Yup.object().shape({
      start: Yup.string().required("events_startDate_required"),
      // end: Yup.mixed().required("events_endDate_required"),
    }),
    startTime: Yup.mixed().required("events_startTime_required"),
    endTime: Yup.mixed().required("events_endTime_required"),
    SelectedEvent: Yup.mixed(),
  });

  const initialValues = {
    SelectedEvent: null,
    Id: "",
    Title: "",
    images: [],
    tagsInit: [],
    Body: "",
    DateTime: { start: new Date(), end: null },
    startTime: moment(new Date(), ["HH:mm"]).format("HH:mm"),
    endTime: "23:59",
  };

  return (
    <CattleAddWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/cattle/info?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addEvent">
            <Trans i18nKey={"cattle_stock_add"} />
          </div>
        </div>
      </div>
      <div className="ms-sm-3 mt-1">
        <AddCattleForm
          handleSubmit={handleCreateCattleInfo}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="cattle_info_add"
        />
      </div>
    </CattleAddWraper>
  );
};

export default AddCattle;
