const TelegramBot = require('node-telegram-bot-api');
const BotMessagesController = require('./controllers/BotMessages.controller');
require('dotenv').config();

const MyBot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const BotMessages = new BotMessagesController(MyBot);

MyBot.on('message', (data) => BotMessages.router(data));