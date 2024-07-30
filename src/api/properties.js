// src/api/properties.js

import {getAllRooms,getRoomTypeList} from "../api/dharmshala/dharmshalaInfo";

export const fetchProperties = async () => {
  try {
    const response = await getAllRooms();
    return {
      properties: response.results,
      totalCount: response.results.length,
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return {
      properties: [],
      totalCount: 0,
    };
  }
};

export const fetchPropertyTypes = async () => {
  try {
    const response = await getRoomTypeList();
    const types = Array.isArray(response.results) ? response.results.map(type => type.name) : [];
    return types;
  } catch (error) {
    console.error('Error fetching property types:', error);
    return [];
  }
};