import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import * as Yup from "yup";

import moment from "moment";
import styled from "styled-components";
import {
  getMedicalInfoDetail,
  updateMedicalInfo,
} from "../../../../api/cattle/cattleMedical";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddMedicalInfoForm from "../../../../components/cattleMedicalInfo/addForm";
import { CustomDropDown } from "../../../../components/partials/customDropDown";
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

const EditMedicalInfo = () => {
  const history = useHistory();
  const { medicalInfoId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

  const medicalInfoDetailQuery = useQuery(
    ["MedicalDetail", medicalInfoId, langSelection, selectedLang.id],
    async () => getMedicalInfoDetail(medicalInfoId)
    // getMedicalInfoDetail({
    //   medicalInfoId,
    //   languageId: getLangId(langArray, langSelection),
    // })
  );
  const handleMedicalInfoUpdate = async (payload) => {
    return updateMedicalInfo({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const schema = Yup.object().shape({
    cattleCalfId: Yup.mixed().required("cattle_id_required"),
    treatmentMedicine: Yup.string().required(
      "cattle_treatment_medicine_required"
    ),
    dosage: Yup.string().required("cattle_dosage_required"),
    DrName: Yup.string().required("cattle_DrName_required"),
    Mobile: Yup.string().required("expenses_mobile_required"),
    price: Yup.number().required("cattle_price_required"),
    cattleSymptoms: Yup.string().required("cattle_symptoms_required"),
  });

  const initialValues = useMemo(() => {
    return {
      medicalId: medicalInfoDetailQuery?.data?.result?.id,
      cattleCalfId: medicalInfoDetailQuery?.data?.result?.cattleId,
      treatmentMedicine: medicalInfoDetailQuery?.data?.result?.medicine ?? "",
      dosage: medicalInfoDetailQuery?.data?.result?.dosage ?? "",
      DrName: medicalInfoDetailQuery?.data?.result?.doctorName ?? "",
      countryCode: medicalInfoDetailQuery?.data?.result?.countryName ?? "in",
      dialCode: medicalInfoDetailQuery?.data?.result?.countryCode ?? "+91",
      Mobile: medicalInfoDetailQuery?.data?.result?.doctorNumber,
      price: medicalInfoDetailQuery?.data?.result?.expenseAmount ?? "",
      cattleSymptoms: medicalInfoDetailQuery?.data?.result?.symptoms ?? "",
      startDate: moment(
        medicalInfoDetailQuery?.data?.result?.treatmentDate
      ).toDate(),
    };
  }, [medicalInfoDetailQuery]);

  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/cattle/medical-info?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="editEvent">
            <Trans i18nKey={"cattle_edit_medical"} />
          </div>
        </div>
        {/* <div className="editEvent">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={medicalInfoDetailQuery?.data?.result?.languages}
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
          medicalInfoDetailQuery.isLoading || medicalInfoDetailQuery.isFetching
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
          {!medicalInfoDetailQuery.isFetching && (
            <AddMedicalInfoForm
              getMobile={
                medicalInfoDetailQuery?.data?.result?.countryCode +
                medicalInfoDetailQuery?.data?.result?.doctorNumber
              }
              plusIconDisable
              initialValues={initialValues}
              validationSchema={schema}
              handleSubmit={handleMedicalInfoUpdate}
              buttonName="save_changes"
            />
          )}
        </Else>
      </If>
    </div>
  );
};

export default EditMedicalInfo;
