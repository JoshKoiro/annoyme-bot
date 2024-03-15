# annoyme-bot
A telegram bot designed to keep you accountable to your schedule by annoying you incessantly until an administrator provides a stop command

![Logo](/logo.png)

The application is designed to be run as a continuous server that will ping users with notifications until an administrator  disables the ping. The pings are in the form of messages which can be sent out at a specified time interval with a specified set of random or sequential messages.

## Installation

To use the bot, you must first install the server either on your local machine or a remote server. The bot runs as a node.js server and requires node to be installed on your server system.

After installing node, clone the repo using https or ssh
```
git clone https://github.com/JoshKoiro/annoyme-bot.git
```
```
git clone git@github.com:JoshKoiro/annoyme-bot.git
```

Next, install the node dependencies by running `npm install` inside the main directory of the repo.

Next, configure the config.yaml.template file. This is a starting point. Make a copy of this file and save it as config.yaml. Save the file in the main directory and fill in the apprpriate credentials. (Telegram token, your user ID as admin, other user ids as clients)

```
token:  # Your bot token
pingInterval: 6000 # in milliseconds
chaosInterval: 2000 # in milliseconds
adminUserID:  # Your user ID
mode: "text" # Options: "text", "images", "both"
users:
  - id: # USER_ID_1
    startTime: "3:25 PM"
  # - id: # USER_ID_2
  #   startTime: "10:00 PM"
messages:
  - "Hey there! It's time to hit the hay and dream of a world without alarms. Sweet dreams... or else. 😴💤"
  # More messages here
images:
  - url: "https://giphy.com/embed/vOGPwT3buij6g"
  # more images here
gifs:
  - url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3U0b3R4OTM2ajMzZGtiMjNnY3FtZzBtc2NxdW5wZm41aXJ6Y2FwayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QthHQMMfHaGk0/giphy.gif"
  - url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmo5eGJjbDRwajMzdXhueW1iNG1rdjRvdGxpemhsaXNrbzBoOG5ibyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tVdn1YOjAMaiPpY4fC/giphy.gif"
  - url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjhnc25ub3ozbW44NnV5N3p1ajExZ3FiYnNwYmkyeXo5bnJhN2lsMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/f6h0ntoYNGAjm/giphy.gif"
  - url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2p4cXdnanh6YnRyZzFkeDlocDZkZ3hxMnl3M3NqNXI2NnQ0M253NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SHEcjjdZz1tWU/giphy.gif"
  # more gifs here
  ```

Finally, you can run the server using the command `node server.js` or `npm start`

Alternatively, you can use nodemon for testing. Make sure to install the global nodemon dependency by running `npm install --global nodemon`.

once nodemon is installed you can run the server as a hotloading server on changes by running `nodemon server.js`.

## Usage

In order to have your victims...err, clients successfully receive messages, they must add the bot to their list of contacts by searching for the bot name and starting a conversation with it. I don't know for sure if you need to hit /start to initialize the conversation or not, but it can't hurt!

Once that is done, make sure your client's userID is entered in the config.yaml file and start throwing commands at the bot, and watch the chaos of notifications ensue!

## Slash Commands

Below are a list of the slash commands availble to the bot.

### /volley

### /chaos

### /schedule

### /stop

### /ping [user]
 
 Coming soon...
