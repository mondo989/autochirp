# AutoChirp

AutoChirp is an AI-powered tweet automation system that tracks and responds to tweets using Grok AI. It automates responses using **Grok AI** and **nut.js** (Apple system automation), and utilizes **Puppeteer** to post responses directly to tweets.

## Features
- **Tracks tweets** from specific accounts in real-time.
- **Uses Grok AI** for intelligent responses.
- **Automates posting** using Puppeteer.
- **Integrates with Apple’s automation system** via nut.js.
- **Manages a queue system** to handle multiple tweets efficiently.
- **Logs errors and bot activities** for debugging.

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Logging](#logging)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Installation

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **A Telegram bot token**

### Clone the Repository
```bash
git clone https://github.com/yourusername/AutoChirp.git
cd AutoChirp
```

### Install Dependencies
```bash
npm install
```

## Configuration

### Setting Up Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
CHAT_ID=your-telegram-chat-id
```

## Usage

### Start the Bot
```bash
npm start
```

### Running in Development Mode
```bash
npm run dev
```

## Project Structure

```
autoChirp/
│── .gitignore
│── .env
│── README.md
│── package.json
│── package-lock.json
│── server.js
│── logs/
│   └── app.log
│── data/
│   └── trackingData.json
│── src/
│   ├── config/
│   │   ├── puppeteerConfig.js
│   │   ├── nutConfig.js
│   ├── utils/
│   │   ├── tweetParser.js
│   │   ├── localStorage.js
│   ├── bot/
│   │   ├── telegramCommands.js
│   │   ├── bot.js
│   ├── automation/
│   │   ├── postTweet.js
│   │   ├── fetchTweet.js
│   ├── services/
│   │   ├── logger.js
│   │   ├── cronService.js
│   │   ├── grokService.js
```

### Key Files & Directories
- **`server.js`** → Main entry point for the application.
- **`src/bot/`** → Manages Telegram bot interactions.
- **`src/automation/`** → Handles fetching and posting tweets.
- **`src/services/`** → Contains logging, scheduling, and AI processing services.
- **`src/utils/`** → Utility functions for tweet parsing and local storage.
- **`logs/`** → Stores application logs.
- **`data/`** → Tracks tweet processing data.

## Environment Variables

| Variable Name       | Description                         |
|---------------------|-------------------------------------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot API token       |
| `CHAT_ID`          | The chat ID for Telegram responses |

## Logging
- Logs are stored in the `logs/` directory.
- Errors and bot activities are recorded in `app.log`.

## Troubleshooting

### Common Issues

#### 1. **Bot Not Responding**
- Ensure the bot is running: `npm start`.
- Check the `.env` file for correct API tokens.
- Review logs in the `logs/` directory.

#### 2. **Telegram API Errors**
- Make sure your bot token is valid.
- Check for connectivity issues with Telegram.

## License
This project is licensed under the MIT License.

---

*For more details or to contribute, visit [your repository link].*
