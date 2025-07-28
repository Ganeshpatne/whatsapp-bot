const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { startSock } = require('./baileysBot');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  startSock();
});
