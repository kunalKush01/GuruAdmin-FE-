import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import deleteIcon from "../../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../../assets/images/icons/category/editIcon.svg";
import guestIcon from "../../../../assets/images/icons/subadmin.svg";
import uploadIcon from "../../../../assets/images/icons/Thumbnail.svg";
import { useQuery } from "@tanstack/react-query";
import {
  updateDharmshalaBooking,
  getRoomTypeList,
  getDharmshalaList,
  getDharmshalaFloorList,
  getFloorDetail,
  getAllRoomsByFloorId,
} from "../../../../api/dharmshala/dharmshalaInfo";
import { DatePicker } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import "../../../../assets/scss/dharmshala.scss";

const AddDharmshalaBooking = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { bookingId } = useParams();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [guestCount, setguestCount] = useState("");
  const [mobile, setMobile] = useState("");
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [donorName, setDonorName] = useState("");
  const [address, setAddress] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [customField1, setCustomField1] = useState("");
  const [customField2, setCustomField2] = useState("");
  const [customField3, setCustomField3] = useState("");
  const [activeTab, setActiveTab] = useState("payment");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState("");
  const [totalDue, setTotalDue] = useState("");
  const [roomsData, setRoomsData] = useState([
    { roomType: "", building: "", floor: "", roomNumber: "", amount: 0 },
  ]);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState({});
  const [rooms, setRooms] = useState({});
  const [status, setStatus] = useState("requested");
  const [_id, set_id] = useState("");
  const { auth } = useSelector((state) => state);
  const [roomNumber, setroomNumber] = useState("");
  const [floorId, setfloorId] = useState("");
  const [buildingId, setbuildingId] = useState("");
  const [roomTypeId, setroomTypeId] = useState("");

  useEffect(() => {
    if (props.location.state) {
      const {
        _id,
        startDate,
        endDate,
        status,
        roomId,
        roomTypeId,
        guestCount,
      } = props.location.state;
      setFromDate(startDate);
      setToDate(endDate);
      setStatus(status);
      set_id(_id);
      setguestCount(guestCount);
      setroomNumber(roomId.roomNumber);
      setbuildingId(roomId?.buildingId);
      setfloorId(roomId?.floorId);
      setroomTypeId(roomTypeId);
    }
  }, [props.location.state]);

  useEffect(() => {
    setMobile(auth.userDetail?.mobileNumber ?? "");
    setGuestName(auth.userDetail?.name ?? "");
    setEmail(auth.userDetail?.email ?? "");
    setDonorName(auth.userDetail?.name ?? "");
  }, [auth?.trustDetail, auth?.userDetail]);

  // Placeholder data for dropdowns
  const idTypes = ["Passport", "Driver's License", "Aadhar Card"];

  const handleFromDateChange = (date, dateString) => {
    setFromDate(dateString);
  };

  const handleToDateChange = (date, dateString) => {
    setToDate(dateString);
  };

  const handleSearch = () => {
    const totalGuests =
      parseInt(guestCount.men) +
      parseInt(guestCount.women) +
      parseInt(guestCount.children);
    roomTypes.sort((a, b) => b.capacity - a.capacity);

    let remainingGuests = totalGuests;
    const roomsCombination = [];

    roomTypes.forEach((roomType) => {
      while (remainingGuests > 0 && roomType.capacity <= remainingGuests) {
        roomsCombination.push({
          roomType: roomType._id,
          building: "",
          floor: "",
          roomNumber: "",
          amount: roomType.price,
        });
        remainingGuests -= roomType.capacity;
      }
    });

    while (remainingGuests > 0) {
      const smallestRoomType = roomTypes.find((rt) => rt.capacity >= 1);
      if (smallestRoomType) {
        roomsCombination.push({
          roomType: smallestRoomType._id,
          building: "",
          floor: "",
          roomNumber: "",
          amount: smallestRoomType.price,
        });
        remainingGuests -= smallestRoomType.capacity;
      } else {
        break;
      }
    }
    setRoomsData(roomsCombination);
    updateTotalAmount(roomsCombination);
  };

  const handleAddRoom = () => {
    setRoomsData([
      ...roomsData,
      { roomType: "", building: "", floor: "", roomNumber: "", amount: 0 },
    ]);
  };

  const handleClearRooms = () => {
    setRoomsData([
      { roomType: "", building: "", floor: "", roomNumber: "", amount: 0 },
    ]);
    setTotalAmount(0);
  };

  const {
    data: roomTypesData,
    isLoading: isRoomTypesLoading,
    isError: isRoomTypesError,
  } = useQuery(["roomTypes"], getRoomTypeList);
  const roomTypes = roomTypesData?.results ?? [];

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const response = await getDharmshalaList();
      setBuildings(response.results);
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  const fetchFloors = async (buildingId) => {
    try {
      const response = await getDharmshalaFloorList(buildingId);
      setFloors((prevFloors) => ({
        ...prevFloors,
        [buildingId]: response.results,
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

  const handleRoomTypeChange = (value, index) => {
    const updatedRoomsData = [...roomsData];
    updatedRoomsData[index].roomType = value;
    updatedRoomsData[index].amount =
      roomTypes.find((rt) => rt._id === value)?.price ?? 0;
    setRoomsData(updatedRoomsData);
    updateTotalAmount(updatedRoomsData);
  };

  const handleBuildingChange = (buildingId, index) => {
    const updatedRooms = roomsData.map((room, i) =>
      i === index
        ? { ...room, building: buildingId, floor: "", roomNumber: "" }
        : room
    );
    setRoomsData(updatedRooms);

    fetchFloors(buildingId);
  };

  const handleFloorChange = (floorId, index) => {
    const updatedRooms = roomsData.map((room, i) =>
      i === index ? { ...room, floor: floorId, roomNumber: "" } : room
    );
    setRoomsData(updatedRooms);
    fetchRooms(floorId);
  };

  const handleRoomNumberChange = (roomNumber, index) => {
    const updatedRooms = roomsData.map((room, i) =>
      i === index ? { ...room, roomNumber: roomNumber } : room
    );
    setRoomsData(updatedRooms);
  };

  const updateTotalAmount = (updatedRoomsData) => {
    const total = updatedRoomsData.reduce((acc, room) => acc + room.amount, 0);
    setTotalAmount(total);
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
        const updatedRoomsData = roomsData.filter((room, idx) => idx !== index);
        setRoomsData(updatedRoomsData);
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

  const handleAccept = async () => {
    try {
      const updatedBooking = await updateDharmshalaBooking({
        bookingId: bookingId,
        status: "accepted",
        totalCost: totalAmount,
      });

      if (updatedBooking) {
        Swal.fire({
          icon: "success",
          title: t("booking_update_success"),
          text: t("booking_update_success_desc"),
          confirmButtonColor: "#d33",
          confirmButtonText: t("confirm"),
        });

        history.push("/booking/info");
      } else {
        Swal.fire({
          icon: "error",
          title: t("booking_update_failed"),
          text: t("booking_update_failed_desc"),
          confirmButtonColor: "#d33",
          confirmButtonText: t("confirm"),
        });
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      Swal.fire({
        icon: "error",
        title: t("booking_update_error"),
        text: t("booking_update_error_desc"),
        confirmButtonColor: "#d33",
        confirmButtonText: t("confirm"),
      });
    }
  };

  return (
    <div
      className="DharmshalaComponentAddWrapper"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-between align-items-center">
          <img
            src={arrowLeft}
            className="me-2 cursor-pointer"
            onClick={() =>
              history.push(
                `/booking/info/?page=${currentPage}&status=${"requested"}&filter=${currentFilter}`
              )
            }
          />
          <div className="addEvent">
            <Trans i18nKey={"dharmshala_booking_add"} />
          </div>
        </div>
      </div>
      <div className="overall-div">
        {/* Bookings Rectangle */}
        <div className="booking-room">
          <div className="booking-container">
            <div className="booking-header">
              <div className="booking-title">Booking</div>
              <div className="booking-id">
                Booking ID: <strong>{props.location.state.bookingId}</strong>
              </div>
            </div>
            <div className="flex-container">
              <div className="date-picker-container">
                <div className="date-picker-item">
                  <label htmlFor="from-date" className="date-label">
                    From Date:
                  </label>
                  <DatePicker
                    id="from-date"
                    value={fromDate ? moment(fromDate) : null}
                    onChange={handleFromDateChange}
                    placeholder="From Date"
                    className={`custom-datepicker ${
                      !isEditClicked ? "read-only" : ""
                    }`}
                    disabled={!isEditClicked}
                    format="DD/MM/YYYY"
                  />
                </div>
                <div className="date-picker-item">
                  <label htmlFor="to-date" className="date-label">
                    To Date:
                  </label>
                  <DatePicker
                    id="to-date"
                    value={toDate ? moment(toDate) : null}
                    onChange={handleToDateChange}
                    placeholder="To Date"
                    className={`custom-datepicker ${
                      !isEditClicked ? "read-only" : ""
                    }`}
                    disabled={!isEditClicked}
                    format="DD/MM/YYYY"
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
                    value={guestCount.men ? guestCount.men : null}
                    onChange={(e) => setNumMen(e.target.value)}
                    className={`member-input ${
                      !isEditClicked ? "read-only" : ""
                    }`}
                    placeholder="Men"
                    readOnly={!isEditClicked}
                  />
                  <input
                    type="text"
                    id="num-women"
                    value={guestCount.women}
                    onChange={(e) => setNumWomen(e.target.value)}
                    className={`member-input ${
                      !isEditClicked ? "read-only" : ""
                    }`}
                    placeholder="Women"
                    readOnly={!isEditClicked}
                  />
                  <input
                    type="text"
                    id="num-kids"
                    value={guestCount.children}
                    onChange={(e) => setNumKids(e.target.value)}
                    className={`member-input ${
                      !isEditClicked ? "read-only" : ""
                    }`}
                    placeholder="Kids"
                    readOnly={!isEditClicked}
                  />
                  <button
                    className="search-button"
                    onClick={handleSearch}
                    disabled={!isEditClicked}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
            <img
              src={editIcon}
              className="edit-icon"
              alt="Edit"
              onClick={() => setIsEditClicked(true)}
            />
          </div>

          {/* Rooms Rectangle */}
          <div className="rooms-container">
            <div className="rooms-header">
              <div className="rooms-title">Rooms</div>
            </div>
            <div className="rooms-content">
              {roomsData.map((room, index) => (
                <div key={index} className="room-row">
                  <div className="field-container">
                    <label
                      htmlFor={`room-type-${index}`}
                      className="room-label"
                    >
                      Room Type:
                    </label>
                    <div className="input-with-icon">
                      {/* <select
                        id={`room-type-${index}`}
                        className="room-dropdown"
                        value={room.roomType}
                        onChange={(e) => handleRoomTypeChange(e.target.value, index)}
                      >
                        <option value="">Select Room Type</option>
                        {roomTypes.map((roomType) => (
                          <option key={roomType._id} value={roomType._id}>
                            {roomType.name}
                          </option>
                        ))}
                      </select> */}
                      <input
                        type="text"
                        id="roomtype"
                        value={props.location.state.roomId.roomTypeId}
                        className={`rooms-input ${
                          !isEditClicked ? "read-only" : ""
                        }`}
                        placeholder="Room Type"
                        readOnly={!isEditClicked}
                      />
                      <div className="guests-content">
                        <img
                          src={guestIcon}
                          className="guests-icon"
                          alt="Guests"
                        />
                        <span className="guests-count">
                          {roomTypes.find((rt) => rt._id === room.roomType)
                            ?.capacity ?? ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="field-container">
                    <label
                      htmlFor={`building-${index}`}
                      className="building-label"
                    >
                      Building:
                    </label>
                    {/* <select
                      id={`building-${index}`}
                      className="building-dropdown"
                      value={room.building}
                      onChange={(e) => handleBuildingChange(e.target.value, index)}
                    >
                      <option value="">Select Building</option>
                      {buildings.map((building) => (
                        <option key={building._id} value={building._id}>
                          {building.name}
                        </option>
                      ))}
                    </select> */}
                    <input
                      type="text"
                      id="building"
                      value={props.location.state.roomId.buildingId}
                      className={`rooms-input ${
                        !isEditClicked ? "read-only" : ""
                      }`}
                      placeholder="Building"
                      readOnly={!isEditClicked}
                    />
                  </div>
                  <div className="field-container">
                    <label htmlFor={`floor-${index}`} className="floor-label">
                      Floor:
                    </label>
                    {/* <select
                      id={`floor-${index}`}
                      className="floor-dropdown"
                      value={room.floor}
                      onChange={(e) => handleFloorChange(e.target.value, index)}
                      //disabled={!room.building} 
                    >
                      <option value="">Select Floor</option>
                      {(floors[room.building] || []).map((floor) => (
                        <option key={floor._id} value={floor._id}>
                          {floor.name}
                        </option>
                      ))}
                    </select> */}
                    <input
                      type="text"
                      id="floor"
                      value={props.location.state.roomId.floorId}
                      className={`rooms-input ${
                        !isEditClicked ? "read-only" : ""
                      }`}
                      placeholder="Floor"
                      readOnly={!isEditClicked}
                    />
                  </div>
                  <div className="field-container">
                    <label
                      htmlFor={`room-number-${index}`}
                      className="room-number-label"
                    >
                      Room Number:
                    </label>
                    {/* <select
              id={`room-number-${index}`}
              className="room-number-dropdown"
              value={room.roomNumber}
              onChange={(e) => handleRoomNumberChange(e.target.value, index)}
              //disabled={!room.floor}
            >
              <option value="">Select Room Number</option>
              {(rooms[room.floor] || [])
                .filter((r) => r.roomTypeId === room.roomType) 
                .map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.roomNumber}
                  </option>
                ))}
            </select> */}
                    <input
                      type="text"
                      id="room-number"
                      value={props.location.state.roomId.roomNumber}
                      className={`rooms-input ${
                        !isEditClicked ? "read-only" : ""
                      }`}
                      placeholder="Room Number"
                      readOnly={!isEditClicked}
                    />
                  </div>
                  <div className="field-container">
                    <label htmlFor={`amount-${index}`} className="amount-label">
                      Amount:
                    </label>
                    <input
                      type="text"
                      id={`amount-${index}`}
                      value={room.amount}
                      className={`rooms-input ${
                        !isEditClicked ? "read-only" : ""
                      }`}
                      placeholder="Price"
                      readOnly={!isEditClicked}
                    />
                  </div>
                  <div className="icon-container">
                    <img
                      src={deleteIcon}
                      className="delete-icon"
                      alt="Delete"
                      onClick={() => handleDeleteRoom(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="rooms-buttons">
              <button className="add-rooms-button" onClick={handleAddRoom}>
                Add More Rooms
              </button>
              <button className="clear-rooms-button" onClick={handleClearRooms}>
                Clear All
              </button>
            </div>
          </div>
        </div>
        <div className="guest-payment">
          {/* Guest Container */}
          <div className="guest-container">
            <div className="guest-header">
              <div className="guest-title">Guest Details</div>
            </div>
            <div className="guest-content">
              <div className="guest-row">
                <div className="field-container">
                  <label htmlFor="mobile" className="guest-label">
                    Mobile:
                  </label>
                  <input
                    type="text"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="guest-input"
                    placeholder="Mobile"
                  />
                </div>
                <div className="field-container">
                  <label htmlFor="guest-name" className="guest-label">
                    Guest Name:
                  </label>
                  <input
                    type="text"
                    id="guest-name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="guest-input"
                    placeholder="Guest Name"
                  />
                </div>
              </div>
              <div className="guest-row">
                <div className="field-container">
                  <label htmlFor="email" className="guest-label">
                    Email:
                  </label>
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="guest-input"
                    placeholder="Email"
                  />
                </div>
                <div className="field-container">
                  <label htmlFor="donor-name" className="guest-label">
                    Donor Name:
                  </label>
                  <input
                    type="text"
                    id="donor-name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="guest-input"
                    placeholder="Donor Name"
                  />
                </div>
              </div>
              <div className="guest-row">
                <div className="field-container full-width">
                  <label htmlFor="address" className="guest-label">
                    Address:
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="guest-input"
                    placeholder="Address"
                  />
                </div>
              </div>
              <div className="guest-row">
                <div className="field-container">
                  <label htmlFor="id-type" className="guest-label">
                    ID Type:
                  </label>
                  <select
                    id="id-type"
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="guest-dropdown"
                  >
                    {idTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field-container">
                  <label htmlFor="id-number" className="guest-label">
                    ID Number:
                  </label>
                  <input
                    type="text"
                    id="id-number"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="guest-input"
                    placeholder="ID Number"
                  />
                </div>
                <div className="field-container">
                  <div className="upload-field">
                    <input
                      type="file"
                      id="upload-id"
                      className="upload-input"
                    />
                    <img
                      src={uploadIcon}
                      className="upload-icon"
                      alt="Upload"
                    />
                    <label htmlFor="upload-id" className="upload-label">
                      Upload ID Card
                    </label>
                  </div>
                </div>
              </div>
              <div className="guest-row">
                <div className="field-container">
                  <label htmlFor="custom-field-1" className="guest-label">
                    Custom Field 1:
                  </label>
                  <input
                    type="text"
                    id="custom-field-1"
                    value={customField1}
                    onChange={(e) => setCustomField1(e.target.value)}
                    className="guest-input"
                    placeholder="Custom Field 1"
                  />
                </div>
                <div className="field-container">
                  <label htmlFor="custom-field-2" className="guest-label">
                    Custom Field 2:
                  </label>
                  <input
                    type="text"
                    id="custom-field-2"
                    value={customField2}
                    onChange={(e) => setCustomField2(e.target.value)}
                    className="guest-input"
                    placeholder="Custom Field 2"
                  />
                </div>
                <div className="field-container">
                  <label htmlFor="custom-field-3" className="guest-label">
                    Custom Field 3:
                  </label>
                  <input
                    type="text"
                    id="custom-field-3"
                    value={customField3}
                    onChange={(e) => setCustomField3(e.target.value)}
                    className="guest-input"
                    placeholder="Custom Field 3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payments Container */}
          <div className="payments-container">
            <div className="tabs">
              <div
                className={`tab ${activeTab === "payment" ? "active" : ""}`}
                onClick={() => setActiveTab("payment")}
              >
                Payment
              </div>
              <div
                className={`tab ${
                  activeTab === "paymentHistory" ? "active" : ""
                }`}
                onClick={() => setActiveTab("paymentHistory")}
              >
                Payment History
              </div>
            </div>
            {activeTab === "payment" && (
              <div className="payment-tab">
                <div className="payment-field">
                  <label htmlFor="total-amount" className="payment-label">
                    Total Amount:
                  </label>
                  <input
                    type="text"
                    id="total-amount"
                    value={totalAmount}
                    readOnly
                    className="payment-input"
                    placeholder="Total Amount"
                  />
                </div>
                <div className="payment-field">
                  <label htmlFor="total-paid" className="payment-label">
                    Total Paid:
                  </label>
                  <input
                    type="text"
                    id="total-paid"
                    value={totalPaid}
                    onChange={(e) => setTotalPaid(e.target.value)}
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
                    value={totalDue}
                    onChange={(e) => setTotalDue(e.target.value)}
                    className="payment-input"
                    placeholder="Total Due"
                  />
                </div>
                <button className="pay-button">Pay</button>
              </div>
            )}
            {activeTab === "paymentHistory" && (
              <div className="payment-history-tab">
                <p>Payment history</p>
              </div>
            )}
          </div>
        </div>
        {/* Footer */}
        <footer className="footer">
          <div className="footer-buttons">
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
            <button className="reject-button">Reject Booking</button>
            <button className="accept-button" onClick={handleAccept}>
              Accept Booking
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AddDharmshalaBooking;
