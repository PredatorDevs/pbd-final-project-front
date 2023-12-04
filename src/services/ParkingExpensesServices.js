import { genRequest } from "./Requests";

const parkingExpensesServices = {};

parkingExpensesServices.find = () => genRequest(`get`, `/parking-expenses`, {});

parkingExpensesServices.findTypes = () => genRequest(`get`, `/parking-expenses/types`, {});

parkingExpensesServices.findById = (parkingExpenseId) => genRequest(`get`, `/parking-expenses/${parkingExpenseId}`, {});

parkingExpensesServices.add = async (
  expenseTypeId,
  paymentMethodId,
  documentNumber,
  documentDatetime,
  accountCode,
  concept,
  description,
  amount,
  createdBy
) => 
  genRequest(`post`, `/parking-expenses`, {
    expenseTypeId,
    paymentMethodId,
    documentNumber,
    documentDatetime,
    accountCode,
    concept,
    description,
    amount,
    createdBy
  });

parkingExpensesServices.update = (
  expenseTypeId,
  paymentMethodId,
  documentNumber,
  documentDatetime,
  accountCode,
  concept,
  description,
  amount,
  createdBy,
  parkingExpenseId
) => 
  genRequest(`put`, `/parking-expenses`, {
    expenseTypeId,
    paymentMethodId,
    documentNumber,
    documentDatetime,
    accountCode,
    concept,
    description,
    amount,
    createdBy,
    parkingExpenseId
  });
  
parkingExpensesServices.remove = (parkingExpenseId) => 
    genRequest(`delete`, `/parking-expenses/${parkingExpenseId}`);

parkingExpensesServices.voidById = (userId, parkingExpenseId) => 
  genRequest(`put`, `/parking-expenses/void`, { voidedBy: userId, parkingExpenseId });

export default parkingExpensesServices;
