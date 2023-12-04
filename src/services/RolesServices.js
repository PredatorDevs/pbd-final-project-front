import { genRequest } from "./Requests";

const rolesService = {};

rolesService.find = () => genRequest(`get`, `/roles`, {});

export default rolesService;
