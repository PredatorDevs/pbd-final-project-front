import axios from "axios";
import { customNot } from "../utils/Notifications";
import { getLocalPrinterServerIp, getLocalPrinterServerPort } from "../utils/LocalData";

export function serverUrl() {
  // const isDevelopment = process.env.NODE_ENV === 'development';

  // return isDevelopment ? 'https://agualimon.herokuapp.com/api' : `${process.env.REACT_APP_API}/api`
  // return isDevelopment ? `http://${ip.address()}:5001/api` : process.env.REACT_APP_API
  // return isDevelopment ? `http://192.168.0.12:5001/api` : process.env.REACT_APP_API

  // FOR MAIN LOCAL SERVER
  // return `http://192.168.1.6:5001/api`;
  // FOR SOME CLIENT
  // return `http://192.168.150.11:5001/api`;
  // return `http://127.0.0.1:5001/api`;
  // return `http://192.168.56.1:5001/api`;
  return 'https://distribuidora-panaderia.vercel.app/api';
}

const genRequest = async function(
  method,
  route,
  data = {},
  successMessage = '',
  successDescription = '',
  errorMessage = '',
  errorDescription = '',
  contentType = 'application/json',
  responseType = 'json'
) {
  try {
    let response;
    switch(method) {
      case 'get': 
        // response = await axios.get(`${serverUrl()}${route}`);
        response = await axios.get(
          `${route}`,
          {
            headers: {
              'Content-Type': contentType || ''
            },
            responseType: responseType || 'json'
          }
        );
        break;
      case 'post': 
        // response = await axios.post(`${serverUrl()}${route}`, data);
        response = await axios.post(
          `${route}`,
          data,
          {
            headers: {
              'Content-Type': contentType || ''
            },
            responseType: responseType || 'json'
          }
        );
        break;
      case 'post-multipart': 
        // response = await axios.post(`${serverUrl()}${route}`, data);
        response = await axios.post(`${route}`, data, { headers: { 'Content-Type': 'multipart/form-data' }});
        break;
      case 'put': 
        // response = await axios.put(`${serverUrl()}${route}`, data); 
        response = await axios.put(`${route}`, data); 
        break;
      case 'delete': 
        // response = await axios.delete(`${serverUrl()}${route}`); 
        response = await axios.delete(`${route}`);
        break;
      default:
        // response = await axios.get(`${serverUrl()}${route}`);
        response = await axios.get(`${route}`);
    }
    if (successMessage) customNot('success', successMessage, successDescription);
    return response;
  } catch (err) {
    if (errorMessage) customNot('error', errorMessage, errorDescription);
    customNot(
      'error',
      err.response.data.message,
      `${err.response?.data?.errorContent?.code} - ${err.response?.data?.errorContent?.sqlMessage}`
    );
    // console.error(err.response.data);

    throw err;
  }
}

export function localPrinterServerUrl() {
  if (getLocalPrinterServerIp() !== null && getLocalPrinterServerPort() !== null) {
    return `http://${getLocalPrinterServerIp()}:${getLocalPrinterServerPort()}/api`
  }
  return `http://127.0.0.1:5005/api`;
}

const localPrinterGenRequest = async function(
  method,
  route,
  data = {},
  successMessage = '',
  successDescription = '',
  errorMessage = '',
  errorDescription = ''
) {
  try {
    let response;
    switch(method) {
      case 'get': 
        response = await axios.get(`${localPrinterServerUrl()}${route}`);
        // response = await axios.get(`${route}`);
        break;
      case 'post': 
        response = await axios.post(`${localPrinterServerUrl()}${route}`, data);
        // response = await axios.post(`${route}`, data);
        break;
      case 'post-multipart': 
        response = await axios.post(`${localPrinterServerUrl()}${route}`, data, { headers: { 'Content-Type': 'multipart/form-data' }});
        // response = await axios.post(`${route}`, data, { headers: { 'Content-Type': 'multipart/form-data' }});
        break;
      case 'put': 
        response = await axios.put(`${localPrinterServerUrl()}${route}`, data); 
        // response = await axios.put(`${route}`, data); 
        break;
      case 'delete': 
        response = await axios.delete(`${localPrinterServerUrl()}${route}`); 
        // response = await axios.delete(`${route}`);
        break;
      default:
        response = await axios.get(`${localPrinterServerUrl()}${route}`);
        // response = await axios.get(`${route}`);
    }
    if (successMessage) customNot('success', successMessage, successDescription);
    return response;
  } catch (err) {
    if (errorMessage) customNot('error', errorMessage, errorDescription);
    return err;
  }
}

export {
  // getRequest,
  // postRequest,
  // putRequest,
  // deleteRequest
  genRequest,
  localPrinterGenRequest
}
