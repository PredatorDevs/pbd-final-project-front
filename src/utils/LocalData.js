import { isEmpty } from "lodash";

export const getUserIsLoggedIn = () => {
  const value = localStorage.getItem('isLoggedIn');
  return value;
}

export const getUserToken = () => {
  const token = localStorage.getItem('userToken');
  return isEmpty(token) ? '' : token;
};

export const getUserId = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return isEmpty(userData) ? 'No información' : userData.id;
};

export const getUserName = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return isEmpty(userData) ? 'No información' : userData.fullName;
};

export const getUserRole = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return isEmpty(userData) ? 0 : userData.roleId;
};

export const getUserMyCashier = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return isEmpty(userData) ? 0 : userData.cashierId;
};

export const getUserCanCloseCashier = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return isEmpty(userData) ? 0 : userData.canCloseCashier;
};

export const getUserLocation = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return isEmpty(userData) ? 0 : userData.locationId;
};

export const getUserLocationName = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return isEmpty(userData) ? 'Sin información' : userData.locationName;
};

export const getUserIsAdmin = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return isEmpty(userData) ? 0 : userData.isAdmin;
};

export const getUserLocationAddress = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return isEmpty(userData) ? 'Sin información' : userData.locationAddress;
};

export const getOrderDetailTmp = () => {
  const data = localStorage.getItem('orderDetailTmp');
  return isEmpty(data) ? [] : JSON.parse(data);
};

export const removeOrderDetailTmp = () => {
  localStorage.removeItem('orderDetailTmp');
};

export const getLocalPrinterServerIp = () => {
  const value = localStorage.getItem('localPrinterServerIp');
  return value;
}

export const getLocalPrinterServerPort = () => {
  const value = localStorage.getItem('localPrinterServerPort');
  return value;
};
