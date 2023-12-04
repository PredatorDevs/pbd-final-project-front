import { genRequest } from "./Requests";

const productionsServices = {};

productionsServices.details = {};

productionsServices.find = () => genRequest(`get`, `/productions`, {});

productionsServices.findById = (productionId) => genRequest(`get`, `/productions/${productionId}`, {});

productionsServices.findByLocationCurrentActiveShiftcut = (locationId) => genRequest(`get`, `/productions/active-shiftcut/location/${locationId || 0}`, {});

productionsServices.findRecents = () => genRequest(`get`, `/productions/recents`, {});

productionsServices.findByRangeDate = (initialDate, finalDate) => genRequest(`get`, `/productions/by-range-date/${initialDate}/${finalDate}`, {});

productionsServices.findByLocationRangeDate = (locationId, initialDate, finalDate) => 
  genRequest(`get`, `/productions/by-location/${locationId}/by-range-date/${initialDate}/${finalDate}`, {});

productionsServices.getAttachmentsById = (productionId) => genRequest(`get`, `/productions/get-attachments/${productionId}`, {});

productionsServices.summaryByShiftcut = (shiftcutId) => genRequest(`get`, `/productions/summary/${shiftcutId}`, {});

productionsServices.add = async (locationId, docDatetime, docNumber, fileAttachment, bulkData) => {
  const formData = new FormData();

  formData.append('locationId', locationId);
  formData.append('docDatetime', docDatetime);
  formData.append('docNumber', docNumber);
  formData.append('fileAttachment', fileAttachment);
  formData.append('bulkProductionDetailData', JSON.stringify(bulkData));

  await genRequest(`post`, `/productions`, formData);
}

productionsServices.voidProduction = (userId, productionId) => 
  genRequest(`post`, `/productions/void`, { userId, productionId });

productionsServices.update = (docDatetime, docNumber, productionId) => 
  genRequest(`put`, `/productions`, { docDatetime, docNumber, productionId });

productionsServices.remove = (productionId) => 
  genRequest(`delete`, `/productions/${productionId}`);

// PRODUCTION DETAILS

productionsServices.details.findByProductionId = (productionId) => 
  genRequest(`get`, `/productions/details/${productionId}`, {});

// EXPECTED req.body => details = [[productionId, productId, quantity], [...]]
productionsServices.details.add = (bulkData) => 
  genRequest(`post`, `/productions/details`, { bulkData });

productionsServices.details.update = ( productionId, productId, quantity, productionDetailId ) => 
  genRequest(`put`, `/productions/details`, {  productionId, productId, quantity, productionDetailId });

productionsServices.details.remove = (productionDetailId) => 
  genRequest(`delete`, `/productions/details/${productionDetailId}`);
  
export default productionsServices;
