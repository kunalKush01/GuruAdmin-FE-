import { toast } from "react-toastify";

export const extractDataFromResponse = ({
  response,
  successCode = 200,
  successStatus = true,
  showSuccessToast = true,
  showErrorToast = true,
}) => {
  const data = response?.data?.data ?? {};

  console.log(response);

  if (
    response.status === successCode &&
    response.data.status &&
    response.data.code === successCode
  ) {
    if (showSuccessToast) {
      toast.success(response.data.message);
    }
    data.error = false;
    return data;
  }
  if (showErrorToast) {
    toast.error(response.data.message);
  }
  data.error = true;
  return data;
};

export const parseApiErrorResponse = ({ error, showToast = true }) => {
  if (error.response) {
    const response = error.response;
    const data = response?.data?.data ?? {};
    data.error = true;
    if (showToast) {
      toast.error(response.data.message);
    }
    return data;
  }
  if (showToast) {
    toast.error("Something went wrong, Please try again later.");
  }
  return { error: true };
};
