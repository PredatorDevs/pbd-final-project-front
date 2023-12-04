import { genRequest } from "./Requests";

const rawMaterialPurchasesServices = {};

rawMaterialPurchasesServices.details = {};

rawMaterialPurchasesServices.find = () => genRequest(`get`, `/rawmaterialspurchases`, {});

rawMaterialPurchasesServices.findResume = () => genRequest(`get`, `/rawmaterialspurchases/resume`, {});

rawMaterialPurchasesServices.findRecents = () => genRequest(`get`, `/rawmaterialspurchases/recents`, {});

rawMaterialPurchasesServices.findById = (rawMaterialPurchaseId) => 
  genRequest(`get`, `/rawmaterialspurchases/${rawMaterialPurchaseId}`, {});

rawMaterialPurchasesServices.add = (locationId, supplierId, docDatetime, docNumber, total) => 
  genRequest(`post`, `/rawmaterialspurchases`, { locationId, supplierId, docDatetime, docNumber, total });

rawMaterialPurchasesServices.update = (supplierId, docDatetime, docNumber, total, rawMaterialPurchaseId) => 
  genRequest(`put`, `/rawmaterialspurchases`, { supplierId, docDatetime, docNumber, total, rawMaterialPurchaseId });

rawMaterialPurchasesServices.remove = (rawMaterialPurchaseId) => 
  genRequest(`delete`, `/rawmaterialspurchases/${rawMaterialPurchaseId}`);

// PRODUCTION DETAILS

rawMaterialPurchasesServices.details.findByRawMaterialPurchaseId = (rawMaterialPurchaseId) => 
  genRequest(`get`, `/rawmaterialspurchases/details/${rawMaterialPurchaseId}`, {});

// EXPECTED req.body => details = [[rawMaterialPurchaseId, rawMaterialId, unitCost, quantity], [...]]
rawMaterialPurchasesServices.details.add = (bulkData) => 
  genRequest(`post`, `/rawmaterialspurchases/details`, { bulkData });

rawMaterialPurchasesServices.details.update = ( rawMaterialPurchaseId, rawMaterialId, unitCost, quantity, rawMaterialPurchaseDetailId ) => 
  genRequest(`put`, `/rawmaterialspurchases/details`, {  rawMaterialPurchaseId, rawMaterialId, unitCost, quantity, rawMaterialPurchaseDetailId });

rawMaterialPurchasesServices.details.remove = (rawMaterialPurchaseDetailId) => 
  genRequest(`delete`, `/rawmaterialspurchases/details/${rawMaterialPurchaseDetailId}`);
  
export default rawMaterialPurchasesServices;
