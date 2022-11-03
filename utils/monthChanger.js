const months = require('../constants/months');

module.exports = function monthChanger(string) {
    // eslint-disable-next-line no-prototype-builtins
    if (months.hasOwnProperty(string)) return months[string];
};
