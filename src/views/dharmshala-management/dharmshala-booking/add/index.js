import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation,useParams } from "react-router-dom";
import "../../dharmshala_css/addbooking.scss";
import BookingForm from "../../../../components/dharmshalaBooking/BookingForm";
import * as Yup from "yup";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";

dayjs.extend(customParseFormat);

const AddDharmshalaBooking = () => {
  const history = useHistory();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const location = useLocation();
  const bookingData = location.state?.bookingData;
  const property = location.state?.property;
  const bookingDate = location.state?.date;
  const searchParams = new URLSearchParams(history.location.search);
  const isReadOnly = searchParams.get("isReadOnly");
  useEffect(() => {
    if (bookingData) {
      console.log("🚀🚀🚀 ~ file: index.js:26 ~ useEffect ~ bookingData:", bookingData);
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
        numMen: bookingData.guestCount?.men || 0,
        numWomen: bookingData.guestCount?.women || 0,
        numKids: bookingData.guestCount?.children || 0,
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
        totalDue: bookingData.calculatedFields.totalDue || 0,
        security: bookingData.dharmshalaId.advanceOnBooking || "",
        address: bookingData.userDetails.address || "",
        idType: bookingData.userDetails.idType || "",
        idNumber: bookingData.userDetails.idNumber || "",
        paymentId: bookingData.payment?._id || "",
        payments: bookingData.payment?.payments || [],
        bookingId: bookingData._id || "",
        bookingCode: bookingData.bookingId || "",
        imagePath: bookingData.imagePath || "",
        etag: bookingData.etag || "",
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
    // Date validations
    fromDate: Yup.date().required("From Date is required").nullable(),
    toDate: Yup.date()
      .required("To Date is required")
      .min(Yup.ref("fromDate"), "To Date cannot be before From Date")
      .nullable(),

    // Guest details validations
    Mobile: Yup.string()
      .matches(/^[0-9]+$/, "Mobile number must be only digits")
      .min(10, "Mobile number must be at least 10 digits")
      .max(15, "Mobile number cannot exceed 15 digits")
      .required("Mobile number is required"),
    guestname: Yup.string()
      .max(30, "Guest name cannot exceed 30 characters")
      .required("Guest name is required"),

    // ID validations
    idType: Yup.string().required("ID Type is required"),
    idNumber: Yup.string()
      .max(30, "ID Number cannot exceed 30 characters")
      .required("ID Number is required"),

    roomsData: Yup.array()
      .of(
        Yup.object().shape({
          roomType: Yup.string().required("Room Type is required"),
          building: Yup.string().required("Building is required"),
          floor: Yup.string().required("Floor is required"),
          roomId: Yup.string().required("Room Number is required"),
        })
      )
      .required("Rooms data is required"),
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
        buttonName={bookingData ? t("update_booking") : t("create_booking")}
        isPaymentModalOpen={isPaymentModalOpen}
        setIsPaymentModalOpen={setIsPaymentModalOpen}
        isEditing={!!bookingData}
        editBookingData={bookingData}
        isReadOnly={isReadOnly}
      />
    </div>
  );
};

export default AddDharmshalaBooking;
