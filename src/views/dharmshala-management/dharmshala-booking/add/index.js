import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { DharmshalaBookingAddWrapper } from "../../dharmshalaStyles";
import "../../dharmshala_css/addbooking.css";
import BookingForm from "../../../../components/dharmshalaBooking/BookingForm";
import * as Yup from "yup";
import dayjs from 'dayjs';

const AddDharmshalaBooking = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const bookingData = location.state?.bookingData;

  useEffect(() => {
    if (bookingData) {
      setInitialValues({
        Mobile: bookingData.userDetails.mobileNumber || "",
        countryCode: bookingData.userDetails.countryCode || "in",
        dialCode: bookingData.userDetails.dialCode || "91",
        SelectedUser: bookingData.userDetails || "",
        donarName: bookingData.userDetails.name || "",
        fromDate: bookingData.startDate ? dayjs(bookingData.startDate) : null,
        toDate: bookingData.endDate ? dayjs(bookingData.endDate) : null,
        numMen: bookingData.guestCount?.men || "",
        numWomen: bookingData.guestCount?.women || "",
        numKids: bookingData.guestCount?.children || "",
        roomsData: bookingData.rooms.map(room => ({
          roomType: room.roomTypeId,
          building: room.building,
          floor: room.floor,
          roomId: room.roomId,
          amount: room.amount,
        })),
        guestname: bookingData.userDetails.name || "",
        email: bookingData.userDetails.email || "",
        roomRent: bookingData.calculatedFields.roomRent || "",
        totalAmount: bookingData.calculatedFields.totalAmount || "",
        totalPaid: bookingData.calculatedFields.totalPaid || "",
        totalDue: bookingData.calculatedFields.totalDue || "",
        security: bookingData.dharmshalaId.advanceOnBooking || "",
        address: bookingData.userDetails.address || "",
        idType: bookingData.userDetails.idType || "",
        idNumber: bookingData.userDetails.idNumber || "",
        paymentId: bookingData.payment?._id || "",
        payments: bookingData.payment?.payments || [],
        bookingId: bookingData._id || "",
        bookingCode: bookingData.bookingId || "",
      });
    } else {
      setInitialValues({
        Mobile: "",
        countryCode: "in",
        dialCode: "91",
        SelectedUser: "",
        donarName: "",
        fromDate: null,
        toDate: null,
        numMen: '',
        numWomen: '',
        numKids: '',
        roomsData: [
          {
            roomType: '',
            building: '',
            floor: '',
            roomId: '',
            amount: 0,
          },
        ],
        guestname: '',
        email: '',
        roomRent: '',
        security: '',
        address: '',
        idType: '',
        idNumber: '',
        totalAmount: '',
        totalPaid: '',
        totalDue: '',
      });
    }
    setIsLoading(false);
  }, [bookingData]);

  const schema = Yup.object().shape({
    Mobile: Yup.string().required(t("expenses_mobile_required")),
    SelectedUser: Yup.mixed().required(t("user_select_required")),
    donarName: Yup.string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        t("donation_donar_name_only_letters")
      )
      .trim(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DharmshalaBookingAddWrapper style={{ backgroundColor: "#FAFAFA" }}>
      <BookingForm
        initialValues={initialValues}
        validationSchema={schema}
        showTimeInput
        buttonName={bookingData ? t("Update Booking") : t("Create Booking")}
        isPaymentModalOpen={isPaymentModalOpen}
        setIsPaymentModalOpen={setIsPaymentModalOpen}
        isEditing={!!bookingData}
      />
    </DharmshalaBookingAddWrapper>
  );
};

export default AddDharmshalaBooking;