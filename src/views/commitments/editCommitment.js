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
import CommitmentForm from "../../components/commitments/commitmentForm"
import { getCommitmentDetail, updateCommitmentDetail } from "../../api/commitmentApi";

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
    Mobile: yup.string().required("expenses_mobile_required"),
    // SelectedUser: yup.string().required("user_select_required"),
    // donarName: yup.string().required("donar_name_required"),
    SelectedMasterCategory: yup.object().required("masterCategory_required"),
    SelectedSubCategory: yup.object(),  
    Amount:yup.string().required("amount_required"),
    
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

export default function EditCommitment() {
  const history = useHistory();
  const { commitmentId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

  const commitmentDetailQuery = useQuery(
    ["CommitmentDetail", commitmentId, langSelection, selectedLang.id],
    async () =>
      await getCommitmentDetail({
        commitmentId,
        languageId: getLangId(langArray, langSelection),
      })
  );

  const handleCommitmentUpdate = async (payload) => {
    return updateCommitmentDetail({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const initialValues = useMemo(() => {
    return {
        Id:commitmentDetailQuery?.data?.result?.id,
        Mobile:commitmentDetailQuery?.data?.result?.user?.mobileNumber,
        SelectedUser: commitmentDetailQuery?.data?.result?.user,
        donarName: commitmentDetailQuery?.data?.result?.donarName,
        SelectedMasterCategory: commitmentDetailQuery?.data?.result?.masterCategory,
        SelectedSubCategory:commitmentDetailQuery?.data?.result?.category,
        createdBy:commitmentDetailQuery?.data?.result?.createdBy.name,
        Amount:commitmentDetailQuery?.data?.result?.amount,
        DateTime:moment(commitmentDetailQuery?.data?.result?.commitmentEndDate).utcOffset("+0530").toDate(),
    };
  }, [commitmentDetailQuery]);

  return (
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/commitment")}
          />
          <div className="editNews">
            <Trans i18nKey={"edit_commitment"} />
          </div>
        </div>
      </div>
      <If
        condition={commitmentDetailQuery.isLoading }
        diableMemo
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
          {!commitmentDetailQuery.isFetching && (
            <div className="ms-3 mt-1 mb-3">
              <CommitmentForm
                vailidationSchema={schema}
                initialValues={initialValues}
                showTimeInput
                handleSubmit={handleCommitmentUpdate}
                buttonName={"save_changes"}
              />
            </div>
          )}
        </Else>
      </If>
    </NewsWarper>
  );
}
