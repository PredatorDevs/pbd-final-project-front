import { genRequest } from "./Requests";

const measurementUnitsServices = {};

measurementUnitsServices.find = () => genRequest(`get`, `/measurement-units`, {}, '', '', 'Información de las unidades de medida no obtenidas', '');

measurementUnitsServices.add = (name) => 
  genRequest(`post`, `/measurement-units`, { name });

measurementUnitsServices.update = (name, measurementUnit) => 
  genRequest(`put`, `/measurement-units`, { name, measurementUnit });

measurementUnitsServices.remove = (measurementUnit) => 
  genRequest(`delete`, `/measurement-units/${measurementUnit}`);

export default measurementUnitsServices;
