import { API_BASE_URL } from "../axiosApi/authApiInstans";
import { callApi } from "../utility/utils/callApi";

export const createExpense = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}expense/create`, payload),
    successCode: 200,
  });

export const getAllMasterCategories = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}donation-category/list-master`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

  export const getAllExpensesLogs = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}expense/logs`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
  export const getAllSubCategories = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}donation-category`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
export const getEventDates = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.get(`${API_BASE_URL}event/get-dates`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const getAllExpense = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}expense`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

  export const ExportAllExpense = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`${API_BASE_URL}expense`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

  export const ExportExpenseReport = (payload) =>
    callApi({
      requestFunction: (axios) =>
        axios.post(`${API_BASE_URL}expense/generate-report`, payload),
      showToastOnSuccess: true,
      successMessage: "Expense report request submitted successfully!",
      showToastOnError: true,
    });

    export const ExportDonationReport = (payload) =>
      callApi({
        requestFunction: (axios) =>
          axios.post(`${API_BASE_URL}donation/generate-report`, payload),
        showToastOnSuccess: true,
        successMessage: "Donation report request submitted successfully!",
        showToastOnError: true,
      });

      export const ExportPledgeReport = (payload) =>
        callApi({
          requestFunction: (axios) =>
            axios.post(`${API_BASE_URL}commitment/generate-report`, payload),
          showToastOnSuccess: true,
          successMessage: "Pledge report request submitted successfully!",
          showToastOnError: true,
        });
        export const ExportDonationBoxReport = (payload) =>
          callApi({
            requestFunction: (axios) =>
              axios.post(`${API_BASE_URL}donation-box/generate-report`, payload),
            showToastOnSuccess: true,
            successMessage: "Donation-Box report request submitted successfully!",
            showToastOnError: true,
          });  
  

export const getExpensesDetail = (payload) =>
  callApi({
    requestFunction: (axios) => axios.get(`${API_BASE_URL}expense/${payload}`),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const updateExpensesDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.put(`${API_BASE_URL}expense/update`, payload),
  });

export const addLangCategoryDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.post(`${API_BASE_URL}donation-category/add-language`, payload),
  });

export const deleteExpensesDetail = (payload) =>
  callApi({
    requestFunction: (axios) =>
      axios.delete(`${API_BASE_URL}expense/delete/${payload}`),
  });
