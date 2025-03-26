// src/utils/tweetParser.js

/**
 * Cleans and formats tweet text for processing or posting.
 * 
 * @param {string} tweetText - The raw tweet text fetched from Twitter.
 * @returns {string} - The cleaned and formatted tweet text.
 */
function cleanTweet(tweetText) {
  if (!tweetText || typeof tweetText !== 'string') {
      throw new Error('Invalid tweet text provided.');
  }

  // Remove extra whitespaces
  let cleanedText = tweetText.trim();

  // Replace multiple spaces with a single space
  cleanedText = cleanedText.replace(/\s+/g, ' ');

  // Remove non-ASCII characters (e.g., emojis, special symbols) if needed
  cleanedText = cleanedText.replace(/[^\x00-\x7F]/g, '');

  return cleanedText;
}

/**
* Extracts hashtags from a tweet.
* 
* @param {string} tweetText - The raw tweet text fetched from Twitter.
* @returns {Array<string>} - An array of hashtags found in the tweet.
*/
function extractHashtags(tweetText) {
  if (!tweetText || typeof tweetText !== 'string') {
      throw new Error('Invalid tweet text provided.');
  }

  // Use regex to find hashtags
  const hashtags = tweetText.match(/#[\w]+/g);
  return hashtags ? hashtags : [];
}

/**
* Extracts mentions (e.g., @username) from a tweet.
* 
* @param {string} tweetText - The raw tweet text fetched from Twitter.
* @returns {Array<string>} - An array of mentions found in the tweet.
*/
function extractMentions(tweetText) {
  if (!tweetText || typeof tweetText !== 'string') {
      throw new Error('Invalid tweet text provided.');
  }

  // Use regex to find mentions
  const mentions = tweetText.match(/@[\w]+/g);
  return mentions ? mentions : [];
}

/**
* Shortens a tweet to a specified character limit, ensuring no word is cut off.
* 
* @param {string} tweetText - The tweet text to shorten.
* @param {number} limit - The character limit (default is 280 for Twitter).
* @returns {string} - The shortened tweet text.
*/
function shortenTweet(tweetText, limit = 280) {
  if (!tweetText || typeof tweetText !== 'string') {
      throw new Error('Invalid tweet text provided.');
  }

  if (tweetText.length <= limit) {
      return tweetText;
  }

  // Shorten without breaking words
  let shortened = tweetText.slice(0, limit);
  const lastSpaceIndex = shortened.lastIndexOf(' ');
  if (lastSpaceIndex > 0) {
      shortened = shortened.slice(0, lastSpaceIndex);
  }

  return `${shortened}...`;
}

module.exports = {
  cleanTweet,
  extractHashtags,
  extractMentions,
  shortenTweet,
};
