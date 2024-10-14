import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { Col, Row } from "reactstrap";
import * as Yup from "yup";
import moment from "moment";
import {
  getRoomDetail,
  updateRoom,
} from "../../../../api/dharmshala/dharmshalaInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddRoomForm from "../../../../components/dharmshalaRoom/addForm";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";
import { DharmshalaRoomAddWrapper } from "../../dharmshalaStyles";
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

const EditRoom = () => {
  const history = useHistory();
  const { roomId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const location = useLocation();
  const roomData = location.state?.roomData;
  const number = searchParams.get("number");
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

  const roomDetails = useQuery(
    ["roomDetails", roomId, langSelection, selectedLang.id],
    async () => getRoomDetail(roomId)
  );

  const handleDharmshalaRoomUpdate = async (payload) => {
    return updateRoom({
      roomId: roomId,
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const schema = Yup.object().shape({
    number: Yup.mixed().required("dharmshala_room_number_required"),
  });

  const initialValues = useMemo(() => {
    return {
      number: roomData?.roomNumber,
      roomType: { value: roomData?.roomTypeId, label: roomData?.roomTypeName },
    };
  }, [roomDetails]);

  const URLParams = useParams("");

  return (
    <DharmshalaRoomAddWrapper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(`/room/${URLParams.floorId}/${URLParams.buildingId}`)
            }
          />
          <div className="editEvent">
            <Trans i18nKey={"dharmshala_room_edit_dharmshala"} />
          </div>
        </div>
      </div>

      <If
        condition={roomDetails.isLoading || roomDetails.isFetching}
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
          {!roomDetails.isFetching && (
            <div className="FormikWrapper">
              <AddRoomForm
                handleSubmit={handleDharmshalaRoomUpdate}
                initialValues={initialValues}
                validationSchema={schema}
                editThumbnail
                buttonName="save_changes"
              />
            </div>
          )}
        </Else>
      </If>
    </DharmshalaRoomAddWrapper>
  );
};

export default EditRoom;
