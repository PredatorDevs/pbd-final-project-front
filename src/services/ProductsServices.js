import { genRequest } from "./Requests";

const productsServices = {};

productsServices.stocks = {};

productsServices.prices = {};

productsServices.packageConfigs = {};

productsServices.find = () => genRequest(`get`, `/products`, {});

productsServices.findByLocationStockData = (locationId) => 
  genRequest(`get`, `/products/by-location-stock-data/${locationId}`, {}, '', '', 'No se pudo obtener la información de los productos', 'Error desconocido');

productsServices.findTaxesByProductId = (productId) => 
  genRequest(`get`, `/products/taxes-data/${productId}`, {}, '', '', 'No se pudo obtener la información de los impuestos de este producto', 'Error desconocido');

productsServices.findByMultipleParams = (locationId, productFilterParam, excludeServices = 0) => 
  genRequest(
    `get`,
    `/products/by-multiple-params/${locationId}/${productFilterParam}/${excludeServices}`,
    {},
    '',
    '',
    'Se ha producido un error al hacer la búsqueda del producto',
    'Error desconocido'
  );

productsServices.findLocationStockCheck = (locationId) => 
  genRequest(
    `get`,
    `/products/location-stock-check/${locationId}`,
    {},
    '',
    '',
    'Se ha producido un error al hacer la búsqueda de las existencias',
    'Error desconocido'
  );

productsServices.checkAvailability = (locationId, productId, quantity) =>
  genRequest(`get`, `/products/check-availability/${locationId}/${productId}/${quantity}`, {}, '', '', '', '');


productsServices.add = (
  name,
  brandId,
  categoryId,
  ubicationId,
  measurementUnitId,
  barcode,
  cost,
  isService,
  isTaxable,
  enabledForProduction,
  packageContent
) => 
  genRequest(
    `post`,
    `/products`,
    {
      name,
      brandId,
      categoryId,
      ubicationId,
      measurementUnitId,
      barcode,
      cost,
      isService,
      isTaxable,
      enabledForProduction,
      packageContent
    },
    'Información general del producto guardada',
    '',
    'No se pudo añadir la información general del producto',
    'Error desconocido'
  );

productsServices.update = (
  name,
  brandId,
  categoryId,
  ubicationId,
  measurementUnitId,
  barcode,
  cost,
  isService,
  isTaxable,
  enabledForProduction,
  packageContent,
  productId
) => 
  genRequest(
    `put`,
    `/products`,
    {
      name,
      brandId,
      categoryId,
      ubicationId,
      measurementUnitId,
      barcode,
      cost,
      isService,
      isTaxable,
      enabledForProduction,
      packageContent,
      productId
    }
  );

productsServices.remove = (productId) => 
  genRequest(`delete`, `/products/${productId}`);

// PRODUCT LOCATION STOCKS

productsServices.stocks.findByProductId = (productId) => 
  genRequest(`get`, `/products/stocks/${productId}`, {}, '', '', 'Información de existencias de producto no obtenida', 'Error desconocido');

productsServices.stocks.updateById = (initialStock, stock, productStockId) => 
  genRequest(`put`, `/products/stocks`, { initialStock, stock, productStockId });

// PRODUCT PRICES

productsServices.prices.findByProductId = (productId) => 
  genRequest(`get`, `/products/prices/${productId}`, {}, '', '', 'Información de precios de producto no obtenida', 'Error desconocido');

// EXPECTED req.body => prices = [[productId, price, profitRate, profitRateFixed], [...]]
productsServices.prices.add = (bulkData) => 
  genRequest(
    `post`,
    `/products/prices`,
    { bulkData },
    'Los precios fueron añadidos con éxito',
    'Acción terminada',
    'Los precios no fueron añadidos',
    'Error desconocido'
  );

productsServices.prices.update = (price, profitRate, profitRateFixed, productPriceId) => 
  genRequest(`put`, `/products/prices`, { price, profitRate, profitRateFixed, productPriceId });

productsServices.prices.remove = (productPriceId) => 
  genRequest(`delete`, `/products/prices/${productPriceId}`);

productsServices.packageConfigs.findByProductId = (productId) => 
  genRequest(`get`, `/products/package-configs/${productId}`, {}, '', '', 'Información de contenidos de producto no obtenida', 'Error desconocido');

productsServices.packageConfigs.add = (packageTypeId, productId, measurementUnitId, quantity) => 
  genRequest(
    `post`,
    `/products/package-configs`,
    {
      packageTypeId,
      productId,
      measurementUnitId,
      quantity
    },
    'La información de contenidos de producto fue añadida',
    'Acción existosa',
    'La información de contenidos de producto no pudo ser añadida',
    'Error desconocido'
  );

productsServices.packageConfigs.remove = (productPackageConfigId) => 
  genRequest(
    `delete`,
    `/products/package-configs/${productPackageConfigId}`,
    {},
    'La información de contenidos de producto fue removida',
    'Acción existosa',
    'La información de contenidos de producto no pudo ser removida',
    'Error desconocido'
  );

export default productsServices;
