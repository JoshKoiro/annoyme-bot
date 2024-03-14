const express = require('express');
const YAML = require('yamljs');
const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
const moment = require('moment');

// Load configuration
const config = YAML.load('config.yaml');

const app = express();
const bot = new TelegramBot(config.token, { polling: true });

let pingIntervals = new Map(); // Store interval IDs for repeated pinging

function validUserId(userId) {
    if(userId == undefined || null){
        return false
    }
    return true
}

// Convert AM/PM format time string to the next JavaScript Date object
function convertToNextScheduledDate(timeString) {
  let scheduleTime = moment(timeString, "h:mm A");

  // If the schedule time is in the past, add one day to schedule it for the next day
  if (scheduleTime.isBefore(moment())) {
    scheduleTime.add(1, 'days');
  }

  return scheduleTime.toDate();
}

// Function to handle repeated pinging
function handleRepeatedPinging(userId) {
    if(validUserId(userId)){ 
  if (pingIntervals.has(userId)) {
    console.log("Chaos is already unleashed on this user:", userId);
    return;
  }

  console.log("Hurling chaos on userId:", userId);
  const intervalId = setInterval(() => {
    const message = config.messages[Math.floor(Math.random() * config.messages.length)];
    bot.sendMessage(userId, message);
  }, config.pingInterval);

  pingIntervals.set(userId, intervalId);
}
}

// Command to stop all pinging
bot.onText(/\/stop/, (msg) => {
  if (msg.from.id === config.adminUserID) {
    pingIntervals.forEach((value, key) => {
      clearInterval(value);
      pingIntervals.delete(key);
    });
    console.log("Admin has stopped all chaos on everyone...at ", moment().format("h:mm A"));
    bot.sendMessage(msg.chat.id, "Chaos has ceased...the world is back to normal...for now....");
  } else {
    bot.sendMessage(msg.chat.id, "You have no power here!!");
  }
});

bot.onText(/\/schedule/, (msg) => {
  if (msg.from.id === config.adminUserID) {
    // Schedule pinging for configured users
    config.users.forEach(user => {
      const nextScheduledDate = convertToNextScheduledDate(user.startTime);
      schedule.scheduleJob(nextScheduledDate, function() {
        console.log(`Unleashing the pings for userId: ${user.id} at ${user.startTime}`);
        handleRepeatedPinging(user.id);
      });
    });
    bot.sendMessage(msg.chat.id, "Chaos is scheduled by admin.");
  } else {
    bot.sendMessage(msg.chat.id, "You are not authorized to prepare the prime the bot for releasing chaos...");
  }
});

bot.onText(/\/chaos/, (msg) => {
  if (msg.from.id === config.adminUserID) {
    // Schedule pinging for configured users
    config.users.forEach(user => {
        handleRepeatedPinging(user.id);
      });
    console.log("Admin is unleashing chaos on everyone...at ", moment().format("h:mm A"));
    bot.sendMessage(msg.chat.id, "You are now unleashing chaos on everyone...");
  } else {
    bot.sendMessage(msg.chat.id, "You are not authorized to unleash chaos from this bot...");
  }
});

// Express server setup
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});