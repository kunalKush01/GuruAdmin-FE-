import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getEventDetail } from "../../api/eventApi";
import { getNoticeDetail } from "../../api/noticeApi";
import DetailPage from "../../components/partials/customDetailpage";

const NoticeDetailPage = () => {
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const { noticeId } = useParams();

  const noticeDetailQuery = useQuery(
    ["NoticeDetail", noticeId, selectedLang.id],
    async () =>
      getNoticeDetail({
        noticeId,
        languageId: selectedLang.id,
      })
  );

  const tags = noticeDetailQuery?.data?.result?.tags?.map((item) => item?.tag);

  return (
    <>
      <DetailPage
        tags={tags}
        title={noticeDetailQuery?.data?.result?.title}
        latitude={noticeDetailQuery?.data?.result?.latitude}
        longitude={noticeDetailQuery?.data?.result?.longitude}
        startDate={noticeDetailQuery?.data?.result?.startDate}
        description={noticeDetailQuery?.data?.result?.body}
        image={noticeDetailQuery?.data?.result?.imageName}
        langButton={noticeDetailQuery?.data?.result?.languages}
      />
    </>
  );
};

export default NoticeDetailPage;
