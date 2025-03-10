import React, { useState, useEffect } from "react";
import { Form } from "formik";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Spinner } from "reactstrap";
import { Plus } from "react-feather";
import { DatePicker } from "antd";
import { Timeline } from "antd";
import Swal from "sweetalert2";
import {
  getRoomTypeList,
  getDharmshalaList,
  getDharmshalaFloorList,
  getAllRoomsByFloorId,
  getDharmshala,
  checkRoomAvailability,
  getAvailableBuildingList,
} from "../../api/dharmshala/dharmshalaInfo";
import { Prompt } from "react-router-dom";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import "../../../src/assets/scss/viewCommon.scss";
import "../../../src/assets/scss/common.scss";
import RoomsContainer from "./RoomsContainer";
import moment from "moment";
const CustomDatePicker = DatePicker.generatePicker(momentGenerateConfig);
import GuestDetailsSection from "./guestDetailsSection";

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
  editBookingData,
  isReadOnly,
  setUserFoundByMobile,
  ...props
}) {
  const { t } = useTranslation();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState("payment");
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState({});
  const [rooms, setRooms] = useState({});
  const [roomTypes, setRoomTypes] = useState([]);

  // const fetchBuildings = async () => {
  //   try {
  //     const response = await getDharmshalaList();
  //     setBuildings((prev) =>
  //       response.results.map((building) => ({
  //         _id: building._id,
  //         name: building.name,
  //       }))
  //     );
  //   } catch (error) {
  //     console.error("Error fetching buildings:", error);
  //   }
  // };

  const fetchRoomTypes = async () => {
    try {
      const response = await getRoomTypeList();
      setRoomTypes(
        response.results.map((room) => ({
          _id: room._id,
          name: room.name,
          capacity: room.capacity,
          price: room.price,
          dharmshalaId: room.dharmshalaId,
        }))
      );

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
        formik.setFieldValue("security", response.advanceOnBooking);
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
        [buildingId]: response.results
          ? response.results.map((floor) => ({
              _id: floor._id,
              name: floor.name,
            }))
          : [],
      }));
    } catch (error) {
      console.error("Error fetching floors:", error);
    }
  };

  const fetchRooms = async (floorId) => {
    try {
      const fromDate = formik.values.fromDate
        ? moment(formik.values.fromDate).format("YYYY-MM-DD")
        : "";
      const toDate = formik.values.toDate
        ? moment(formik.values.toDate).format("YYYY-MM-DD")
        : "";

      const response = await getAllRoomsByFloorId(floorId, fromDate, toDate);

      // Find any existing room selections for this floor
      const existingRoomSelections = formik.values.roomsData
        .filter((room) => room.floor === floorId && room.roomId)
        .map((room) => ({
          _id: room.roomId,
          roomNumber: room.roomNumber,
          roomTypeId: room.roomType,
        }));

      // Combine API response with existing selections to ensure they're available in dropdown
      const availableRooms = [
        ...response.results,
        ...existingRoomSelections.filter(
          (existingRoom) =>
            !response.results.some(
              (apiRoom) => apiRoom._id === existingRoom._id
            )
        ),
      ];

      setRooms((prevRooms) => ({
        ...prevRooms,
        [floorId]: availableRooms,
      }));
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const updateTotalAmount = (updatedRoomsData, fromDate, toDate) => {
    if (!fromDate || !toDate) {
      formik.setFieldValue("roomRent", 0);
      formik.setFieldValue("totalAmount", 0);
      formik.setFieldValue("totalDue", 0);
      return;
    }
    const startDate = fromDate;
    const endDate = toDate;
    const numberOfDays = endDate ? endDate.diff(startDate, "days") : null;

    const roomRentPerDay = updatedRoomsData.reduce(
      (acc, room) => acc + room.amount,
      0
    );

    const totalRoomRent = roomRentPerDay * numberOfDays;

    const totalAmount = totalRoomRent + formik.values.security;

    let totalDueNew = totalAmount - formik.values.totalPaid;

    if (totalDueNew === 0) {
      totalDueNew -= formik.values.security;
    }

    formik.setFieldValue("roomRent", totalRoomRent);
    formik.setFieldValue("totalAmount", totalAmount);
    formik.setFieldValue("totalDue", totalDueNew);
  };

  const getFieldLabel = (totalDue) => {
    if (totalDue < 0) return "Refund:";
    if (totalDue > 0) return "Collect Now:";
    return "Status:";
  };

  const getFieldValue = (totalDue) => {
    if (totalDue === 0) return "Settled";
    return Math.abs(totalDue).toString();
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedRoomsData = formik.values.roomsData.filter(
          (room, idx) => idx !== index
        );
        formik.setFieldValue("roomsData", updatedRoomsData);
        updateTotalAmount(
          updatedRoomsData,
          formik.values.fromDate,
          formik.values.toDate
        );
        if (formik.values.fromDate && formik.values.toDate) {
          const roomTypeIds = updatedRoomsData.map((room) => room.roomType);
          const updatedBuildings = {};

          try {
            for (let i = 0; i < roomTypeIds.length; i++) {
              const roomTypeId = roomTypeIds[i];
              const response = await getAvailableBuildingList({
                roomTypeId,
                fromDate: formik.values.fromDate,
                toDate: formik.values.toDate,
              });

              if (response) {
                const buildings = response.results || [];
                updatedBuildings[i] = buildings.map((building) => ({
                  _id: building._id,
                  name: building.name,
                }));
              } else {
                console.error(
                  `Failed to fetch buildings for roomTypeId: ${roomTypeId}`
                );
              }
            }

            // Update the global buildings state
            setBuildings(updatedBuildings);
          } catch (error) {
            console.error("Error fetching buildings:", error);
          }
        }
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
  useEffect(() => {
    if (
      formik.values.fromDate &&
      formik.values.toDate &&
      formik.values.roomsData.length > 0
    ) {
      updateTotalAmount(
        formik.values.roomsData,
        formik.values.fromDate,
        formik.values.toDate
      );
    }
  }, [formik.values.fromDate, formik.values.toDate, formik.values.roomsData]);

  useEffect(() => {
    // fetchBuildings();
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

  useEffect(() => {
    if (formik.values) {
      formik.setFieldValue("roomRent", formik.values.roomRent);
      formik.setFieldValue("totalAmount", formik.values.totalAmount);
      formik.setFieldValue("totalDue", formik.values.totalDue);
      formik.setFieldValue("totalPaid", formik.values.totalPaid);
    }
  }, [
    formik.values.roomRent,
    formik.values.totalAmount,
    formik.values.totalDue,
    formik.values.totalPaid,
  ]);

  const isSearchEnabled = () => {
    const men = parseInt(formik.values.numMen, 10) || 0;
    const women = parseInt(formik.values.numWomen, 10) || 0;
    const kids = parseInt(formik.values.numKids, 10) || 0;
    const totalGuests = men + women + kids;

    return formik.values.fromDate && formik.values.toDate && totalGuests > 0;
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };
  const [selectedFromDate, setSelectedFromDate] = useState(
    isEditing ? editBookingData.startDate : formik.values.fromDate
  );
  const [selectedToDate, setSelectedToDate] = useState(
    isEditing ? editBookingData.endDate : formik.values.toDate
  );
  const checkRoomAvailable = useMutation({
    mutationFn: checkRoomAvailability,
    onSuccess: (data) => {
      const result = data.results?.[0]; // Assuming results is an array and you need the first element

      if (result && !result.available) {
        const unavailableRoomNumbers = result.unavailableRoomNumbers;

        if (unavailableRoomNumbers && unavailableRoomNumbers.length > 0) {
          const errorMessage = `Room(s) ${unavailableRoomNumbers.join(
            ", "
          )} not available for the selected dates`;

          Swal.fire({
            icon: "error",
            title: "Room Availability Error",
            text: errorMessage,
            confirmButtonText: "OK",
          });
        }
      }
    },
  });
  const handleDateChange = async (fromDate, toDate) => {
    // Helper function to safely format date
    const formatDate = (date) => {
      if (!date) return null; // Return null if date is null/undefined
      return typeof date === "string" && /^\d{2}-\d{2}-\d{4}$/.test(date)
        ? date
        : date.format("DD-MM-YYYY");
    };

    // Format the dates safely
    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    // Check if at least one valid date exists before proceeding
    if (formattedFromDate || formattedToDate) {
      const bookingPayload = {
        startDate: formattedFromDate,
        endDate: formattedToDate,
        currentBookingId: editBookingData?._id,
        rooms: editBookingData?.rooms.map((room) => ({
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
      };
      await checkRoomAvailable.mutate(bookingPayload);
    }
  };

  const handleFromDateChange = (date, dateString) => {
    formik.setFieldValue("fromDate", date);
    setSelectedFromDate(date);
    if (isEditing) {
      handleDateChange(date, selectedToDate);
    }
    if (formik.values.toDate && date > formik.values.toDate) {
      formik.setFieldValue("toDate", null);
    }
  };

  const handleToDateChange = (date, dateString) => {
    formik.setFieldValue("toDate", date);
    setSelectedToDate(date);
    if (isEditing) {
      handleDateChange(selectedFromDate, date);
    }
  };
  const [isSearchRoom, setIsSearchRoom] = useState(false);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!isSearchEnabled()) return;
    setIsSearchRoom(true);
    const men = parseInt(formik.values.numMen, 10) || 0;
    const women = parseInt(formik.values.numWomen, 10) || 0;
    const kids = parseInt(formik.values.numKids, 10) || 0;
    const totalGuests = men + women + kids;

    const sortedRoomTypes = [...roomTypes].sort(
      (a, b) => b.capacity - a.capacity
    );

    let remainingGuests = totalGuests;
    const roomsCombination = [];

    while (remainingGuests > 0) {
      const suitableRoom = sortedRoomTypes.find(
        (room) => room.capacity <= remainingGuests
      );
      if (suitableRoom) {
        roomsCombination.push({
          roomType: suitableRoom._id,
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
        const smallestRoom = sortedRoomTypes[sortedRoomTypes.length - 1];

        roomsCombination.push({
          roomType: smallestRoom._id,
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
    if (formik.values.fromDate && formik.values.toDate) {
      // Create a list of roomTypeIds from the updated room data
      const roomTypeIds = roomsCombination.map((room) => room.roomType);

      try {
        const buildingsData = {}; // Temporary storage for building data

        // Fetch buildings for each room type
        for (let i = 0; i < roomTypeIds.length; i++) {
          const roomTypeId = roomTypeIds[i];
          // console.log(`Fetching buildings for roomTypeId: ${roomTypeId} at index: ${i}`);

          // Fetch the available buildings for this room type
          const response = await getAvailableBuildingList({
            roomTypeId,
            fromDate: formik.values.fromDate,
            toDate: formik.values.toDate,
          });

          if (response) {
            const buildings = response.results || [];
            // Temporarily store the data for the current index
            buildingsData[i] = buildings.map((building) => ({
              _id: building._id,
              name: building.name,
            }));
          } else {
            console.error(
              `Failed to fetch buildings for roomTypeId: ${roomTypeId}`
            );
          }
        }

        // Update the state after all requests are completed
        setBuildings((prev) => ({
          ...prev,
          ...buildingsData,
        }));
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    }

    formik.setFieldValue("roomsData", roomsCombination);
    updateTotalAmount(
      roomsCombination,
      formik.values.fromDate,
      formik.values.toDate
    );
  };
  const handleAddRoom = () => {
    const updatedRoomsData = [
      ...formik.values.roomsData,
      {
        roomType: "",
        building: "",
        floor: "",
        roomId: "",
        roomNumber: "",
        amount: 0,
      },
    ];
    formik.setFieldValue("roomsData", updatedRoomsData);
    updateTotalAmount(
      updatedRoomsData,
      formik.values.fromDate,
      formik.values.toDate
    );
  };

  const handleClearRooms = () => {
    const clearedRoomsData = [
      {
        roomType: "",
        building: "",
        floor: "",
        roomId: "",
        roomNumber: "",
        amount: 0,
      },
    ];
    formik.setFieldValue("roomsData", clearedRoomsData);
    setBuildings({});
    updateTotalAmount(
      clearedRoomsData,
      formik.values.fromDate,
      formik.values.toDate
    );
  };

  const handleRoomTypeChange = async (value, index) => {
    const selectedRoomType = roomTypes.find((rt) => rt._id === value);
    const updatedRoomsData = [...formik.values.roomsData];
    updatedRoomsData[index] = {
      ...updatedRoomsData[index],
      roomType: value,
      roomTypeName: selectedRoomType?.name || "",
      building: "",
      buildingName: "",
      floor: "",
      floorName: "",
      roomId: "",
      roomNumber: "",
      amount: selectedRoomType?.price || 0,
    };
    formik.setFieldValue("roomsData", updatedRoomsData);
    updateTotalAmount(
      updatedRoomsData,
      formik.values.fromDate,
      formik.values.toDate
    );

    if (formik.values.fromDate && formik.values.toDate) {
      // Create a list of roomTypeIds from the updated room data
      const roomTypeIds = updatedRoomsData.map((room) => room.roomType);

      try {
        // Fetch buildings for each room type
        for (let i = 0; i < roomTypeIds.length; i++) {
          const roomTypeId = roomTypeIds[i];

          // Fetch the available buildings for this room type
          const response = await getAvailableBuildingList({
            roomTypeId,
            fromDate: formik.values.fromDate,
            toDate: formik.values.toDate,
          });

          if (response) {
            const buildings = response.results || [];

            // Update the global buildings state and set available buildings for the room
            setBuildings((prev) => ({
              ...prev,
              [i]: buildings.map((building) => ({
                _id: building._id,
                name: building.name,
              })),
            }));
          } else {
            console.error(
              `Failed to fetch buildings for roomTypeId: ${roomTypeId}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    }
  };

  const handleBuildingChange = (buildingId, index) => {
    const updatedRooms = formik.values.roomsData.map((room, i) =>
      i === index
        ? {
            ...room,
            building: buildingId,
            buildingName: (
              (!isEditing ? buildings[index] : fetchBuildings[index]) || []
            ).find((b) => b._id === buildingId)?.name,
            floor: "",
            floorName: "",
            roomNumber: "",
            roomId: "",
          }
        : room
    );
    formik.setFieldValue("roomsData", updatedRooms);
    updateTotalAmount(
      updatedRooms,
      formik.values.fromDate,
      formik.values.toDate
    );
    fetchFloors(buildingId);
  };

  const handleFloorChange = (floorId, index) => {
    const updatedRooms = formik.values.roomsData.map((room, i) =>
      i === index
        ? {
            ...room,
            floor: floorId,
            floorName: floors[room.building]?.find((f) => f._id === floorId)
              ?.name,
            roomNumber: "",
            roomId: "",
          }
        : room
    );
    formik.setFieldValue("roomsData", updatedRooms);
    updateTotalAmount(
      updatedRooms,
      formik.values.fromDate,
      formik.values.toDate
    );
    fetchRooms(floorId);
  };

  const handleRoomNumberChange = (roomId, index) => {
    const floorId = formik.values.roomsData[index].floor;
    const selectedRoom = (rooms[floorId] || []).find(
      (room) => room._id === roomId
    );

    const updatedRooms = formik.values.roomsData.map((room, i) =>
      i === index
        ? {
            ...room,
            roomId: roomId,
            roomNumber: selectedRoom
              ? selectedRoom.roomNumber
              : room.roomNumber, // Preserve existing room number if no new selection
          }
        : room
    );

    formik.setFieldValue("roomsData", updatedRooms);
    updateTotalAmount(
      updatedRooms,
      formik.values.fromDate,
      formik.values.toDate
    );
  };

  const [fetchBuildings, setFetchBuildings] = useState([]);
  const fetchAvailableBuildings = async (editBookingData, roomsData) => {
    if (roomsData && formik.values.fromDate && formik.values.toDate) {
      // Create a list of roomTypeIds from the updated room data
      const updatedBookindData = [...roomsData];
      const roomTypeIds = updatedBookindData.map((room) => room.roomType);

      try {
        const buildingsData = {}; // Temporary storage for building data

        // Fetch buildings for each room type
        await Promise.all(
          roomTypeIds.map(async (roomTypeId, index) => {
            try {
              // Fetch the available buildings for this room type
              const response = await getAvailableBuildingList({
                roomTypeId,
                fromDate: formik.values.fromDate,
                toDate: formik.values.toDate,
                bookingId: editBookingData?._id,
              });

              if (response) {
                const buildings = response.results || [];
                // Temporarily store the data for the current index
                buildingsData[index] = buildings.map((building) => ({
                  _id: building._id,
                  name: building.name,
                }));
              } else {
                console.error(
                  `Failed to fetch buildings for roomTypeId: ${roomTypeId}`
                );
              }
            } catch (error) {
              console.error(
                `Error fetching buildings for roomTypeId: ${roomTypeId}:`,
                error
              );
            }
          })
        );

        // Update the state after all requests are completed
        setFetchBuildings((prev) => ({
          ...prev,
          ...buildingsData,
        }));
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    }
  };

  useEffect(() => {
    if ((isEditing && editBookingData) || formik.values.roomsData) {
      fetchAvailableBuildings(editBookingData, formik.values.roomsData);
    }
  }, [isEditing, editBookingData, formik.values.roomsData]);

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
                <div className="booking-id">
                  Booking ID: {formik.values.bookingCode}
                </div>
              )}
            </div>
            <div className="flex-container">
              <div className="date-picker-container">
                <div className="date-picker-item">
                  <label htmlFor="from-date" className="date-label">
                    From Date<span className="text-danger">*</span>:
                  </label>
                  <CustomDatePicker
                    id="from-date"
                    value={formik.values.fromDate}
                    onChange={handleFromDateChange}
                    format="DD MMM YYYY"
                    placeholder={t("select_date")}
                    className="custom-datepicker"
                    disabledDate={disabledDate}
                    name="fromDate"
                    onBlur={formik.handleBlur}
                    disabled={isReadOnly}
                  />
                  {formik.errors.fromDate && formik.touched.fromDate && (
                    <div className="text-danger">
                      <Trans i18nKey={formik.errors.fromDate} />
                    </div>
                  )}
                </div>
                <div className="date-picker-item">
                  <label htmlFor="to-date" className="date-label">
                    To Date<span className="text-danger">*</span>:
                  </label>
                  <CustomDatePicker
                    id="to-date"
                    value={formik.values.toDate}
                    onChange={handleToDateChange}
                    format="DD MMM YYYY"
                    placeholder={t("select_date")}
                    className="custom-datepicker"
                    onBlur={formik.handleBlur}
                    disabledDate={(current) => {
                      return (
                        (current && current < moment().startOf("day")) ||
                        (formik.values.fromDate &&
                          current < formik.values.fromDate)
                      );
                    }}
                    disabled={isReadOnly}
                  />
                  {formik.errors.toDate && formik.touched.toDate && (
                    <div className="text-danger">
                      <Trans i18nKey={formik.errors.toDate} />
                    </div>
                  )}
                </div>
              </div>
              <div className="member-container">
                <label htmlFor="num-men" className="member-label">
                  Members (M/W/K):
                </label>
                <div className="member-inputs">
                  <div className="d-flex flex-column">
                    <input
                      type="number"
                      id="num-men"
                      value={
                        formik.values.numMen === "" ? "" : formik.values.numMen
                      }
                      onChange={(e) => {
                        const parsedValue = parseInt(e.target.value, 10);
                        formik.setFieldValue(
                          "numMen",
                          e.target.value === "" ? "" : Math.max(0, parsedValue)
                        );
                      }}
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                      } // Restrict negative input
                      className="member-input"
                      placeholder="Men"
                      name="numMen"
                      min="0"
                      readOnly={isReadOnly}
                    />
                  </div>

                  <div className="d-flex flex-column">
                    <input
                      type="number"
                      id="num-women"
                      value={
                        formik.values.numWomen === ""
                          ? ""
                          : formik.values.numWomen
                      }
                      onChange={(e) => {
                        const parsedValue = parseInt(e.target.value, 10);
                        formik.setFieldValue(
                          "numWomen",
                          e.target.value === "" ? "" : Math.max(0, parsedValue)
                        );
                      }}
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                      }
                      className="member-input"
                      placeholder="Women"
                      name="numWomen"
                      min="0"
                      readOnly={isReadOnly}
                    />
                  </div>

                  <div className="d-flex flex-column">
                    <input
                      type="number"
                      id="num-kids"
                      value={
                        formik.values.numKids === ""
                          ? ""
                          : formik.values.numKids
                      }
                      onChange={(e) => {
                        const parsedValue = parseInt(e.target.value, 10);
                        formik.setFieldValue(
                          "numKids",
                          e.target.value === "" ? "" : Math.max(0, parsedValue)
                        );
                      }}
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                      }
                      className="member-input"
                      placeholder="Kids"
                      name="numKids"
                      min="0"
                      readOnly={isReadOnly}
                    />
                  </div>

                  <button
                    className={`search-button ${
                      isSearchEnabled() ? "" : "disabled"
                    }`}
                    onClick={(e) => handleSearch(e)}
                    type="button"
                    style={{
                      display: isReadOnly && "none",
                    }}
                    disabled={!isSearchEnabled() || isReadOnly}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
          <RoomsContainer
            roomsData={formik.values.roomsData}
            formik={formik}
            roomTypes={roomTypes}
            buildings={
              isEditing || formik.values.roomsData ? fetchBuildings : buildings
            }
            floors={floors}
            rooms={rooms}
            handleRoomTypeChange={handleRoomTypeChange}
            handleBuildingChange={handleBuildingChange}
            handleFloorChange={handleFloorChange}
            handleRoomNumberChange={handleRoomNumberChange}
            handleDeleteRoom={handleDeleteRoom}
            handleAddRoom={handleAddRoom}
            handleClearRooms={handleClearRooms}
            isSearchRoom={isSearchRoom}
            isSearchEnabled={isSearchEnabled}
            isReadOnly={isReadOnly}
            isEditing={isEditing}
          />
        </div>
        <div className="guest-payment">
          <GuestDetailsSection
            formik={formik}
            getCommitmentMobile={getCommitmentMobile}
            payDonation={payDonation}
            countryFlag={countryFlag}
            isEditing={isEditing}
            isReadOnly={isReadOnly}
            setUserFoundByMobile={setUserFoundByMobile}
          />
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
                        {getFieldLabel(formik.values.totalDue)}
                      </label>
                      <input
                        type="text"
                        id="total-due"
                        value={getFieldValue(formik.values.totalDue)}
                        readOnly
                        className="payment-input"
                        placeholder="Amount"
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
                        color={payment.type === "deposit" ? "green" : "red"}
                      >
                        <p>
                          <strong>
                            {payment.type === "deposit" ? "Deposit" : "Refund"}
                          </strong>
                          :{payment.amount} {formik.values.currency}
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
          <Button
            color="primary"
            className="addAction-btn "
            type="submit"
            style={{ display: isReadOnly && "none" }}
          >
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
