import { useQuery } from "@tanstack/react-query";
import he from "he";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import * as Yup from "yup";
import { getEventDetail, updateEventDetail } from "../../api/eventApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import EventForm from "../../components/events/eventForm";
import { CustomDropDown } from "../../components/partials/customDropDown";
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

const getLangId = (langArray, langSelection) => {
  let languageId;
  langArray.map(async (Item) => {
    if (Item.name == langSelection?.toLowerCase()) {
      languageId = Item.id;
    }
  });
  return languageId;
};

export default function EditEvent() {
  const history = useHistory();
  const { eventId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );
  const eventDetailQuery = useQuery(
    ["EventDetail", eventId, langSelection, selectedLang.id],
    async () =>
      getEventDetail({
        eventId,
        languageId: getLangId(langArray, langSelection),
      })
  );

  const handleEventUpdate = async (payload) => {
    return updateEventDetail({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

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
      images: eventDetailQuery?.data?.result?.images??[],
      PublishedBy: eventDetailQuery?.data?.result?.publishedBy,
      DateTime: {
        start: moment(eventDetailQuery?.data?.result?.startDate)
          .utcOffset("+0530")
          .toDate(),
        end: moment(eventDetailQuery?.data?.result?.endDate)
          .utcOffset("+0530")
          .toDate(),
      },
      startTime: eventDetailQuery?.data?.result?.startTime
      ? moment(eventDetailQuery?.data?.result?.startTime, 'HH:mm').format('HH:mm')
      : null,
      endTime: eventDetailQuery?.data?.result?.endTime
      ? moment(eventDetailQuery?.data?.result?.endTime, 'HH:mm').format('HH:mm')
      : null,
      location: eventDetailQuery?.data?.result?.location,
      city: eventDetailQuery?.data?.result?.city,
      state: eventDetailQuery?.data?.result?.state,
      latitude: eventDetailQuery?.data?.result?.longitude,
      longitude: eventDetailQuery?.data?.result?.latitude,
      SelectedEvent: {
        id: eventDetailQuery?.data?.result?.baseId,
        title: eventDetailQuery?.data?.result?.baseTitle
      }
    };
  }, [eventDetailQuery?.data?.result]);

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
            <Trans i18nKey={"events_EditEvent"} />
          </div>
        </div>
        <div className="editEvent">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={eventDetailQuery?.data?.result?.languages}
            className={"ms-1"}
            defaultDropDownName={ConverFirstLatterToCapital(
              langSelection ?? ""
            )}
            handleDropDownClick={(e) =>
              setLangSelection(ConverFirstLatterToCapital(e.target.name))
            }
            // disabled
          />
        </div>
      </div>

      <If
        condition={eventDetailQuery.isLoading || eventDetailQuery.isFetching}
        disableMemo
      >
        <Then>
          <Row>
            <SkeletonTheme
              baseColor="#FFF7E8"
              highlightColor="#fff"
              borderRadius={"10px"}
            >
              <Col xs={7} className="me-1">
                <Row className="my-1">
                  <Col xs={6}>
                    <Skeleton height={"36px"} />
                  </Col>
                  <Col xs={6}>
                    <Skeleton height={"36px"} />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col>
                    <Skeleton height={"150px"} />
                  </Col>
                </Row>
              </Col>
              <Col className="mt-1">
                <Skeleton height={"318px"} width={"270px"} />
              </Col>
            </SkeletonTheme>
          </Row>
        </Then>
        <Else>
          {!eventDetailQuery.isFetching && (
            <div className="mt-1">
              <EventForm
                editImage="edit"
                defaultImages={eventDetailQuery?.data?.result?.images}
                initialValues={initialValues}
                validationSchema={schema}
                showTimeInput
                selectEventDisabled
                handleSubmit={handleEventUpdate}
                buttonName="save_changes"
              />
            </div>
          )}
        </Else>
      </If>
    </div>
  );
}
