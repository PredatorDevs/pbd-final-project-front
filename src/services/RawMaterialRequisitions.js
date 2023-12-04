import { genRequest } from "./Requests";

const rawMaterialRequisitionsServices = {};

rawMaterialRequisitionsServices.details = {};

rawMaterialRequisitionsServices.find = () => genRequest(`get`, `/rawmaterialsrequisitions`, {});
rawMaterialRequisitionsServices.findRecents = () => genRequest(`get`, `/rawmaterialsrequisitions/recents`, {});

rawMaterialRequisitionsServices.findById = 
  (rawMaterialRequisitionId) => genRequest(`get`, `/rawmaterialsrequisitions/${rawMaterialRequisitionId}`, {});

rawMaterialRequisitionsServices.findByLocationCurrentActiveShiftcut = 
  (locationId) => genRequest(`get`, `/rawmaterialsrequisitions/active-shiftcut/location/${locationId || 0}`, {});

rawMaterialRequisitionsServices.findByRangeDate = 
  (initialDate, finalDate) => genRequest(`get`, `/rawmaterialsrequisitions/by-range-date/${initialDate}/${finalDate}`, {});

rawMaterialRequisitionsServices.findByLocationRangeDate = 
  (locationId, initialDate, finalDate) => genRequest(`get`, `/rawmaterialsrequisitions/by-location/${locationId}/by-range-date/${initialDate}/${finalDate}`, {});

rawMaterialRequisitionsServices.add = (locationId, registeredBy, givenBy, receivedBy, docDatetime) => 
  genRequest(`post`, `/rawmaterialsrequisitions`, { locationId, registeredBy, givenBy, receivedBy, docDatetime });

rawMaterialRequisitionsServices.update = (docDatetime, docNumber, registeredBy, givenBy, receivedBy, rawMaterialRequisitionId) => 
  genRequest(`put`, `/rawmaterialsrequisitions`, { docDatetime, docNumber, registeredBy, givenBy, receivedBy, rawMaterialRequisitionId });

rawMaterialRequisitionsServices.remove = (rawMaterialRequisitionId) => 
  genRequest(`delete`, `/rawmaterialsrequisitions/${rawMaterialRequisitionId}`);

// PRODUCTION DETAILS

rawMaterialRequisitionsServices.details.findByRawMaterialRequisitionId = (rawMaterialRequisitionId) => 
  genRequest(`get`, `/rawmaterialsrequisitions/details/${rawMaterialRequisitionId}`, {});

// EXPECTED req.body => details = [[rawMaterialRequisitionId, rawMaterialId, quantity], [...]]
rawMaterialRequisitionsServices.details.add = (bulkData) => 
  genRequest(`post`, `/rawmaterialsrequisitions/details`, { bulkData });

rawMaterialRequisitionsServices.details.update = ( rawMaterialRequisitionId, rawMaterialId, quantity, rawMaterialRequisitionDetailId ) => 
  genRequest(`put`, `/rawmaterialsrequisitions/details`, { rawMaterialRequisitionId, rawMaterialId, quantity, rawMaterialRequisitionDetailId });

rawMaterialRequisitionsServices.details.remove = (rawMaterialRequisitionDetailId) => 
  genRequest(`delete`, `/rawmaterialsrequisitions/details/${rawMaterialRequisitionDetailId}`);
  
export default rawMaterialRequisitionsServices;
