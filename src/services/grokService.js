// src/services/grokService.js

const { execSync } = require('child_process');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

const logsDir = path.resolve('./');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log(`Created logs directory at: ${logsDir}`);
}

async function interactWithGrok(username, tweetContent, context) {
  try {
    if (!username && !tweetContent && !context) {
      throw new Error('Missing all required inputs. Provide at least a URL.');
    }

    if (context.startsWith('http')) {
      const urls = context.match(/https?:\/\/\S+/g);
      if (urls && urls.length > 0) {
        context = urls[0];
      }
    }

    console.log(`Inputs -> Username: ${username || 'N/A'}, Tweet: "${tweetContent || 'N/A'}", Context: "${context || 'N/A'}"`);

    // ✅ Step 1: Open Safari and Navigate to Grok
    const grokUrl = 'https://grok.x.com'; 
    const openSafariScript = `
      osascript -e '
      tell application "Safari"
          activate
          delay 1
          set URL of front document to "${grokUrl}"
      end tell'
    `;
    
    execSync(openSafariScript);
    console.log('✅ Safari opened and navigated to Grok.');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // ✅ Step 2: Prepare Prompt
    let preprompt;
    if (context.startsWith('http')) {
      preprompt = `Hello Grok, you are a witty comedian and thoughtful copywriter. Consider the tweet at this URL: ${context}. Keep it concise. No hashtags or emojis. Output the tweet between <<<START>>> and <<<END>>>.`;
    } else {
      preprompt = `Hello Grok, you are a witty comedian and thoughtful copywriter. Use the tweet from @${username}, consider the history of the person. Use the context of "${context}" to craft the tweet. Keep it concise. No hashtags or emojis. ONLY OUTPUT THE TWEET RESULTS BETWEEN <<<START>>> and <<<END>>> and include nothing else. Original tweet: "${tweetContent}"`;
    }

    const escapedPreprompt = preprompt.replace(/"/g, '\\"');

    // ✅ Step 3: Type and Submit the Prompt
    const typePromptScript = `
      osascript -e '
      tell application "System Events"
          delay 1
          key code 0 using {command down} -- ⌘ + A (Select all)
          delay 0.1
          key code 51 -- Delete (Backspace)
          delay 0.1

          keystroke "${escapedPreprompt}"
          delay 0.3
          key code 36 -- Return key
      end tell'
    `;

    execSync(typePromptScript);
    console.log('✅ Preprompt entered.');

    await new Promise((resolve) => setTimeout(resolve, 35000));

    // ✅ Step 4: Capture Grok Output
    // // THIS IS FOR IMAC DO NOT REMOVE
    // const grokOutputRegion = {
    //   left: 970,
    //   top: 20,
    //   width: 900,
    //   height: 900,
    // };

    // MBP 16" DO NOT REMOVE
    const grokOutputRegion = {
      left: 900,
      top: 200,
      width: 800,
      height: 600,
    };

    const screenshotPath = path.join(logsDir, 'grok_output_image.png');

    console.log("Your screenshot path: " + screenshotPath);

    const { screen } = require('@nut-tree-fork/nut-js');
    await screen.captureRegion(screenshotPath, grokOutputRegion);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!fs.existsSync(screenshotPath)) {
      throw new Error(`Screenshot file not found: ${screenshotPath}`);
    }
    console.log(`✅ Screenshot successfully saved at: ${screenshotPath}`);

    // ✅ Step 5: Perform OCR
    const ocrResult = await Tesseract.recognize(screenshotPath, 'eng');
    const extractedText = ocrResult.data.text.trim();

    console.log('Full Extracted Text:', extractedText);

    // ✅ Step 6: Extract the tweet from <<<START>>> to <<<END>>>
    const startMarker = '<<<START>>>';
    const endMarker = '<<<END>>>';
            
    // Find all occurrences of <<<START>>> and <<<END>>>
    const startIndices = [];
    const endIndices = [];
            
    let index = extractedText.indexOf(startMarker);
    while (index !== -1) {
        startIndices.push(index);
        index = extractedText.indexOf(startMarker, index + startMarker.length);
    }

    index = extractedText.indexOf(endMarker);
    while (index !== -1) {
        endIndices.push(index);
        index = extractedText.indexOf(endMarker, index + endMarker.length);
    }

    // Ensure there are at least two occurrences of both markers
    if (startIndices.length >= 2 && endIndices.length >= 2) {
        const startIndex = startIndices[1] + startMarker.length; // Second occurrence of <<<START>>>
        const endIndex = endIndices[1]; // Second occurrence of <<<END>>>

        if (startIndex < endIndex) {
            let content = extractedText.substring(startIndex, endIndex).trim();

            // Normalize spacing and remove unwanted line breaks
            content = content.replace(/\s+/g, ' '); // Replace multiple spaces/newlines with a single space

            // Replace '|' with 'I'
            content = content.replace(/\|/g, 'I');

            console.log('Extracted Content (Normalized):', content);
            return content; // Return cleaned and corrected content between the second markers
        } else {
            throw new Error('Second occurrence markers are out of order.');
        }
    } else {
        throw new Error('Not enough occurrences of <<<START>>> or <<<END>>> found.');
    }
  } catch (error) {
    console.error('Error during Grok interaction:', error);
    throw error;
  }
}

module.exports = { interactWithGrok };

