import { genRequest } from "./Requests";

const reportsServices = {};

reportsServices.kardexByProduct = (locationId, productId, startDate, endDate) => 
  genRequest(`get`, `/reports/kardex/by-product/${locationId}/${productId}/${startDate}/${endDate}`, {});

reportsServices.getLocationProductsByCategory = (locationId) => 
  genRequest(`get`, `/reports/get-product-by-cat/${locationId}`, {}, '', '', '', '', 'application/pdf', 'blob');

reportsServices.getLocationProductsByBrand = (locationId) => 
genRequest(`get`, `/reports/get-product-by-brand/${locationId}`, {}, '', '', '', '', 'application/pdf', 'blob');

reportsServices.shiftcutSettlement = (shiftcutId) => 
  genRequest(
    `get`,
    `/reports/shiftcut-settlement/${shiftcutId}`,
    {},
    '',
    '',
    '',
    '',
    'application/pdf',
    'blob'
  );

reportsServices.getLocationProductsByFilteredData = (filteredData) => 
  genRequest(`post`, `/reports/get-product-by-filtered-data`, { productsData: filteredData }, '', '', '', '', 'application/json', 'blob');


export default reportsServices;
