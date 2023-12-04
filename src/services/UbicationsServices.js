import { genRequest } from "./Requests";

const ubicationsServices = {};

ubicationsServices.find = () => genRequest(`get`, `/ubications`, {}, '', '', 'Las ubicaciones en tienda no han podido ser obtenidas', 'Error desconocido');

ubicationsServices.add = (name) => 
  genRequest(`post`, `/ubications`, { name });

ubicationsServices.update = (name, ubicationId) => 
  genRequest(`put`, `/ubications`, { name, ubicationId });

ubicationsServices.remove = (ubicationId) => 
  genRequest(`delete`, `/ubications/${ubicationId}`);

export default ubicationsServices;
