const getFilterNumber = (value) => {
    if (!value) {
        return '';
    }
    return value.replace(/\D+/g, '');
};

export default getFilterNumber;
