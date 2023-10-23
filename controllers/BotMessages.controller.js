class BotMessagesController {
    #ChatID;
    #Bot;

    constructor(Bot) {
        this.#Bot = Bot;
        this.hiddenNumber = null;
        this.router = this.router.bind(this);
        this.setMyCommandsForBot = this.setMyCommandsForBot.bind(this);
        this.startGame = this.startGame.bind(this);
        this.handlerForGame = this.handlerForGame.bind(this);

        this.#Bot.on('callback_query', (msg) => this.handlerForGame(msg)); 
    };
 
    setMyCommandsForBot() {
        this.#Bot.setMyCommands([
            {
                command: '/play',
                description: 'Сыграть в "Угадай число".',
            },
        ]);
    };

    startGame() {
        this.hiddenNumber = Math.floor(Math.random()*10).toString();
        this.#Bot.sendMessage(this.#ChatID, 'Я загадал число от 0 до 9, ваша задача угадать его.', {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{text: '1', callback_data: '1'},{text: '2', callback_data: '2'},{text: '3', callback_data: '3'}],
                    [{text: '4', callback_data: '4'},{text: '5', callback_data: '5'},{text: '6', callback_data: '6'}],
                    [{text: '7', callback_data: '7'},{text: '8', callback_data: '8'},{text: '9', callback_data: '9'}],
                    [{text: '0', callback_data: '0'}],
                ],
            }),
        });
    };

    handlerForGame(msg) {
        if(this.hiddenNumber === msg.data) {
            this.#Bot.sendMessage(this.#ChatID, 'Отлично! Вы угадали.', {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{text: 'Сыграть ещё!', callback_data: '/playAgain'}],
                    ],
                }),
            });
        } else if(msg.data === '/playAgain') this.startGame();
        else {
            this.#Bot.sendMessage(this.#ChatID, `К сожалению вы не угадали. Загаданное число: ${this.hiddenNumber}.`, {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{text: 'Попробовать ещё!', callback_data: '/playAgain'}],
                    ],
                }),
            });
        };
    };

    router(data) {
        this.#ChatID = data.chat.id;
        
        switch(data.text) {
            case '/start': {
                this.setMyCommandsForBot();
                this.#Bot.sendMessage(this.#ChatID, `Привет, ${data.from.first_name}!`);
                break;      
            };
            case '/play': {
                this.startGame();
                break;      
            };
            default: {
                this.#Bot.sendMessage(this.#ChatID, 'У меня нет инструкций для вашего сообщения.');
                break;
            };
        };
    };
};

module.exports = BotMessagesController;