# Discord Message Fetcher Bot

A **Node.js** based bot that fetches messages from one or more Discord source channels and forwards them to corresponding target channels. This bot uses Discord's API to fetch the latest messages, convert message embeds and attachments to readable content, and send them to the specified target channels.

## Features

- Fetch messages from multiple source channels.
- Send the new messages to the corresponding target channels.
- Fetches messages every minute, ensuring only new messages are sent.
- Supports fetching messages with embeds and attachments.
- Custom formatting for forwarded messages, including adding custom labels (e.g., `[Team CGF]`).

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [How it Works](#how-it-works)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation

To set up the project locally, follow these steps:

### Prerequisites

- **Node.js**: You need to have Node.js installed. You can download it from [here](https://nodejs.org/).
- **Discord Token**: You need a Discord bot token or user token (although self-bots are discouraged and may result in account bans).

### Step-by-Step Guide

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Shazankk/Discord-Self-Bot.git
   ```
2. Navigate to the project directory:

   ```bash
   cd Discord-Self-Bot
   ```
3. Install the necessary dependencies:

   ```bash
   npm install
   ```
4. Set up the environment variables (see [Environment Variables](#environment-variables) below).
5. Run the bot:

   ```bash
   node selfbot.js
   ```

## Environment Variables

Create a `.env` file in the root of the project to store your environment variables. The `.env` file should include:

```bash
USER_TOKEN=your_discord_user_or_bot_token
SOURCE_CHANNELS=comma_separated_source_channel_ids
TARGET_CHANNELS=comma_separated_target_channel_ids
```

- **USER_TOKEN**: Your Discord user or bot token.
- **SOURCE_CHANNELS**: A comma-separated list of source channel IDs.
- **TARGET_CHANNELS**: A comma-separated list of target channel IDs.

Example:

```bash
USER_TOKEN=abcd1234yourdiscordtoken5678
SOURCE_CHANNELS=123456789012345678,234567890123456789
TARGET_CHANNELS=345678901234567890,456789012345678901
```

## Usage

1. **Ensure your `.env` file is set up** with your Discord token and channel IDs.
2. **Start the bot** by running:

   ```bash
   node selfbot.js
   ```
3. The bot will fetch new messages from the specified source channels and send them to the corresponding target channels every minute.
4. To stop the bot, press `Ctrl + C` in your terminal.

## How it Works

- The bot is built using **Node.js** and the **Axios** library to interact with Discord's API.
- The script fetches the latest 5 messages from each source channel every minute using Discord's `/messages` endpoint.
- It stores the last processed message ID for each source channel to avoid duplicating messages.
- If new messages are found, it forwards them to the corresponding target channels, including any embeds or attachments.

### Message Processing Flow

1. **Fetch Messages**: The bot fetches the latest 5 messages from each source channel.
2. **Compare Message IDs**: It compares the message ID of each fetched message with the last processed message ID to determine if the message is new.
3. **Format Message**: The bot formats the message, including converting embeds to readable text and handling attachments.
4. **Send Message**: The formatted message is sent to the corresponding target channel.

## Folder Structure

```bash
.
├── node_modules/        # Project dependencies
├── .env                 # Environment variables file (not tracked by Git)
├── .gitignore           # Files and directories to ignore in version control
├── README.md            # Project documentation (this file)
├── package.json         # Project metadata and dependencies
├── your-script-file.js  # Main script to run the bot
```

## Contributing

Contributions are welcome! If you have any suggestions or improvements, feel free to open an issue or create a pull request.

To contribute:

1. Fork the project.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to your branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
