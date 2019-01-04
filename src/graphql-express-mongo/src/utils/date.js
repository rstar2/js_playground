/**
 * @param {Date} date
 * @return {String}
 */
exports.date2str = date => {
    return new Date(date).toISOString();
};

/**
 * @param {String}
 * @return {Date}
 */
exports.str2date = str => {
    return new Date(str);
};