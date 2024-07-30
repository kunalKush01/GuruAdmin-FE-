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
import { addLangNoticeDetail, getNoticeDetail } from "../../api/noticeApi";
import NoticeForm from "../../components/notices/noticeForm";
import { ConverFirstLatterToCapital } from "../../utility/formater";

import "../../assets/scss/viewCommon.scss";

const schema = Yup.object().shape({
  Title: Yup.string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("notices_title_required")
    .trim(),
  Body: Yup.string().required("notices_desc_required").trim(),
  DateTime: Yup.string(),
  // tagsInit:Yup.array().max(15 ,"tags_limit"),
});

export default function AddLanguageNotice() {
  const history = useHistory();
  const { noticeId } = useParams();

  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState("Select");

  const noticeDetailQuery = useQuery(
    ["NoticeDetail", noticeId, selectedLang.id],
    async () => await getNoticeDetail({ noticeId, languageId: selectedLang.id })
  );

  const handleNoticeLangUpdate = (payload) => {
    let languageId;
    langArray.map(async (Item) => {
      if (Item.name == langSelection.toLowerCase()) {
        languageId = Item.id;
      }
    });

    return addLangNoticeDetail({ ...payload, languageId });
  };

  const getAvailLangOption = () => {
    if (noticeDetailQuery?.data?.result?.languages && langArray) {
      const option = _.differenceBy(
        langArray,
        noticeDetailQuery?.data?.result?.languages,
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
    noticeDetailQuery?.data?.result?.languages,
  ]);
  // useEffect(() => {
  //   if (availableLangOptions.length != 0) {
  //     setLangSelection(availableLangOptions[0]?.name);
  //   }
  // }, [availableLangOptions]);
  const tags = noticeDetailQuery?.data?.result?.tags?.map((item) => ({
    id: item.id,
    text: item.tag,
    _id: item.id,
  }));
  const initialValues = useMemo(() => {
    return {
      Id: noticeDetailQuery?.data?.result?.id,
      Title: noticeDetailQuery?.data?.result?.title,
      tagsInit: tags,
      image: noticeDetailQuery?.data?.result?.image,
      Body: he?.decode(noticeDetailQuery?.data?.result?.body ?? ""),
      PublishedBy: noticeDetailQuery?.data?.result?.publishedBy,
      DateTime: moment(noticeDetailQuery?.data?.result?.publishDate)
        .utcOffset("+0530")
        .toDate(),
    };
  }, [noticeDetailQuery]);

  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/notices?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="editNotice">
            <Trans i18nKey={"news_AddLangNews"} />
          </div>
        </div>
        <div className="editNotice">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={availableLangOptions}
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

      {!noticeDetailQuery.isLoading ? (
        <div className="mt-1">
          <NoticeForm
            editThumbnail
            thumbnailImageName={noticeDetailQuery?.data?.result?.imageName}
            initialValues={initialValues}
            AddLanguage
            langSelectionValue={langSelection}
            validationSchema={schema}
            showTimeInput
            handleSubmit={handleNoticeLangUpdate}
            buttonName="news_AddLangNews"
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
