// src/automation/postTweet.js
const {
    keyboard,
    screen,
    Key
} = require('@nut-tree-fork/nut-js');

// Configure Nut.js behavior
keyboard.config.autoDelayMs = 200;

async function postTweet(tweetContent, tweetUrl) {
    try {
        console.log('Starting postTweet process...');
        console.log(`Received tweetContent: "${tweetContent}"`);
        console.log(`Received tweetUrl: "${tweetUrl}"`); // Log received tweetUrl for debugging

        // Validate tweetUrl
        if (!tweetUrl) {
            throw new Error('Tweet URL is undefined. Cannot proceed.');
        }

        // Open Spotlight Search with Command + Space
        console.log('Opening Spotlight Search...');
        await keyboard.pressKey(Key.LeftSuper, Key.Space);
        await keyboard.releaseKey(Key.LeftSuper, Key.Space);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for Spotlight to open
        await keyboard.type('Safari'); // Type "Safari" in Spotlight
        await keyboard.pressKey(Key.Return);
        await keyboard.releaseKey(Key.Return);
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for Safari to open

        // Navigate to the tweet's URL
        console.log('Navigating to tweet URL...');
        await keyboard.pressKey(Key.LeftSuper, Key.L);
        await keyboard.releaseKey(Key.LeftSuper, Key.L);
        await keyboard.type(tweetUrl);
        await keyboard.pressKey(Key.Return);
        await keyboard.releaseKey(Key.Return);
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for the page to load

        // Open the tweet composer by pressing 'n'
        console.log('Opening tweet composer...');
        await keyboard.pressKey(Key.R); // Replace with appropriate key for opening tweet composer
        await keyboard.releaseKey(Key.R);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for composer to open

        // Type the tweet content
        console.log('Typing the tweet content...');
        keyboard.config.autoDelayMs = 10;
        await keyboard.type(tweetContent);

        // Post the tweet by simulating Return
        console.log('Posting the tweet...');
        await keyboard.pressKey(Key.LeftSuper, Key.Return);
        await keyboard.releaseKey(Key.LeftSuper, Key.Return);

        console.log('Tweet posted successfully:', tweetContent);
    } catch (error) {
        console.error('Error in postTweet:', error);
        throw error;
    }
}

module.exports = postTweet;


