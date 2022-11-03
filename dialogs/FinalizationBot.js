const { ComponentDialog } = require('botbuilder-dialogs');
const { WaterfallDialog } = require('botbuilder-dialogs');

const FINALIZATION_DIALOG = 'FINALIZATION_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class FinalizationBot extends ComponentDialog {
    constructor() {
        super(FINALIZATION_DIALOG);
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.stepFinalizationBot.bind(this),
            this.endStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async stepFinalizationBot(stepContext) {
        await stepContext.context.sendActivity('It was a pleasure to meet you, until next time! 👋🏼');
        return await stepContext.next();
    }

    async endStep(stepContext) {
        return await stepContext.endDialog();
    }
}

module.exports.FinalizationBot = FinalizationBot;
module.exports.FINALIZATION_DIALOG = FINALIZATION_DIALOG;
