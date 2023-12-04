import { genRequest } from "./Requests";

const deliveryRoutesServices = {};

deliveryRoutesServices.find = () => genRequest(`get`, `/deliveryroutes`, {}, '', '', 'La información de las rutas no pudo ser obtenida', 'Error desconocido');

deliveryRoutesServices.add = (name) => 
  genRequest(`post`, `/deliveryroutes`, { name });

deliveryRoutesServices.update = (name, deliveryRouteId) => 
  genRequest(`put`, `/deliveryroutes`, { name, deliveryRouteId });

deliveryRoutesServices.remove = (deliveryRouteId) => 
  genRequest(`delete`, `/deliveryroutes/${deliveryRouteId}`);

export default deliveryRoutesServices;
