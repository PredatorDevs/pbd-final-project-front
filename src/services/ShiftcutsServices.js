import { genRequest } from "./Requests";

const shiftcutsService = {};

shiftcutsService.find = () => genRequest(`get`, `/shiftcuts`, {});
shiftcutsService.findById = (shiftcutId) => genRequest(`get`, `/shiftcuts/${shiftcutId}`, {});
shiftcutsService.settlements = () => genRequest(`get`, `/shiftcuts/settlements`, {});
shiftcutsService.settlementsById = (shiftcutId) => genRequest(`get`, `/shiftcuts/settlements/${shiftcutId}`, {});
shiftcutsService.settlementsByLocation = (locationId) => genRequest(`get`, `/shiftcuts/settlements/by-location/${locationId}`, {});
shiftcutsService.settlementsOrderSaleById = (shiftcutId) => genRequest(`get`, `/shiftcuts/settlements/order-sales/${shiftcutId}`, {});

export default shiftcutsService;
