import { genRequest } from "./Requests";

const sellersServices = {};

sellersServices.find = () => genRequest(`get`, `/sellers`, {});

sellersServices.add = (name) => 
  genRequest(`post`, `/sellers`, { name });

sellersServices.update = (name, sellerId) => 
  genRequest(`put`, `/sellers`, { name, sellerId });

sellersServices.remove = (sellerId) => 
  genRequest(`delete`, `/sellers/${sellerId}`);

export default sellersServices;
