const axios = require("axios");
require("dotenv").config(); // Load environment variables from .env

// Load user token, source channel, and target channel from environment variables
const TOKEN = process.env.USER_TOKEN;
const SOURCE_CHANNEL_ID = process.env.TEST_SOURCE_CHANNEL;
const TARGET_CHANNEL_ID = process.env.TEST_TARGET_CHANNEL;

// Discord API headers
const headers = {
  Authorization: TOKEN,
  "Content-Type": "application/json",
};

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
    console.log("Message sent successfully!");
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

// Main function to fetch and print the last 5 messages from the source channel to the target channel
async function fetchAndPrintMessages() {
  const messages = await fetchMessages(SOURCE_CHANNEL_ID);

  if (messages && messages.length > 0) {
    for (const message of messages) {
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
      await sendMessage(TARGET_CHANNEL_ID, formattedMessage);
    }
  } else {
    console.log("No messages found or an error occurred.");
  }
}

// Run the function to fetch and print the last 5 messages
fetchAndPrintMessages();
