import {parsePhoneNumberFromString} from 'libphonenumber-js';
import {countries} from '../config/phoneCodeCountries';

export const getPhoneData = (phoneNumber) => {
    const result = parsePhoneNumberFromString(phoneNumber);
    return result || {};
};

export const getCountryPhone = (code) => {
    return countries.find((c) => c.iso2 === code.toUpperCase());
};

export const getPhonePrefix = (code) => {
    const countryPhone = getCountryPhone(code);
    if (!countryPhone) {
        return undefined;
    }
    return `+${countryPhone.dialCode}`;
};

export const toE164PhoneNumber = (phoneNumber) => {
    const phone = parsePhoneNumberFromString(phoneNumber);
    return phone ? phone.format('E.164') : phoneNumber;
};
