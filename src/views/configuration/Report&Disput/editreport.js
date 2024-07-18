import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import he from "he";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import * as Yup from "yup";
import { createNews, getNewsDetail, updateNewsDetail } from "../../api/newsApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { CustomDropDown } from "../../components/partials/customDropDown";
import CustomTextField from "../../components/partials/customTextField";
import RichTextField from "../../components/partials/richTextEditorField";
import { ConverFirstLatterToCapital } from "../../utility/formater";

import { getNoticeDetail, updateNoticeDetail } from "../../api/noticeApi";
import CategoryForm from "../../components/categories/categoryForm";
import NoticeForm from "../../components/notices/noticeForm";

import '../../../styles/viewCommon.scss';;
;

const schema = Yup.object().shape({
  Title: Yup.string().required("notices_title_required"),
  Body: Yup.string().required("notices_desc_required"),
  DateTime: Yup.string(),
});

const getLangId = (langArray, langSelection) => {
  let languageId;
  langArray.map(async (Item) => {
    if (Item.name == langSelection.toLowerCase()) {
      languageId = Item.id;
    }
  });
  return languageId;
};

export default function EditReportDispute() {
  const history = useHistory();
  const { noticeId } = useParams();

  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [langSelection, setLangSelection] = useState(selectedLang.name);
  const noticeDetailQuery = useQuery(
    ["NoticeDetail", noticeId, langSelection],
    async () =>
      getNoticeDetail({
        noticeId,
        languageId: getLangId(langArray, langSelection, selectedLang.id),
      })
  );

  const handleNoticeUpdate = async (payload) => {
    return updateNoticeDetail({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const initialValues = useMemo(() => {
    return {
      Id: noticeDetailQuery?.data?.result?.id,
      Title: noticeDetailQuery?.data?.result?.title,
      Tags: noticeDetailQuery?.data?.result?.tags,
      Body: he?.decode(noticeDetailQuery?.data?.result?.body ?? ""),
      PublishedBy: noticeDetailQuery?.data?.result?.publishedBy,
      DateTime: moment(noticeDetailQuery?.data?.result?.publishDate)
        .utcOffset("+0530")
        .toDate(),
    };
  }, [noticeDetailQuery]);

  return (
    <div className="noticewrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/report-dispute")}
          />
          <div className="editReportDispute">
            <Trans i18nKey={"report_editReport"} />
          </div>
        </div>
        <div className="editReportDispute">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={noticeDetailQuery?.data?.result?.languages}
            className={"ms-1"}
            defaultDropDownName={langSelection}
            handleDropDownClick={(e) =>
              setLangSelection(ConverFirstLatterToCapital(e.target.name))
            }
            // disabled
          />
        </div>
      </div>

      <If
        disableMemo
        condition={noticeDetailQuery.isLoading || noticeDetailQuery.isFetching}
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
          {!!noticeDetailQuery?.data?.result && (
            <CategoryForm
              buttonLabel={"category_save"}
              initialValues={initialValues}
              validationSchema={schema}
              showTimeInput
              selectNoticeDisabled
              handleSubmit={handleNoticeUpdate}
            />
          )}
        </Else>
      </If>
    </div>
  );
}
