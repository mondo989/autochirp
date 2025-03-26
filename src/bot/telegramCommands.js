// src/bot/telegramCommands.js

const { Telegraf } = require('telegraf');
const fetchTweet = require('../automation/fetchTweet');
const { interactWithGrok } = require('../services/grokService');
const postTweet = require('../automation/postTweet');
const { scheduleTweetJob } = require('../services/cronService');
const localStorage = require('../utils/localStorage');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// **/context Command: Stores or Updates Context**
bot.command('context', async (ctx) => {
    try {
        const messageText = ctx.message.text.replace('/context', '').trim();

        if (!messageText) {
            return ctx.reply('Usage: /context <your context>\nExample: /context funny');
        }

        localStorage.set('grokContext', messageText); // Store new context
        ctx.reply(`Grok context updated to: "${messageText}"`);
    } catch (error) {
        console.error('Error setting context:', error);
        ctx.reply('Failed to update the context.');
    }
});

// **Handles both old logic and URL-only input**
bot.on('text', async (ctx) => {
    try {
        const messageText = ctx.message.text.trim();

        // **Case 3: URL-Only Input**
        if (messageText.startsWith('http')) {
            const tweetUrl = messageText;
            ctx.reply(`Processing tweet from URL: ${tweetUrl}...`);

            // Get stored context (if any)
            const storedContext = localStorage.get('grokContext') || '';

            let tweetText = "Extracted tweet text (if available)"; // Optional: Fetch real text if needed

            // Send to Grok with stored context
            let grokOutput;
            try {
                grokOutput = await interactWithGrok('', tweetText, `${storedContext} ${tweetUrl}`);
                ctx.reply(`Processed Grok Output: "${grokOutput}"`);
            } catch (error) {
                console.error('Error processing tweet with Grok:', error);
                return ctx.reply('Failed to process the tweet with Grok.');
            }

            // Post the tweet
            try {
                await postTweet(grokOutput, tweetUrl);
                ctx.reply('Tweet posted successfully!');
            } catch (error) {
                console.error('Error posting tweet:', error);
                return ctx.reply('Failed to post the tweet.');
            }
            return;
        }

        // **Case 1: /post <username> "<context>"**
        if (messageText.startsWith('/post')) {
            const args = messageText.replace('/post', '').trim().split(' ');
            const username = args[0];
            const context = args.slice(1).join(' ');

            if (!username || !context) {
                return ctx.reply('Usage: /post <username> "<context>"');
            }

            ctx.reply(`Fetching latest tweet for @${username} with context: "${context}"...`);

            let tweetData;
            try {
                tweetData = await fetchTweet(username);
                const tweetText = tweetData.tweetText;
                const tweetUrl = tweetData.tweetLink;
                ctx.reply(`Fetched Tweet: "${tweetText}"`);

                let grokOutput = await interactWithGrok(username, tweetText, context);
                ctx.reply(`Processed Grok Output: "${grokOutput}"`);

                await postTweet(grokOutput, tweetUrl);
                ctx.reply('Tweet posted successfully!');
            } catch (error) {
                console.error('Error handling /post command:', error);
                return ctx.reply('An error occurred while processing the tweet.');
            }
            return;
        }

        // **Case 2: /track <username> "<context>"**
        if (messageText.startsWith('/track')) {
            const args = messageText.replace('/track', '').trim().split(' ');
            const username = args[0];
            const context = args.slice(1).join(' ');

            if (!username || !context) {
                return ctx.reply('Usage: /track <username> "<context>"');
            }

            ctx.reply(`Setting up tracking for @${username} with context: "${context}"...`);

            let latestTweet;
            try {
                latestTweet = await fetchTweet(username);
                if (!latestTweet || !latestTweet.tweetLink) {
                    throw new Error('No tweets found or invalid tweet link.');
                }
            } catch (error) {
                console.error('Error fetching tweet:', error);
                return ctx.reply(`Failed to fetch the latest tweet for @${username}.`);
            }

            // Update local storage
            try {
                localStorage.set(username, { context, lastUrl: latestTweet.tweetLink });
                console.log(`Tracking data updated for @${username}`);
            } catch (error) {
                console.error('Error updating tracking data:', error);
                return ctx.reply('Failed to update tracking data.');
            }

            // Schedule the cron job
            try {
                scheduleTweetJob(username, context, '*/3 * * * *'); // Every 3 minutes
                ctx.reply(`Now tracking @${username}. Latest tweet: ${latestTweet.tweetLink}`);
            } catch (error) {
                console.error('Error scheduling cron job:', error);
                return ctx.reply('Failed to schedule the tracking job.');
            }
            return;
        }

        // If no valid input was detected
        ctx.reply('Invalid command. Send a tweet URL or use /post <username> "<context>" or /track <username> "<context>".');

    } catch (error) {
        console.error('Error processing message:', error);
        ctx.reply('An unexpected error occurred.');
    }
});

module.exports = bot;


