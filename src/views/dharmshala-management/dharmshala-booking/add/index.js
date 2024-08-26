import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { DharmshalaBookingAddWrapper } from "../../dharmshalaStyles";
import "../../dharmshala_css/addbooking.css";
import BookingForm from "../../../../components/dharmshalaBooking/BookingForm";
import * as Yup from "yup";
import moment from 'moment';


const AddDharmshalaBooking = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
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
    roomRent:'',
    security:'',
  });

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (location.state && location.state.bookingData) {
      const bookingData = location.state.bookingData;
      console.log("🚀🚀🚀 ~ file: index.js:44 ~ useEffect ~ bookingData:", bookingData);
      setInitialValues({
        ...initialValues,
        Mobile: bookingData.userDetails.mobileNumber || "",
        SelectedUser: bookingData.userDetails || "",
        donarName: bookingData.userDetails.name || "",
        fromDate: bookingData.startDate ? moment(bookingData.startDate) : null,
        toDate: bookingData.endDate ? moment(bookingData.endDate) : null,
        numMen: bookingData.guestCount?.men || "",
        numWomen: bookingData.guestCount?.women || "",
        numKids: bookingData.guestCount?.children || "",
        // roomsData: bookingData.rooms || initialValues.roomsData,
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
        paymentId: bookingData.payment._id || "",
        payments: bookingData.payment.payments || [],
        bookingId: bookingData._id,
      });
    }
  }, [location.state]);

  const schema = Yup.object().shape({
    Mobile: Yup.string().required("expenses_mobile_required"),
    SelectedUser: Yup.mixed().required("user_select_required"),
    donarName: Yup.string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        "donation_donar_name_only_letters"
      )
      .trim(),
  });

  // const initialValues = {
  //   Mobile: "",
  //   countryCode: "in",
  //   dialCode: "91",
  //   SelectedUser: "",
  //   donarName: "",
  //   fromDate: null,
  //   toDate: null,
  //   numMen: '',
  //   numWomen: '',
  //   numKids: '',
  //   roomsData: [
  //     {
  //       roomType: '',
  //       building: '',
  //       floor: '',
  //       roomNumber: '',
  //       amount: 0,
  //     },
  //   ],
  //   guestname: '',
  //   email: '',
  //   donarName: '',
  //   roomRent:'',
  //   security:'',

  // };

  return (
    // <DharmshalaBookingAddWrapper style={{ backgroundColor: "#FAFAFA" }}>
    //   <BookingForm
    //     initialValues={initialValues}
    //     // validationSchema={schema}
    //     showTimeInput
    //     buttonName="Create Booking"
    //     isPaymentModalOpen={isPaymentModalOpen}
    //     setIsPaymentModalOpen={setIsPaymentModalOpen}
    //   />
    // </DharmshalaBookingAddWrapper>

<DharmshalaBookingAddWrapper style={{ backgroundColor: "#FAFAFA" }}>
<BookingForm
  initialValues={initialValues}
  validationSchema={schema}
  showTimeInput
  buttonName={location.state?.bookingData ? "Update Booking" : "Create Booking"}
  isPaymentModalOpen={isPaymentModalOpen}
  setIsPaymentModalOpen={setIsPaymentModalOpen}
  isEditing={!!location.state?.bookingData}
/>
</DharmshalaBookingAddWrapper>
  );
};

export default AddDharmshalaBooking;