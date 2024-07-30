import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { CustomDropDown } from "../../components/partials/customDropDown";

import he from "he";
import moment from "moment";
import { useSelector } from "react-redux";
import { addLangEventDetail, getEventDetail } from "../../api/eventApi";
import EventForm from "../../components/events/eventForm";
import { ConverFirstLatterToCapital } from "../../utility/formater";

import "../../assets/scss/viewCommon.scss";

const schema = Yup.object().shape({
  Title: Yup.string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("events_title_required")
    .trim(),
  Body: Yup.string().required("events_desc_required").trim(),
  DateTime: Yup.object().shape({
    start: Yup.string().required("events_startDate_required"),
    // end: Yup.mixed().required("events_endDate_required"),
  }),
  startTime: Yup.mixed().required("events_startTime_required"),
  endTime: Yup.mixed().required("events_endTime_required"),
  SelectedEvent: Yup.mixed(),
  location: Yup.mixed().required("events_location_required"),
  // tagsInit:Yup.array().max(15 ,"tags_limit"),
});
export default function AddLanguageEvent() {
  const history = useHistory();
  const { eventId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState("Select");

  const eventDetailQuery = useQuery(
    ["EventDetail", eventId, selectedLang.id],
    async () => await getEventDetail({ eventId, languageId: selectedLang.id })
  );

  const handleEventLangUpdate = (payload) => {
    let languageId;
    langArray.map(async (Item) => {
      if (Item.name == langSelection.toLowerCase()) {
        languageId = Item.id;
      }
    });

    return addLangEventDetail({ ...payload, languageId });
  };

  const getAvailLangOption = () => {
    if (eventDetailQuery?.data?.result?.languages && langArray) {
      const option = _.differenceBy(
        langArray,
        eventDetailQuery?.data?.result?.languages,
        "id"
      );
      if (_.isEqual(option, langArray)) {
        return [];
      }

      return option;
    }
    return [];
  };

  const availableLangOptions = useMemo(getAvailLangOption, [
    langArray,
    eventDetailQuery?.data?.result?.languages,
  ]);

  const tags = eventDetailQuery?.data?.result?.tags?.map((item) => ({
    id: item.id,
    text: item.tag,
    _id: item.id,
  }));

  const initialValues = useMemo(() => {
    return {
      Id: eventDetailQuery?.data?.result?.id,
      Title: eventDetailQuery?.data?.result?.title,
      tagsInit: tags,
      Body: he?.decode(eventDetailQuery?.data?.result?.body ?? ""),
      images: [],
      PublishedBy: eventDetailQuery?.data?.result?.publishedBy,
      DateTime: {
        start: moment(eventDetailQuery?.data?.result?.startDate)
          .utcOffset("+0530")
          .toDate(),
        end: moment(eventDetailQuery?.data?.result?.endDate)
          .utcOffset("+0530")
          .toDate(),
      },
      startTime: eventDetailQuery?.data?.result?.startTime,
      endTime: eventDetailQuery?.data?.result?.endTime,
      location: eventDetailQuery?.data?.result?.location,
      city: eventDetailQuery?.data?.result?.city,
      state: eventDetailQuery?.data?.result?.state,
      latitude: eventDetailQuery?.data?.result?.longitude,
      longitude: eventDetailQuery?.data?.result?.latitude,
    };
  }, [eventDetailQuery]);

  return (
    <div className="listviewwrapper">
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
          <div className="editEvent">
            <Trans i18nKey={"news_AddLangNews"} />
          </div>
        </div>
        <div className="editEvent">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={availableLangOptions}
            className={"ms-1"}
            defaultDropDownName={ConverFirstLatterToCapital(langSelection)}
            handleDropDownClick={(e) =>
              setLangSelection(ConverFirstLatterToCapital(e.target.name))
            }
            // disabled
          />
        </div>
      </div>

      {!eventDetailQuery.isLoading ? (
        <div className="mt-1">
          <EventForm
            AddLanguage
            editImage="edit"
            langSelectionValue={langSelection}
            defaultImages={eventDetailQuery?.data?.result?.images}
            initialValues={initialValues}
            validationSchema={schema}
            showTimeInput
            handleSubmit={handleEventLangUpdate}
            buttonName={"news_AddLangNews"}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
