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

function getUserName(userId) {
  bot.getChat(userId).then(chat => {
      let userName = '';

      // Check if it's a private chat
      // if (chat.type === 'private') {
          // Construct the user's name. Some users may not have a username.
          userName = `${chat.first_name || ''} ${chat.last_name || ''}`.trim();
          
          // If the user has a username, append it.
          if (chat.username) {
              userName += ` (@${chat.username})`;
          }

          return `User Name: ${userName}`;
      // } else {
      //     console.log('N/A - This ID does not seem to be a private user chat.');
      // }
  }).catch(error => {
      console.error('Error retrieving user chat:', error);
  });
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

//TODO: abstract out the send text and send images logic

function sendMessageToUser(userId) {
  if (!validUserId(userId)) {
      return;
  }
  const mode = config.mode;

  // Send text messages
  if (mode === "text") {
    const message = config.messages[Math.floor(Math.random() * config.messages.length)];
    bot.sendMessage(userId, message);
  }

  // Send images/GIFs
  if (mode === "images") {
    const imageType = Math.round(Math.random());
    if (imageType === 0) {
        const selectedImage = config.images[Math.floor(Math.random() * config.images.length)];
        console.log("sending selected image: " + selectedImage.url)
        bot.sendPhoto(userId, selectedImage.url);
    }

    if (imageType === 1) {
        const selectedAnimation = config.gifs[Math.floor(Math.random() * config.gifs.length)];
        console.log("sending selected image as animation: " + selectedAnimation.url)
        bot.sendAnimation(userId, selectedAnimation.url);
    }
  }

  // Send both
  if (mode === "both") {
      // determine which kind of meesage to send choose randomly between text or image
      const messageType = Math.round(Math.random());

      if (messageType === 0) {
         // select random message from the list of text messages
         const message = config.messages[Math.floor(Math.random() * config.messages.length)];
         bot.sendMessage(userId, message);
      }

      if (messageType === 1) {
          
          // Choose between images and GIFs
          const imageType = Math.round(Math.random());
          if (imageType === 0) {
              const selectedImage = config.images[Math.floor(Math.random() * config.images.length)];
              console.log("sending selected image: " + selectedImage.url)
              bot.sendPhoto(userId, selectedImage.url);
          }

          if (imageType === 1) {
              const selectedAnimation = config.gifs[Math.floor(Math.random() * config.gifs.length)];
              console.log("sending selected image as animation: " + selectedAnimation.url)
              bot.sendAnimation(userId, selectedAnimation.url);
          }
          }
      }
    }   


// Function to handle repeated pinging
function handleRepeatedPinging(userId, rate) {
    if(validUserId(userId)){ 
  if (pingIntervals.has(userId)) {
    console.log("Chaos is already unleashed on this user:", userId);
    return;
  }

  console.log("Hurling chaos on user:", userId);
  const intervalId = setInterval(() => {
    sendMessageToUser(userId);
  }, rate);

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
        console.log(`Unleashing the scheduled chaos on userId: ${user.id} at ${user.startTime}`);
        bot.sendMessage(config.adminUserID, `Unleashing the scheduled chaos on userId: ${user.id}`);
        handleRepeatedPinging(user.id, config.pingInterval);
      });
    });
    bot.sendMessage(msg.chat.id, "Chaos is scheduled by admin.");
  } else {
    bot.sendMessage(msg.chat.id, "You are not authorized to prepare the prime the bot for releasing chaos...");
  }
});

bot.onText(/\/volley/, (msg) => {
  if (msg.from.id === config.adminUserID) {
    // Schedule pinging for configured users
    config.users.forEach(user => {
        handleRepeatedPinging(user.id, config.pingInterval);
      });
    console.log("Admin is unleashing a volley of chaos on everyone...at ", moment().format("h:mm A"));
    bot.sendMessage(msg.chat.id, "You are now unleashing a volley of chaos on everyone...");
  } else {
    bot.sendMessage(msg.chat.id, "You are not authorized to unleash a volley of chaos from this bot...");
  }
});

bot.onText(/\/chaos/, (msg) => {
  if (msg.from.id === config.adminUserID) {
    // Schedule pinging for configured users
    config.users.forEach(user => {
        handleRepeatedPinging(user.id, config.chaosInterval);
      });
    console.log("Admin is unleashing chaos on everyone...at ", moment().format("h:mm A"));
    bot.sendMessage(msg.chat.id, "You are now unleashing chaos on everyone...");
  } else {
    bot.sendMessage(msg.chat.id, "You are not authorized to unleash chaos from this bot...");
  }
});

// TODO:
// Use the ping command to send a message to an individual user


// automatically start the scheduled pings
config.users.forEach(user => {
  console.log(`\nA volley is scheduled for userId: ${user.id} at ${user.startTime}\n`);
  const nextScheduledDate = convertToNextScheduledDate(user.startTime);
  schedule.scheduleJob(nextScheduledDate, function() {
    console.log(`Unleashing the scheduled chaos on userId: ${user.id} at ${user.startTime}`);
    bot.sendMessage(config.adminUserID, `Unleashing the scheduled chaos on userId: ${user.id}`);
    handleRepeatedPinging(user.id, config.pingInterval);
  });
});

// Express server setup
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Annoy-Me-Bot is running... Express Server on port:${port}`);
});