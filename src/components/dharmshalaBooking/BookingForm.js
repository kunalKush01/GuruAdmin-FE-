import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { getAllMasterCategories } from "../../api/expenseApi";
import FormWithoutFormikForBooking from "../../components/dharmshalaBooking/FormWithoutFormikForBooking";
import { createDharmshalaBooking, createPayment, updatePayment, updateDharmshalaBooking } from "../../api/dharmshala/dharmshalaInfo";
import { PaymentModal } from "./PaymentModal";

const FormWrapper = styled.div`
  .FormikWrapper {
    padding: 40px;
  }
  .btn-Published {
    text-align: center;
  }
  .addDonation-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .donationContent {
    height: 350px;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;

    font: normal normal bold 13px/5px noto sans;
  }
  .btn-secondary {
    background-color: #fff7e8 !important;
    color: #583703 !important ;
    border: none;
    font: normal normal bold 20px/20px noto sans !important ;
    box-shadow: none !important ;
    :hover {
      color: #fff !important;
      background-color: #ff8744 !important;
    }
    .secondary.active {
      color: #fff !important;
    }
  }
  .addUser {
    font-size: 13px;
  }
  .addUser > span {
    text-decoration: underline;
    color: #ff8744;
  }
`;

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
            roomTypeId: room.roomTypeId,
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
    <FormWrapper className="FormikWrapper">
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
              bookingId="MASDSF"
              totalDue={!isEditing ? formik.values.totalAmount : formik.values.totalDue}
            />
          </>
        )}
      </Formik>
      
      )}
    </FormWrapper>
  );
}