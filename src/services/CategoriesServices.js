import { genRequest } from "./Requests";

const categoriesServices = {};

categoriesServices.find = () => genRequest(`get`, `/categories`, {}, '', '', 'La información de las categorías no pudo ser obtenida', 'Error desconocido');

categoriesServices.add = (name) => 
  genRequest(`post`, `/categories`, { name });

categoriesServices.update = (name, categoryId) => 
  genRequest(`put`, `/categories`, { name, categoryId });

categoriesServices.remove = (categoryId) => 
  genRequest(`delete`, `/categories/${categoryId}`);

export default categoriesServices;
