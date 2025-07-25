require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ]
});

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().includes('weather')) {
    try {
      const messages = await message.channel.messages.fetch({ limit: 100 });
      const today = new Date().toDateString();

      const todaysMessages = messages
        .filter(m => new Date(m.createdTimestamp).toDateString() === today)
        .map(m => ({
          author: m.author.username,
          content: m.content,
          timestamp: new Date(m.createdTimestamp).toISOString()
        }));

      await axios.post(process.env.N8N_WEBHOOK_URL, {
        triggerMessage: message.content,
        allMessages: todaysMessages,
        channelId: message.channel.id
      });

      message.react('📡');
    } catch (err) {
      console.error('Failed to send to n8n:', err);
      message.reply('❌ Error triggering the weather check.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
