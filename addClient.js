const mongoose = require('mongoose');
const Client = require('./models/clientModel');
require('dotenv').config();

async function addClient() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const newClient = new Client({
      clientId: 'cryoCorp',
      numberID: '918624895945', // <-- YOUR BOT'S NUMBER HERE
      accessToken: 'test_mode',
      messageFlow: {
        'hi': 'Hello! How can I assist you today?',
        'hii': 'Hello! How can I assist you today?',
        'hello': 'Hello! How can I assist you today?',
        'price': 'Our pricing starts from ₹5000.',
        'location': 'We are based in Pune, India.',
        'timing': 'We operate from 9 AM to 6 PM, Monday to Saturday.'
      },
      faq: [
        { q: 'payment', a: 'You can pay via UPI, bank transfer, or credit card.' },
        { q: 'support', a: 'We offer 24x7 customer support for premium clients.' }
      ]
    });

    await newClient.save();
    console.log('✅ Client added successfully');
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

if (require.main === module) {
  addClient();
}
