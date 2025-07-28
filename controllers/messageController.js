const { sendMessage } = require('../baileysBot');
const Client = require('../models/clientModel'); // Optional, for dynamic replies

exports.receiveMessage = async (req, res) => {
  try {
    const { messages } = req.body;

    const msg = messages?.[0];
    if (!msg || !msg.message || msg.key.fromMe) {
      console.warn('📭 No valid incoming message');
      return res.sendStatus(200);
    }

    const from = msg.key.remoteJid;
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const cleanText = text.toLowerCase().trim();

    if (!cleanText) {
      console.log("⚠️ Not a valid text message");
      return res.sendStatus(200);
    }

    // Optional: Lookup client config for dynamic replies
    let reply = null;
    try {
      const client = await Client.findOne({ numberID: from.split('@')[0] }); // Simplified lookup
      if (client?.messageFlow?.[cleanText]) {
        reply = client.messageFlow[cleanText];
      } else if (Array.isArray(client?.faq)) {
        const matchedFAQ = client.faq.find(f => cleanText.includes(f.q.toLowerCase()));
        if (matchedFAQ?.a) reply = matchedFAQ.a;
      }
    } catch (dbErr) {
      console.warn("⚠️ DB lookup failed, using fallback reply");
    }

    if (!reply) {
      reply = "🤖 Sorry, I didn't understand that. Please try 'hi', 'timing' or 'price'.";
    }

    console.log(`💬 ${from} → "${cleanText}" → 💬 Replying: "${reply}"`);
    await sendMessage(from, reply);

    res.sendStatus(200);
  } catch (err) {
    console.error("🚨 Error in receiveMessage:", err);
    res.sendStatus(500);
  }
};
