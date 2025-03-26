// src/automation/fetchTweet.js

const { createBrowser } = require('../config/puppeteerConfig');

// Function to scrape the latest tweet for a given username
async function fetchTweet(username) {
    console.log(`fetchTweet.js: Fetching tweets for @${username}`);

    // Create a browser instance with the configured settings
    const { browser, page, userAgent } = await createBrowser();

    try {
        console.log(`fetchTweet.js: Using User-Agent: ${userAgent}`);

        // Navigate to the user's profile on Nitter
        const url = `https://nitter.poast.org/${username}`;
        console.log(`fetchTweet.js: Navigating to ${url}`);

        // USe to end query
        // Navigate to the user's profile on Nitter
        // const url = `https://xcancel.com/${username}`;
        // console.log(`fetchTweet.js: Navigating to ${url}`);

        // Navigate to the user's profile on Nitter
        // const url = `https://nitter.privacydev.net/${username}`;
        // console.log(`fetchTweet.js: Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.timeline-item', { timeout: 10000 });

        // Extract the content of the most recent valid tweet (non-retweet and non-pinned)
        const latestTweet = await page.evaluate(() => {
            const timelineItems = document.querySelectorAll('.timeline-item');

            for (let item of timelineItems) {
                // Skip retweets
                if (item.querySelector('.retweet-header')) continue;

                // Skip pinned tweets
                if (item.querySelector('.pinned')) continue;

                // Extract tweet content
                const tweetContent = item.querySelector('.tweet-content.media-body')?.innerText || '';

                // Extract the timestamp
                const timestamp = item.querySelector('time')?.getAttribute('datetime') || '';

                // Extract the tweet link
                const tweetAnchor = item.querySelector('.tweet-date > a');
                const tweetLink = tweetAnchor ? tweetAnchor.getAttribute('href') : null;

                // Log tweet content and tweet link for debugging
                console.log('Debug: Extracted tweet content:', tweetContent);
                console.log('Debug: Extracted tweet link:', tweetLink);

                if (tweetContent && tweetLink) {
                    // Ensure the link is absolute
                    const fullTweetLink = tweetLink.startsWith('http') ? tweetLink : `https://twitter.com${tweetLink}`;
                    return {
                        tweetText: tweetContent,
                        timestamp,
                        tweetLink: fullTweetLink, // Return the full URL
                    };
                }
            }

            return null; // No valid tweets found
        });

        if (!latestTweet) {
            throw new Error('Unable to fetch the latest valid tweet.');
        }

        console.log(`fetchTweet.js: Fetched Tweet: "${latestTweet.tweetText}" at ${latestTweet.timestamp}`);
        console.log(`fetchTweet.js: Fetched Tweet URL: ${latestTweet.tweetLink}`);
        return latestTweet;

    } catch (error) {
        console.error('fetchTweet.js: Error fetching tweet:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

module.exports = fetchTweet;
