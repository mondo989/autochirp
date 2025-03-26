// src/services/cronService.js

const cron = require('node-cron');
const logger = require('./logger');
const fetchTweet = require('../automation/fetchTweet');
const postTweet = require('../automation/postTweet');
const { interactWithGrok } = require('./grokService');
const storage = require('../utils/localStorage');

const activeJobs = {};

function scheduleTweetJob(username, context, schedule) {
    if (activeJobs[username]) {
        logger.info(`Cron job for @${username} already exists. Overwriting...`);
        activeJobs[username].stop();
    }

    const job = cron.schedule(schedule, async () => {
        try {
            const data = storage.get(username);
            if (!data) {
                logger.warn(`No data found for @${username}. Stopping job.`);
                job.stop();
                delete activeJobs[username];
                return;
            }

            const latestTweet = await fetchTweet(username);
            if (!latestTweet) {
                logger.info(`No new tweets found for @${username}.`);
                return;
            }

            // Check for new URL
            if (latestTweet.tweetLink !== data.lastUrl) {
                logger.info(`New tweet detected for @${username}: ${latestTweet.tweetLink}`);

                const grokOutput = await interactWithGrok(username, latestTweet.tweetText, context);

                // Pass the output from Grok to postTweet
                await postTweet(grokOutput, latestTweet.tweetLink);

                // Update stored URL
                storage.set(username, {
                    ...data,
                    lastUrl: latestTweet.tweetLink,
                });

                logger.info(`Tweet processed through Grok and posted for @${username}.`);
            }
        } catch (error) {
            logger.error(`Error in cron job for @${username}: ${error.message}`);
        }
    });

    activeJobs[username] = job;
    logger.info(`Cron job scheduled for @${username} with schedule "${schedule}".`);
}

module.exports = { scheduleTweetJob };
