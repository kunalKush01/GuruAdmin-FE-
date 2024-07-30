import { callApi, callDharmshalaApi } from "../../utility/utils/callApi";

export const importFile = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.post(`dharmshala/import-file`, payload),
  });

export const exportData = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.post(`buildings/`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

  //Buildings 

  export const getDharmshalaList = (payload) =>
    callDharmshalaApi({
      requestFunction: (axios) => axios.get(`buildings/`),
      showToastOnSuccess: false,
      showToastOnError: false,
    });

export const createBuilding = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.post(`buildings/`, payload),
    successCode: 201,
  });

export const deleteDharmshalaInfo = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.delete(`buildings/${payload}`),
  });

export const getDharmshalaInfoDetail = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.get(`buildings/${payload}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const updateDharmshalaInfo = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) =>
      axios.put(`buildings/${payload.buildingId}`, payload),
  });

  //Roomtypes 

export const createRoomType = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.post(`roomTypes/`, payload),
    successCode: 201,
  });

export const getRoomTypeList = () =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.get(`roomTypes/`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const deleteRoomTypeInfo = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.delete(`roomTypes/${payload}`),
  });
export const updateRoomTypeInfo = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) =>
      axios.put(`roomTypes/${payload.roomTypeId}`, payload),
  });

export const getRoomTypeDetail = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.get(`roomTypes/${payload}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

  //Floors
  
export const getDharmshalaFloorList = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.get(`buildings/${payload}/floors`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const createDharmshalaFloor = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.post(`floors/`, payload),
    successCode: 201,
  });

export const deleteDharmshalaFloor = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.delete(`floors/${payload}`),
  });

export const getFloorDetail = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.get(`floors/${payload}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const updateFloor = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => 
      axios.put(`floors/${payload.floorId}`, payload),
  });

//Housekeeping

export const createHousekeepingTask = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.post(`housekeeping`, payload),
    successCode: 201,
  });

export const getHousekeepingTask = (taskId) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.get(`housekeeping/${taskId}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const updateHousekeepingTask = (taskId, payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.put(`housekeeping/${taskId}`, payload),
  });

export const deleteHousekeepingTask = (taskId) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.delete(`housekeeping/${taskId}`),
  });

  //Rooms

  export const getRoomDetail = (roomId) =>
    callDharmshalaApi({
      requestFunction: (axios) => axios.get(`rooms/${roomId}`),
      showToastOnSuccess: false,
      showToastOnError: false,
    });
  
  export const updateRoom = (payload) =>
    callDharmshalaApi({
      requestFunction: (axios) => axios.put(`rooms/${payload.roomId}`, payload),
    });
  
  export const deleteRoom = (roomId) =>
    callDharmshalaApi({
      requestFunction: (axios) => axios.delete(`rooms/${roomId}`),
    });
  
  export const getAllRooms = () =>
    callDharmshalaApi({
      requestFunction: (axios) => axios.get(`rooms/`),
      showToastOnSuccess: false,
      showToastOnError: false,
    });

  export const getAllRoomsByFloorId = (floorId) =>
    callDharmshalaApi({
      requestFunction: (axios) => axios.get(`rooms/?floorId=${floorId}`),
      showToastOnSuccess: false,
      showToastOnError: false,
    });

  export const getAllRoomsByBuildingId = (buildingId) =>
    callDharmshalaApi({
      requestFunction: (axios) => axios.get(`rooms/?floorId=${buildingId}`),
      showToastOnSuccess: false,
      showToastOnError: false,
    });
  
  export const createRoom = (payload) =>
    callDharmshalaApi({
      requestFunction: (axios) => axios.post(`rooms`, payload),
      successCode: 201,
    });

    //Bookings

export const createDharmshalaBooking = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.post(`bookings`, payload),
    successCode: 201,
  });

export const calculateBookingTotalPayment = (bookingId) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.get(`bookings/${bookingId}/total-payment`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const changeBookingRoom = (bookingId, roomId) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.put(`bookings/${bookingId}/change-room`, { roomId }),
  });

export const deleteDharmshalaBooking = (bookingId) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.delete(`bookings/${bookingId}`),
  });

export const updateDharmshalaBooking = (payload) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.put(`bookings/${payload.bookingId}`, payload),
  });

export const checkoutBooking = (bookingId) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.put(`bookings/${bookingId}/checkout`),
  });

export const getDharmshalaBookingDetail = (bookingId) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.get(`bookings/${bookingId}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const processBookingPayment = (bookingId, paymentData) =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.post(`bookings/${bookingId}`, paymentData),
  });

export const getDharmshalaBookingList = () =>
  callDharmshalaApi({
    requestFunction: (axios) => axios.get(`bookings/` ),
    showToastOnSuccess: false,
    showToastOnError: false,
  });


  //Feedback

  export const createFeedback = (payload) =>
    callDharmshalaApi({
      requestFunction: (axios) => axios.post(`feedback`, payload),
      successCode: 201, 
    });
  
  export const getAllFeedback = (payload) => 
    callDharmshalaApi({
      requestFunction: (axios) => axios.get(`feedback`, payload),
      showToastOnSuccess: false,
      showToastOnError: false,
    });
  
  export const getFeedback = (feedbackId) =>
    callDharmshalaApi({
      requestFunction: (axios) => axios.get(`feedback/${feedbackId}`),
      showToastOnSuccess: false,
      showToastOnError: false,
    });
  
  export const updateFeedback = (feedbackId, payload) =>
    callDharmshalaApi({
      requestFunction: (axios) => axios.put(`feedback/${feedbackId}`, payload),
    });
  
  export const deleteFeedback = (feedbackId) =>
    callDharmshalaApi({
      requestFunction: (axios) => axios.delete(`feedback/${feedbackId}`),
    });
  
    //Dharmshalas

    export const findAvailableRooms = (dharmshalaId, payload) =>
      callDharmshalaApi({
        requestFunction: (axios) => axios.post(`dharmshalas/${dharmshalaId}/find-available-rooms`, payload),
        showToastOnSuccess: false,
        showToastOnError: false,
      });
    
    export const createDharmshala = (payload) =>
      callDharmshalaApi({
        requestFunction: (axios) => axios.post(`dharmshalas`, payload),
        successCode: 201, 
      });
    
    export const getAllDharmshalas = (payload) => 
      callDharmshalaApi({
        requestFunction: (axios) => axios.get(`dharmshalas/`, payload),
        showToastOnSuccess: false,
        showToastOnError: false,
      });

    
    export const getDharmshala = (dharmshalaId) =>
      callDharmshalaApi({
        requestFunction: (axios) => axios.get(`dharmshalas/${dharmshalaId}`),
        showToastOnSuccess: false,
        showToastOnError: false,
      });
    
    export const updateDharmshala = (dharmshalaId, payload) =>
      callDharmshalaApi({
        requestFunction: (axios) => axios.put(`dharmshalas/${dharmshalaId}`, payload),
      });
    
    export const deleteDharmshala = (dharmshalaId) =>
      callDharmshalaApi({
        requestFunction: (axios) => axios.delete(`dharmshalas/${dharmshalaId}`),
      });
