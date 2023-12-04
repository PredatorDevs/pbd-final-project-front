import { genRequest } from "./Requests";

const usersService = {};

usersService.find = () => genRequest(`get`, `/users`, {}, '', '', 'Información de los usuarios no fue obtenida', 'Error desconocido');

usersService.add = (fullName, username, password, PINCode, roleId, locationId, cashierId, isAdmin, canCloseCashier) => 
  genRequest(`post`, `/users`, { fullName, username, password, PINCode, roleId, locationId, cashierId, isAdmin, canCloseCashier });

usersService.update = (fullName, username, roleId, locationId, cashierId, isAdmin, canCloseCashier, userId) => 
  genRequest(`put`, `/users`, { fullName, username, roleId, locationId, cashierId, isAdmin, canCloseCashier, userId });

usersService.remove = (userId) => 
  genRequest(`delete`, `/users/${userId}`);

export default usersService;
