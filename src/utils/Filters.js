import { isEmpty } from "lodash";

const matchText = (base = '', compare = '', isEqual) => {
  const baseText = base.toString().toLowerCase();
  const compareText = compare.toString().toLowerCase();
  if (isEqual) {
    return baseText === compareText;
  }
  const includesText = baseText.includes(compareText);
  return includesText;
}

export const filterData = (data = [], filter = '', filterParams = ['Id']) => {
  const filteredData = data.filter((row) => {
    if (isEmpty(filter)) return true;
    const match = matchText;
    const matchResult = filterParams.some((e) => (filter && match(row[e] || '', filter)));
    const macthTexts = (matchResult);
    return macthTexts;
  });
  return filteredData;
}
