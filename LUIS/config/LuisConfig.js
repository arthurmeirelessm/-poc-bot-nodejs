const { LuisRecognizer } = require('botbuilder-ai');

const {
    LuisAppId,
    LuisAPIKey,
    LuisAPIHostName
} = process.env;

const recognizerOptions = {
    includeAllIntents: true
};

const config = {
    applicationId: LuisAppId,
    endpointKey: LuisAPIKey,
    endpoint: LuisAPIHostName
};

module.exports = {
    configured: new LuisRecognizer(config, recognizerOptions, true),
    class: LuisRecognizer
};
