const units = (number) => {
  switch(number) {
    case 1: return 'UNO';
    case 2: return 'DOS';
    case 3: return 'TRES';
    case 4: return 'CUATRO';
    case 5: return 'CINCO';
    case 6: return 'SEIS';
    case 7: return 'SIETE';
    case 8: return 'OCHO';
    case 9: return 'NUEVE';
    default: return '';
  }
}

const andTens = (stringText, numberUnits) => {
  return (numberUnits > 0) ? stringText + ' Y ' + units(numberUnits) : stringText;
}

const tens = (number) => {
  let ten = Math.floor(number/10);
  let unit = number - (ten * 10);

  switch(ten) {
    case 1:
      switch(unit) {
        case 0: return 'DIEZ';
        case 1: return 'ONCE';
        case 2: return 'DOCE';
        case 3: return 'TRECE';
        case 4: return 'CATORCE';
        case 5: return 'QUINCE';
        default: return 'DIECI' + units(unit);
      }
    case 2:
      switch(unit) {
        case 0: return 'VEINTE';
        default: return 'VEINTI' + units(unit);
      }
    case 3: return andTens('TREINTA', unit);
    case 4: return andTens('CUARENTA', unit);
    case 5: return andTens('CINCUENTA', unit);
    case 6: return andTens('SESENTA', unit);
    case 7: return andTens('SETENTA', unit);
    case 8: return andTens('OCHENTA', unit);
    case 9: return andTens('NOVENTA', unit);
    case 0: return units(unit);
  }
}

const hundreds = (number) => {
  let hundred = Math.floor(number / 100);
  let ten = number - (hundred * 100);

  switch(hundred) {
    case 1: return (ten > 0) ? 'CIENTO ' + tens(ten) : 'CIEN';
    case 2: return 'DOSCIENTOS ' + tens(ten);
    case 3: return 'TRESCIENTOS ' + tens(ten);
    case 4: return 'CUATROCIENTOS ' + tens(ten);
    case 5: return 'QUINIENTOS ' + tens(ten);
    case 6: return 'SEISCIENTOS ' + tens(ten);
    case 7: return 'SETECIENTOS ' + tens(ten);
    case 8: return 'OCHOCIENTOS ' + tens(ten);
    case 9: return 'NOVECIENTOS ' + tens(ten);
  }

  return tens(ten);
}

const section = (number, divider, singularString, pluralString) => {
  let hundred = Math.floor(number / divider);
  let rest = number - (hundred * divider);

  let letters = '';

  if (hundred > 0) {
    if (hundred > 1) {
      letters = hundreds(hundred) + ' ' + pluralString;
    } else {
      letters = singularString;
    }
  }

  if (rest > 0) {
    letters += '';
  }
  
  return letters;
}

const thousands = (number) =>  {
  let divider = 1000;
  let hundred = Math.floor(number / divider);
  let rest = number - (hundred * divider);

  let thousandString = section(number, divider, 'UN MIL', 'MIL');
  let hundredString = hundreds(rest);

  if(thousandString == '') {
    return hundredString;
  }

  return thousandString + ' ' + hundredString;
}

const millions = (number) => {
  let divider = 1000000;
  let hundred = Math.floor(number / divider)
  let rest = number - (hundred * divider)

  let millionString = section(number, divider, 'UN MILLON', 'MILLONES');
  let thousandString = thousands(rest);

  if(millionString == '') {
    return thousandString;
  }

  return millionString + ' ' + thousandString;
}

const numberToLettersCore = (number = 0, currency = {}) => {
  let data = {
    number: number,
    integers: Math.floor(number),
    cents: (((Math.round(number * 100)) - (Math.floor(number) * 100))),
    centLetters: '',
    pluralMoneyLetter: currency.plural || 'DÓLARES',
    singularMoneyLetter: currency.singular || 'DÓLAR',
    pluralMoneyCentLetter: currency.centPlural || 'CENTAVOS',
    singularMoneyCentLetter: currency.centSingular || 'CENTAVO'
  };

  data.centLetters = `${data.cents}/100`;

  if(data.integers == 0)
    return 'CERO' + ' (' + data.centLetters + ') ' + data.pluralMoneyLetter;
  if (data.integers == 1)
    return millions(data.integers) + ' CON (' + data.centLetters + ') ' + data.singularMoneyLetter;
  else
    return millions(data.integers) + ' (' + data.centLetters + ') ' + data.pluralMoneyLetter;
}

export const numberToLetters = (number) => {
  return numberToLettersCore(
    number, {
      plural: 'DOLARES',
      singular: 'DOLARES',
      centPlural: 'CENTAVOS',
      centSingular: 'CENTAVO'
    }
  );
}
