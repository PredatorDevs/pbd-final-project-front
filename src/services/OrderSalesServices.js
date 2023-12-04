import { genRequest } from "./Requests";

const orderSalesServices = {};

orderSalesServices.details = {};

orderSalesServices.find = () => genRequest(`get`, `/ordersales`, {});
orderSalesServices.findById = (orderSaleId) => genRequest(`get`, `/ordersales/byId/${orderSaleId || 0}`, {});

orderSalesServices.findByLocationCurrentActiveShiftcut = (locationId) => genRequest(`get`, `/ordersales/active-shiftcut/location/${locationId || 0}`, {});

orderSalesServices.findByRangeDate = (initialDate, finalDate) => genRequest(`get`, `/ordersales/by-range-date/${initialDate}/${finalDate}`, {});

orderSalesServices.findByLocationRangeDate = (locationId, initialDate, finalDate) => 
  genRequest(`get`, `/ordersales/by-location/${locationId}/by-range-date/${initialDate}/${finalDate}`, {});

orderSalesServices.findSettlementByRangeDate = (initialDate, finalDate) => genRequest(`get`, `/ordersales/settlement-by-range-date/${initialDate}/${finalDate}`, {});

orderSalesServices.findSettlementByLocationRangeDate = (locationId, initialDate, finalDate) => 
  genRequest(`get`, `/ordersales/settlement/by-location/${locationId}/by-range-date/${initialDate}/${finalDate}`, {});

orderSalesServices.findRecents = () => genRequest(`get`, `/ordersales/recents`, {});

orderSalesServices.add = (locationId, customerId, docType, docDatetime, total) => 
  genRequest(`post`, `/ordersales`, { locationId, customerId, docType, docDatetime, total });

orderSalesServices.update = (locationId, customerId, docType, docDatetime, status, total, orderSaleId) => 
  genRequest(`put`, `/ordersales`, { locationId, customerId, docType, docDatetime, status, total, orderSaleId });
  
orderSalesServices.setStatus = (status, orderSaleId) => 
  genRequest(`put`, `/ordersales/setstatus`, { status, orderSaleId });

orderSalesServices.remove = (orderSaleId) => 
  genRequest(`delete`, `/ordersales/${orderSaleId}`);

orderSalesServices.recalculateTotal = (orderSaleId) => 
  genRequest(`put`, `/ordersales/recalculate/${orderSaleId}`);

// PRODUCTION DETAILS

orderSalesServices.details.findByOrderSaleId = (orderSaleId) => 
  genRequest(`get`, `/ordersales/details/${orderSaleId}`, {});

// EXPECTED req.body => details = [[orderSaleId, productId, unitPrice, quantity], [...]]
orderSalesServices.details.add = (bulkData) => 
  genRequest(`post`, `/ordersales/details`, { bulkData });

orderSalesServices.details.update = (orderSaleId, productId, unitPrice, quantity, orderSaleDetailId) => 
  genRequest(`put`, `/ordersales/details`, { orderSaleId, productId, unitPrice, quantity, orderSaleDetailId });

orderSalesServices.details.remove = (orderSaleDetailId) => 
  genRequest(`delete`, `/ordersales/details/${orderSaleDetailId}`);
  
export default orderSalesServices;
