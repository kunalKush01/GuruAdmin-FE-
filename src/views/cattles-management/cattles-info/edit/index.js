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

const CattleAddWraper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addEvent {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

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
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

  const cattleDetails = useQuery(
    ["cattleDetails", cattleId, langSelection, selectedLang.id],
    async () => getCattleInfoDetail(cattleId)
  );
  console.log(cattleDetails);
  const handleCattleUpdate = async (payload) => {
    return updateCattleInfo({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const schema = Yup.object().shape({
    tagId: Yup.string().required("cattle_tag_id_required"),
    type: Yup.mixed().required("cattle_type_required"),
    breed: Yup.string().required("cattle_breed_required"),
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
      type:
        {
          label: ConverFirstLatterToCapital(
            cattleDetails?.data?.result?.type?.toLowerCase() ?? ""
          ),
          value: cattleDetails?.data?.result?.type,
        } ?? "",
      breed: cattleDetails?.data?.result?.breed ?? "",
      soldDate: moment(cattleDetails?.data?.result?.soldDate).toDate(),
      dob: moment(cattleDetails?.data?.result?.dob).toDate(),
      purchaseDate: moment(cattleDetails?.data?.result?.purchaseDate).toDate(),
      deathDate: moment(cattleDetails?.data?.result?.deathDate).toDate(),
      deliveryDate: moment(cattleDetails?.data?.result?.deliveryDate).toDate(),
      pregnantDate: moment(cattleDetails?.data?.result?.pregnantDate).toDate(),
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
    <CattleAddWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/cattle/info?page=${currentPage}&filter=${currentFilter}`
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
            <div className="ms-sm-3 mt-1">
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
    </CattleAddWraper>
  );
};

export default EditCattle;
