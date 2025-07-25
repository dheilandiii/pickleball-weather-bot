# Use official Node.js LTS base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose no ports (bot connects outbound only)
# ENV variables come from .env file mapped during runtime

# Start the bot
CMD ["node", "bot.js"]
