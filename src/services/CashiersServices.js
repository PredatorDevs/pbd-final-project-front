import { genRequest } from "./Requests";

const cashiersServices = {};

cashiersServices.find = () => 
  genRequest(
    `get`,
    `/cashiers`,
    {},
    '',
    '',
    'No se pudo obtener la información de las cajas',
    'Error desconocido'
  );

cashiersServices.findMyCashier = (cashierId) => genRequest(`get`, `/cashiers/my-cashier/${cashierId}`, {}, '', '', 'No se pudo obtener la información de mi caja', 'Error desconocido');

cashiersServices.checkIfAbleToProcess = (cashierId) => 
  genRequest(
    `get`,
    `/cashiers/my-cashier/check-if-able-to-process/${cashierId}`,
    {},
    '',
    '',
    'No se pudo obtener la información de mi caja',
    'Error desconocido'
  );

cashiersServices.getDocumentInformation = (cashierId, documentTypeId) => 
  genRequest(
    `get`,
    `/cashiers/my-cashier/get-document-information/${cashierId}/${documentTypeId}`,
    {},
    '',
    '',
    'No se pudo obtener la información del documento de mi caja',
    'Error desconocido'
  );

cashiersServices.getDefaultInitialCashById = (cashierId) => 
  genRequest(
    `get`,
    `/cashiers/def-init-cash/${cashierId}`,
    {},
    '',
    '',
    'No se pudo obtener la información del monto inicial',
    'Error desconocido'
  );

cashiersServices.findById = (cashierId) => genRequest(`get`, `/cashiers/${cashierId}`, {});

cashiersServices.update = (
  ticketCorrelative,
  cfCorrelative,
  ccfCorrelative,
  creditNoteCorrelative,
  debitNoteCorrelative,
  receiptCorrelative,
  ticketSerie,
  cfSerie,
  ccfSerie,
  creditNoteSerie,
  debitNoteSerie,
  receiptSerie,
  defaultInitialCash,
  enableReportCashFundMovements,
  cashierId
) => 
  genRequest(
    `put`,
    `/cashiers/${cashierId}`,
    {
      ticketCorrelative,
      cfCorrelative,
      ccfCorrelative,
      creditNoteCorrelative,
      debitNoteCorrelative,
      receiptCorrelative,
      ticketSerie,
      cfSerie,
      ccfSerie,
      creditNoteSerie,
      debitNoteSerie,
      receiptSerie,
      defaultInitialCash,
      enableReportCashFundMovements
    },
    'Caja actualizada exitosamente',
    'Acción completada',
    'No se pudo actualizar la caja',
    'Algo salió mal'
  );

cashiersServices.findByLocationId = (locationId) => genRequest(`get`, `/cashiers/by-location/${locationId}`, {});

cashiersServices.canCloseShiftcut = (shiftcutId) => 
  genRequest(`get`, `/cashiers/check-close/${shiftcutId}`, {});

cashiersServices.getCurrentShiftcutReport = (shiftcutId) => 
  genRequest(`get`, `/cashiers/shiftcut-report/${shiftcutId}`, {});

cashiersServices.getCurrentShiftcutSummary = (shiftcutId) => 
  genRequest(`get`, `/cashiers/shiftcut-summary/${shiftcutId}`, {});

cashiersServices.getCurrentShiftcutPayments = (shiftcutId) => 
  genRequest(`get`, `/cashiers/shiftcut-payments/${shiftcutId}`, {});

cashiersServices.getCurrentShiftcutCashFundMovements = (shiftcutId) => 
  genRequest(`get`, `/cashiers/shiftcut-cashfund-movements/${shiftcutId}`, {});

cashiersServices.closeCurrentAndOpenNextShiftcut = (locationId, cashierId, actionBy, actionDatetime, initialAmount, finalAmount, remittedAmount, shiftcutDatetime) => 
  genRequest(`post`, `/cashiers/close-and-open-shiftcut`, { locationId, cashierId, actionBy, actionDatetime, initialAmount, finalAmount, remittedAmount, shiftcutDatetime });

cashiersServices.openCashier = (cashierId, actionBy, actionDatetime, initialAmount, userPINCode) => 
  genRequest(
    `post`,
    `/cashiers/open`,
    { cashierId, actionBy, actionDatetime, initialAmount, userPINCode },
    'La caja fue aperturada con éxito',
    'Acción terminada',
    'La caja no pudo ser aperturada',
    'Error desconocido'
  );

cashiersServices.closeCashier = (cashierId, actionBy, actionDatetime, finalAmount, remittedAmount, cashFunds, userPINCode) => 
  genRequest(
    `post`,
    `/cashiers/close`,
    { cashierId, actionBy, actionDatetime, finalAmount, remittedAmount, cashFunds, userPINCode },
    'La caja ha sido cerrada con éxito',
    'Acción terminada',
    'La caja no pudo ser cerrada',
    'Error desconocido'
  );

cashiersServices.newCashFundDeposit = (
  cashierId,
  movementAmount,
  comments,
  userPINCode
) => 
  genRequest(
    `post`,
    `/cashiers/new-cashfund-mov/deposit`,
    {
      cashierId,
      movementAmount,
      comments,
      userPINCode
    },
    'Deposito de caja chica realizado con éxito',
    'Acción terminada',
    'El deposito no ha podido realizarse',
    'Error desconocido'
  );

cashiersServices.newCashFundWithdraw = (
  cashierId,
  movementAmount,
  comments,
  userPINCode
) => 
  genRequest(
    `post`,
    `/cashiers/new-cashfund-mov/withdraw`,
    {
      cashierId,
      movementAmount,
      comments,
      userPINCode
    },
    'Retiro de caja chica realizado con éxito',
    'Acción terminada',
    'El retiro no ha podido realizarse',
    'Error desconocido'
  );
  
export default cashiersServices;
