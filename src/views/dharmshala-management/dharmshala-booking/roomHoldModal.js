import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { Trans, useTranslation } from "react-i18next";
import RoomsContainer from '../../../components/dharmshalaBooking/RoomsContainer';
import { getRoomTypeList, getDharmshalaList, getDharmshalaFloorList, getAllRoomsByFloorId, createRoomHold } from "../../../api/dharmshala/dharmshalaInfo";
import { toast } from 'react-toastify';
import '../../../../src/views/dharmshala-management/dharmshala_css/addbooking.scss';
import { DatePicker } from "antd";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { useQueryClient } from '@tanstack/react-query';

const CustomDatePicker = DatePicker.generatePicker(momentGenerateConfig);

const RoomHoldModal = ({ isOpen, toggle }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient()
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [type, setType] = useState('');
  const [remark, setRemark] = useState('');
  const [roomsData, setRoomsData] = useState([{}]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState({});
  const [rooms, setRooms] = useState({});

  useEffect(() => {
    fetchRoomTypes();
    fetchBuildings();
  }, []);

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
    } catch (error) {
      console.error("Error fetching room types:", error);
    }
  };

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

  const fetchFloors = async (buildingId) => {
    try {
      const response = await getDharmshalaFloorList(buildingId);
      setFloors(prevFloors => ({
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
      const response = await getAllRoomsByFloorId(floorId, fromDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD'));
      setRooms(prevRooms => ({
        ...prevRooms,
        [floorId]: response.results,
      }));
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const resetForm = () => {
    setFromDate('');
    setToDate('');
    setType('');
    setRemark('');
    setRoomsData([{}]);
  };

  const handleRoomTypeChange = (value, index) => {
    const updatedRooms = [...roomsData];
    const selectedRoomType = roomTypes.find(rt => rt._id === value);
    updatedRooms[index] = {
      ...updatedRooms[index],
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
    setRoomsData(updatedRooms);
  };

  const handleBuildingChange = (buildingId, index) => {
    const updatedRooms = roomsData.map((room, i) =>
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
    setRoomsData(updatedRooms);
    fetchFloors(buildingId);
  };

  const handleFloorChange = (floorId, index) => {
    const updatedRooms = roomsData.map((room, i) =>
      i === index ? {
        ...room,
        floor: floorId,
        floorName: floors[roomsData[index].building]?.find(f => f._id === floorId)?.name,
        roomNumber: "",
        roomId: ""
      } : room
    );
    setRoomsData(updatedRooms);
    if (fromDate && toDate) {
      fetchRooms(floorId);
    } else {
      toast.warn('Please select both From Date and To Date before selecting a floor.');
    }
  };

  const handleRoomNumberChange = (roomId, index) => {
    const selectedRoom = (rooms[roomsData[index].floor] || []).find(room => room._id === roomId);
    const updatedRooms = roomsData.map((room, i) =>
      i === index ? { 
        ...room, 
        roomId: roomId,
        roomNumber: selectedRoom ? selectedRoom.roomNumber : ''
      } : room
    );
    setRoomsData(updatedRooms);
  };

  const handleDeleteRoom = (index) => {
    const updatedRooms = roomsData.filter((_, i) => i !== index);
    setRoomsData(updatedRooms);
  };

  // const handleAddRoom = () => {
  //   setRoomsData([...roomsData, {}]);
  // };

  // const handleClearRooms = () => {
  //   setRoomsData([{}]);
  // };

  const handleAddRoom = () => {
    const lastRoom = roomsData[roomsData.length - 1];
    if (lastRoom.roomType && lastRoom.building && lastRoom.floor && lastRoom.roomId) {
      setRoomsData([...roomsData, {}]);
    } else {
      toast.warn('Please fill in all fields for the current room before adding a new one.');
    }
  };
  
  const handleClearRooms = () => {
    setRoomsData([{}]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      startDate: fromDate ? fromDate.format('YYYY-MM-DD') : '',
    endDate: toDate ? toDate.format('YYYY-MM-DD') : '',
      type: type,
      remark: remark,
      rooms: roomsData.map(room => ({
        roomTypeId: room.roomType,
        roomTypeName: room.roomTypeName,
        building: room.building,
        buildingName: room.buildingName,
        floor: room.floor,
        floorName: room.floorName,
        roomId: room.roomId,
        amount: room.amount,
        roomNumber: room.roomNumber
      }))
    };

    try {
      const response = await createRoomHold(payload);
      queryClient.invalidateQueries(["dharmshalaRoomholdList"]);
      toast.success('Room hold created successfully');
      resetForm();
      toggle(); 
    } catch (error) {
      toast.error('Failed to create room hold. Please try again.');
    }
  };

  const handleCancel = () => {
    resetForm();
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle} className="custom-modal-header">
        <h4 className="modal-title">
          <Trans i18nKey="Reserve or Hold Room">Reserve or Hold Room</Trans>
        </h4>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col md={4}>
              <FormGroup>
              <Label for="fromDate" className="label-custom">
                  <Trans i18nKey="From Date" />
                </Label>
                <CustomDatePicker
          id="from-date"
          value={fromDate}
          onChange={(date) => setFromDate(date)}
          format="DD MMM YYYY"
          placeholder="Select a date"
          className="custom-datepicker"
        />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
              <Label for="toDate" className="label-custom">
                  <Trans i18nKey="To Date" />
                </Label>
                <CustomDatePicker
          id="to-date"
          value={toDate}
          onChange={(date) => setToDate(date)}
          format="DD MMM YYYY"
          placeholder="Select a date"
          className="custom-datepicker"
        />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
              <Label for="type" className="label-custom">
                  <Trans i18nKey="Type" />
                </Label>
                <Input 
                  type="select" 
                  name="type" 
                  id="type" 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  className={`custom-select ${type ? 'brown-selected' : ''}`}
                >
                  <option value="">Select</option>
                  <option value="Trust Guest">{t('Trust Guest')}</option>
                  <option value="Maintenance">{t('Maintenance')}</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <RoomsContainer
            roomsData={roomsData}
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
            hideAmountField={true}
          />
          <FormGroup className="mt-3">
            <Label for="remark" className="label-custom">
              <Trans i18nKey="remark" />
            </Label>
            <Input 
              type="textarea" 
              name="remark" 
              id="remark" 
              rows="1" 
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleCancel}>
            <Trans i18nKey="cancel" />
          </Button>
          <Button color="primary" type="submit">
            <Trans i18nKey="save" />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default RoomHoldModal;