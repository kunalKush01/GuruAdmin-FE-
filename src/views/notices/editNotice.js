import { Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import CustomTextField from "../../components/partials/customTextField";
import * as yup from "yup";
import RichTextField from "../../components/partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../../components/partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNews, getNewsDetail, updateNewsDetail } from "../../api/newsApi";
import { useSelector } from "react-redux";
import moment from "moment";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import he from "he";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { If, Then, Else } from "react-if-else-switch";

import { getNoticeDetail, updateNoticeDetail } from "../../api/noticeApi";
import NoticeForm from "../../components/notices/noticeForm";

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
  Title: yup.string().matches(/^[^!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]*$/g,"injection_found").required("notices_title_required"),
  Body: yup.string().required("notices_desc_required"),
  DateTime: yup.string(),
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

export default function EditNotice() {
  const history = useHistory();
  const { noticeId } = useParams();

  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang= useSelector(state=>state.auth.selectLang)
  const [langSelection, setLangSelection] = useState(selectedLang.name);


  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get('page')
  const currentFilter = searchParams.get('filter')

  const noticeDetailQuery = useQuery(
    ["NoticeDetail", noticeId, langSelection],
    async () =>
      getNoticeDetail({
        noticeId,
        languageId: getLangId(langArray, langSelection,selectedLang.id),
      })
  );

  const handleNoticeUpdate = async (payload) => {
    return updateNoticeDetail({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };
  const tags = noticeDetailQuery?.data?.result?.tags?.map((item)=>({
    id: item.id,
    text: item.tag,
    _id: item.id
  }))
  const initialValues = useMemo(() => {
    return {
      Id: noticeDetailQuery?.data?.result?.id,
      Title: noticeDetailQuery?.data?.result?.title,
      tagsInit:tags,
      image:noticeDetailQuery?.data?.result?.image,
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
            className="me-2  cursor-pointer"
            onClick={() => history.push(`/notices?page=${currentPage}&filter=${currentFilter}`)}
          />
          <div className="editNotice">
            <Trans i18nKey={"notices_EditNotice"} />
          </div>
        </div>
        <div className="editNotice">
        <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={noticeDetailQuery?.data?.result?.languages}
            className={"ms-1"}
            defaultDropDownName={ConverFirstLatterToCapital(langSelection ?? "")}
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
            <div className="ms-sm-3 mt-1">

              <NoticeForm
                initialValues={initialValues}
                editThumbnail
                thumbnailImageName={noticeDetailQuery?.data?.result?.imageName}
                vailidationSchema={schema}
                showTimeInput
                selectNoticeDisabled
                buttonName="save_changes"
                handleSubmit={handleNoticeUpdate}
              />
            </div>
          )}
        </Else>
      </If>
    </NoticeWarper>
  );
}
