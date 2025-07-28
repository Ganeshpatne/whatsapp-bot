const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  q: { type: String, required: true },
  a: { type: String, required: true }
}, { _id: false });

const clientSchema = new mongoose.Schema({
  clientId: { type: String, required: true, unique: true },
  numberID: { type: String, required: true, unique: true },
  accessToken: { type: String },
  messageFlow: { type: Map, of: String },
  faq: [faqSchema]
});

module.exports = mongoose.model('Client', clientSchema);
