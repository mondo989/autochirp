// src/utils/localStorage.js

const fs = require('fs');
const path = require('path');

// File path for storage
const storageFilePath = path.resolve('./data/trackingData.json');

// In-memory storage cache
let trackingData = {};

// Load storage data from file
function loadStorage() {
    try {
        if (fs.existsSync(storageFilePath)) {
            const fileContent = fs.readFileSync(storageFilePath, 'utf8');
            trackingData = JSON.parse(fileContent);
        } else {
            trackingData = {};
        }
    } catch (error) {
        console.error('Error loading storage:', error);
    }
}

// Save storage data to file
function saveStorage() {
    try {
        fs.writeFileSync(storageFilePath, JSON.stringify(trackingData, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving storage:', error);
    }
}

// Get tracking data for a specific username
function get(username) {
    return trackingData[username] || null;
}

// Set/update tracking data for a specific username
function set(username, data) {
    trackingData[username] = data;
    saveStorage();
}

// Remove tracking data for a specific username
function remove(username) {
    delete trackingData[username];
    saveStorage();
}

// Set timeout state
function setTimeoutState(hours) {
    const timeoutUntil = new Date();
    timeoutUntil.setHours(timeoutUntil.getHours() + hours);
    trackingData.timeout = {
        until: timeoutUntil.toISOString(),
        hours: hours
    };
    saveStorage();
}

// Clear timeout state
function clearTimeoutState() {
    delete trackingData.timeout;
    saveStorage();
}

// Check if bot is in timeout
function isInTimeout() {
    if (!trackingData.timeout) return false;
    
    const timeoutUntil = new Date(trackingData.timeout.until);
    const now = new Date();
    
    if (now >= timeoutUntil) {
        clearTimeoutState();
        return false;
    }
    
    return true;
}

// Get remaining timeout hours
function getRemainingTimeoutHours() {
    if (!trackingData.timeout) return 0;
    
    const timeoutUntil = new Date(trackingData.timeout.until);
    const now = new Date();
    
    if (now >= timeoutUntil) {
        clearTimeoutState();
        return 0;
    }
    
    const remainingMs = timeoutUntil - now;
    return Math.ceil(remainingMs / (1000 * 60 * 60));
}

// Initialize storage on load
loadStorage();

module.exports = {
    get,
    set,
    remove,
    setTimeoutState,
    clearTimeoutState,
    isInTimeout,
    getRemainingTimeoutHours
};
