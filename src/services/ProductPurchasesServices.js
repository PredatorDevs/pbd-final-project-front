import { genRequest } from "./Requests";

const productPurchasesServices = {};

productPurchasesServices.details = {};
productPurchasesServices.payments = {};

productPurchasesServices.find = () => genRequest(`get`, `/product-purchases`, {});

productPurchasesServices.findById = (productPurchaseId) => 
  genRequest(
    `get`,
    `/product-purchases/byId/${productPurchaseId || 0}`,
    {},
    '',
    '',
    'No se han podido obtener la información de esta compra',
    'Error desconocido'
  );

productPurchasesServices.findByLocationCurrentActiveShiftcut = (locationId) => 
  genRequest(
    `get`,
    `/product-purchases/active-shiftcut/location/${locationId || 0}`,
    {},
    '',
    '',
    'No se han podido obtener las compras',
    'Error desconocido'
  );
 
productPurchasesServices.findPendings = () => genRequest(`get`, `/product-purchases/pendings`, {});

productPurchasesServices.findPendingsByLocation = (locationId) => 
  genRequest(`get`, `/product-purchases/pendings/by-location/${locationId}`, {});

productPurchasesServices.findPendingAmountToPay = (saleId) =>
  genRequest(`get`, `/product-purchases/pending-amount-to-pay/${saleId || 0}`, {}, '', '', 'No se pudo obtener el mongo a pagar', 'Error desconocido');

/*
  prmt_location 
  prmt_supplierid
  prmt_documenttype
  prmt_paymenttype
  prmt_paymentmethod
  prmt_docdatetime
  prmt_docnumber
  prmt_total
  prmt_registeredby
  prmt_IVAretention
  prmt_IVAperception
*/

productPurchasesServices.add = (
  locationId,
  supplierId,
  documentTypeId,
  paymentTypeId,
  paymentMethodId,
  docDatetime,
  docNumber,
  total,
  IVAretention,
  IVAperception
) => 
  genRequest(`post`, `/product-purchases`, {
    locationId,
    supplierId,
    documentTypeId,
    paymentTypeId,
    paymentMethodId,
    docDatetime,
    docNumber,
    total,
    IVAretention,
    IVAperception
  });
 
productPurchasesServices.voidProductPurchase = (userId, productPurchaseId) => 
  genRequest(`post`, `/product-purchases/void`, { userId, productPurchaseId });

// PRODUCTION DETAILS

productPurchasesServices.details.findByProductPurchaseId = (productPurchaseId) => 
  genRequest(`get`, `/product-purchases/details/${productPurchaseId}`, {});

// EXPECTED req.body => details = [[productPurchaseId, productId, unitCost, quantity], [...]]
productPurchasesServices.details.add = (bulkData) => 
  genRequest(`post`, `/product-purchases/details`, { bulkData });

productPurchasesServices.payments.add = (locationId, cashierId, productPurchaseId, paymentAmount) => 
  genRequest(`post`, `/product-purchases/payments/new-single-payment`, { locationId, cashierId, productPurchaseId, paymentAmount });
  
export default productPurchasesServices;
