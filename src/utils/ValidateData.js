import { isEmpty, isNumber, isString } from "lodash";
import { customNot } from "./Notifications";

let emailRegex = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
let phoneRegex = /^\d{8}$|\d{4}-\d{4}$|\d{4} \d{4}$/;
let nitRegex = /^\d{4}-\d{6}-\d{3}-\d{1}$/;
let duiRegex = /^\d{8}-\d{1}$/;

export const validateStringData = (value, messageIfFalse) => {
  if (!(isString(value) && !isEmpty(value)))
    customNot('warning', messageIfFalse || 'Dato no válido', '');
  return isString(value) && !isEmpty(value);
}

export const validateNumberData = (value, messageIfFalse, allowZero = true) => {
  if (!(isNumber(value) && isFinite(value) && (allowZero ? value >= 0 : value > 0)))
    customNot('warning', messageIfFalse || 'Dato no válido', '');
  return isNumber(value) && isFinite(value) && (allowZero ? value >= 0 : value > 0);
}

export const validateSelectedData = (value, messageIfFalse) => {
  if (!(value !== 0))
    customNot('warning', messageIfFalse || 'Dato no válido', '');
  return value !== 0;
}

export const validateArrayData = (value, minLength, messageIfFalse) => {
  if (!(!isEmpty(value) && value.length >= minLength))
    customNot('warning', messageIfFalse || 'Dato no válido', '');
  return !isEmpty(value) && value.length >= minLength;
}

export const validatePhoneNumber = (value, messageIfFalse) => {
  if (!(phoneRegex.test(value)))
    customNot('warning', messageIfFalse || 'Dato no válido', '');
  return phoneRegex.test(value);
}

export const validateEmail = (value, messageIfFalse) => {
  if (!(emailRegex.test(value) || value === ''))
    customNot('warning', messageIfFalse || 'Dato no válido', '');
  return emailRegex.test(value) || value === '';
}

export const validateDui = (value, messageIfFalse) => {
  if (!(duiRegex.test(value)))
    customNot('warning', messageIfFalse || 'Dato no válido', '');
  return duiRegex.test(value);
}

export const validateNit = (value, messageIfFalse) => {
  if (!(nitRegex.test(value)))
    customNot('warning', messageIfFalse || 'Dato no válido', '');
  return nitRegex.test(value);
}
