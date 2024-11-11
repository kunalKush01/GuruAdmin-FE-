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
      fromDate: Yup.date()
      .required(t("Check-in date is required"))
      .min(dayjs().startOf('day'), t("Check-in date cannot be in the past")),
    
    toDate: Yup.date()
      .required("To Date is required")
      .min(Yup.ref("fromDate"), "To Date cannot be before From Date")
      .nullable(),

    // Members validations
    numMen: Yup.number()
      .typeError("Please enter a valid number")
      .min(0, "Must be 0 or more")
      .required("Men is required"),
    numWomen: Yup.number()
      .typeError("Please enter a valid number")
      .min(0, "Must be 0 or more")
      .required("Women is required"),
    numKids: Yup.number()
      .typeError("Please enter a valid number")
      .min(0, "Must be 0 or more")
      .required("Kids is required"),

    // Guest details validations
    Mobile: Yup.string()
      .matches(/^[0-9]+$/, "Mobile number must be only digits")
      .min(10, "Mobile number must be at least 10 digits")
      .max(15, "Mobile number cannot exceed 15 digits")
      .required("Mobile number is required"),
    guestname: Yup.string()
      .max(30, "Guest name cannot exceed 30 characters")
      .required("Guest name is required"),
    donarName: Yup.string().max(30, "Donor name cannot exceed 30 characters"),

    // Email validation
    // email: Yup.string()
    //   .email("Invalid email format")
    //   .max(30, "Email cannot exceed 30 characters"),

    // Address validation
    // address: Yup.string().max(100, "Address cannot exceed 100 characters"),

    // ID validations
    idType: Yup.string().required("ID Type is required"),
    idNumber: Yup.string()
      .max(30, "ID Number cannot exceed 30 characters")
      .required("ID Number is required"),

    // Payment validations
    roomRent: Yup.number().typeError("Room Rent must be a number").nullable(),
    security: Yup.number().typeError("Security must be a number").nullable(),
    totalAmount: Yup.number()
      .typeError("Total Amount must be a number")
      .nullable(),
    totalPaid: Yup.number().typeError("Total Paid must be a number").nullable(),
    roomsData: Yup.array()
      .of(
        Yup.object().shape({
          roomTypeId: Yup.string().required("Room Type is required"),
          building: Yup.string().required("Building is required"),
          floor: Yup.string().required("Floor is required"),
          roomId: Yup.string().required("Room Number is required"),
        })
      )
      .required("Rooms data is required")
      .min(1, "At least one room must be selected"),
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
      />
    </div>
  );
};

export default AddDharmshalaBooking;
