const entitiesNames = require('../constants/entitiesNames');
const intentsNames = require('../constants/intentsNames');

class Recognizer {
    async start(option, luisConfig, context) {
        const result = await luisConfig.configured.recognize(context);
        console.log(result);
        switch (option) {
        case 'entity':
            return this.entity(result);
        case 'intent':
            return this.intent(result);
        case 'both':
            return {
                intent: this.intent(result),
                entity: this.entity(result)
            };
        }
    }

    entity(result) {
        const { entities } = result;
        let entity;

        entitiesNames.forEach(element => {
            // eslint-disable-next-line no-prototype-builtins
            if (entities.hasOwnProperty(element)) {
                entity = entities[element][0];
            };
        });
        return entity;
    }

    intent(result) {
        const topIntent = result.luisResult.topScoringIntent;
        let intent;
        intentsNames.forEach(element => {
            if (topIntent.intent === element) {
                intent = topIntent;
            }
        });

        return intent;
    }
}

module.exports.Recognizer = Recognizer;
