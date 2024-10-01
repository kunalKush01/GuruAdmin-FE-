import React, { useState, useEffect } from "react";
import { Form } from "formik";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import { Plus } from "react-feather";
import { DatePicker } from "antd";
import { Timeline } from "antd";
import Swal from "sweetalert2";
import CustomTextField from "../partials/customTextField";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import AsyncSelectField from "../partials/asyncSelectField";
import { getAllSubCategories } from "../../api/expenseApi";
import { findAllComitmentByUser, findAllUsersByName, findAllUsersByNumber } from "../../api/findUser";
import { getRoomTypeList, getDharmshalaList, getDharmshalaFloorList, getAllRoomsByFloorId, getDharmshala } from "../../api/dharmshala/dharmshalaInfo";
import guestIcon from "../../assets/images/icons/subadmin.svg";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import uploadIcon from "../../assets/images/icons/Thumbnail.svg";
import { Prompt } from 'react-router-dom';
import AddUserDrawerForm from "../donation/addUserDrawerForm";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import '../../../src/assets/scss/viewCommon.scss';
import RoomsContainer from './RoomsContainer';

const CustomDatePicker = DatePicker.generatePicker(momentGenerateConfig);

export default function FormWithoutFormikForBooking({
  formik,
  masterloadOptionQuery,
  buttonName,
  paidDonation,
  getCommitmentMobile,
  countryFlag,
  payDonation,
  loading,
  article,
  setArticle,
  showPrompt,
  isEditing,
  ...props
}) {
  const { t } = useTranslation();
  const history = useHistory();
  // const [fromDate, setFromDate] = useState(null);
  // const [toDate, setToDate] = useState(null);
  // const [numMen, setNumMen] = useState("");
  // const [numWomen, setNumWomen] = useState("");
  // const [numKids, setNumKids] = useState("");
  const [activeTab, setActiveTab] = useState("payment");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState("");
  const [totalDue, setTotalDue] = useState("");
  // const [roomsData, setRoomsData] = useState([
  //   { roomType: "", building: "", floor: "", roomNumber: "", amount: 0 },
  // ]);
  const fromDate = formik.values.fromDate;
  const toDate = formik.values.toDate;
  const numMen = formik.values.numMen;
  const numWomen = formik.values.numWomen;
  const numKids = formik.values.numKids;
  const roomsData = formik.values.roomsData;
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState({});
  const [rooms, setRooms] = useState({});
  const [roomTypes, setRoomTypes] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState(getCommitmentMobile ?? "");
  const [noUserFound, setNoUserFound] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: roomTypesData, isLoading: isRoomTypesLoading, isError: isRoomTypesError } = useQuery(["roomTypes"], getRoomTypeList);
  
  const handleDataLoad = (val) => {
    setDataLoad(val);
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

useEffect(() => {
  const Mobile = formik?.values?.Mobile?.toString();
  if (Mobile?.length === 10) {
    const results = async () => {
      try {
        const res = await findAllUsersByNumber({
          mobileNumber: Mobile,
        });
        if (res.result) {
          formik.setFieldValue("SelectedUser", res.result);
          setNoUserFound(false);
        } else {
          setNoUserFound(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setNoUserFound(true);
      }
    };
    results();
  } else if (Mobile?.length !== 10) {
    formik.setFieldValue("SelectedUser", "");
    setNoUserFound(false);
  }
}, [formik?.values?.Mobile]);

useEffect(() => {
  const user = formik?.values?.SelectedUser;
  if (user?.id) {
    formik.setFieldValue("Mobile", user?.mobileNumber);
    formik.setFieldValue("countryCode", user?.countryName);
    formik.setFieldValue("dialCode", user?.countryCode);
    formik.setFieldValue("guestname", user?.name);
    formik.setFieldValue("email", user?.email);
    formik.setFieldValue("donarName", user?.name);
    setPhoneNumber(user?.countryCode + user?.mobileNumber);
    return;
  }
  formik.setFieldValue("Mobile", "");
  formik.setFieldValue("countryCode", "");
  formik.setFieldValue("dialCode", "");
  formik.setFieldValue("guestname", "");
  formik.setFieldValue("email", "");
  formik.setFieldValue("donarName", "");
}, [formik?.values?.SelectedUser]);

useEffect(() => {
  if (formik.values.calculatedFields) {
    formik.setFieldValue('roomRent', formik.values.calculatedFields.roomRent);
    formik.setFieldValue('totalAmount', formik.values.calculatedFields.totalAmount);
    formik.setFieldValue('totalDue', formik.values.calculatedFields.totalDue);
    formik.setFieldValue('totalPaid', formik.values.calculatedFields.totalPaid);
  }
}, [formik.values.calculatedFields]);

const idTypeOptions = [
  { value: 'aadhar', label: 'Aadhar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'voter', label: 'Voter ID Card' },
  { value: 'driving', label: 'Driving License' },
  { value: 'other', label: 'Other' }
];

  useEffect(() => {
    fetchBuildings();
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    fetchBuildings();
    fetchRoomTypes();
    
    if (formik.values.roomsData && formik.values.roomsData.length > 0) {
      formik.values.roomsData.forEach((room) => {
        if (room.building) {
          fetchFloors(room.building);
        }
        if (room.floor) {
          fetchRooms(room.floor);
        }
      });
    }
  }, []);

  const handleCreateUser = async (payload) => {
    return createSubscribedUser(payload);
  };

  const schema = Yup.object().shape({
    mobile: Yup.string().required("users_mobile_required"),
    email: Yup.string()
      .email("email_invalid")
      .required("users_email_required")
      .trim(),
    name: Yup.string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        "user_only_letters"
      )
      .required("users_title_required")
      .trim(),
    pincode: Yup.string().when("searchType", {
      is: "isPincode",
      then: Yup.string().max(6, "Pincode not found"),
      otherwise: Yup.string(),
    }),
  });

  const fetchBuildings = async () => {
    try {
      const response = await getDharmshalaList();
      setBuildings(response.results.map(building => ({
        _id: building._id,
        name: building.name
      })));
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await getRoomTypeList();
      setRoomTypes(response.results.map(room => ({
        _id: room._id,
        name: room.name,
        capacity: room.capacity,
        price: room.price,
        dharmshalaId: room.dharmshalaId
      })));
      
      if (response.results && response.results.length > 0) {
        const dharmshalaId = response.results[0].dharmshalaId;
        fetchDharmshalaDetails(dharmshalaId);
      }
    } catch (error) {
      console.error("Error fetching room types:", error);
    }
  };

  const fetchDharmshalaDetails = async (dharmshalaId) => {
    try {
      const response = await getDharmshala(dharmshalaId);
      if (response && response.advanceOnBooking) {
        formik.setFieldValue('security', response.advanceOnBooking);
      }
    } catch (error) {
      console.error("Error fetching dharmshala details:", error);
    }
  };

  const fetchFloors = async (buildingId) => {
    try {
      const response = await getDharmshalaFloorList(buildingId);
      setFloors((prevFloors) => ({
        ...prevFloors,
        [buildingId]: response.results.map(floor => ({
          _id: floor._id,
          name: floor.name
        }))
      }));
    } catch (error) {
      console.error("Error fetching floors:", error);
    }
  };

  const fetchRooms = async (floorId) => {
    try {
      const response = await getAllRoomsByFloorId(floorId);
      setRooms((prevRooms) => ({
        ...prevRooms,
        [floorId]: response.results,
      }));
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleFromDateChange = (date, dateString) => {
    formik.setFieldValue('fromDate', date);
  };
  
  const handleToDateChange = (date, dateString) => {
    formik.setFieldValue('toDate', date);
  };

  const handleSearch = () => {
    const totalGuests = parseInt(formik.values.numMen) + parseInt(formik.values.numWomen) + parseInt(formik.values.numKids);
    const sortedRoomTypes = [...roomTypes].sort((a, b) => b.capacity - a.capacity);
  
    let remainingGuests = totalGuests;
    const roomsCombination = [];
  
    while (remainingGuests > 0) {
      const suitableRoom = sortedRoomTypes.find(room => room.capacity <= remainingGuests);
      
      if (suitableRoom) {
        roomsCombination.push({
          roomTypeId: suitableRoom._id,
          roomTypeName: suitableRoom.name,
          building: "",
          buildingName: "",
          floor: "",
          floorName: "",
          roomId: "",
          roomNumber: "",
          amount: suitableRoom.price,
        });
        remainingGuests -= suitableRoom.capacity;
      } else {
        // If no suitable room found, assign the smallest room
        const smallestRoom = sortedRoomTypes[sortedRoomTypes.length - 1];
        roomsCombination.push({
          roomTypeId: smallestRoom._id,
          roomTypeName: smallestRoom.name,
          building: "",
          buildingName: "",
          floor: "",
          floorName: "",
          roomId: "",
          roomNumber: "",
          amount: smallestRoom.price,
        });
        remainingGuests -= smallestRoom.capacity;
      }
    }
  
    formik.setFieldValue('roomsData', roomsCombination);
    updateTotalAmount(roomsCombination);
  };

  const handleAddRoom = () => {
    const updatedRoomsData = [
      ...formik.values.roomsData,
      { roomType: "", building: "", floor: "", roomId: "", roomNumber:'', amount: 0 },
    ];
    formik.setFieldValue('roomsData', updatedRoomsData);
    updateTotalAmount(updatedRoomsData);
  };

  const handleClearRooms = () => {
    const clearedRoomsData = [
      { roomType: "", building: "", floor: "", roomId: "", roomNumber:'', amount: 0 },
    ];
    formik.setFieldValue('roomsData', clearedRoomsData);
    updateTotalAmount(clearedRoomsData);
  };

  const handleRoomTypeChange = (value, index) => {
    const selectedRoomType = roomTypes.find((rt) => rt._id === value);
    const updatedRoomsData = [...formik.values.roomsData];
    updatedRoomsData[index] = {
      ...updatedRoomsData[index],
      roomType: value,
      roomTypeName: selectedRoomType?.name || '',
      building: '',
      buildingName: '',
      floor: '',
      floorName: '',
      roomId: '',
      roomNumber: '',
      amount: selectedRoomType?.price || 0,
    };
    formik.setFieldValue('roomsData', updatedRoomsData);
    updateTotalAmount(updatedRoomsData);
  };
  
  const handleBuildingChange = (buildingId, index) => {
    const updatedRooms = formik.values.roomsData.map((room, i) =>
      i === index ? {
        ...room,
        building: buildingId,
        buildingName: buildings.find(b => b._id === buildingId)?.name,
        floor: "",
        floorName: "",
        roomNumber: "",
        roomId: ""
      } : room
    );
    formik.setFieldValue('roomsData', updatedRooms);
    updateTotalAmount(updatedRooms);
    fetchFloors(buildingId);
  };
  
  const handleFloorChange = (floorId, index) => {
    const updatedRooms = formik.values.roomsData.map((room, i) =>
      i === index ? {
        ...room,
        floor: floorId,
        floorName: floors[formik.values.roomsData[index].building]?.find(f => f._id === floorId)?.name,
        roomNumber: "",
        roomId: ""
      } : room
    );
    formik.setFieldValue('roomsData', updatedRooms);
    updateTotalAmount(updatedRooms);
    fetchRooms(floorId);
  };
  
  const handleRoomNumberChange = (roomId, index) => {
    const selectedRoom = (rooms[formik.values.roomsData[index].floor] || []).find(room => room._id === roomId);
    
    const updatedRooms = formik.values.roomsData.map((room, i) =>
      i === index ? { 
        ...room, 
        roomId: roomId,
        roomNumber: selectedRoom ? selectedRoom.roomNumber : ''
      } : room
    );
    
    formik.setFieldValue('roomsData', updatedRooms);
    updateTotalAmount(updatedRooms);
  };

  const updateTotalAmount = (updatedRoomsData) => {
    const total = updatedRoomsData.reduce((acc, room) => acc + room.amount, 0);
    const totalAmount = total+ formik.values.security;
    formik.setFieldValue('roomRent', total);
    formik.setFieldValue('totalAmount', totalAmount);
  };

  const handleDeleteRoom = (index) => {
    Swal.fire({
      title: t("booking_room_delete"),
      text: t("booking_room_delete_sure"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: t("cancel"),
      confirmButtonText: t("confirm"),
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedRoomsData = formik.values.roomsData.filter((room, idx) => idx !== index);
        formik.setFieldValue('roomsData', updatedRoomsData);
        updateTotalAmount(updatedRoomsData);
        Swal.fire(
          t("booking_room_deleted"),
          t("booking_room_deleted_message"),
          t("success")
        );
      }
    });
  };
  

  const handleCancel = () => {
    Swal.fire({
      title: t("cancel_booking"),
      text: t("cancel_booking_sure"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: t("undo_cancel"),
      confirmButtonText: t("confirm_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        history.push("/booking/info");
      }
    });
  };
  
  return (
    <Form>
      {showPrompt && (
        <Prompt
          when={!!Object.values(formik?.values).find((val) => !!val)}
          message={(location) =>
            `Are you sure you want to leave this page & visit ${location.pathname.replace(
              "/",
              ""
            )}`
          }
        />
      )}
      <div className="overall-div">
        <div className="booking-room">
          <div className="booking-container">
          <div className="booking-header">
            <div className="booking-title">Booking</div>
            {isEditing && formik.values.bookingId && (
              <div className="booking-id">Booking ID: {formik.values.bookingCode}</div>
            )}
          </div>
            <div className="flex-container">
              <div className="date-picker-container">
                <div className="date-picker-item">
                  <label htmlFor="from-date" className="date-label">
                    From Date:
                  </label>
                  <CustomDatePicker
                    id="from-date"
                    value={formik.values.fromDate}
                    onChange={handleFromDateChange}
                    format="DD MMM YYYY"
                    placeholder="Select a date"
                    className="custom-datepicker"
                  />
                </div>
                <div className="date-picker-item">
                  <label htmlFor="to-date" className="date-label">
                    To Date:
                  </label>
                  <CustomDatePicker
                    id="to-date"
                    value={formik.values.toDate}
                    onChange={handleToDateChange}
                    format="DD MMM YYYY"
                    placeholder="Select a date"
                    className="custom-datepicker"
                  />
                </div>
              </div>
              <div className="member-container">
                <label htmlFor="num-men" className="member-label">
                  Members (M/W/K):
                </label>
                <div className="member-inputs">
                <input
                  type="text"
                  id="num-men"
                  value={formik.values.numMen}
                  onChange={(e) => formik.setFieldValue('numMen', e.target.value)}
                  className="member-input"
                  placeholder="Men"
                />
                <input
                  type="text"
                  id="num-women"
                  value={formik.values.numWomen}
                  onChange={(e) => formik.setFieldValue('numWomen', e.target.value)}
                  className="member-input"
                  placeholder="Women"
                />
                <input
                  type="text"
                  id="num-kids"
                  value={formik.values.numKids}
                  onChange={(e) => formik.setFieldValue('numKids', e.target.value)}
                  className="member-input"
                  placeholder="Kids"
                />
                  <button className="search-button" onClick={handleSearch} type="button">
                    Search
                  </button>
                </div>
              </div>
            </div>
            {/* <img src={editIcon} className="edit-icon" alt="Edit" /> */}
          </div>
          <RoomsContainer
            roomsData={formik.values.roomsData}
            roomTypes={roomTypes}
            buildings={buildings}
            floors={floors}
            rooms={rooms}
            handleRoomTypeChange={handleRoomTypeChange}
            handleBuildingChange={handleBuildingChange}
            handleFloorChange={handleFloorChange}
            handleRoomNumberChange={handleRoomNumberChange}
            handleDeleteRoom={handleDeleteRoom}
            handleAddRoom={handleAddRoom}
            handleClearRooms={handleClearRooms}
          />  
        </div> 
        <div className="guest-payment">
          <div className="guest-container-add-booking">
            <div className="guest-header">
              <div className="guest-title">Guest Details</div>
            </div>
            <Row className="paddingForm">
              <Col xs={12}>
                <Row>
                  <Col xs={12} sm={6} lg={4} className="pb-1 custom-margin-top" >
                    <Row>
                      <Col xs={12} className="align-self-center">
                      <CustomCountryMobileNumberField
                        value={phoneNumber}
                        disabled={payDonation}
                        defaultCountry={countryFlag}
                        label={t("dashboard_Recent_DonorNumber")}
                        placeholder={t("placeHolder_mobile_number")}
                        onChange={(phone, country) => {
                          setPhoneNumber(phone);
                          formik.setFieldValue("countryCode", country?.countryCode);
                          formik.setFieldValue("dialCode", country?.dialCode);
                          formik.setFieldValue(
                            "Mobile",
                            phone?.replace(country?.dialCode, "")
                          );
                        }}
                        required
                      />
                      {noUserFound && (
                          <div className="addUser">
                            {" "}
                            <Trans i18nKey={"add_user_donation"} />{" "}
                            <span className="cursor-pointer" onClick={showDrawer}>
                              <Trans i18nKey={"add_user"} />
                            </span>
                          </div>
                        )}
                        <AddUserDrawerForm
                          onClose={onClose}
                          open={open}
                          handleSubmit={handleCreateUser}
                          addDonationUser
                          initialValues={{
                            name: "",
                            countryCode: "in",
                            dialCode: "91",
                            email: "",
                            pincode: "",
                            searchType: "isPincode",
                            panNum: "",
                            addLine1: "",
                            addLine2: "",
                            city: "",
                            district: "",
                            state: "",
                            country: "",
                            pin: "",
                          }}
                          validationSchema={schema}
                          buttonName={"add_user"}
                          getNumber={phoneNumber}
                          onSuccess={handleDataLoad}
                        />
                        {formik.errors.Mobile && (
                          <div className="text-danger">
                            <Trans i18nKey={formik.errors.Mobile} />
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} sm={6} lg={4} className="pb-1">
                  <CustomTextField
                    required
                    label={t("Guest Name")}
                    placeholder={t("Guest Name")}
                    name="guestname"
                    value={formik.values.guestname}
                    onChange={formik.handleChange}
                    onInput={(e) => (e.target.value = e.target.value.slice(0, 30))}
                  />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={6} lg={4} className="pb-1">
                  <CustomTextField
                    label={t("Email")}
                    placeholder={t("placeHolder_email")}
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onInput={(e) => (e.target.value = e.target.value.slice(0, 30))}
                  />
                  </Col>
                  <Col xs={12} sm={6} lg={4} className="pb-1">
                  <CustomTextField
                    label={t("dashboard_Recent_DonorName")}
                    placeholder={t("placeHolder_donar_name")}
                    name="donarName"
                    value={formik.values.donarName}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "donarName",
                        e.target.value.slice(0, 30)
                      );
                    }}
                  />
                  </Col>
                  <Col xs={12} sm={6} lg={8} className="a pb-1">
                  <CustomTextField
                    type="address"
                    label={t("Address")}
                    placeholder={t("Address")}
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                  />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={6} lg={4} className="pb-2">
                  <FormikCustomReactSelect
                    name="idType"
                    labelName={t("ID Type")}
                    placeholder={t("Id Type")}
                    options={idTypeOptions}
                    value={idTypeOptions.find(option => option.value === formik.values.idType) || null}
                    onChange={(selectedOption) => formik.setFieldValue('idType', selectedOption ? selectedOption.value : '')}
                  />
                  </Col>
                  <Col xs={12} sm={6} lg={4} className="pb-1">
                  <CustomTextField
                    label={t("Id Number")}
                    placeholder={t("Id Number")}
                    name="idNumber"
                    value={formik.values.idNumber}
                    onChange={formik.handleChange}
                    onInput={(e) => (e.target.value = e.target.value.slice(0, 30))}
                  />
                  </Col>
                  <Col xs={12} sm={6} lg={4} className="pb-1 upload-id">
                    <input type="file" id="upload-id" className="upload-input" />
                    <img
                      src={uploadIcon}
                      className="upload-icon"
                      alt="Upload"
                    />
                    <label htmlFor="upload-id" className="upload-label">
                      Upload ID Card
                    </label>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <div className="payments-container">
            <div className="tabs">
              <div
                className={`tab ${activeTab === "payment" ? "active" : ""}`}
                onClick={() => setActiveTab("payment")}
              >
                Payment
              </div>
              <div
                className={`tab ${activeTab === "paymentHistory" ? "active" : ""}`}
                onClick={() => setActiveTab("paymentHistory")}
              >
                Payment History
              </div>
            </div>
            {activeTab === "payment" && (
              <div className="payment-tab">
                <div className="payment-field">
                  <label htmlFor="room-rent" className="payment-label">
                    Room Rent:
                  </label>
                  <input
                    type="text"
                    id="room-rent"
                    value={formik.values.roomRent}
                    readOnly
                    className="payment-input"
                    placeholder="Room Rent"
                  />
                </div>
                <div className="payment-field">
                  <label htmlFor="security" className="payment-label">
                    Security:
                  </label>
                  <input
                    type="text"
                    id="security"
                    value={formik.values.security}
                    readOnly
                    // onChange={(e) => formik.setFieldValue('security', e.target.value)}
                    className="payment-input"
                    placeholder="Security"
                  />
                </div>
                <div className="payment-field">
                  <label htmlFor="total-amount" className="payment-label">
                    Total Amount:
                  </label>
                  <input
                    type="text"
                    id="total-amount"
                    value={formik.values.totalAmount}
                    readOnly
                    className="payment-input"
                    placeholder="Total Amount"
                  />
                </div>
                {isEditing && (
                <>
                  <div className="payment-field">
                    <label htmlFor="total-paid" className="payment-label">
                      Total Paid:
                    </label>
                    <input
                      type="text"
                      id="total-paid"
                      value={formik.values.totalPaid}
                      readOnly
                      className="payment-input"
                      placeholder="Total Paid"
                    />
                  </div>
                  <div className="payment-field">
                    <label htmlFor="total-due" className="payment-label">
                      Total Due:
                    </label>
                    <input
                      type="text"
                      id="total-due"
                      value={formik.values.totalDue}
                      readOnly
                      className="payment-input"
                      placeholder="Total Due"
                    />
                  </div>
                </>
              )}
                {/* <button className="pay-button">Pay</button> */}
              </div>
            )}
            {activeTab === "paymentHistory" && (
              <div 
              // className="payment-history-tab"
              >
                {/* <h3>Payment History</h3> */}
                {formik.values.payments && formik.values.payments.length > 0 ? (
                  <Timeline>
                    {formik.values.payments.map((payment, index) => (
                      <Timeline.Item 
                        key={payment._id || index} 
                        color={payment.type === 'deposit' ? 'green' : 'red'}
                      >
                        <p>
                          <strong>{payment.type === 'deposit' ? 'Deposit' : 'Refund'}</strong>: 
                          {payment.amount} {formik.values.currency}
                        </p>
                        <p>Date: {new Date(payment.date).toLocaleString()}</p>
                        <p>Method: {payment.method}</p>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                ) : (
                  <p>No payment history available.</p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="btn-Published mt-3">
        {loading ? (
          <Button
            color="primary"
            className="common-button-style add-trust-btn"
            disabled
          >
            <Spinner size="md" />
          </Button>
        ) : (
          <Button color="primary" className="addAction-btn " type="submit">
            {!props.plusIconDisable && (
              <span>
                <Plus className="" size={15} strokeWidth={4} />
              </span>
            )}
            <span>
              <Trans i18nKey={`${buttonName}`} />
            </span>
          </Button>
        )}
      </div>
    </Form>
  );
}