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
import {getDharmshalaBookingDetail, updateDharmshalaBooking} from "../../../../api/dharmshala/dharmshalaInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddBookingForm from "../../../../components/dharmshalaBooking/addForm";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";
import { DharmshalaBookingAddWrapper } from "../../dharmshalaStyles";

const getLangId = (langArray, langSelection) => {
  let languageId;
  langArray.map(async (Item) => {
    if (Item.name == langSelection?.toLowerCase()) {
      languageId = Item.id;
    }
  });
  return languageId;
};

const EditBooking = () => {
  const history = useHistory();
  const { bookingId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  console.log(searchParams);

const bookingID = searchParams.get("bookingId");
const startDate = searchParams.get("startDate");
const endDate = searchParams.get("endDate");
const count = searchParams.get("count");
const status = searchParams.get("status");
const earlyCheckIn = searchParams.get("earlyCheckIn");
const lateCheckout = searchParams.get("lateCheckout");


  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

  const bookingDetails = useQuery(
    ["bookingDetails", bookingId, langSelection, selectedLang.id],
    async () => getDharmshalaBookingDetail(bookingId)
  );

  const handleDharmshalaBookingUpdate = async (payload) => {
    return updateDharmshalaBooking({
      bookingId: bookingId,
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const schema = Yup.object().shape({
    bookingId: Yup.string().required("dharmshala_booking_id_required"),
    startDate: Yup.string().required("dharmshala_booking_start_date_required"),
    endDate: Yup.string().required("dharmshala_booking_end_date_required"),
    count:Yup.string().required("dharmshala_booking_count_required"),
    status:Yup.string().required("dharmshala_booking_status_required"),
    earlyCheckIn:Yup.string().required("dharmshala_booking_early_check_in_required"),
    lateCheckout:Yup.string().required("dharmshala_booking_late_check_out_required")
  });

  const URLParams = useParams("");

  const initialValues = useMemo(() => {
    return {
        bookingId: bookingID,
        startDate: startDate,
        endDate: endDate,
        count:count,
        status:status,
        earlyCheckIn:earlyCheckIn,
        lateCheckout:lateCheckout
    };
  }, [bookingDetails]);
  console.log("Booking Details Fetched:", bookingDetails)

  
  return (
    <DharmshalaBookingAddWrapper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/bookings/info/?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}`
              )
            }
          />
          <div className="editEvent">
            <Trans i18nKey={"dharmshala_booking_edit"} />
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
        condition={bookingDetails.isLoading || bookingDetails.isFetching}
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
          {!bookingDetails.isFetching && (
            <div className="ms-sm-3 mt-1">
              <AddBookingForm
                handleSubmit={handleDharmshalaBookingUpdate}
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
    </DharmshalaBookingAddWrapper>
  );
};

export default EditBooking;
