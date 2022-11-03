const { MessageFactory, CardFactory } = require('botbuilder');
const { WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const { ChoicePrompt, NumberPrompt, TextPrompt } = require('botbuilder-dialogs');
const { FINALIZATION_DIALOG, FinalizationBot } = require('./FinalizationBot');
const { User } = require('../models/User');
var axios = require('axios');

const USER_DIALOG = 'USER_DIALOG';
const CONFIRMDATAS_PROMPT = 'CONFIRMDATAS_PROMPT';
const STARTDIALOG_PROMPT = 'STARTDIALOG_PROMPT';
const CEP_PROMPT = 'CEP_PROMPT';
const GENDER_PROMPT = 'GENDER_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const CPF_PROMPT = 'CPF_PROMPT';
const BIRTHDATE_PROMPT = 'BIRTHDATE_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class UserDialog extends ComponentDialog {
    constructor() {
        super(USER_DIALOG);

        this.addDialog(new FinalizationBot());
        this.addDialog(new ChoicePrompt(STARTDIALOG_PROMPT, this.validateStartDialog.bind(this)));
        this.addDialog(new ChoicePrompt(CONFIRMDATAS_PROMPT, this.confirmationValidate.bind(this)));
        this.addDialog(new TextPrompt(CEP_PROMPT, this.cepValidation.bind(this)));
        this.addDialog(new TextPrompt(GENDER_PROMPT, this.genderValidation.bind(this)));
        this.addDialog(new TextPrompt(NAME_PROMPT, this.nameValidation.bind(this)));
        this.addDialog(new TextPrompt(CPF_PROMPT, this.cpfValidation.bind(this)));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.ageValidation.bind(this)));
        this.addDialog(new TextPrompt(BIRTHDATE_PROMPT, this.birthdateValidation.bind(this)));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.startDialog.bind(this), // 'Name ask and validation (Only string)'
            this.redirectStartDialog.bind(this),
            this.askName.bind(this), // 'Age ask and validation (Only Numbers)'
            this.askAge.bind(this), // 'Ask gender and validation'
            this.askGender.bind(this), // 'Ask CPF and validation'
            this.askCPF.bind(this), // 'Ask CEP and validation'
            this.askCEP.bind(this), // 'Ask birth data and validation'
            this.askBirthDate.bind(this),
            this.askConfirmation.bind(this),
            this.toFinalization.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async startDialog(step) {
        const buttons = ['Register user', 'Cancel'];

        const card = CardFactory.heroCard(undefined, undefined, buttons, { text: 'Welcome to **Hergomic** real state! 🏡👋🏼\n\nChoose one option: ' });

        const prompt = MessageFactory.attachment(card);

        return await step.prompt(STARTDIALOG_PROMPT, { prompt });
    }

    async validateStartDialog(turnContext) {
        const { context } = turnContext;
        const options = ['Register user', 'Cancel'];
        return options.includes(context.activity.text);
    }

    async redirectStartDialog(step) {
        const { text } = step.context.activity;
        if (text === 'Register user') return await step.next();
        return await step.beginDialog(FINALIZATION_DIALOG);
    }

    async askName(step) {
        step.values.user = new User();
        return await step.prompt(NAME_PROMPT, 'To **obtain the registration**, please tell me your name: ');
    }

    async nameValidation(turnContext) {
        const { entity, intent } = turnContext.context.result;
        return entity !== undefined && intent.intent === 'user_name';
    }

    async askAge(step) {
        step.values.user.name = step.result;
        return await step.prompt(NUMBER_PROMPT, 'How **old** are you?');
    }

    async ageValidation(turnContext) {
        const { entity, intent } = turnContext.context.result;
        return entity !== undefined && intent.intent === 'user_age';
    }

    async askGender(step) {
        step.values.user.age = step.result;
        return await step.prompt(GENDER_PROMPT, 'What is your **gender**?');
    }

    async genderValidation(turnContext) {
        const { entity, intent } = turnContext.context.result;
        return entity !== undefined && intent.intent === 'user_gender';
    }

    async askCPF(step) {
        step.values.user.gender = step.result;
        return await step.prompt(CPF_PROMPT, 'What is your **CPF**?');
    }

    async cpfValidation(turnContext) {
        const { entity, intent } = turnContext.context.result;
        return entity !== undefined && intent.intent === 'user_cpf';
    }

    async askCEP(step) {
        step.values.user.CPF = step.result;
        return await step.prompt(CEP_PROMPT, 'What is your **CEP**?');
    }

    async cepValidation(turnContext) {
        const { entity } = turnContext.context.result;
        if (entity) {
            const clearCEP = turnContext.recognized.value.trim();
            const responseCEP = await axios.get(`http://viacep.com.br/ws/${ clearCEP }/json/`)
                .then((response) => {
                    console.log(response.data.cep.length);
                    if (response.data.cep.length > 0) return true;
                    return false;
                }).catch((error) => {
                    console.log(error.status);
                    if (error.status !== 200) return false;
                });
            return responseCEP;
        }
    }

    async askBirthDate(step) {
        const consultCompleteCEPInfo = await axios.get(`http://viacep.com.br/ws/${ step.result }/json/`);
        step.values.user.CEP = consultCompleteCEPInfo.data.cep;
        return await step.prompt(BIRTHDATE_PROMPT, 'What is your **date of birth**?');
    }

    async birthdateValidation(turnContext) {
        const { entity, intent } = turnContext.context.result;
        return entity !== undefined && intent.intent === 'user_birthdate';
    }

    async askConfirmation(step) {
        step.values.user.birthdate = step.context.result.entity;
        const { user } = step.values;

        const buttons = ['Ok, correct!', 'No, continue later', 'Back to beginning of registration'];

        const card = CardFactory.heroCard(undefined, undefined, buttons, { text: `These were the data you provided us:\n\n**Name**: ${ user.name }\n\n**Age**: ${ user.age }\n\n**Gender**: ${ user.gender }\n\n**CPF**: ${ user.CPF }\n\n**CEP**: ${ user.CEP }\n\n**Birth date**: ${ user.birthdate }` });

        const prompt = MessageFactory.attachment(card);

        return await step.prompt(CONFIRMDATAS_PROMPT, { prompt });
    }

    async confirmationValidate(turnContext) {
        const { context } = turnContext;
        const options = ['Ok, correct!', 'No, continue later', 'Back to beginning of registration'];
        return options.includes(context.activity.text);
    }

    async toFinalization(stepContext) {
        const { text } = stepContext.context.activity;
        if (text === 'Ok, correct!' || text === 'No, continue later') return await stepContext.beginDialog(FINALIZATION_DIALOG);
        return await stepContext.beginDialog(USER_DIALOG);
    }
}

module.exports.UserDialog = UserDialog;
module.exports.USER_DIALOG = USER_DIALOG;
