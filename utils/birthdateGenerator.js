const monthChanger = require('./monthChanger');

module.exports = function birthdateGenerator(string) {
    // eslint-disable-next-line no-unused-vars
    const [day, _, month] = string.split(' ');
    const monthInNumber = monthChanger(month);
    return `${ day }/${ monthInNumber }`;
};
