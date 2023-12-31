import dotenv from 'dotenv'; 
dotenv.config();

export default {
    VERSION: process.env.VERSION || '',
    BOT_KEY: process.env.BOT_KEY || '',
    CHANNEL_ID: process.env.CHANNEL_ID || ''
}