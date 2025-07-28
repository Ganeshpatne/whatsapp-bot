// controllers/faqController.js

const Client = require('../models/Client');

const checkFAQMatch = async (clientNumber, incomingMessage) => {
  const client = await Client.findOne({ numberID: clientNumber });

  if (!client || !client.faq || client.faq.length === 0) return null;

  const question = incomingMessage.toLowerCase().trim();

  for (let faq of client.faq) {
    if (question.includes(faq.q.toLowerCase())) {
      return faq.a;
    }
  }

  return null;
};

module.exports = { checkFAQMatch };
