// src/api/properties.js

const properties = [
  { id: 1, roomNumber: "Room #1", location: "Location 1", description: "Description 1", roomType: "Deluxe Room" },
  { id: 2, roomNumber: "Room #2", location: "Location 2", description: "Description 2", roomType: "Luxury Room" },
  { id: 3, roomNumber: "Room #3", location: "Location 3", description: "Description 3", roomType: "Premium Room" },
  { id: 4, roomNumber: "Room #4", location: "Location 4", description: "Description 4", roomType: "Standard Room" },
  { id: 5, roomNumber: "Room #5", location: "Location 5", description: "Description 5", roomType: "Deluxe Room" },
  { id: 6, roomNumber: "Room #6", location: "Location 6", description: "Description 6", roomType: "Luxury Room" },
  { id: 7, roomNumber: "Room #7", location: "Location 7", description: "Description 7", roomType: "Premium Room" },
  { id: 8, roomNumber: "Room #8", location: "Location 8", description: "Description 8", roomType: "Standard Room" },
  { id: 9, roomNumber: "Room #9", location: "Location 9", description: "Description 9", roomType: "Deluxe Room" },
  { id: 10, roomNumber: "Room #10", location: "Location 10", description: "Description 10", roomType: "Luxury Room" },
  { id: 11, roomNumber: "Room #11", location: "Location 11", description: "Description 11", roomType: "Premium Room" },
  { id: 12, roomNumber: "Room #12", location: "Location 12", description: "Description 12", roomType: "Standard Room" },
  { id: 13, roomNumber: "Room #13", location: "Location 13", description: "Description 13", roomType: "Deluxe Room" },
  { id: 14, roomNumber: "Room #14", location: "Location 14", description: "Description 14", roomType: "Luxury Room" },
  { id: 15, roomNumber: "Room #15", location: "Location 15", description: "Description 15", roomType: "Premium Room" },
  { id: 16, roomNumber: "Room #16", location: "Location 16", description: "Description 16", roomType: "Standard Room" },
  { id: 17, roomNumber: "Room #17", location: "Location 17", description: "Description 17", roomType: "Deluxe Room" },
  { id: 18, roomNumber: "Room #18", location: "Location 18", description: "Description 18", roomType: "Luxury Room" },
  { id: 19, roomNumber: "Room #19", location: "Location 19", description: "Description 19", roomType: "Premium Room" },
  { id: 20, roomNumber: "Room #20", location: "Location 20", description: "Description 20", roomType: "Standard Room" },
  { id: 21, roomNumber: "Room #21", location: "Location 21", description: "Description 21", roomType: "Deluxe Room" },
  { id: 22, roomNumber: "Room #22", location: "Location 22", description: "Description 22", roomType: "Luxury Room" },
  { id: 23, roomNumber: "Room #23", location: "Location 23", description: "Description 23", roomType: "Premium Room" },
  { id: 24, roomNumber: "Room #24", location: "Location 24", description: "Description 24", roomType: "Standard Room" },
];

const propertyTypes = [
  "Deluxe Room",
  "Luxury Room",
  "Premium Room",
  "Standard Room"
];
  
  export const fetchProperties = () => {
    return Promise.resolve({
      properties: properties,
      totalCount: properties.length
    });
  };

  export const fetchPropertyTypes = () => {
    return Promise.resolve(propertyTypes);
  };
  