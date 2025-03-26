// server.js

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const bot = require('./src/bot/telegramCommands');

if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('Error: TELEGRAM_BOT_TOKEN is not set in the .env file.');
    process.exit(1);
}

try {
    console.log('Starting AutoChirp bot...');
    bot.launch(); // Start the Telegram bot
    console.log('AutoChirp bot is now running.');
} catch (error) {
    console.error('Error starting AutoChirp bot:', error);
}

// Handle uncaught exceptions and rejections gracefully
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
