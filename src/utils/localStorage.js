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

// Initialize storage on load
loadStorage();

module.exports = {
    get,
    set,
    remove,
};
