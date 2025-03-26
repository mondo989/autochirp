// src/services/logger.js

const fs = require('fs');
const path = require('path');

// Define log levels
const LOG_LEVELS = {
    INFO: 'INFO',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
    WARN: 'WARN',
};

// Define log file location
const logFilePath = path.resolve('./logs/app.log');

// Ensure the logs directory exists
if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

// Generic logger function
function log(message, level = LOG_LEVELS.INFO) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;

    // Write to log file
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) console.error('Failed to write to log file:', err);
    });

    // Print to console
    console.log(`[${level}] ${message}`);
}

// Dedicated methods for each log level
function info(message) {
    log(message, LOG_LEVELS.INFO);
}

function error(message) {
    log(message, LOG_LEVELS.ERROR);
}

function debug(message) {
    log(message, LOG_LEVELS.DEBUG);
}

function warn(message) {
    log(message, LOG_LEVELS.WARN);
}

module.exports = {
    log,
    info,
    error,
    debug,
    warn,
    LOG_LEVELS,
};
