import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import * as Yup from "yup";

import moment from "moment";
import {
  getDharmshalaInfoDetail,
  updateDharmshalaInfo,
} from "../../../../api/dharmshala/dharmshalaInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddDharmshalaForm from "../../../../components/dharmshalaInfo/addForm";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";
import "../../../../assets/scss/common.scss";
import "../../../../assets/scss/dharmshala.scss";

const getLangId = (langArray, langSelection) => {
  let languageId;
  langArray.map(async (Item) => {
    if (Item.name == langSelection?.toLowerCase()) {
      languageId = Item.id;
    }
  });
  return languageId;
};

const EditDharmshala = () => {
  const navigate = useNavigate();
  const { buildingId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

  const dharmshalaDetails = useQuery(
    ["dharmshalaDetails", buildingId, langSelection, selectedLang.id],
    async () => getDharmshalaInfoDetail(buildingId)
  );

  const handleDharmshalaUpdate = async (payload) => {
    return updateDharmshalaInfo({
      buildingId: buildingId,
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const schema = Yup.object().shape({
    name: Yup.string().required("building_name_required"),
    description: Yup.mixed().required("building_description_required"),
    location: Yup.mixed().required("building_location_required"),
  });

  const initialValues = useMemo(() => {
    return {
      name: dharmshalaDetails?.data?.result?.name ?? "",
      description: dharmshalaDetails?.data?.result?.description ?? "",
      location: dharmshalaDetails?.data?.result?.location ?? "",
    };
  }, [dharmshalaDetails]);

  return (
    <div className="DharmshalaComponentAddWrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => navigate(`/dharmshala/info`)}
          />
          <div className="editEvent">
            <Trans i18nKey={"dharmshala_edit_building"} />
          </div>
        </div>
      </div>

      <If
        condition={dharmshalaDetails.isLoading || dharmshalaDetails.isFetching}
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
          {!dharmshalaDetails.isFetching && (
            <div className="listviewwrapper">
              <AddDharmshalaForm
                handleSubmit={handleDharmshalaUpdate}
                initialValues={initialValues}
                validationSchema={schema}
                editThumbnail
                buttonName="save_changes"
              />
            </div>
          )}
        </Else>
      </If>
    </div>
  );
};

export default EditDharmshala;
