import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Form, Input, Select, Button } from 'antd';
import { useTranslation } from "react-i18next";
import RoomsContainer from "../../../components/dharmshalaBooking/RoomsContainer";
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { updateDharmshalaBooking } from "../../../api/dharmshala/dharmshalaInfo";
import '../../../../src/views/dharmshala-management/dharmshala_css/addbooking.scss';
import { toast } from 'react-toastify';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

const CheckInModal = ({ visible, onClose, booking, mode }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [dueAmount, setDueAmount] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState(dayjs().tz('Asia/Kolkata').format('ddd, DD MMM YYYY HH:mm:ss [IST]'));
  const queryClient = useQueryClient();

  const updateBookingMutation = useMutation({
    mutationFn: (payload) => updateDharmshalaBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["dharmshalaBookingList"]);
      form.resetFields();
      onClose();
    },
    onError: (error) => {
      console.error('Error updating booking:', error);
    },
  });

  useEffect(() => {
    if (booking) {
      const room = booking.rooms[0] || {};
      const bookingStartDate = dayjs(booking.startDate, "DD MMM YYYY");
      const bookingEndDate = dayjs(booking.endDate, "DD MMM YYYY");
      form.setFieldsValue({
        building: room.buildingName || booking.building,
        floor: room.floorName || booking.floor,
        roomNumbers: room.roomNumber || '',
        capacity: booking.capacity,
        fromDate: dayjs(booking.startDate, "DD MMM YYYY"),
        toDate: dayjs(booking.endDate, "DD MMM YYYY"),
        currentDate: dayjs(),
        dueAmount: booking.calculatedFields.totalDue || 0,
      });
      setDueAmount(booking.calculatedFields.totalDue || 0);
    }
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, [booking, form]);

  const updateDateTime = () => {
    const now = dayjs().tz('Asia/Kolkata');
    const formattedDateTime = now.format('ddd, DD MMM YYYY HH:mm:ss [IST]');
    setCurrentDateTime(formattedDateTime);
    form.setFieldsValue({ currentDate: formattedDateTime });
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const isRefund = mode === 'check-out' && dueAmount < 0;
      const bookingStartDate = dayjs(booking.startDate, "DD MMM YYYY");
      const bookingEndDate = dayjs(booking.endDate, "DD MMM YYYY");
      const currentDate = dayjs(values.currentDate, "ddd, DD MMM YYYY HH:mm:ss [IST]");

      if (currentDate.isBefore(bookingStartDate)) {
        toast.error("Check-in is only allowed on or after the booking start date.");
        return;
      }

      if (mode === 'check-out' && currentDate.isBefore(bookingEndDate)) {
        toast.error("Check-out is only allowed on or after the booking end date.");
        return;
      }

      const bookingPayload = {
        bookingId: booking._id,
        startDate: dayjs(booking.startDate).format('DD-MM-YYYY'),
        endDate: dayjs(booking.endDate).format('DD-MM-YYYY'),
        rooms: booking.rooms,
        guestCount: booking.guestCount,
        status: mode === 'check-in' ? 'checked-in' : 'checked-out',
        amountPaid: values.amount,
        paymentDetails: {
          type: isRefund ? "refund" : "deposit",
          amount: values.amount,
          transactionId: values.transactionId,
          remark: values.remark,
          paymentMode: values.paymentMode,
        },
        address: booking.userDetails.address,
        donarName: booking.userDetails.donarName,
        idType: booking.userDetails.idType,
        idNumber: booking.userDetails.idNumber,
      };

      updateBookingMutation.mutate(bookingPayload);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const fromDate = booking ? dayjs(booking.startDate).format('DD MMM YYYY') : '';
  const toDate = booking ? dayjs(booking.endDate).format('DD MMM YYYY') : '';

  return (
    <Modal
      title={(
        <div className="modal-title-container">
          <span className="modal-title-text">
            {t(mode === 'check-in' ? "Check In" : "Check Out")}
          </span>
          <span className="modal-title-date">
            ({fromDate} - {toDate})
          </span>
        </div>
      )}
      visible={visible}
      centered
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="cancel" onClick={onClose} className="modal-footer-button-cancel">
          {t("Cancel")}
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk} className="modal-footer-button-submit">
         {t(mode === 'check-in' ? "Check In" : dueAmount < 0 ? "Check Out & Refund" : "Check Out" )}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <RoomsContainer
          className="rooms-container"
          roomsData={booking?.rooms || []}
          roomTypes={booking?.rooms?.map(room => ({
            _id: room.roomTypeId, 
            name: room.roomTypeName 
          })) || []}
          buildings={booking?.rooms?.map(room => ({
            _id: room.building, 
            name: room.buildingName 
          })) || []}
          floors={booking?.rooms.reduce((acc, room) => {
            if (acc[room.building]) {
              acc[room.building].push({
                _id: room.floor,
                name: room.floorName,
              });
            } else {
              acc[room.building] = [{
                _id: room.floor,
                name: room.floorName,
              }];
            }
            return acc;
          }, {})}
          rooms={booking?.rooms.reduce((acc, room) => {
            if (acc[room.floor]) {
              acc[room.floor].push({
                _id: room.roomId,
                roomNumber: room.roomNumber,
                roomTypeId: room.roomTypeId,
              });
            } else {
              acc[room.floor] = [{
                _id: room.roomId,
                roomNumber: room.roomNumber,
                roomTypeId: room.roomTypeId,
              }];
            }
            return acc;
          }, {})}
          isPartialView={true}
          isReadOnly={true}
          isCheckModal={true}
        />

        <div className="form-layout">
          <Form.Item name="currentDate" label={t("Date and Time")} className="form-item-date-time">
            <Input value={currentDateTime} readOnly />
          </Form.Item>

          <Form.Item name="dueAmount" label={t("Due Amount")} className="form-item-due-amount">
            <Input disabled/>  
          </Form.Item>
        </div>

        {(mode === 'check-out' || (mode === 'check-in' && dueAmount > 0)) && (
          <div className="payment-section">
            <div className="payment-grid">
              <Form.Item name="paymentMode" label={t("Mode")} rules={[{ required: true, message: t("Please select payment mode!") }]} className="payment-form-item">
                <Select>
                  <Option value="cash">{t("Cash")}</Option>
                  <Option value="online">{t("Online")}</Option>
                </Select>
              </Form.Item>
              <Form.Item name="transactionId" label={t("Transaction ID")} className="payment-form-item">
                <Input />
              </Form.Item>
              <Form.Item name="amount" 
               label={mode === 'check-out' && dueAmount < 0 ? t("Refund Amount") : t("Amount")} 
               rules={[{ required: true, message: t("Please input the amount!") }]} className="payment-form-item">
                <Input type="number" />
              </Form.Item>
            </div>
            <Form.Item name="remark" label={t("Remark")} className="payment-remark">
              <Input.TextArea rows={3} />
            </Form.Item>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default CheckInModal;