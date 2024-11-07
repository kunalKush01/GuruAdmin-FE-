import React, { useState, useEffect } from "react";
import { Form } from "formik";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import { Plus } from "react-feather";
import { DatePicker, Image } from "antd";
import { Timeline } from "antd";
import {  Upload, message } from "antd";
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
import { Prompt } from "react-router-dom";
import AddUserDrawerForm from "../donation/addUserDrawerForm";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import "../../../src/assets/scss/viewCommon.scss";
import "../../../src/assets/scss/common.scss";
import RoomsContainer from "./RoomsContainer";
import moment from 'moment';
import { UploadOutlined } from "@ant-design/icons";
import { uploadFile, deleteFile, downloadFile } from '../../api/sharedStorageApi'; 
import {Button as AntdButton } from "antd";
const CustomDatePicker = DatePicker.generatePicker(momentGenerateConfig);
import uploadIc from "../../assets/images/icons/file-upload.svg";

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
  const [activeTab, setActiveTab] = useState("payment");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState("");
  const [totalDue, setTotalDue] = useState("");
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
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
  const {
    data: roomTypesData,
    isLoading: isRoomTypesLoading,
    isError: isRoomTypesError,
  } = useQuery(["roomTypes"], getRoomTypeList);

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
  if (formik.values.roomsData && formik.values.roomsData.length > 0) {
    formik.values.roomsData.forEach((room) => {
      if (room.floor) {
        fetchRooms(room.floor);
      }
    });
  }
}, [formik.values.fromDate, formik.values.toDate]);

useEffect(() => {
  const loadInitialRoomData = async () => {
    if (isEditing && formik.values.roomsData) {
      // Load buildings and room types first
      await fetchBuildings();
      await fetchRoomTypes();

      // Then load floors and rooms for each existing room
      for (const room of formik.values.roomsData) {
        if (room.building) {
          await fetchFloors(room.building);
        }
        if (room.floor) {
          await fetchRooms(room.floor);
        }
      }
    }
  };

  loadInitialRoomData();
}, [isEditing]);

useEffect(() => {
  if (formik.values.fromDate && formik.values.toDate && formik.values.roomsData.length > 0) {
    updateTotalAmount(formik.values.roomsData,formik.values.fromDate,formik.values.toDate);
  }
}, [formik.values.fromDate, formik.values.toDate,formik.values.roomsData]);

const handleInitialFile = async () => {
  try {
    // Download the file
    const blob = await downloadFile(formik.values.imagePath);
    
    // Create a File object from the blob
    const fileName = formik.values.imagePath.split('/').pop();
    const file = new File([blob], fileName, { type: blob.type });
    
    // Create a dummy response object to match Upload component's expectations
    const dummyResponse = {
      data: {
        result: {
          filePath: formik.values.imagePath,
          result: { value: formik.values.imagePath }
        }
      }
    };
    
    setFileList([{
      uid: '-1',
      name: fileName,
      status: 'done',
      url: URL.createObjectURL(blob),
      response: dummyResponse
    }]);
  } catch (error) {
    console.error('Error loading initial file:', error);
    message.error('Failed to load ID card image');
  }
};

