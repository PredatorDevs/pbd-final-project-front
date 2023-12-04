import { genRequest } from "./Requests";

const suppliersServices = {};

suppliersServices.find = () => genRequest(`get`, `/suppliers`, {}, '', '', 'Información de los proveedores no obtenida', 'Error desconocido');
suppliersServices.findPendingPurchases = (customerId) => genRequest(`get`, `/suppliers/pending-sales/${customerId}`, {});

suppliersServices.add = (name, address, phone, email, dui, nit, nrc, businessLine, occupation) => 
  genRequest(`post`, `/suppliers`, { name, address, phone, email, dui, nit, nrc, businessLine, occupation });

suppliersServices.update = (name, address, phone, email, dui, nit, nrc, businessLine, occupation, supplierId) => 
  genRequest(`put`, `/suppliers`, { name, address, phone, email, dui, nit, nrc, businessLine, occupation, supplierId });

suppliersServices.remove = (supplierId) => 
  genRequest(`delete`, `/suppliers/${supplierId}`);

export default suppliersServices;
