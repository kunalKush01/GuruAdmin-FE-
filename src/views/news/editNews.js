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
import NewsForm from "../../components/news/newsForm";

const NewsWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .editNews {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const schema = yup.object().shape({
  Title: yup.string().required("news_title_required"),
  Tags: yup.string().required("news_tags_required"),
  Body: yup.string().required("news_desc_required"),
  PublishedBy: yup.string().required("news_publish_required"),
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

export default function EditNews() {
  const history = useHistory();
  const { newsId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang= useSelector(state=>state.auth.selectLang)
  const [langSelection, setLangSelection] = useState(ConverFirstLatterToCapital(selectedLang.name));

  const newsDetailQuery = useQuery(
    ["NewsDetail", newsId, langSelection,selectedLang.id],
    async () =>
      await getNewsDetail({
        newsId,
        languageId: getLangId(langArray, langSelection),
      })
  );

  

  const handleNewsUpdate = async (payload) => {
    return updateNewsDetail({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const loggedInUser = useSelector((state)=>state.auth.userDetail?.name)
  

  const initialValues = useMemo(()=>{
    return  {
      Id: newsDetailQuery?.data?.result?.id,
      Title: newsDetailQuery?.data?.result?.title,
      Tags: newsDetailQuery?.data?.result?.tags,
      Body: he.decode(newsDetailQuery?.data?.result?.body ?? ""),
      PublishedBy:loggedInUser,
      DateTime: moment(newsDetailQuery?.data?.result?.publishDate)
        .utcOffset("+0530")
        .toDate(),
    };
  },[newsDetailQuery])

  return (
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/news")}
          />
          <div className="editNews">
            <Trans i18nKey={"news_EditNews"} />
          </div>
        </div>
        <div className="editNews">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={newsDetailQuery?.data?.result?.languages}
            className={"ms-1"}
            defaultDropDownName={langSelection}
            handleDropDownClick={(e) =>
              setLangSelection(ConverFirstLatterToCapital(e.target.name))
            }
            // disabled
          />
        </div>
      </div>
      <If condition={newsDetailQuery.isLoading || newsDetailQuery.isFetching} diableMemo >
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
          
          {!newsDetailQuery.isFetching&&
          <div className="ms-3 mt-1">

            <NewsForm
              vailidationSchema={schema}
              initialValues={initialValues}
              showTimeInput
              handleSubmit={handleNewsUpdate}
              buttonName={"save_changes"}
            />
          </div>
            }
        </Else>
      </If>
    </NewsWarper>
  );
}