useEffect(() => {
  if (isEditing && formik.values.imagePath) {
    handleInitialFile();
  }
}, [isEditing, formik.values.imagePath]);

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

  useEffect(() => {
    if (formik.values) {
      formik.setFieldValue('roomRent', formik.values.roomRent);
      formik.setFieldValue('totalAmount', formik.values.totalAmount);
      formik.setFieldValue('totalDue', formik.values.totalDue);
      formik.setFieldValue('totalPaid', formik.values.totalPaid);
    }
  }, [formik.values.roomRent,formik.values.totalAmount,formik.values.totalDue,formik.values.totalPaid]);

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
      const fromDate = formik.values.fromDate ? moment(formik.values.fromDate).format('YYYY-MM-DD') : '';
      const toDate = formik.values.toDate ? moment(formik.values.toDate).format('YYYY-MM-DD') : '';
      
      const response = await getAllRoomsByFloorId(floorId, fromDate, toDate);
      
      // Find any existing room selections for this floor
      const existingRoomSelections = formik.values.roomsData
        .filter(room => room.floor === floorId && room.roomId)
        .map(room => ({
          _id: room.roomId,
          roomNumber: room.roomNumber,
          roomTypeId: room.roomType
        }));

      // Combine API response with existing selections to ensure they're available in dropdown
      const availableRooms = [
        ...response.results,
        ...existingRoomSelections.filter(existingRoom => 
          !response.results.some(apiRoom => apiRoom._id === existingRoom._id)
        )
      ];

      setRooms(prevRooms => ({
        ...prevRooms,
        [floorId]: availableRooms,
      }));
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };


  const isSearchEnabled = () => {
    const men = parseInt(formik.values.numMen) || 0;
    const women = parseInt(formik.values.numWomen) || 0;
    const kids = parseInt(formik.values.numKids) || 0;
    const totalGuests = men + women + kids;
  
    return (
      formik.values.fromDate &&
      formik.values.toDate &&
      totalGuests > 0  
    );
  };
  

  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };

  const handleFromDateChange = (date, dateString) => {
    formik.setFieldValue('fromDate', date);
    if (formik.values.toDate && date > formik.values.toDate) {
      formik.setFieldValue('toDate', null);
    }
  };
  
  const handleToDateChange = (date, dateString) => {
    formik.setFieldValue('toDate', date);
  };

  const handleSearch = () => {
    if (!isSearchEnabled()) return;
    
    const men = parseInt(formik.values.numMen) || 0;
    const women = parseInt(formik.values.numWomen) || 0;
    const kids = parseInt(formik.values.numKids) || 0;
    const totalGuests = men + women + kids;
  
    const sortedRoomTypes = [...roomTypes].sort((a, b) => b.capacity - a.capacity);
  
    let remainingGuests = totalGuests;
    const roomsCombination = [];
  
    while (remainingGuests > 0) {
      const suitableRoom = sortedRoomTypes.find(room => room.capacity <= remainingGuests);
      
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
  
    formik.setFieldValue('roomsData', roomsCombination);
    updateTotalAmount(roomsCombination,formik.values.fromDate,formik.values.toDate);
  };

  const handleAddRoom = () => {
    const updatedRoomsData = [
      ...formik.values.roomsData,
      { roomType: "", building: "", floor: "", roomId: "", roomNumber:'', amount: 0 },
    ];
    formik.setFieldValue('roomsData', updatedRoomsData);
    updateTotalAmount(updatedRoomsData,formik.values.fromDate,formik.values.toDate);
  };

  const handleClearRooms = () => {
    const clearedRoomsData = [
      { roomType: "", building: "", floor: "", roomId: "", roomNumber:'', amount: 0 },
    ];
    formik.setFieldValue('roomsData', clearedRoomsData);
    updateTotalAmount(clearedRoomsData,formik.values.fromDate,formik.values.toDate);
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
    updateTotalAmount(updatedRoomsData,formik.values.fromDate,formik.values.toDate);
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
    updateTotalAmount(updatedRooms,formik.values.fromDate,formik.values.toDate);
    fetchFloors(buildingId);
  };
  
  const handleFloorChange = (floorId, index) => {
    const updatedRooms = formik.values.roomsData.map((room, i) =>
      i === index ? {
        ...room,
        floor: floorId,
        floorName: floors[room.building]?.find(f => f._id === floorId)?.name,
        roomNumber: "",
        roomId: ""
      } : room
    );
    formik.setFieldValue('roomsData', updatedRooms);
    updateTotalAmount(updatedRooms,formik.values.fromDate,formik.values.toDate);
    fetchRooms(floorId);
  };
  
  const handleRoomNumberChange = (roomId, index) => {
    const floorId = formik.values.roomsData[index].floor;
    const selectedRoom = (rooms[floorId] || []).find(room => room._id === roomId);
    
    const updatedRooms = formik.values.roomsData.map((room, i) =>
      i === index ? { 
        ...room, 
        roomId: roomId,
        roomNumber: selectedRoom ? selectedRoom.roomNumber : room.roomNumber // Preserve existing room number if no new selection
      } : room
    );
    
    formik.setFieldValue('roomsData', updatedRooms);
    updateTotalAmount(updatedRooms,formik.values.fromDate,formik.values.toDate);
  };

  const updateTotalAmount = (updatedRoomsData,fromDate,toDate) => {
    const startDate = fromDate;
    const endDate = toDate;
    const numberOfDays = endDate.diff(startDate, 'days'); 

    const roomRentPerDay = updatedRoomsData.reduce((acc, room) => acc + room.amount, 0);

    const totalRoomRent = roomRentPerDay * numberOfDays;

    const totalAmount = totalRoomRent + formik.values.security;

    const totalDueNew = totalRoomRent - formik.values.totalPaid + formik.values.security;

    formik.setFieldValue('roomRent', totalRoomRent);
    formik.setFieldValue('totalAmount', totalAmount);
    formik.setFieldValue('totalDue', totalDueNew);
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
        updateTotalAmount(updatedRoomsData,formik.values.fromDate,formik.values.toDate);
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

  const handleUpload = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    
    if (options.event) {
      options.event.preventDefault();
      options.event.stopPropagation();
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    
    try {
      const response = await uploadFile(formData);
      
      if (response?.status && response?.data?.result?.result?.value) {
        onSuccess(response, file);
        message.success(`${file.name} file uploaded successfully.`);
        setFileList([{
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: URL.createObjectURL(file),
          response: response
        }]);
        formik.setFieldValue('imagePath', response.data.result.filePath);
      } else {
        throw new Error('Invalid response structure from server');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      onError({ error });
      message.error(`${file.name} file upload failed. ${error.message || 'Please try again.'}`);
    } finally {
      setUploading(false);
    }
  };
  

  const handleRemove = async (file) => {
    try {
      const filePath = file.response?.data?.result?.result?.value || formik.values.imagePath;
      if (filePath) {
        await deleteFile(filePath);
        message.success('File removed successfully');
      }
      setFileList([]);
      formik.setFieldValue('imagePath', '');
    } catch (error) {
      console.error('Error removing file:', error);
      message.error('Failed to remove file');
    }
  };

  const handleDownload = async () => {
    try {
      if (formik.values.imagePath) {
        const blob = await downloadFile(formik.values.imagePath);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = formik.values.imagePath.split('/').pop();
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      message.error('Failed to download file');
    }
  };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const uploadProps = {
    name: 'file',
    customRequest: handleUpload,
    onRemove: handleRemove,
    fileList: fileList,
    accept: 'image/*',
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
    },
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
    },
  };
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
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
                    placeholder={t('select_date')}
                    className="custom-datepicker"
                    disabledDate={disabledDate}
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
                    placeholder={t('select_date')}
                    className="custom-datepicker"
                    disabledDate={(current) => {
                      return (current && current < moment().startOf('day')) || 
                             (formik.values.fromDate && current < formik.values.fromDate);
                    }}
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
                  <button 
                  className={`search-button ${isSearchEnabled() ? '' : 'disabled'}`} 
                  onClick={handleSearch} 
                  type="button"
                  disabled={!isSearchEnabled()}
                >
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
                  <Col
                    xs={12}
                    sm={6}
                    lg={4}
                    md={6}
                    className="pb-1 custom-margin-top"
                  >
                    <Row>
                      <Col xs={12} className="align-self-center">
                      <CustomCountryMobileNumberField
                        value={`${formik.values.SelectedUser?.countryCode || ''}${formik.values.SelectedUser?.mobileNumber || ''}`}
                        disabled={payDonation}
                        defaultCountry={countryFlag}
                        label={t("dashboard_Recent_DonorNumber")}
                        placeholder={t("placeHolder_mobile_number")}
                        onChange={(phone, country) => {
                          setPhoneNumber(phone);
                          formik.setFieldValue("countryCode", country?.countryCode || '');
                          formik.setFieldValue("dialCode", country?.dialCode || '');
                          if (typeof phone === 'string' && typeof country?.dialCode === 'string') {
                            formik.setFieldValue(
                              "Mobile",
                              phone.replace(country.dialCode, "")
                            );
                          } else {
                            formik.setFieldValue("Mobile", '');
                          }
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
                  <Col xs={12} sm={6} lg={4} md={6} className="pb-1">
                    <CustomTextField
                      required
                      label={t("Guest Name")}
                      placeholder={t("Guest Name")}
                      name="guestname"
                      value={formik.values.guestname}
                      onChange={formik.handleChange}
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} sm={6} lg={4} md={6} className="pb-1">
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
                </Row>
                <Row>
                  <Col xs={12} sm={6} lg={4} md={6} className="pb-1">
                    <CustomTextField
                      label={t("Email")}
                      placeholder={t("placeHolder_email")}
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>

                  <Col xs={12} sm={6} lg={8} md={8} className="a pb-1">
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
                      width={"100"}
                      value={
                        idTypeOptions.find(
                          (option) => option.value === formik.values.idType
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        formik.setFieldValue(
                          "idType",
                          selectedOption ? selectedOption.value : ""
                        )
                      }
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
                    <Upload
                      name="file"
                      className="uploadIdCard"
                      listType="picture"
                      {...uploadProps}
                      style={{ width: "100%" }}
                      onPreview={handlePreview}
                    >
                      <AntdButton
                        icon={
                          <img
                            src={uploadIc}
                            alt="Upload Icon"
                            style={{ width: 16, height: 16 }}
                          />
                        }
                        style={{ width: "100%" }}
                      >
                        {t("upload_id_card")}
                      </AntdButton>
                    </Upload>
                    {previewImage && (
                      <Image
                        wrapperStyle={{
                          display: 'none',
                        }}
                        preview={{
                          visible: previewOpen,
                          onVisibleChange: (visible) => setPreviewOpen(visible),
                          afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                      />
                    )}
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