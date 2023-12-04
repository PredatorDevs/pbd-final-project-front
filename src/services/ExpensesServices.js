import { genRequest } from "./Requests";

const expensesServices = {};

expensesServices.find = () => 
  genRequest(
    `get`,
    `/expenses`,
    {},
    '',
    '',
    '',
    ''
  );

expensesServices.findTypes = () => genRequest(`get`, `/expenses/types`, {});
expensesServices.findById = (expenseId) => genRequest(`get`, `/expenses/${expenseId}`, {});
expensesServices.getAttachmentsById = (expenseId) => genRequest(`get`, `/expenses/get-attachments/${expenseId}`, {});

expensesServices.add = async (locationId, expenseTypeId, paymentMethodId, docNumber, docDatetime, accountCode, concept, description, amount, createdBy, fileAttachment) => {
  const formData = new FormData();
    
  formData.append('locationId', locationId);
  formData.append('expenseTypeId', expenseTypeId);
  formData.append('paymentMethodId', paymentMethodId);
  formData.append('docNumber', docNumber);
  formData.append('docDatetime', docDatetime);
  formData.append('accountCode', accountCode);
  formData.append('concept', concept);
  formData.append('description', description);
  formData.append('amount', amount);
  formData.append('createdBy', createdBy);
  formData.append('fileAttachment', fileAttachment);

  await genRequest(`post-multipart`, `/expenses`, formData);
}

expensesServices.update = (locationId, shiftcutId, expenseTypeId, paymentMethodId, docNumber, docDatetime, accountCode, concept, description, amount, createdBy, expenseId) => 
  genRequest(`put`, `/expenses`, { locationId, shiftcutId, expenseTypeId, paymentMethodId, docNumber, docDatetime, accountCode, concept, description, amount, createdBy, expenseId });

expensesServices.voidById = (userId, expenseId) => 
  genRequest(`put`, `/expenses/void`, { voidedBy: userId, expenseId });

expensesServices.remove = (expenseId) => 
  genRequest(`delete`, `/expenses/${expenseId}`);

export default expensesServices;
