import React, { useState,useEffect } from "react";
import Swal from 'sweetalert2';
import { Trans,useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import deleteIcon from "../../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../../assets/images/icons/category/editIcon.svg";
import guestIcon from "../../../../assets/images/icons/subadmin.svg";
import { DharmshalaBookingAddWrapper } from "../../dharmshalaStyles";
import "../../dharmshala_css/addbooking.css";
import { useQuery } from "@tanstack/react-query";
import { getRoomTypeList, getDharmshalaList, getDharmshalaFloorList,getAllRoomsByFloorId} from "../../../../api/dharmshala/dharmshalaInfo";
import { DatePicker } from "antd";
import { useSelector } from "react-redux";
import BookingForm from "../../../../components/dharmshalaBooking/BookingForm";
import * as Yup from "yup";

const AddDharmshalaBooking = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [numMen, setNumMen] = useState("");
  const [numWomen, setNumWomen] = useState("");
  const [numKids, setNumKids] = useState("");
  const [activeTab, setActiveTab] = useState("payment");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState("");
  const [totalDue, setTotalDue] = useState("");
  const [roomsData, setRoomsData] = useState([{ roomType: "", building: "", floor: "", roomNumber: "", amount: 0 }]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState({});
  const [rooms, setRooms] = useState({});

  
  ///////////////////////////////////////DONATION
  const loggedInUser = useSelector((state) => state.auth.userDetail.name);


  const schema = Yup.object().shape({
    Mobile: Yup.string().required("expenses_mobile_required"),
    SelectedUser: Yup.mixed().required("user_select_required"),
    donarName: Yup.string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        "donation_donar_name_only_letters"
      )
      .trim(),
    SelectedMasterCategory: Yup.mixed().required("masterCategory_required"),
    Amount: Yup.string()
      .matches(/^[1-9][0-9]*$/, "invalid_amount")
      .required("amount_required"),
  });
  
  const initialValues = {
      Mobile: "",
      countryCode: "in",
      dialCode: "91",
      SelectedUser: "",
      donarName: "",
      SelectedMasterCategory: "",
      SelectedSubCategory: "",
      SelectedCommitmentId: "",
      Amount: "",
      isGovernment: "NO",
      createdBy: loggedInUser,
    };

  // Placeholder data for dropdowns
  const idTypes = ["Passport", "Driver's License", "Aadhar Card"];

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const handleSearch = () => {
    const totalGuests = parseInt(numMen) + parseInt(numWomen) + parseInt(numKids);
    roomTypes.sort((a, b) => b.capacity - a.capacity);
  
    let remainingGuests = totalGuests;
    const roomsCombination = [];
  
    roomTypes.forEach(roomType => {
      while (remainingGuests > 0 && roomType.capacity <= remainingGuests) {
        roomsCombination.push({
          roomType: roomType._id,
          building: "",
          floor: "",
          roomNumber: "",
          amount: roomType.price
        });
        remainingGuests -= roomType.capacity;
      }
    });
  
    while (remainingGuests > 0) {
      const smallestRoomType = roomTypes.find(rt => rt.capacity >= 1);
      if (smallestRoomType) {
        roomsCombination.push({
          roomType: smallestRoomType._id,
          building: "",
          floor: "",
          roomNumber: "",
          amount: smallestRoomType.price
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
      { roomType: "", building: "", floor: "", roomNumber: "", amount: 0 }
    ]);
  };

  const handleClearRooms = () => {
    setRoomsData([{ roomType: "", building: "", floor: "", roomNumber: "", amount: 0 }]);
    setTotalAmount(0);
  };
  
  const { data: roomTypesData, isLoading: isRoomTypesLoading, isError: isRoomTypesError } = useQuery(
    ['roomTypes'],
    getRoomTypeList
  );
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
    updatedRoomsData[index].amount = roomTypes.find((rt) => rt._id === value)?.price ?? 0;
    setRoomsData(updatedRoomsData);
    updateTotalAmount(updatedRoomsData);
  };


  const handleBuildingChange = (buildingId, index) => {
    const updatedRooms = roomsData.map((room, i) =>
      i === index ? { ...room, building: buildingId, floor: "", roomNumber: "" } : room
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
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: t("cancel"),
      confirmButtonText: t("confirm")
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
      title: t('cancel_booking'),
      text: t('cancel_booking_sure'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: t("undo_cancel"),
      confirmButtonText: t("confirm_cancel")
    }).then((result) => {
      if (result.isConfirmed) {
        history.push('/booking/info');
      }
    });
  };
  
  const handleSubmitBooking = async () => {
    try {
      Swal.fire({
        icon: 'success',
        title: t("booking_success"),
        text: t("booking_success_desc"),
        confirmButtonColor: '#d33',
        confirmButtonText: t("confirm")
      });
      history.push('/dharmshala/booking'); 
    } catch (error) {
      console.error("Error submitting booking:", error);
      Swal.fire({
        icon: 'error',
        title: t("booking_error"),
        text: t("booking_error_desc"),
        confirmButtonColor: '#d33',
        confirmButtonText: t("confirm")
      });
    }
  };

  return (
    <DharmshalaBookingAddWrapper style={{backgroundColor:'#FAFAFA'}}>
      <div className="d-flex justify-content-between align-items-center" >
        
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
          <div className="booking-id">Booking ID: MASDSF</div>
        </div>
        <div className="flex-container">
          <div className="date-picker-container">
          <div className="date-picker-item">
          <label htmlFor="from-date" className="date-label">
                From Date:
              </label>
              <DatePicker
                id="from-date"
                selected={fromDate}
                onChange={handleFromDateChange}
                dateFormat="MM/dd/yyyy"
                placeholderText="Select a date"
                className={`custom-datepicker`}
              />
            </div>
            <div className="date-picker-item">
            <label htmlFor="to-date" className="date-label">
                To Date:
              </label>
              <DatePicker
                id="to-date"
                selected={toDate}
                onChange={handleToDateChange}
                dateFormat="MM/dd/yyyy"
                placeholderText="Select a date"
                className={`custom-datepicker`}
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
                value={numMen}
                onChange={(e) => setNumMen(e.target.value)}
                className={`member-input`}
                placeholder="Men"
              />
              <input
                type="text"
                id="num-women"
                value={numWomen}
                onChange={(e) => setNumWomen(e.target.value)}
                className={`member-input`}
                placeholder="Women"
              />
              <input
                type="text"
                id="num-kids"
                value={numKids}
                onChange={(e) => setNumKids(e.target.value)}
                className={`member-input`}
                placeholder="Kids"
              />
              <button 
              className="search-button" 
              onClick={handleSearch} 
              >Search
              </button>
            </div>
          </div>
        </div>
        <img 
              src={editIcon} 
              className="edit-icon" 
              alt="Edit" 
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
                    <label htmlFor={`room-type-${index}`} className="room-label">
                      Room Type:
                    </label>
                    <div className="input-with-icon">
                      <select
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
                      </select>
                      <div className="guests-content">
                        <img src={guestIcon} className="guests-icon" alt="Guests" />
                        <span className="guests-count">
                        {roomTypes.find((rt) => rt._id === room.roomType)?.capacity ?? ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="field-container">
                    <label htmlFor={`building-${index}`} className="building-label">
                      Building:
                    </label>
                    <select
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
                    </select>
                  </div>
                  <div className="field-container">
                    <label htmlFor={`floor-${index}`} className="floor-label">
                      Floor:
                    </label>
                    <select
                      id={`floor-${index}`}
                      className="floor-dropdown"
                      value={room.floor}
                      onChange={(e) => handleFloorChange(e.target.value, index)}
                      disabled={!room.building}
                    >
                      <option value="">Select Floor</option>
                      {(floors[room.building] || []).map((floor) => (
                        <option key={floor._id} value={floor._id}>
                          {floor.name}
                        </option>
                      ))}
                    </select>

                  </div>
                  <div className="field-container">
            <label htmlFor={`room-number-${index}`} className="room-number-label">
              Room Number:
            </label>
            <select
              id={`room-number-${index}`}
              className="room-number-dropdown"
              value={room.roomNumber}
              onChange={(e) => handleRoomNumberChange(e.target.value, index)}
              disabled={!room.floor} 
            >
              <option value="">Select Room Number</option>
              {(rooms[room.floor] || [])
                .filter((r) => r.roomTypeId === room.roomType) 
                .map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.roomNumber}
                  </option>
                ))}
            </select>
                  </div>
                  <div className="field-container">
                <label htmlFor={`amount-${index}`} className="amount-label">
                  Amount:
                </label>
                <input
                  type="text"
                  id={`amount-${index}`}
                  value={room.amount}
                  readOnly 
                  className="amount-input"
                  placeholder="Price"
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
      <div className="guest-container-add-booking">
        <div className="guest-header">
          <div className="guest-title">Guest Details</div>
        </div> 
        <BookingForm
          //handleSubmit={handleCreateBooking}
          initialValues={initialValues}
          validationSchema={schema}
          showTimeInput
          buttonName="donation_Adddonation"
        />
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
            className={`tab ${activeTab === "paymentHistory" ? "active" : ""}`}
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
    <button className="cancel-button" onClick={handleCancel}>Cancel</button>
    <button className="reject-button">Reject Booking</button>
    <button className="accept-button">Accept Booking</button>
  </div>
</footer>
</div>

    </DharmshalaBookingAddWrapper>
  );
};

export default AddDharmshalaBooking;