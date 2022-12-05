import { Form, Formik } from "formik";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import CustomTextField from "../../components/partials/customTextField";
import * as yup from "yup";
import styled from "styled-components";
import { CustomDropDown } from "../../components/partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSelector } from "react-redux";
import moment from "moment";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import he from "he";
import NoticeForm from "../../components/notices/noticeForm";
import { addLangNoticeDetail, getNoticeDetail } from "../../api/noticeApi";

const NoticeWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .editNotice {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const schema = yup.object().shape({
  Title: yup.string().required("notices_title_required"),
  Body: yup.string().required("notices_desc_required"),
  DateTime: yup.string(),
});

export default function AddLanguageNotice() {
  const history = useHistory();
  const { noticeId } = useParams();

  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [langSelection, setLangSelection] = useState(ConverFirstLatterToCapital(selectedLang.name));

  const noticeDetailQuery = useQuery(
    ["NoticeDetail", noticeId, langSelection, selectedLang.id],
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
  useEffect(() => {
    if (availableLangOptions.length != 0) {
      setLangSelection(availableLangOptions[0]?.name);
    }
  }, [availableLangOptions]);

  const initialValues = useMemo(() => {
    return {
      Id: noticeDetailQuery?.data?.result?.id,
      Title: noticeDetailQuery?.data?.result?.title,
      Tags: noticeDetailQuery?.data?.result?.tags,
      Body: he.decode(noticeDetailQuery?.data?.result?.body ?? ""),
      PublishedBy: noticeDetailQuery?.data?.result?.publishedBy,
      DateTime: moment(noticeDetailQuery?.data?.result?.publishDate)
        .utcOffset("+0530")
        .toDate(),
    };
  }, [noticeDetailQuery]);

  return (
    <NoticeWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2"
            onClick={() => history.push("/Notices")}
          />
          <div className="editNotice">
            <Trans i18nKey={"news_AddLangNews"} />
          </div>
        </div>
        <div className="editNotice">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={availableLangOptions}
            className={"ms-1"}
            defaultDropDownName={langSelection}
            handleDropDownClick={(e) =>
              setLangSelection(ConverFirstLatterToCapital(e.target.name))
            }
            // disabled
          />
        </div>
      </div>

      {!noticeDetailQuery.isLoading ? (
        <NoticeForm
          initialValues={initialValues}
          vailidationSchema={schema}
          showTimeInput
          handleSubmit={handleNoticeLangUpdate}
          buttonName="news_AddLangNews"
        />
      ) : (
        ""
      )}
    </NoticeWarper>
  );
}
