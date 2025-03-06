import React, { useEffect, useState } from "react";
import guestIcon from "../../assets/images/icons/subadmin.svg";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import { t } from "i18next";
import { Trans } from "react-i18next";
import { getAvailableBuildingList } from "../../api/dharmshala/dharmshalaInfo";

const RoomsContainer = ({
  isSearchRoom,
  formik,
  roomsData,
  roomTypes,
  buildings,
  floors,
  rooms,
  handleRoomTypeChange,
  handleBuildingChange,
  handleFloorChange,
  handleRoomNumberChange,
  handleDeleteRoom,
  handleAddRoom,
  handleClearRooms,
  isPartialView = false,
  hideAmountField = false,
  isCheckModal = false,
  isReadOnly,
  isEditing,
}) => {
  console.log(isEditing);
  const getSelectedRoomIds = () => {
    return roomsData.map((room) => room.roomId).filter((id) => id);
  };

  const handleButtonClick = (action) => (event) => {
    event.preventDefault();
    action();
  };
  const isFromDateAndToDateSet = !!(
    formik?.values?.fromDate && formik?.values?.toDate
  );
  useEffect(() => {
    if (formik && (!formik?.values?.fromDate || !formik?.values?.toDate)) {
      formik.setFieldValue(
        "roomsData",
        roomsData.map(() => ({
          roomType: "",
          building: "",
          floor: "",
          roomId: "",
        }))
      );
    }
  }, [formik,formik?.values?.fromDate, formik?.values?.toDate]);
  return (
    <div className="rooms-container">
      <div className="rooms-header">
        <div className="rooms-title">{t("rooms")}</div>
      </div>
      <div className="rooms-content">
        {roomsData.map((room, index) => (
          <div key={index} className="room-row">
            <div className="field-container">
              <label htmlFor={`room-type-${index}`} className="room-label">
                {t("room_type")}
                <span className="text-danger">*</span>:
              </label>
              <div className="input-with-icon w-100">
                <div className="d-flex flex-column w-100">
                  <select
                    id={`room-type-${index}`}
                    className="room-dropdown"
                    value={room.roomTypeId || room.roomType}
                    onChange={(e) => {
                      handleRoomTypeChange(e.target.value, index);
                      if (formik) {
                        formik.setFieldValue(
                          `roomsData[${index}].roomType`,
                          e.target.value
                        );
                        formik.validateField(`roomsData[${index}].roomType`);
                        formik.setFieldTouched(
                          `roomsData[${index}].roomType`,
                          true
                        );
                      }
                    }}
                    disabled={!isSearchRoom || isReadOnly}
                    onBlur={formik && !isCheckModal && formik.handleBlur}
                    name={`roomsData[${index}].roomType`}
                    style={{ opacity: isSearchRoom ? 1 : 0.5 }}
                  >
                    <option value="">{t("Select_Room_Type")}</option>
                    {roomTypes.map((roomType) => (
                      <option key={roomType._id} value={roomType._id}>
                        {roomType.name}
                      </option>
                    ))}
                  </select>
                  {!isCheckModal &&
                    formik &&
                    formik.touched.roomsData?.[index]?.roomType &&
                    formik.errors.roomsData?.[index]?.roomType && (
                      <div className="text-danger">
                        <Trans
                          i18nKey={formik.errors.roomsData[index].roomType}
                        />
                      </div>
                    )}
                </div>
                <div className="guests-content">
                  <img
                    src={guestIcon}
                    className="guests-icon"
                    alt="Guests"
                    style={{ width: "24px", height: "24px" }}
                  />
                  <span className="guests-count">
                    {roomTypes.find((rt) => rt._id === room.roomType)
                      ?.capacity ?? ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="field-container">
              <label htmlFor={`building-${index}`} className="building-label">
                {t("building")}
                <span className="text-danger">*</span>:
              </label>
              <select
                id={`building-${index}`}
                className="building-dropdown"
                value={room.building}
                onChange={(e) => handleBuildingChange(e.target.value, index)}
                disabled={!room.roomType || isReadOnly}
                onBlur={formik && !isCheckModal && formik.handleBlur}
                name={`roomsData[${index}].building`}
                style={{
                  opacity: !room.roomType || !isSearchRoom ? 0.5 : 1,
                }}
              >
                <option value="">{t("select_building")}</option>
                {(!isCheckModal
                  ? Array.isArray(buildings[index])
                    ? buildings[index]
                    : []
                  : Array.isArray(buildings)
                  ? buildings
                  : []
                ).map((building) => (
                  <option key={building._id} value={building._id}>
                    {building.name}
                  </option>
                ))}
              </select>
              {!isCheckModal &&
                formik &&
                formik.touched.roomsData?.[index]?.building &&
                formik.errors.roomsData?.[index]?.building && (
                  <div className="text-danger">
                    <Trans i18nKey={formik.errors.roomsData[index].building} />
                  </div>
                )}
            </div>
            <div className="field-container">
              <label htmlFor={`floor-${index}`} className="floor-label">
                {t("floor")}
                <span className="text-danger">*</span>:
              </label>
              <select
                id={`floor-${index}`}
                className="floor-dropdown"
                value={room.floor}
                onChange={(e) => handleFloorChange(e.target.value, index)}
                disabled={!room.building || isReadOnly}
                onBlur={formik && !isCheckModal && formik.handleBlur}
                name={`roomsData[${index}].floor`}
                style={{
                  opacity: !room.building || !isSearchRoom ? 0.5 : 1,
                }}
              >
                <option value="">{t("select_floor")}</option>
                {(floors[room.building] || []).map((floor) => (
                  <option key={floor._id} value={floor._id}>
                    {floor.name}
                  </option>
                ))}
              </select>
              {!isCheckModal &&
                formik &&
                formik.touched.roomsData?.[index]?.floor &&
                formik.errors.roomsData?.[index]?.floor && (
                  <div className="text-danger">
                    <Trans i18nKey={formik.errors.roomsData[index].floor} />
                  </div>
                )}
            </div>
            <div className="field-container">
              <label
                htmlFor={`room-number-${index}`}
                className="room-number-label"
              >
                {t("room_number")}
                <span className="text-danger">*</span>:
              </label>
              <select
                id={`room-number-${index}`}
                className="room-number-dropdown"
                value={room.roomId}
                onChange={(e) => handleRoomNumberChange(e.target.value, index)}
                disabled={!room.floor || !room.roomType || isReadOnly}
                onBlur={formik && !isCheckModal && formik.handleBlur}
                name={`roomsData[${index}].roomId`}
                style={{
                  opacity:
                    !room.floor || !room.roomType || !isSearchRoom ? 0.5 : 1,
                }}
              >
                <option value="">Select Room Number</option>
                {isCheckModal
                  ? (rooms[room.floor] || []).map((availableRoom) => (
                      <option key={availableRoom._id} value={availableRoom._id}>
                        {availableRoom.roomNumber}
                      </option>
                    ))
                  : (rooms[room.floor] || [])
                      .filter((r) => r.roomTypeId === room.roomType)
                      .filter(
                        (r) =>
                          !getSelectedRoomIds().includes(r._id) ||
                          r._id === room.roomId
                      )
                      .map((availableRoom) => (
                        <option
                          key={availableRoom._id}
                          value={availableRoom._id}
                        >
                          {availableRoom.roomNumber}
                        </option>
                      ))}
              </select>
              {!isCheckModal &&
                formik &&
                formik.touched.roomsData?.[index]?.roomId &&
                formik.errors.roomsData?.[index]?.roomId && (
                  <div className="text-danger">
                    <Trans i18nKey={formik.errors.roomsData[index].roomId} />
                  </div>
                )}
            </div>
            {!hideAmountField && (
              <div className="field-container">
                <label htmlFor={`amount-${index}`} className="amount-label">
                  {t("amount")}:
                </label>
                <input
                  type="text"
                  id={`amount-${index}`}
                  value={room.amount}
                  readOnly
                  className="amount-input"
                  style={{
                    opacity: !isSearchRoom ? 0.5 : 1,
                  }}
                  placeholder="Price"
                />
              </div>
            )}
            {!isPartialView && (
              <div className="icon-container">
                <img
                  src={deleteIcon}
                  className="delete-icon"
                  alt="Delete"
                  onClick={() => handleDeleteRoom(index)}
                  style={{ display: isReadOnly && "none" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {!isPartialView && !isReadOnly && (
        <div className="rooms-buttons">
          <button
            className="add-rooms-button"
            onClick={handleButtonClick(handleAddRoom)}
            disabled={!isSearchRoom}
            style={{ opacity: isSearchRoom ? 1 : 0.5 }}
          >
            {t("addmore_room")}
          </button>
          <button
            className="clear-rooms-button"
            onClick={handleButtonClick(handleClearRooms)}
            disabled={!isSearchRoom}
            style={{ opacity: isSearchRoom ? 1 : 0.5 }}
          >
            {t("clear_all")}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomsContainer;
