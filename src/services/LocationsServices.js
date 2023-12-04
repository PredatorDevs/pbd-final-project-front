import { genRequest } from "./Requests";

const locationsService = {};

locationsService.find = () => genRequest(`get`, `/locations`, {});

locationsService.add = (fullName, username, password, roleId, locationId) => 
  genRequest(`post`, `/locations`, { fullName, username, password, roleId, locationId });

export default locationsService;
