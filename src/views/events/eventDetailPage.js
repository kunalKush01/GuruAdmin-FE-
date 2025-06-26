import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getEventDetail } from "../../api/eventApi";
import DetailPage from "../../components/partials/customDetailpage";

const EventDetailPage = () => {
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const { eventId } = useParams();

  const eventDetailQuery = useQuery(
    ["EventDetail", eventId, selectedLang.id],
    async () =>
      getEventDetail({
        eventId,
        languageId: selectedLang.id,
      })
  );

  const tags = eventDetailQuery?.data?.result?.tags?.map((item) => item?.tag);

  let subImages = [];
  eventDetailQuery?.data?.result?.images?.length > 1
    ? (subImages = [...subImages, ...eventDetailQuery?.data?.result?.images])
    : [];
  subImages.splice(0, 1);
  return (
    <>
      <DetailPage
        tags={tags}
        title={eventDetailQuery?.data?.result?.title}
        latitude={eventDetailQuery?.data?.result?.latitude}
        longitude={eventDetailQuery?.data?.result?.longitude}
        startDate={eventDetailQuery?.data?.result?.startDate}
        description={eventDetailQuery?.data?.result?.body}
        images={eventDetailQuery?.data?.result?.images}
        subImages={subImages}
        langButton={eventDetailQuery?.data?.result?.languages}
      />
    </>
  );
};

export default EventDetailPage;
