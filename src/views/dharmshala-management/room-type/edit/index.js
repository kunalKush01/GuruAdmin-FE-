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
  getRoomTypeDetail,
  updateRoomTypeInfo,
} from "../../../../api/dharmshala/dharmshalaInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddRoomTypeForm from "../../../../components/roomType/addForm";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";
import {RoomTypeAddWrapper} from "../../dharmshalaStyles";
//import { DharmshalaSource, dharmshalaType } from "../add";

// const RoomTypeAddWrapper = styled.div`
//   color: #583703;
//   font: normal normal bold 20px/33px Noto Sans;
//   .ImagesVideos {
//     font: normal normal bold 15px/33px Noto Sans;
//   }
//   .addEvent {
//     color: #583703;
//     display: flex;
//     align-items: center;
//   }
// `;

const getLangId = (langArray, langSelection) => {
  let languageId;
  langArray.map(async (Item) => {
    if (Item.name == langSelection?.toLowerCase()) {
      languageId = Item.id;
    }
  });
  return languageId;
};

const EditRoomType = () => {
  const history = useHistory();
  const { roomTypeId } = useParams();
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

  const roomTypeDetails = useQuery(
    ["roomTypeDetails", roomTypeId, langSelection, selectedLang.id],
    async () => getRoomTypeDetail(roomTypeId)
  );

  const handleRoomTypeUpdate = async (payload) => {
    return updateRoomTypeInfo({
      roomTypeId: roomTypeId,
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const schema = Yup.object().shape({
    name: Yup.string().required("dharmshala_roomtype_name_required"),
    description: Yup.mixed().required(
      "dharmshala_roomtype_description_required"
    ),
    capacity: Yup.mixed().required("dharmshala_roomtype_capacity_required"),
    price: Yup.mixed().required("dharmshala_roomtype_price_required"),
  });

  const initialValues = useMemo(() => {
    return {
      name: roomTypeDetails?.data?.result?.name ?? "",
      description: roomTypeDetails?.data?.result?.description ?? "",
      capacity: roomTypeDetails?.data?.result?.capacity ?? "",
      price: roomTypeDetails?.data?.result?.price ?? "",
    };
  }, [roomTypeDetails]);

  return (
    <RoomTypeAddWrapper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/roomtype/info?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}`
              )
            }
          />
          <div className="editEvent">
            <Trans i18nKey={"dharmshala_edit_roomtype"} />
          </div>
        </div>
        {/* <div className="editEvent">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={roomTypeDetails?.data?.result?.languages}
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
        condition={roomTypeDetails.isLoading || roomTypeDetails.isFetching}
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
          {!roomTypeDetails.isFetching && (
            <div className="ms-sm-3 mt-1">
              <AddRoomTypeForm
                handleSubmit={handleRoomTypeUpdate}
                initialValues={initialValues}
                validationSchema={schema}
                editThumbnail
                buttonName="save_changes"
                /*RoomTypeType={RoomTypeType}
                RoomTypeSource={RoomTypeSource} */
              />
            </div>
          )}
        </Else>
      </If>
    </RoomTypeAddWrapper>
  );
};

export default EditRoomType;
