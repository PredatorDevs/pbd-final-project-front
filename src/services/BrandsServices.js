import { genRequest } from "./Requests";

const brandsServices = {};

brandsServices.find = () => genRequest(`get`, `/brands`, {}, '', '', 'La información de las marcas no pudo ser obtenida', 'Error desconocido');

brandsServices.add = (name) => 
  genRequest(`post`, `/brands`, { name });

brandsServices.update = (name, brandId) => 
  genRequest(`put`, `/brands`, { name, brandId });

brandsServices.remove = (brandId) => 
  genRequest(`delete`, `/brands/${brandId}`);

export default brandsServices;
