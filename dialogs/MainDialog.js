const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs');
const { UserDialog, USER_DIALOG } = require('./UserDialog');

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
const MAIN_DIALOG = 'MAIN_DIALOG';

class MainDialog extends ComponentDialog {
    constructor() {
        super(MAIN_DIALOG);

        this.addDialog(new UserDialog())
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.ActstepContext.bind(this)]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async ActstepContext(stepContext) {
        return await stepContext.beginDialog(USER_DIALOG);
    }
}

module.exports.MainDialog = MainDialog;
