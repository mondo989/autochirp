# AutoChirp

AutoChirp is an automated tweet processing and response system that integrates with Telegram and Slack. It tracks tweets, processes them using AI (Grok/OpenAI), and posts responses automatically.

## Features
- **Tracks tweets** from specific accounts in real-time.
- **Uses OpenAI/Grok AI** for intelligent responses.
- **Manages a queue system** to handle multiple tweets efficiently.
- **Sends responses via Telegram and Slack** integration.
- **Supports Puppeteer** for tweet scraping.
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
- **OpenAI API key** (optional, for AI-generated responses)

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
SLACK_BOT_TOKEN=your-slack-bot-token
OPENAI_API_KEY=your-openai-api-key
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
