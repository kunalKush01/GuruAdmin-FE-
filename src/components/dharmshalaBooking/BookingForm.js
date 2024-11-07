import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllMasterCategories } from "../../api/expenseApi";
import FormWithoutFormikForBooking from "../../components/dharmshalaBooking/FormWithoutFormikForBooking";
import { createDharmshalaBooking, createPayment, updatePayment, updateDharmshalaBooking } from "../../api/dharmshala/dharmshalaInfo";
import { PaymentModal } from "./PaymentModal";
import '../../views/dharmshala-management/dharmshala_css/addbooking.scss';

export default function BookingForm({
  plusIconDisable = true,
  // buttonName = "",
  // payDonation,
  // getCommitmentMobile,
  // initialValues,
  // showTimeInput,
  initialValues,
  validationSchema,
  showTimeInput,
  buttonName,
  isPaymentModalOpen,
  setIsPaymentModalOpen,
  isEditing,
}) {
  // const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const history = useHistory();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [loading, setLoading] = useState(false);
  const masterloadOptionQuery = useQuery(
    ["MasterCategory", selectedLang.id],
    async () => await getAllMasterCategories({ languageId: selectedLang.id })
  );

  const [showPrompt, setShowPrompt] = useState(true);
  const [toggleState, setToggleState] = useState(false);

  const handleCreateBooking = async (formData) => {
    setBookingData({ ...formData, isEditing });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSave = async (paymentDetails) => {
    if (bookingData) {
      setLoading(true);
      try {
        const bookingPayload = {
          bookingId: bookingData.bookingId, 
          Mobile: bookingData.Mobile,
          countryCode: bookingData.countryCode,
          dialCode: bookingData.dialCode,
          SelectedUser: bookingData.SelectedUser,
          donarName: bookingData.donarName,
          startDate: bookingData.fromDate ? bookingData.fromDate.format('DD-MM-YYYY') : null,
          endDate: bookingData.toDate ? bookingData.toDate.format('DD-MM-YYYY') : null,
          address: bookingData.address,
          idType: bookingData.idType,
          idNumber: bookingData.idNumber,
          guestCount: {
            men: bookingData.numMen,
            women: bookingData.numWomen,
            children: bookingData.numKids,
          },
          rooms: bookingData.roomsData.map(room => ({
            roomTypeId: room.roomType,
            roomTypeName: room.roomTypeName,
            building: room.building,
            buildingName: room.buildingName,
            floor: room.floor,
            floorName: room.floorName,
            roomId: room.roomId,
            amount: room.amount,
            roomNumber: room.roomNumber,
          })),
          userDetails: {
            name: bookingData.guestname,
            email: bookingData.email,
            mobileNumber: bookingData.Mobile,
            address: bookingData.address,
            idType: bookingData.idType,
            idNumber: bookingData.idNumber,
          },
          calculatedFields: {
            roomRent: bookingData.roomRent,
            totalAmount: bookingData.totalAmount,
            totalPaid: bookingData.totalPaid,
            totalDue: bookingData.totalDue,
          },
          amountPaid: paymentDetails.amount,
          paymentDetails,
          security: bookingData.security,
          imagePath: bookingData.imagePath,
        };

        let bookingResponse;
      if (bookingData.isEditing) {
        bookingResponse = await updateDharmshalaBooking({
          ...bookingPayload,
          bookingId: bookingData.bookingId, 
        });
        history.push("/booking/info");
      } else {
        bookingResponse = await createDharmshalaBooking(bookingPayload);
        history.push("/booking/info");
      }
      } catch (error) {
        console.error("Error creating booking and payment:", error);
      } finally {
        setLoading(false);
        setIsPaymentModalOpen(false);
      }
    }
  };

  return (
    <div className="form-wrapper">
      {!masterloadOptionQuery.isLoading && (
        <Formik
        initialValues={initialValues}
        onSubmit={handleCreateBooking}
      >
        {(formik) => (
          <>
            <FormWithoutFormikForBooking
              formik={formik}
              masterloadOptionQuery={masterloadOptionQuery}
              loading={loading}
              article={toggleState}
              setArticle={setToggleState}
              countryFlag={formik.values.countryCode}
              paidDonation={formik.values.SelectedUser?.id}
              plusIconDisable={plusIconDisable}
              showPrompt={showPrompt}
              buttonName={buttonName}
              isEditing={isEditing}
            />
            <PaymentModal
              isOpen={isPaymentModalOpen}
              onClose={() => setIsPaymentModalOpen(false)}
              onSave={handlePaymentSave}
              totalDue={!isEditing ? formik.values.totalAmount : formik.values.totalDue}
              isEditing={isEditing}
              security={formik.values.security}
            />
          </>
        )}
      </Formik>
      
      )}
    </div>
  );
}