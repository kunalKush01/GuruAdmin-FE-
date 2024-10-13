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
  getItemUsageDetail,
  updateItemUsage,
} from "../../../../../api/cattle/cattleUsage";
import arrowLeft from "../../../../../assets/images/icons/arrow-left.svg";
import AddItemUsageForm from "../../../../../components/cattleUsage/addForm";
import { ConverFirstLatterToCapital } from "../../../../../utility/formater";

import "../../../../../assets/scss/viewCommon.scss";
import "../../../../../assets/scss/common.scss";

const getLangId = (langArray, langSelection) => {
  let languageId;
  langArray.map(async (Item) => {
    if (Item.name == langSelection?.toLowerCase()) {
      languageId = Item.id;
    }
  });
  return languageId;
};

const EditItemUsage = () => {
  const history = useHistory();
  const { itemUsageId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

  const itemUsageDetailQuery = useQuery(
    ["usageDetail", itemUsageId, langSelection, selectedLang.id],
    async () => getItemUsageDetail(itemUsageId)
    // getPregnancyReportDetail({
    //   itemUsageId,
    //   languageId: getLangId(langArray, langSelection),
    // })
  );

  const handleUpdateItemUsage = async (payload) => {
    return updateItemUsage({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const schema = Yup.object().shape({
    itemId: Yup.mixed().required("cattle_itemID_required"),
    name: Yup.mixed().required("cattle_name_required"),
    quantity: Yup.number().required("cattle_quantity_required"),
    unit: Yup.mixed().required("cattle_unit_required"),
    purpose: Yup.mixed().required("cattle_purpose_required"),
  });
  const initialValues = useMemo(() => {
    return {
      usageId: itemUsageDetailQuery?.data?.result?._id,
      itemId: itemUsageDetailQuery?.data?.result?.itemReferenceId,
      name: itemUsageDetailQuery?.data?.result?.itemReferenceId,
      quantity: itemUsageDetailQuery?.data?.result?.quantity,
      purpose: itemUsageDetailQuery?.data?.result?.purpose,
      unit: {
        label: itemUsageDetailQuery?.data?.result?.unit,
        value: itemUsageDetailQuery?.data?.result?.unit,
      },
      Date: moment(itemUsageDetailQuery?.data?.result?.date).toDate(),
    };
  }, [itemUsageDetailQuery]);

  return (
    <div className="itemusageaddwraper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/cattle/management/usage?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="editEvent">
            <Trans i18nKey={"cattle_edit_usage"} />
          </div>
        </div>
        {/* <div className="editEvent">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={itemUsageDetailQuery?.data?.result?.languages}
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
          itemUsageDetailQuery.isLoading || itemUsageDetailQuery.isFetching
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
          {!itemUsageDetailQuery.isFetching && (
            <div className="FormikWrapper">
              <AddItemUsageForm
                initialValues={initialValues}
                plusIconDisable
                validationSchema={schema}
                handleSubmit={handleUpdateItemUsage}
                buttonName="save_changes"
              />
            </div>
          )}
        </Else>
      </If>
    </div>
  );
};

export default EditItemUsage;
