import { useQuery } from "@tanstack/react-query";
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

import {
  getPregnancyReportDetail,
  updatePregnancyReport,
} from "../../../../api/cattle/cattlePregnancy";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddPregnancyForm from "../../../../components/cattlePregnancy/addForm";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";
import "../../../../assets/scss/viewCommon.scss";
import "../../../../assets/scss/common.scss";

const getLangId = (langArray, langSelection) => {
  let languageId;
  langArray.map(async (Item) => {
    if (Item.name == langSelection?.toLowerCase()) {
      languageId = Item.id;
    }
  });
  return languageId;
};

const EditPregnancyReport = () => {
  const history = useHistory();
  const { pregnancyReportId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentPregnancyStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

  const PregnancyReportDetailQuery = useQuery(
    [
      "PregnancyReportDetail",
      pregnancyReportId,
      langSelection,
      selectedLang.id,
    ],
    async () => getPregnancyReportDetail(pregnancyReportId)
    // getPregnancyReportDetail({
    //   PregnancyReportId,
    //   languageId: getLangId(langArray, langSelection),
    // })
  );

  const handlePregnancyReportUpdate = async (payload) => {
    return updatePregnancyReport({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const schema = Yup.object().shape({
    cattleId: Yup.mixed().required("cattle_id_required"),
    pregnancyStatus: Yup.string().required("cattle_pregnancy_status_required"),
  });

  const initialValues = useMemo(() => {
    return {
      pregnancyId: PregnancyReportDetailQuery?.data?.result?.id,
      cattleId: PregnancyReportDetailQuery?.data?.result?.cattleId,
      calfId: PregnancyReportDetailQuery?.data?.result?.calfId,
      pregnancyStatus: PregnancyReportDetailQuery?.data?.result?.status,
      pregnancyDate: moment(
        PregnancyReportDetailQuery?.data?.result?.pregnancyDate
      ).toDate(),
      conceivingDate: moment(
        PregnancyReportDetailQuery?.data?.result?.conceivingDate
      ).toDate(),
    };
  }, [PregnancyReportDetailQuery]);

  return (
    <div className="pregnancyaddwraper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/cattle/pregnancy-reports?page=${currentPage}&status=${currentPregnancyStatus}&filter=${currentFilter}`
              )
            }
          />
          <div className="editEvent">
            <Trans i18nKey={"cattle_edit_pregnancy"} />
          </div>
        </div>
        {/* <div className="editEvent">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={PregnancyReportDetailQuery?.data?.result?.languages}
            className={"ms-1"}
            defaultDropDownName={ConverFirstLatterToCapital(
              langSelection ?? ""
            )}
            handleDropDownClick={(e) =>
              setLangSelection(ConverFirstLatterToCapital(e.target.name))
            }
            // disabled
          />
        </div> */}
      </div>

      <If
        condition={
          PregnancyReportDetailQuery.isLoading ||
          PregnancyReportDetailQuery.isFetching
        }
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
          {!PregnancyReportDetailQuery.isFetching && (
            <div className="FormikWrapper">
              <AddPregnancyForm
                initialValues={initialValues}
                validationSchema={schema}
                plusIconDisable
                handleSubmit={handlePregnancyReportUpdate}
                buttonName="save_changes"
              />
            </div>
          )}
        </Else>
      </If>
    </div>
  );
};

export default EditPregnancyReport;
