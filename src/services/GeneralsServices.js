import { genRequest } from "./Requests";

const generalsServices = {};

generalsServices.findDocumentTypes = () => genRequest(`get`, `/generals/document-types`, {}, '', '', 'Los tipos de documentos no se han obtenido', 'Error desconocido');
generalsServices.findPaymentTypes = () => genRequest(`get`, `/generals/payment-types`, {}, '', '', 'Los tipos de pago no se han obtenido', 'Error desconocido');
generalsServices.findPaymentMethods = () => genRequest(`get`, `/generals/payment-methods`, {}, '', '', 'Los métodos de pago no se han obtenido', 'Error desconocido');
generalsServices.findDepartments = () => genRequest(`get`, `/generals/departments`, {}, '', '', 'Los departamentos no se han obtenido', 'Error desconocido');
generalsServices.findCities = () => genRequest(`get`, `/generals/cities`, {}, '', '', 'Las ciudades no se han obtenido', 'Error desconocido');
generalsServices.findTaxes = () => genRequest(`get`, `/generals/taxes`, {}, '', '', 'Los impuestos no se han obtenido', 'Error desconocido');
generalsServices.findPackageTypes = () => genRequest(`get`, `/generals/package-types`, {}, '', '', 'Los tipos de paquetes no se han obtenido', 'Error desconocido');

generalsServices.validatePolicyDocNumber = (docNumber) => genRequest(`post`, `/generals/policy/validate-docnumber`, { docNumber }, '', '', 'No se ha podido verificar el número de póliza', 'Error desconocido')

export default generalsServices;
