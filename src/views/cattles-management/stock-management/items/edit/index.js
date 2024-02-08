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

import {
  getItemDetail,
  updateItem,
} from "../../../../../api/cattle/cattleStock";
import arrowLeft from "../../../../../assets/images/icons/arrow-left.svg";
import AddStockItemForm from "../../../../../components/cattleStockManagment/Items/addForm";
import { ConverFirstLatterToCapital } from "../../../../../utility/formater";

const ItemEditWrapper = styled.div`
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

const EditItem = () => {
  const history = useHistory();
  const { itemId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

  const itemDetailQuery = useQuery(
    ["itemDetail", itemId, langSelection, selectedLang.id],
    async () => getItemDetail(itemId)
    // getPregnancyReportDetail({
    //   itemId,
    //   languageId: getLangId(langArray, langSelection),
    // })
  );

  const handleUpdateItem = async (payload) => {
    return updateItem({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const schema = Yup.object().shape({
    name: Yup.string().required("cattle_name_required"),
    unit: Yup.mixed().required("cattle_unit_required"),
    unitType: Yup.mixed().required("cattle_unit_type_required"),
  });

  const initialValues = useMemo(() => {
    return {
      itemId: itemDetailQuery?.data?.result?._id,
      name: itemDetailQuery?.data?.result?.name,
      unit: {
        label: itemDetailQuery?.data?.result?.unit,
        value: itemDetailQuery?.data?.result?.unit,
      },
      unitType: {
        label: itemDetailQuery?.data?.result?.unitType,
        value: itemDetailQuery?.data?.result?.unitType,
      },
    };
  }, [itemDetailQuery]);

  return (
    <ItemEditWrapper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/cattle/management/items?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="editEvent">
            <Trans i18nKey={"cattle_edit_item"} />
          </div>
        </div>
        {/* <div className="editEvent">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={itemDetailQuery?.data?.result?.languages}
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
        condition={itemDetailQuery.isLoading || itemDetailQuery.isFetching}
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
          {!itemDetailQuery.isFetching && (
            <div className="ms-sm-3 mt-1">
              <AddStockItemForm
                initialValues={initialValues}
                validationSchema={schema}
                selectEventDisabled
                handleSubmit={handleUpdateItem}
                buttonName="save_changes"
              />
            </div>
          )}
        </Else>
      </If>
    </ItemEditWrapper>
  );
};

export default EditItem;
