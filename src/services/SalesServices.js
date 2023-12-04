import { genRequest } from "./Requests";

const salesServices = {};

salesServices.details = {};
salesServices.payments = {};

salesServices.find = () => genRequest(`get`, `/sales`, {});

salesServices.findById = (saleId) => genRequest(`get`, `/sales/byId/${saleId || 0}`, {}, '', '', 'No se pudo obtener información general de la orden', 'Error desconocido');

salesServices.findByLocationCurrentActiveShiftcut = (locationId) => genRequest(`get`, `/sales/active-shiftcut/location/${locationId || 0}`, {});

salesServices.findByMyCashier = (cashierId) => 
  genRequest(
    `get`,
    `/sales/my-cashier/${cashierId || 0}`,
    {},
    '',
    '',
    'No se pudo obtener la información de las órdenes de su caja',
    'Error desconocido'
  );

salesServices.findPendings = () => genRequest(`get`, `/sales/pendings`, {});

salesServices.findPendingsByLocation = (locationId) => 
  genRequest(`get`, `/sales/pendings/by-location/${locationId}`, {});

salesServices.findPendingAmountToPay = (saleId) => genRequest(`get`, `/sales/pending-amount-to-pay/${saleId || 0}`, {});

salesServices.add = (
  locationId,
  customerId,
  documentTypeId,
  paymentTypeId,
  docType,
  docDatetime,
  docNumber,
  total,
  cashierId,
  IVAretention,
  IVAperception,
  expirationDays,
  userPINCode
) => 
  genRequest(
    `post`,
    `/sales`,
    {
      locationId,
      customerId,
      documentTypeId,
      paymentTypeId,
      docType,
      docDatetime,
      docNumber,
      total,
      cashierId,
      IVAretention,
      IVAperception,
      expirationDays,
      userPINCode
    },
    'Datos generales guardados',
    '',
    'La información general de la venta no se pudo guardar',
    'Error desconocido'
  );
  
salesServices.validateDocNumber = (documentType, docNumber, cashierId) => 
  genRequest(
    `post`,
    `/sales/validate`,
    { documentType, docNumber, cashierId },
    '',
    '',
    'No se pudo validar el número de documento para esta caja',
    'Error desconocido'
  );

salesServices.voidSale = (userId, saleId) => 
  genRequest(`post`, `/sales/void`, { userId, saleId });

salesServices.update = (locationId, customerId, docType, docDatetime, docNumber, total, saleId) => 
  genRequest(`put`, `/sales`, { locationId, customerId, docType, docDatetime, docNumber, total, saleId });

salesServices.remove = (saleId) => 
  genRequest(`delete`, `/sales/${saleId}`);

// PRODUCTION DETAILS

salesServices.details.findBySaleId = (saleId) => 
  genRequest(`get`, `/sales/details/${saleId}`, {}, '', '', 'No se pudo obtener información del detalle de ventas', 'Error desconocido');

// EXPECTED req.body => details = [[saleId, productId, unitPrice, quantity], [...]]
salesServices.details.add = (bulkData) => 
  genRequest(`post`, `/sales/details`, { bulkData }, 'Detalle de venta guardados', '', 'El detalle de la venta no fue añadido', 'Error desconocido');

salesServices.details.update = ( saleId, productId, unitPrice, quantity, saleDetailId ) => 
  genRequest(`put`, `/sales/details`, {  saleId, productId, unitPrice, quantity, saleDetailId });

salesServices.details.remove = (saleDetailId) => 
  genRequest(`delete`, `/sales/details/${saleDetailId}`);

salesServices.payments.add = (locationId, cashierId, saleId, paymentAmount) => 
  genRequest(`post`, `/sales/payments/new-single-payment`, { locationId, cashierId, saleId, paymentAmount });
  
export default salesServices;
