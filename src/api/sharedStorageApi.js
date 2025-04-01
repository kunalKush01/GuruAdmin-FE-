import axios from "axios";
import { selectAccessToken } from "../redux/authSlice";
import { store } from "../redux/store";

const REACT_APP_BASEURL_PUBLIC = process.env.REACT_APP_BASEURL_PUBLIC;
const REACT_APP_BASEURL = process.env.REACT_APP_BASEURL;

const trustId = localStorage.getItem("trustId");
const accessToken = selectAccessToken(store.getState());
const headers = {
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "multipart/form-data", // Important for file uploads
};
export const uploadFile = async (payload, isMultiple) => {
  try {
    //  const endpoint = isMultiple ? 'storage/upload/multiple' : 'storage/upload'
    const endpoint = "storage/upload";
    const response = await axios.post(
      `${REACT_APP_BASEURL}${trustId}/${endpoint}`,
      payload,
      { headers }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteFile = async (filepath, payload) => {
  try {
    const response = await axios.delete(
      `${REACT_APP_BASEURL}storage/delete/${filepath}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const downloadFile = async (filepath, params) => {
  try {
    const response = await axios.get(
      `${REACT_APP_BASEURL_PUBLIC}storage/download/${filepath}`,
      {
        responseType: "blob",
        params,
        headers
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};
