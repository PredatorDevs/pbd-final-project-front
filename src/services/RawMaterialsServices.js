import { genRequest } from "./Requests";

const rawMaterialsServices = {};

rawMaterialsServices.stocks = {};

rawMaterialsServices.find = () => genRequest(`get`, `/rawmaterials`, {});
rawMaterialsServices.findByLocationStockData = (locationId) => genRequest(`get`, `/rawmaterials/by-location-stock-data/${locationId}`, {});

rawMaterialsServices.findCurrentStock = () => genRequest(`get`, `/rawmaterials/current-stock`, {});

rawMaterialsServices.add = (name, cost) => 
  genRequest(`post`, `/rawmaterials`, { name, cost });

rawMaterialsServices.update = (name, cost, rawMaterialId) => 
  genRequest(`put`, `/rawmaterials`, { name, cost, rawMaterialId });

rawMaterialsServices.remove = (rawMaterialId) => 
  genRequest(`delete`, `/rawmaterials/${rawMaterialId}`);

// PRODUCT LOCATION STOCKS

rawMaterialsServices.stocks.findByRawMaterialId = (rawMaterialId) => 
  genRequest(`get`, `/rawmaterials/stocks/${rawMaterialId}`, {});

rawMaterialsServices.stocks.updateById = (initialStock, stock, rawMaterialStockId) => 
  genRequest(`put`, `/rawmaterials/stocks`, { initialStock, stock, rawMaterialStockId });

  
export default rawMaterialsServices;
