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
<<<<<<< Updated upstream
import {
  getDharmshalaInfoDetail,
  updateDharmshalaInfo,
} from "../../../../api/dharmshala/dharmshalaInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddDharmshalaForm from "../../../../components/dharmshalaInfo/addForm";
=======
import {getFloorDetail, updateFloor} from "../../../../api/dharmshala/dharmshalaInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddDharmshalaFloorForm from "../../../../components/dharmshalaFloor/addForm";
>>>>>>> Stashed changes
import { ConverFirstLatterToCapital } from "../../../../utility/formater";
import { DharmshalaFloorAddWrapper } from "../../dharmshalaStyles";

<<<<<<< Updated upstream
const DharmshalaAddWraper = styled.div`
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
=======
>>>>>>> Stashed changes

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
  const history = useHistory();
  const { buildingId } = useParams();
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
    name: Yup.string().required("dharmshala_name_required"),
    description: Yup.mixed().required("dharmshala_description_required"),
    location: Yup.mixed().required("dharmshala_location_required"),
  });

  const initialValues = useMemo(() => {
    return {
      name: dharmshalaDetails?.data?.result?.name ?? "",
      description: dharmshalaDetails?.data?.result?.description ?? "",
      location: dharmshalaDetails?.data?.result?.location ?? "",
    };
<<<<<<< Updated upstream
  }, [dharmshalaDetails]);

  return (
    <DharmshalaAddWraper>
=======
  }, [floorDetails]);

  const URLParams = useParams("");
  

  return (
    <DharmshalaFloorAddWrapper>
>>>>>>> Stashed changes
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
<<<<<<< Updated upstream
                `/dharmshala/info?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}`
=======
                `/floors/${URLParams.buildingId}?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}`
>>>>>>> Stashed changes
              )
            }
          />
          <div className="editEvent">
            <Trans i18nKey={"dharmshala_edit_dharmshala"} />
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
            <div className="ms-sm-3 mt-1">
              <AddDharmshalaForm
                handleSubmit={handleDharmshalaUpdate}
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
<<<<<<< Updated upstream
    </DharmshalaAddWraper>
=======
    </DharmshalaFloorAddWrapper>
>>>>>>> Stashed changes
  );
};

export default EditDharmshala;
