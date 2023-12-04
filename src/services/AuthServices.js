import { genRequest } from "./Requests";

const authenticateUser = (username, password) => 
  genRequest(`post`, `/auth`, { username, password });

const authUserPassword = (password) => 
  genRequest(`post`, `/auth/authpassword`, { password }, '', '', 'No se pudo autenticar su clave', 'Por favor intente más tarde');

const authUserPINCode = (PINCode) => 
  genRequest(`post`, `/auth/authuserpincode`, { PINCode }, '', '', 'No se pudo autenticar su PIN', 'Por favor intente más tarde');

const checkToken = () => 
  genRequest(`post`, `/auth/checktoken`, {});

export {
  authenticateUser,
  authUserPINCode,
  authUserPassword,
  checkToken
}