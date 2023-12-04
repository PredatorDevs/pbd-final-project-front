import { genRequest } from "./Requests";

const policiesServices = {};

policiesServices.find = () => genRequest(`get`, `/policies`, {});
policiesServices.findById = (policyId) => genRequest(`get`, `/policies/${policyId}`, {});

policiesServices.add = (locationId, docNumber, docDatetime, supplier, transactionValue, transportationCost, insuranceCost, customTotalValue, incoterm, exchangeRate, createdBy) => 
  genRequest(`post`, `/policies`, { locationId, docNumber, docDatetime, supplier, transactionValue, transportationCost, insuranceCost, customTotalValue, incoterm, exchangeRate, createdBy });

policiesServices.voidPolicy = (voidedBy, policyId) => 
  genRequest(`post`, `/policies/void`, { voidedBy, policyId });

policiesServices.update = (locationId, shiftcutId, docNumber, docDatetime, supplier, transactionValue, transportationCost, insuranceCost, customTotalValue, incoterm, exchangeRate, policyId) => 
  genRequest(`put`, `/policies`, { locationId, shiftcutId, docNumber, docDatetime, supplier, transactionValue, transportationCost, insuranceCost, customTotalValue, incoterm, exchangeRate, policyId });

policiesServices.remove = (policyId) => 
  genRequest(`delete`, `/policies/${policyId}`);

policiesServices.details = {};

policiesServices.details.find = () => genRequest(`get`, `/policies/details`, {});
policiesServices.details.findByPolicyId = (policyId) => genRequest(`get`, `/policies/details/${policyId}`, {});

policiesServices.details.add = (policyId, productId, measurementUnitId, quantity, unitCost) => 
  genRequest(`post`, `/policies/details`, { policyId, productId, measurementUnitId, quantity, unitCost });

policiesServices.details.update = (policyId, productId, measurementUnitId, quantity, unitCost, policyDetailId) => 
  genRequest(`put`, `/policies/details`, { policyId, productId, measurementUnitId, quantity, unitCost, policyDetailId });

policiesServices.remove = (policyDetailId) => 
  genRequest(`delete`, `/policies/details/${policyDetailId}`);

export default policiesServices;
