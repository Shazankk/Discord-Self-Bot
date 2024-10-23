const axios = require("axios");
require("dotenv").config(); // Load environment variables from .env

// Load user token, source channels, and target channels from environment variables
const TOKEN = process.env.USER_TOKEN;
const SOURCE_CHANNELS = process.env.SOURCE_CHANNELS.split(",");
const TARGET_CHANNELS = process.env.TARGET_CHANNELS.split(",");

// Discord API headers
const headers = {
  Authorization: TOKEN,
  "Content-Type": "application/json",
};

let lastMessageIds = {}; // Store the ID of the last message for each source channel

// Function to fetch the last 5 messages from the source channel
async function fetchMessages(channelId) {
  const url = `https://discord.com/api/v9/channels/${channelId}/messages?limit=5`; // Fetch the last 5 messages
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching messages:",
      error.response ? error.response.status : error.message
    );
    if (error.response && error.response.data) {
      console.error("Error details:", error.response.data);
    }
  }
}

// Function to send a message to the target channel
async function sendMessage(channelId, content) {
  const url = `https://discord.com/api/v9/channels/${channelId}/messages`;
  const data = { content: content };

  try {
    await axios.post(url, data, { headers });
    console.log(`Message sent successfully to channel ${channelId}!`);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.status : error.message
    );
    if (error.response && error.response.data) {
      console.error("Error details:", error.response.data);
    }
  }
}

// Function to convert embeds into a simple text message, including fields
function convertEmbedToText(embed) {
  let message = "";

  if (embed.title) message += `**${embed.title}**\n`;
  if (embed.description) message += `${embed.description}\n`;

  if (embed.fields && embed.fields.length > 0) {
    embed.fields.forEach((field) => {
      message += `**${field.name}:** ${field.value}\n`;
    });
  }

  if (embed.footer && embed.footer.text) {
    message += `*${embed.footer.text}*\n`;
  }

  return message || "No content to display";
}

// Function to fetch and print new messages from a specific source channel to its target channel
async function fetchAndPrintNewMessages(sourceChannelId, targetChannelId) {
  const messages = await fetchMessages(sourceChannelId);

  if (messages && messages.length > 0) {
    let newMessages = [];

    // Loop through messages to find new ones
    for (const message of messages) {
      if (
        !lastMessageIds[sourceChannelId] ||
        message.id > lastMessageIds[sourceChannelId]
      ) {
        newMessages.push(message); // Only push new messages
      }
    }

    if (newMessages.length > 0) {
      lastMessageIds[sourceChannelId] = newMessages[0].id; // Update lastMessageId for this source channel

      for (const message of newMessages.reverse()) {
        // Process oldest first
        let messageContent = message.content || "";

        // If the message has embeds, convert them into a readable format
        if (message.embeds && message.embeds.length > 0) {
          message.embeds.forEach((embed) => {
            const embedText = convertEmbedToText(embed);
            messageContent += `\n${embedText}`;
          });
        }

        // Handle attachments if they exist
        if (message.attachments && message.attachments.length > 0) {
          messageContent += "\nAttachments:\n";
          message.attachments.forEach((attachment) => {
            messageContent += `${attachment.url}\n`; // Append the URL of each attachment
          });
        }

        // Add [Team CGF] in bold and format the message with >>>
        const formattedMessage = `**[Team CGF]**\n>>> ${messageContent}`;

        // Send the message to the target channel
        await sendMessage(targetChannelId, formattedMessage);
      }
    } else {
      console.log(`No new messages in source channel ${sourceChannelId}.`);
    }
  } else {
    console.log(
      `No messages found or an error occurred in source channel ${sourceChannelId}.`
    );
  }
}

// Main function to fetch and print new messages for all source-target channel pairs
async function fetchAndPrintMessagesForAllChannels() {
  for (let i = 0; i < SOURCE_CHANNELS.length; i++) {
    const sourceChannelId = SOURCE_CHANNELS[i];
    const targetChannelId = TARGET_CHANNELS[i];

    // Fetch and print new messages for the current source-target channel pair
    await fetchAndPrintNewMessages(sourceChannelId, targetChannelId);
  }
}

// Check for new messages every minute (60,000 ms)
setInterval(fetchAndPrintMessagesForAllChannels, 60000);

// Run the function initially to start checking for messages
fetchAndPrintMessagesForAllChannels();
