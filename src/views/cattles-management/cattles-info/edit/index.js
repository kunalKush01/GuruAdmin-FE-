import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import * as Yup from "yup";

import moment from "moment";
import {
  getCattleInfoDetail,
  updateCattleInfo,
} from "../../../../api/cattle/cattleInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddCattleForm from "../../../../components/cattleInfo/addForm";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";
import { cattleSource, cattleType } from "../add";
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

const EditCattle = () => {
  const history = useHistory();
  const { cattleId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  // const currentBreed = searchParams.get("breed");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

  const cattleDetails = useQuery(
    ["cattleDetails", cattleId, langSelection, selectedLang.id],
    async () => getCattleInfoDetail(cattleId)
  );

  const handleCattleUpdate = async (payload) => {
    return updateCattleInfo({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const schema = Yup.object().shape({
    tagId: Yup.string().required("cattle_tag_id_required"),
    type: Yup.mixed().required("cattle_type_required"),
    breed: Yup.mixed().required("cattle_breed_required"),
    age: Yup.string().required("cattle_age_required"),
    purchasePrice: Yup.string().required("cattle_purchase_price_required"),
    source: Yup.mixed().required("cattle_source_required"),
    ownerName: Yup.string().required("cattle_owner_name_required"),
    ownerMobile: Yup.string().required("expenses_mobile_required"),
    ownerId: Yup.string().required("cattle_owner_id_required"),
  });

  const initialValues = useMemo(() => {
    return {
      tagId: cattleDetails?.data?.result?.tagId ?? "",
      cattleId: cattleDetails?.data?.result?._id,
      motherId: cattleDetails?.data?.result?.motherId,
      type: cattleDetails?.data?.result?.typeId ?? "",
      breed: cattleDetails?.data?.result?.breedId ?? "",
      soldDate: cattleDetails?.data?.result?.soldDate
        ? moment(cattleDetails?.data?.result?.soldDate).toDate()
        : new Date(),
      dob: cattleDetails?.data?.result?.dob
        ? moment(cattleDetails?.data?.result?.dob).toDate()
        : new Date(),
      purchaseDate: cattleDetails?.data?.result?.purchaseDate
        ? moment(cattleDetails?.data?.result?.purchaseDate).toDate()
        : new Date(),
      deathDate: cattleDetails?.data?.result?.deathDate
        ? moment(cattleDetails?.data?.result?.deathDate).toDate()
        : new Date(),
      deliveryDate: cattleDetails?.data?.result?.deliveryDate
        ? moment(cattleDetails?.data?.result?.deliveryDate).toDate()
        : new Date(),
      pregnancyDate: cattleDetails?.data?.result?.pregnancyDate
        ? moment(cattleDetails?.data?.result?.pregnancyDate).toDate()
        : new Date(),
      deathReason: cattleDetails?.data?.result?.deathReason ?? "",
      purchasePrice: cattleDetails?.data?.result?.purchasePrice ?? "",
      source:
        {
          label: ConverFirstLatterToCapital(
            cattleDetails?.data?.result?.source?.toLowerCase() ?? ""
          ),
          value: cattleDetails?.data?.result?.source,
        } ?? "",
      ownerName: cattleDetails?.data?.result?.ownerName ?? "",
      ownerCountryName: cattleDetails?.data?.result?.ownerCountryName ?? "in",
      ownerCountryCode: cattleDetails?.data?.result?.ownerCountryCode ?? "+91",
      ownerMobile: cattleDetails?.data?.result?.ownerMobile ?? "",
      ownerId: cattleDetails?.data?.result?.ownerId ?? "",
      cattleImage: cattleDetails?.data?.result?.cattleImage ?? "",
      ownerImage: cattleDetails?.data?.result?.ownerImage ?? "",
      age: cattleDetails?.data?.result?.age ?? "",
      isDead: cattleDetails?.data?.result?.isDead ? "YES" : "NO",
      isPregnant: cattleDetails?.data?.result?.isPregnant ? "YES" : "NO",
      isSold: cattleDetails?.data?.result?.isSold ? "YES" : "NO",
      isMilking: cattleDetails?.data?.result?.isMilking ? "YES" : "NO",
      purchaserName: cattleDetails?.data?.result?.purchaserName ?? "",
      purchaserCountryName:
        cattleDetails?.data?.result?.purchaserCountryName ?? "in",
      purchaserCountryCode:
        cattleDetails?.data?.result?.purchaserCountryCode ?? "+91",
      purchaserMobile: cattleDetails?.data?.result?.purchaserMobile ?? "",
      purchaserId: cattleDetails?.data?.result?.purchaserId ?? "",
      soldPrice: cattleDetails?.data?.result?.soldPrice ?? "",
      milkQuantity: cattleDetails?.data?.result?.milkQuantity ?? "",
    };
  }, [cattleDetails]);

  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push(`/cattle/info`)}
          />
          <div className="editEvent">
            <Trans i18nKey={"cattle_edit_cattle"} />
          </div>
        </div>
        {/* <div className="editEvent">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={cattleDetails?.data?.result?.languages}
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
        condition={cattleDetails.isLoading || cattleDetails.isFetching}
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
          {!cattleDetails.isFetching && (
            <div className="FormikWrapper">
              <AddCattleForm
                handleSubmit={handleCattleUpdate}
                initialValues={initialValues}
                validationSchema={schema}
                editThumbnail
                getMobile={
                  cattleDetails?.data?.result?.ownerCountryCode +
                  cattleDetails?.data?.result?.ownerMobile
                }
                getPurchaserMobile={
                  cattleDetails?.data?.result?.purchaserCountryCode ??
                  "+91" + cattleDetails?.data?.result?.purchaserMobile
                }
                ownerImageName={cattleDetails?.data?.result?.ownerImageName}
                cattleImageName={cattleDetails?.data?.result?.cattleImageName}
                buttonName="save_changes"
                cattleType={cattleType}
                cattleSource={cattleSource}
              />
            </div>
          )}
        </Else>
      </If>
    </div>
  );
};

export default EditCattle;
