// src/bot/bot.js
const bot = require('./telegramCommands');

// Function to start the bot
function startBot() {
    try {
        console.log('Starting Telegram bot...');

        // Start listening for incoming updates
        bot.launch();

        console.log('Telegram bot is running.');
    } catch (error) {
        console.error('Error starting the bot:', error);
    }
}

// Graceful shutdown handling
process.once('SIGINT', () => {
    console.log('SIGINT received. Stopping bot...');
    bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
    console.log('SIGTERM received. Stopping bot...');
    bot.stop('SIGTERM');
});

module.exports = startBot;
