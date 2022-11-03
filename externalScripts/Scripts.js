
class Scripts {
    async externalNameValidation(input) {
        console.log('passei pelo external');
        var cleanedInput = input.normalize('NFD').replace(/[^\w\s]/gi, '').toLowerCase();
        const nameRgx = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
        const lengthName = cleanedInput.length;
        return nameRgx.test(cleanedInput) && lengthName > 10 && lengthName <= 50;
    }
}

module.exports.Scripts = Scripts;
