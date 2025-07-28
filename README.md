# WhatsApp Bot

Hey! This is a simple multi-client WhatsApp bot project I built just for fun and learning. It uses the [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) library and helps you create bots that can send and receive messages automatically. I made this to learn how automation works using Node.js and WhatsApp web.

## What it Does

* You can scan QR code to login (like WhatsApp Web)
* Send auto replies
* Handle multiple clients
* Check messages and reply

## Tech Stack

* Node.js
* Express.js
* whatsapp-web.js
* qrcode-terminal
* Socket.io

## How to Run It

### Step 1: Clone the repo

```bash
git clone https://github.com/Ganeshpatne/whatsapp-bot.git
cd whatsapp-bot
```

### Step 2: Install all required stuff

```bash
npm install
```

### Step 3: Start the bot

```bash
npm start
```

Then just scan the QR code from your WhatsApp and you're in!

## Project Structure

```
whatsapp-bot/
│
├── client/           # Frontend (if any)
├── controllers/      # Bot logic goes here
├── routes/           # Express routes
├── node_modules/     # Dependencies
├── .gitignore        # Ignore stuff like node_modules
├── index.js          # Main entry file
└── package.json      # Project metadata
```

## Features I'm Planning to Add

* Chat logging
* Better UI for client
* Store chat replies in a database

## Who Am I

I'm Ganesh, a 20-year-old developer who loves building cool side projects. Still learning a lot every day. This project was mainly to try automation using WhatsApp.

## Connect with Me

* GitHub: [Ganeshpatne](https://github.com/Ganeshpatne)
* Email: [ganeshpatne044@gmail.com](mailto:ganeshpatne044@gmail.com)

Thanks for checking this out! If you liked it, give a star on GitHub.
