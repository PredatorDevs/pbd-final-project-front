import { localPrinterGenRequest } from "./Requests";

const printerServices = {};

printerServices.testPrinterConnection = () => 
  localPrinterGenRequest(`post`, `/printer/test`, {}, 'Se ha comprobado la conexión con la impresora', 'Acción terminada', 'No se pudo establecer conexión con la impresora', 'Error desconocido');

printerServices.printTestPage = () => 
  localPrinterGenRequest(`post`, `/printer/testpage`, {}, 'Se ha realizado el envío Test Page a la impresora', 'Acción terminada', 'No se pudo establecer conexión con la impresora', 'Error desconocido');

// invoiceHeaderData = { customerFullname, documentDatetime, customerAddress, customerState, customerNit, customerNRC, customerBusinessType, taxableSale, totalTaxes, totalSale, totalToLetters }
// invoiceBodyData = [{ quantity, description, unitPrice, taxableSale }]

printerServices.printCCF = (invoiceHeaderData, invoiceBodyData) => 
  localPrinterGenRequest(`post`, `/printer/ccf`, { invoiceHeaderData, invoiceBodyData }, 'Se ha realizado el envío CCF a la impresora', 'Acción terminada', 'No se pudo establecer conexión con la impresora', 'Error desconocido');

// invoiceHeaderData = { customerFullname, documentDatetime, customerAddress, customerDui, customerNit, customerPhone, totalSale, totalToLetters }
// invoiceBodyData = [{ quantity, description, unitPrice, subTotal }]

printerServices.printCF = (invoiceHeaderData, invoiceBodyData) => 
  localPrinterGenRequest(`post`, `/printer/cf`, { invoiceHeaderData, invoiceBodyData }, 'Se ha realizado el envío CF a la impresora', 'Acción terminada', 'No se pudo establecer conexión con la impresora', 'Error desconocido');

export {
  printerServices
}
