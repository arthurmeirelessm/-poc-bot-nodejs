const { ActivityHandler } = require('botbuilder');

class RegistrationMainBot extends ActivityHandler {
    constructor(conversationState, userState, dialog, recognizer, luisConfig) {
        super();
        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');

        this.onMessage(async (context, next) => {
            console.log('passei pelo ONMESSAGE');
            context.result = await recognizer.start('both', luisConfig, context);
            await this.dialog.run(context, this.dialogState);

            await next();
        });

        this.onDialog(async (context, next) => {
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);

            await next();
        });
    }
}

module.exports.RegistrationMainBot = RegistrationMainBot;
