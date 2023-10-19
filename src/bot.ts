import TelegramBot from 'node-telegram-bot-api';
import config from './config';

const bot = new TelegramBot(config.BOT_KEY, {polling: true});

export const sendMessage = (msg: string) => {
    return bot.sendMessage(config.CHANNEL_ID, msg, {
        parse_mode: 'HTML'
    })
}
