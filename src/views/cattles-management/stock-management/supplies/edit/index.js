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
  getSupplyDetail,
  updateItem,
  updateSupply,
} from "../../../../../api/cattle/cattleStock";
import arrowLeft from "../../../../../assets/images/icons/arrow-left.svg";
import AddStockItemForm from "../../../../../components/cattleStockManagment/Items/addForm";
import AddSuppliesForm from "../../../../../components/cattleStockManagment/supplies/addForm";
import { ConverFirstLatterToCapital } from "../../../../../utility/formater";

import "../../../../../assets/scss/viewCommon.scss";
const getLangId = (langArray, langSelection) => {
  let languageId;
  langArray.map(async (Item) => {
    if (Item.name == langSelection?.toLowerCase()) {
      languageId = Item.id;
    }
  });
  return languageId;
};

const EditSupply = () => {
  const history = useHistory();
  const { supplyId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

  const supplyDetailQuery = useQuery(
    ["supplyDetail", supplyId, langSelection, selectedLang.id],
    async () => getSupplyDetail(supplyId)
    // getPregnancyReportDetail({
    //   supplyId,
    //   languageId: getLangId(langArray, langSelection),
    // })
  );

  const handleUpdateItem = async (payload) => {
    return updateSupply({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const schema = Yup.object().shape({
    itemId: Yup.mixed().required("cattle_itemID_required"),
    name: Yup.mixed().required("cattle_name_required"),
    orderQuantity: Yup.number().required("cattle_order_quantity_required"),
    unit: Yup.mixed().required("cattle_unit_required"),
  });

  const initialValues = useMemo(() => {
    return {
      supplyId: supplyDetailQuery?.data?.result?.id,
      itemId: supplyDetailQuery?.data?.result?.itemReferenceId,
      name: supplyDetailQuery?.data?.result?.itemReferenceId,
      orderQuantity: supplyDetailQuery?.data?.result?.orderQuantity,
      unit: {
        label: supplyDetailQuery?.data?.result?.unit,
        value: supplyDetailQuery?.data?.result?.unit,
      },
    };
  }, [supplyDetailQuery]);

  return (
    <div className="addviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/cattle/management/supplies?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="editEvent">
            <Trans i18nKey={"cattle_edit_supplies"} />
          </div>
        </div>
        {/* <div className="editEvent">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={supplyDetailQuery?.data?.result?.languages}
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
        condition={supplyDetailQuery.isLoading || supplyDetailQuery.isFetching}
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
          {!supplyDetailQuery.isFetching && (
            <div className="ms-sm-3 mt-1">
              <AddSuppliesForm
                initialValues={initialValues}
                validationSchema={schema}
                plusIconDisable
                handleSubmit={handleUpdateItem}
                buttonName="save_changes"
              />
            </div>
          )}
        </Else>
      </If>
    </div>
  );
};

export default EditSupply;
