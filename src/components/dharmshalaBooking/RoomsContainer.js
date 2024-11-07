import React from 'react';
import guestIcon from "../../assets/images/icons/subadmin.svg";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import { t } from 'i18next';

const RoomsContainer = ({
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
  isReadOnly = false,
  hideAmountField = false,
  isCheckModal = false,
}) => {

  const getSelectedRoomIds = () => {
    return roomsData.map(room => room.roomId).filter(id => id);
  };

  const handleButtonClick = (action) => (event) => {
    event.preventDefault();
    action();
  };

  return (
    <div className="rooms-container">
      <div className="rooms-header">
        <div className="rooms-title">{t('rooms')}</div>
      </div>
      <div className="rooms-content">
        {roomsData.map((room, index) => (
          <div key={index} className="room-row">
            <div className="field-container">
              <label htmlFor={`room-type-${index}`} className="room-label">
                {t('room_type')}:
              </label>
              <div className="input-with-icon">
              <select
                  id={`room-type-${index}`}
                  className="room-dropdown"
                  value={room.roomTypeId || room.roomType||""}
                  onChange={(e) => handleRoomTypeChange(e.target.value, index)}
                  disabled={isReadOnly}
                >
                  <option value="">{t('Select_Room_Type')}</option>
                  {roomTypes.map((roomType) => (
                    <option key={roomType._id} value={roomType._id}>
                      {roomType.name}
                    </option>
                  ))}
                </select>
                <div className="guests-content">
                  <img src={guestIcon} className="guests-icon" alt="Guests" style={{ width: '24px', height: '24px' }}/>
                  <span className="guests-count">
                    {roomTypes.find((rt) => rt._id === room.roomType)?.capacity ?? ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="field-container">
              <label htmlFor={`building-${index}`} className="building-label">
                {t('building')}:
              </label>
              <select
                id={`building-${index}`}
                className="building-dropdown"
                value={room.building}
                onChange={(e) => handleBuildingChange(e.target.value, index)}
                disabled={isReadOnly}
              >
                <option value="">{t('select_building')}</option>
                {buildings.map((building) => (
                  <option key={building._id} value={building._id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-container">
              <label htmlFor={`floor-${index}`} className="floor-label">
                {t('floor')}:
              </label>
              <select
                id={`floor-${index}`}
                className="floor-dropdown"
                value={room.floor}
                onChange={(e) => handleFloorChange(e.target.value, index)}
                disabled={isReadOnly || !room.building}
              >
                <option value="">{t('select_floor')}</option>
                {(floors[room.building] || []).map((floor) => (
                  <option key={floor._id} value={floor._id}>
                    {floor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-container">
              <label htmlFor={`room-number-${index}`} className="room-number-label">
                {t('room_number')}:
              </label>
              <select
                id={`room-number-${index}`}
                className="room-number-dropdown"
                value={room.roomId}
                onChange={(e) => handleRoomNumberChange(e.target.value, index)}
                disabled={isReadOnly || !room.floor || !room.roomType}
              >
                <option value="">Select Room Number</option>
                {isCheckModal?
                  (rooms[room.floor] || [])
                  .map((availableRoom) => (
                    <option key={availableRoom._id} value={availableRoom._id}>
                      {availableRoom.roomNumber}
                    </option>
                  )):
                  (rooms[room.floor] || [])
                  .filter((r) => r.roomTypeId === room.roomType)
                  .filter((r) => !getSelectedRoomIds().includes(r._id) || r._id === room.roomId)
                  .map((availableRoom) => (
                    <option key={availableRoom._id} value={availableRoom._id}>
                      {availableRoom.roomNumber}
                    </option>
                  ))
                  }
              </select>
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
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {!isPartialView && (
        <div className="rooms-buttons">
          <button className="add-rooms-button" onClick={handleButtonClick(handleAddRoom)}>
            {t('addmore_room')}
          </button>
          <button className="clear-rooms-button" onClick={handleButtonClick(handleClearRooms)}>
            {t('clear_all')}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomsContainer;
