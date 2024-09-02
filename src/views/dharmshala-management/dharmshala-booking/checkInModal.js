import React, { useState, useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import { Modal, Form, Input, DatePicker, Select, Button } from 'antd';
import { useTranslation } from "react-i18next";
import RoomsContainer from "../../../components/dharmshalaBooking/RoomsContainer";
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { updatePayment, updateDharmshalaBooking } from "../../../api/dharmshala/dharmshalaInfo";
import '../../../../src/views/dharmshala-management/dharmshala_css/addbooking.css';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

const CheckInModal = ({ visible, onClose, booking, mode }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [dueAmount, setDueAmount] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState('');

  const updateBookingMutation = useMutation({
    mutationFn: (payload) => updateDharmshalaBooking(payload),
    onSuccess: () => {
      console.log('Booking updated successfully');
    },
    onError: (error) => {
      console.error('Error updating booking:', error);
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: (payload) => updatePayment(payload),
    onSuccess: () => {
      console.log('Payment updated successfully');
    },
    onError: (error) => {
      console.error('Error updating payment:', error);
    },
  });

  useEffect(() => {
    if (booking) {
      const room = booking.rooms[0] || {};
      form.setFieldsValue({
        building: room.buildingName || booking.building,
        floor: room.floorName || booking.floor,
        roomNumbers: room.roomNumber || '',
        capacity: booking.capacity,
        fromDate: dayjs(booking.startDate, "DD MMM YYYY"),
        toDate: dayjs(booking.endDate, "DD MMM YYYY"),
        currentDate: dayjs(),
        dueAmount: booking.calculatedFields.totalDue || 1000, 
      });
      setDueAmount(booking.calculatedFields.totalDue || 0);
      console.log('Booking Data on Modal Open:', booking);

      const initialFormValues = form.getFieldsValue();
      console.log('Initial Form Values:', initialFormValues);
    }
    const timer = setInterval(() => {
      const now = dayjs().tz('Asia/Kolkata');
      setCurrentDateTime(now.format('ddd, DD MMM YYYY HH:mm:ss [IST]'));
    }, 1000);
    return () => clearInterval(timer);
  }, [booking, form]);

  const handleOk = () => {
    const existingPayments = Array.isArray(booking.payment.payments) ? booking.payment.payments : [];

    
    
    form.validateFields().then((values) => {
      const bookingPayload = {
        bookingId: booking._id,
        building: values.building,
        startDate: dayjs(booking.startDate).format('DD-MM-YYYY'),
        endDate: dayjs(booking.endDate).format('DD-MM-YYYY'),
        rooms: booking.rooms,
        calculatedFields: {
          roomRent: booking.calculatedFields.roomRent,
          totalAmount: booking.calculatedFields.totalAmount,
          totalPaid: booking.calculatedFields.totalPaid,
          totalDue: values.dueAmount,
          security: booking.calculatedFields.security,
        },
        status: mode === 'check-in' ? 'checked-in' : 'checked-out',
        guestCount: {
          men: booking.guestCount.men,
          women: booking.guestCount.women,
          children: booking.guestCount.children,
        },
      };

      const newPayment = {
        type: "deposit",
        amount: values.amount,
        date: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
        transactionId: values.transactionId,
        remarks: values.remark,
        method: values.paymentMode,
      };

      const paymentPayload = {
        paymentId: booking.payment._id,
        bookingId: booking._id,
        totalAmount: {
          roomrent : booking.calculatedFields.totalAmount,
          security : booking.calculatedFields.security,
        },
        currency: 'INR',
        payments: [
          ...existingPayments,
          newPayment
        ],
        status: 'pending',
      };

      updateBookingMutation.mutate(bookingPayload);
      updatePaymentMutation.mutate(paymentPayload);

      onClose();
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };



  return (
    <Modal
    title={t(mode === 'check-in' ? "Check In" : "Check Out")}
      visible={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose} style={{ borderColor: '#d9d9d9', color: '#d9d9d9' }}>
          {t("Cancel")}
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk} style={{ backgroundColor: '#e69138', borderColor: '#e69138' }}>
        {t(mode === 'check-in' ? "Check In" : "Check Out")}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {/* Form Fields */}
        <div style={{ border: '1px solid #d9d9d9', padding: '10px', marginBottom: '20px' }}>
        <RoomsContainer
            style={{ maxHeight: '100px', overflow: 'auto' }}
            roomsData={booking?.rooms || []}
            roomTypes={booking?.rooms.map(room => ({
              _id: room.roomTypeId, 
              name: room.roomTypeName 
            })) || []}
            buildings={booking?.rooms.map(room => ({
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
            handleRoomTypeChange={() => {}}
            handleBuildingChange={() => {}}
            handleFloorChange={() => {}}
            handleRoomNumberChange={() => {}}
            handleDeleteRoom={() => {}}
            handleAddRoom={() => {}}
            handleClearRooms={() => {}}
            isPartialView={true}
            isReadOnly={true}
          />
          <div style={{ border: '1px solid #d9d9d9', padding: '10px', marginBottom: '20px', marginTop:'20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          <Form.Item name="fromDate" label={t("From Date")} style={{ margin: 0 }}>
          <DatePicker 
            disabled 
            style={{ width: '100%' }} 
            format="DD MMM YYYY"
          />
            </Form.Item>
            <Form.Item name="toDate" label={t("To Date")} style={{ margin: 0 }}>
              <DatePicker 
                disabled 
                style={{ width: '100%' }} 
                format="DD MMM YYYY"
              />
            </Form.Item>
            </div>
            </div>
          </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Form.Item name="currentDate" label={t("Date and Time")} style={{ width: '48%', margin: 0 }}>
          <Input value={currentDateTime} readOnly />
        </Form.Item>


          <Form.Item name="dueAmount" label={t("Due Amount")} style={{ width: '48%', margin: 0 }}>
            <Input disabled />
          </Form.Item>
        </div>

        {dueAmount > 0 && (
          <div style={{ border: '1px solid #d9d9d9', padding: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <Form.Item name="paymentMode" label={t("Mode")} rules={[{ required: true, message: t("Please select payment mode!") }]} style={{ margin: 0 }}>
                <Select>
                  <Option value="cash">{t("Cash")}</Option>
                  <Option value="online">{t("Online")}</Option>
                </Select>
              </Form.Item>
              <Form.Item name="transactionId" label={t("Transaction ID")} style={{ margin: 0 }}>
                <Input />
              </Form.Item>
              <Form.Item name="amount" label={t("Amount")} rules={[{ required: true, message: t("Please input the amount!") }]} style={{ margin: 0 }}>
                <Input type="number" />
              </Form.Item>
            </div>
            <Form.Item name="remark" label={t("Remark")} style={{ margin: '10px 0 0 0' }}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </div>
        )}
        
        {/* <div style={{ border: '1px solid #d9d9d9', padding: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            <Form.Item name="building" label={t("Building")} style={{ margin: 0 }}>
              <Input disabled style={{ backgroundColor: 'white' }} />
            </Form.Item>
            <Form.Item name="floor" label={t("Floor")} style={{ margin: 0 }}>
              <Input disabled style={{ backgroundColor: 'white' }} />
            </Form.Item>
            <Form.Item name="roomNumbers" label={t("Room Numbers")} style={{ margin: 0 }}>
              <Input disabled style={{ backgroundColor: 'white' }} />
            </Form.Item>
            <Form.Item name="capacity" label={t("Capacity")} style={{ margin: 0 }}>
              <Input disabled style={{ backgroundColor: 'white' }} />
            </Form.Item>
            <Form.Item name="fromDate" label={t("From Date")} style={{ margin: 0 }}>
              <DatePicker 
                disabled 
                style={{ width: '100%' }} 
                format="DD MMM YYYY"
              />
            </Form.Item>
            <Form.Item name="toDate" label={t("To Date")} style={{ margin: 0 }}>
              <DatePicker 
                disabled 
                style={{ width: '100%' }} 
                format="DD MMM YYYY"
              />
            </Form.Item>
          </div>
        </div> */}
        
      </Form>
    </Modal>
  );
};

export default CheckInModal;
