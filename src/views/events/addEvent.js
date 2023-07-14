import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { createEvent } from "../../api/eventApi.js";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import EventForm from "../../components/events/eventForm";

const EventWraper = styled.div`
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

const handleCreateEvent = async (payload) => {
  return createEvent(payload);
};
const schema = yup.object().shape({
  Title: yup
    .string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("events_title_required")
    .trim(),
  // tagsInit:yup.array().max(15 ,"tags_limit"),
  Body: yup.string().required("events_desc_required").trim(),
  DateTime: yup.object().shape({
    start: yup.string().required("events_startDate_required"),
    // end: yup.mixed().required("events_endDate_required"),
  }),
  startTime: yup.mixed().required("events_startTime_required"),
  endTime: yup.mixed().required("events_endTime_required"),
  SelectedEvent: yup.mixed(),
});

const initialValues = {
  SelectedEvent: null,
  Id: "",
  Title: "",
  images: [],
  tagsInit: [],
  Body: "",
  DateTime: { start: new Date(), end: null },
  startTime: new Date(),
  endTime: "00:00",
};

export default function AddEvent() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");
  return (
    <EventWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/events?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addEvent">
            <Trans i18nKey={"events_AddEvent"} />
          </div>
        </div>
        {/* <div className="addEvent">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={langArray}
            className={"ms-1"}
            defaultDropDownName={"English"}
            disabled
          />
        </div> */}
      </div>
      <div className="ms-sm-3 mt-1">
        <EventForm
          handleSubmit={handleCreateEvent}
          initialValues={initialValues}
          vailidationSchema={schema}
          showTimeInput
          buttonName="events_AddEvent"
        />
      </div>
    </EventWraper>
  );
}
