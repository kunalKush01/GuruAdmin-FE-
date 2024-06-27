import React from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { createDharmshalaBooking } from "../../../../api/dharmshala/dharmshalaInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddDharmshalaBookingForm from "../../../../components/dharmshalaBooking/addForm";
import { DharmshalaBookingAddWrapper } from "../../dharmshalaStyles";

const AddDharmshalaBooking = () => {
  const history = useHistory();
  const { buildingId } = useParams();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  const handleCreateDharmshalaBooking = async (payload) => {
    return createDharmshalaBooking(payload);
  };
  const trustId = localStorage.getItem("trustId");

  const schema = Yup.object().shape({
    bookingId: Yup.string().required("dharmshala_booking_id_required"),
    startDate: Yup.string().required("dharmshala_booking_start_date_required"),
    endDate: Yup.string().required("dharmshala_booking_end_date_required"),
    count:Yup.string().required("dharmshala_booking_count_required"),
    status:Yup.string().required("dharmshala_booking_status_required"),
    earlyCheckIn:Yup.string().required("dharmshala_booking_early_check_in_required"),
    lateCheckout:Yup.string().required("dharmshala_booking_late_check_out_required"),
    dharmshalaId: Yup.mixed().required("dharmshala_booking_id_required"),
    userId: Yup.mixed().required("dharmshala_booking_id_required"),
    roomId: Yup.mixed().required("dharmshala_booking_id_required"),
    roomTypeId: Yup.mixed().required("dharmshala_booking_id_required"),
  });

  const initialValues = {
    bookingId: "",
    startDate: "",
    endDate: "",
    count:"",
    status:"",
    earlyCheckIn:"",
    lateCheckout:"",
    dharmshalaId: trustId,
    userId: "",
    roomId: "",
    roomTypeId: "",
  };

  const URLParams = useParams("");
  
  return (
    <DharmshalaBookingAddWrapper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/booking/info/?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}`
              )
            }
          />
          <div className="addEvent">
            <Trans i18nKey={"dharmshala_booking_add"} />
          </div>
        </div>
      </div>
      <div className="ms-sm-3 mt-1">
        <AddDharmshalaBookingForm
          handleSubmit={handleCreateDharmshalaBooking}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName="dharmshala_booking_add"
        />
      </div>
    </DharmshalaBookingAddWrapper>
  );
};

export default AddDharmshalaBooking;
