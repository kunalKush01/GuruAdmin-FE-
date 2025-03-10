import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllMasterCategories } from "../../api/expenseApi";
import FormWithoutFormikForBooking from "../../components/dharmshalaBooking/FormWithoutFormikForBooking";
import {
  createDharmshalaBooking,
  createPayment,
  updatePayment,
  updateDharmshalaBooking,
} from "../../api/dharmshala/dharmshalaInfo";
import { PaymentModal } from "./PaymentModal";
import "../../views/dharmshala-management/dharmshala_css/addbooking.scss";
import Swal from "sweetalert2";

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
  editBookingData,
  isReadOnly,
}) {
  // const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [currentEtag, setCurrentEtag] = useState(editBookingData?.etag || null);
  const history = useHistory();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [loading, setLoading] = useState(false);
  const masterloadOptionQuery = useQuery(
    ["MasterCategory", selectedLang.id],
    async () => await getAllMasterCategories({ languageId: selectedLang.id })
  );

  const [showPrompt, setShowPrompt] = useState(true);
  const [toggleState, setToggleState] = useState(false);
  const [userFoundByMobile, setUserFoundByMobile] = useState(false);
  const handleCreateBooking = async (formData) => {
    if (userFoundByMobile) {
      Swal.fire({
        icon: "warning",
        title: "User Not Found",
        text: "No user is registered with this mobile number. Please add the user first before proceeding.",
        confirmButtonText: "Add User",
      });
      return;
    }
    setBookingData({ ...formData, isEditing, etag: currentEtag });
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
          startDate: bookingData.fromDate
            ? bookingData.fromDate.format("DD-MM-YYYY")
            : null,
          endDate: bookingData.toDate
            ? bookingData.toDate.format("DD-MM-YYYY")
            : null,
          address: bookingData.address,
          idType: bookingData.idType,
          idNumber: bookingData.idNumber,
          guestCount: {
            men: bookingData.numMen || 0,
            women: bookingData.numWomen || 0,
            children: bookingData.numKids || 0,
          },
          rooms: bookingData.roomsData.map((room) => ({
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
          status: paymentDetails.status,
          etag: bookingData.etag,
        };

        let response;
        if (bookingData.isEditing) {
          try {
            response = await updateDharmshalaBooking({
              ...bookingPayload,
              bookingId: bookingData.bookingId,
            });

            if (response.status === 409) {
              toast.error(
                "This booking has been modified by another user. Please refresh and try again."
              );
              setShowPrompt(false);
              return;
            }

            if (response.data?.etag) {
              setCurrentEtag(response.data.etag);
            }

            history.push("/booking/info");
            setShowPrompt(true);
          } catch (error) {
            if (error.response?.status === 409) {
              toast.error(
                "This booking has been modified by another user. Please refresh and try again."
              );
              setShowPrompt(false);
            } else {
              toast.error("Error updating booking. Please try again.");
            }
          }
        } else {
          try {
            response = await createDharmshalaBooking(bookingPayload);
            if (response.data?.etag) {
              setCurrentEtag(response.data.etag);
            }
            history.push("/booking/info");
          } catch (error) {
            if (error.response?.status === 409) {
              toast.error(
                "You have already booked a room for the specified dates."
              );
            } else {
              toast.error("Error creating booking. Please try again.");
            }
          }
        }
      } catch (error) {
        console.error("Error handling booking and payment:", error);
        toast.error("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
        setIsPaymentModalOpen(false);
      }
    }
  };

  useEffect(() => {
    if (editBookingData?.etag) {
      setCurrentEtag(editBookingData.etag);
    }
  }, [editBookingData]);
  return (
    <div className="form-wrapper">
      {!masterloadOptionQuery.isLoading && (
        <Formik
          initialValues={initialValues}
          onSubmit={handleCreateBooking}
          validationSchema={validationSchema}
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
                editBookingData={editBookingData}
                isReadOnly={isReadOnly}
                setUserFoundByMobile={setUserFoundByMobile}
              />
              <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSave={handlePaymentSave}
                totalDue={
                  !isEditing
                    ? formik.values.totalAmount
                    : formik.values.totalDue
                }
                isEditing={isEditing}
                security={formik.values.security}
                fromDate={
                  formik.values.fromDate
                    ? formik.values.fromDate.format("YYYY-MM-DD")
                    : undefined
                }
              />
            </>
          )}
        </Formik>
      )}
    </div>
  );
}
