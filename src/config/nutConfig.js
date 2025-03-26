// src/config/nutConfig.js

const { keyboard, mouse, screen, Key } = require('@nut-tree-fork/nut-js');

// Nut.js global configuration
const nutConfig = {
    autoDelayMs: 200, // Delay between actions (typing, mouse clicks, etc.)
    searchTimeout: 5000, // Timeout for screen element searches in milliseconds
};

// Apply global configurations
keyboard.config.autoDelayMs = nutConfig.autoDelayMs;
mouse.config.autoDelayMs = nutConfig.autoDelayMs;
screen.config.confidence = 0.9; // Confidence level for screen searches (0.0 to 1.0)

// Helper function: Press a sequence of keys
async function pressKeys(...keys) {
    try {
        for (const key of keys) {
            await keyboard.pressKey(key);
        }
        for (const key of keys) {
            await keyboard.releaseKey(key);
        }
    } catch (error) {
        console.error('Error pressing keys:', error);
        throw error;
    }
}

// Helper function: Click at a specific screen location
async function clickAt(location) {
    try {
        await mouse.move(location);
        await mouse.leftClick();
    } catch (error) {
        console.error('Error clicking at location:', error);
        throw error;
    }
}

// Helper function: Wait for a specific screen element
async function waitForImage(imagePath, timeout = nutConfig.searchTimeout) {
    try {
        console.log(`Waiting for image: ${imagePath}`);
        const result = await screen.waitFor(screen.find(imagePath), timeout);
        return result;
    } catch (error) {
        console.error(`Error waiting for image (${imagePath}):`, error);
        throw error;
    }
}

module.exports = {
    nutConfig,
    pressKeys,
    clickAt,
    waitForImage,
};
