import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import "../../dharmshala_css/addbooking.scss";
import BookingForm from "../../../../components/dharmshalaBooking/BookingForm";
import * as Yup from "yup";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";

dayjs.extend(customParseFormat);

const AddDharmshalaBooking = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const bookingData = location.state?.bookingData;
  const property = location.state?.property;
  const bookingDate = location.state?.date;
  useEffect(() => {
    if (bookingData) {
      setInitialValues({
        Mobile: bookingData.userDetails.mobileNumber || "",
        countryCode: bookingData.userDetails.countryCode || "in",
        dialCode: bookingData.userDetails.dialCode || "91",
        SelectedUser: bookingData.userDetails || "",
        donarName: bookingData.userDetails.name || "",
        fromDate: bookingData.startDate
          ? dayjs(bookingData.startDate, "DD-MM-YYYY")
          : null,
        toDate: bookingData.endDate
          ? dayjs(bookingData.endDate, "DD-MM-YYYY")
          : null,
        numMen: bookingData.guestCount?.men || "",
        numWomen: bookingData.guestCount?.women || "",
        numKids: bookingData.guestCount?.children || "",
        roomsData: bookingData.rooms.map((room) => ({
          roomType: room.roomTypeId,
          building: room.building,
          floor: room.floor,
          roomId: room.roomId,
          amount: room.amount,
          roomNumber: room.roomNumber,
          roomTypeName: room.roomTypeName,
          buildingName: room.buildingName,
          floorName: room.floorName,
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
        imagePath: bookingData.imagePath || "",
      });
    } else {
      setInitialValues({
        Mobile: "",
        countryCode: "in",
        dialCode: "91",
        SelectedUser: "",
        donarName: "",
        fromDate: (bookingDate && moment(bookingDate, "DD MMM YYYY")) || null,
        toDate: bookingDate
          ? bookingDate && moment(bookingDate, "DD MMM YYYY").add(1, "days")
          : null,
        numMen: "",
        numWomen: "",
        numKids: "",
        roomsData: [
          {
            roomTypeId: property?.roomType || "",
            building: property?.buildingId || "",
            floor: property?.floorId || "",
            roomId: property?._id || "",
            amount: 0,
            roomNumber: property?.roomNumber || "",
            roomTypeName: property?.roomTypeName || "",
            buildingName: "",
            floorName: "",
          },
        ],
        guestname: "",
        email: "",
        roomRent: "",
        security: "",
        address: "",
        idType: "",
        idNumber: "",
        totalAmount: "",
        totalPaid: "",
        totalDue: "",
        imagePath: "",
      });
    }
    setIsLoading(false);
  }, [bookingData, bookingDate, property]);

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
    <div
      className="DharmshalaComponentAddWrapper"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      <BookingForm
        initialValues={initialValues}
        validationSchema={schema}
        showTimeInput
        buttonName={bookingData ? t("Update Booking") : t("Create Booking")}
        isPaymentModalOpen={isPaymentModalOpen}
        setIsPaymentModalOpen={setIsPaymentModalOpen}
        isEditing={!!bookingData}
      />
    </div>
  );
};

export default AddDharmshalaBooking;
