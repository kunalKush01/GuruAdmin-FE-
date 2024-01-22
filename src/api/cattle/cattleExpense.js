import { callApi } from "../../utility/utils/callApi";

export const getCattlesExpenseList = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`item-expense`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const createCattleExpenses = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`item-expense/create`, payload),
    successCode: 200,
  });

export const findAllItemId = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`item/find-item-id`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });

export const findAllExpenseName = (payload) =>
  callApi({
    requestFunction: (axios) => axios.post(`item/find-item-name`, payload),
    showToastOnSuccess: false,
    showToastOnError: false,
  });
