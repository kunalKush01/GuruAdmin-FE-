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
import {
  getFloorDetail,
  updateFloor,
} from "../../../../api/dharmshala/dharmshalaInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddDharmshalaFloorForm from "../../../../components/dharmshalaFloor/addForm";
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

const EditFloor = () => {
  const history = useHistory();
  const { floorId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const name = searchParams.get("name");
  const number = searchParams.get("number");
  const description = searchParams.get("description");

  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

  const floorDetails = useQuery(
    ["floorDetails", floorId, langSelection, selectedLang.id],
    async () => getFloorDetail(floorId)
  );

  const handleDharmshalaFloorUpdate = async (payload) => {
    return updateFloor({
      floorId: floorId,
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const schema = Yup.object().shape({
    name: Yup.string().required("dharmshala_floor_name_required"),
    description: Yup.mixed().required("dharmshala_floor_description_required"),
    number: Yup.mixed().required("dharmshala_floor_number_required"),
  });

  const initialValues = useMemo(() => {
    return {
      name: name,
      description: description,
      number: number,
    };
  }, [floorDetails]);

  const URLParams = useParams("");

  return (
    <div className="DharmshalaComponentAddWrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push(`/floors/${URLParams.buildingId}`)}
          />
          <div className="editEvent">
            <Trans i18nKey={"dharmshala_floor_edit_dharmshala"} />
          </div>
        </div>
        {/* <div className="editEvent">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={DharmshalaDetails?.data?.result?.languages}
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
        condition={floorDetails.isLoading || floorDetails.isFetching}
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
          {!floorDetails.isFetching && (
            <div className="listviewwrapper">
              <AddDharmshalaFloorForm
                handleSubmit={handleDharmshalaFloorUpdate}
                initialValues={initialValues}
                validationSchema={schema}
                editThumbnail
                buttonName="save_changes"
                /*DharmshalaType={DharmshalaType}
                DharmshalaSource={DharmshalaSource} */
              />
            </div>
          )}
        </Else>
      </If>
    </div>
  );
};

export default EditFloor;
