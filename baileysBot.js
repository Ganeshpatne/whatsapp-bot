const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  DisconnectReason
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const mongoose = require('mongoose');
const axios = require('axios');
const Client = require('./models/clientModel');
require('dotenv').config();

let sock = null;

// Free LLM fallback: HuggingFace's Flan-T5 model
async function getHuggingFaceReply(userText) {
  const hfToken = process.env.HF_API_TOKEN;
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      { inputs: userText },
      { headers: { Authorization: `Bearer ${hfToken}` } }
    );
    return response.data[0]?.generated_text || "";
  } catch (err) {
    console.error("❌ HF API error:", err?.response?.data || err.message);
    return "";
  }
}

async function startSock() {
  await mongoose.connect(process.env.MONGO_URI);

  const { state, saveCreds } = await useMultiFileAuthState('./auth');
  sock = makeWASocket({
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, p => ({ state: 'store', key: p })) },
    logger: pino({ level: 'warn' }),
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '22.04.4']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('📲 Scan this QR Code:\n');
      qrcode.generate(qr, { small: true });
    }
    if (connection) console.log('🔄 Connection status:', connection);
    else console.log('🔄 Connection status update received without connection field');
    if (connection === 'open') {
      console.log('✅ WhatsApp Connected. Bot is ready ✅');
    }
    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error instanceof Boom &&
        lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
      console.log('🔌 Connection closed. Should reconnect?', shouldReconnect);
      if (shouldReconnect) {
        console.log('♻️ Reconnecting in 5 seconds...');
        setTimeout(() => startSock(), 5000);
      } else {
        console.log('⛔ Session logged out. Please delete auth folder and scan QR again.');
        process.exit(0);
      }
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    const from = msg?.key?.remoteJid;

    // Ignore group chats and unwanted/system/self messages
    if (
      !msg.message || msg.key.fromMe ||
      from === 'status@broadcast' ||
      msg.messageStubType || msg.message?.protocolMessage ||
      from.endsWith('@g.us')
    ) return;

    try {
      const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.ephemeralMessage?.message?.conversation ||
        msg.message?.ephemeralMessage?.message?.extendedTextMessage?.text ||
        "";
      const cleanText = text.trim().toLowerCase();
      console.log(`💬 Message from ${from}: "${cleanText}"`);

      const botNumber = sock.user.id.split(':')[0];
      const client = await Client.findOne({ numberID: botNumber });

      if (!client) {
        await sendMessage(from, '🤖 Sorry, this bot is not configured for your number.');
        return;
      }

      // Greetings
      const greetings = ['hi', 'hii', 'hiii', 'hello', 'hey', 'hola', 'नमस्ते', 'bonjour'];
      if (greetings.includes(cleanText)) {
        await sendMessage(from, 'Hello! 👋');
        return;
      }

      // Exact keyword (DB)
      let reply = client.messageFlow.get(cleanText);

      // FAQ (partial match)
      if (!reply && client.faq && client.faq.length > 0) {
        const faqMatch = client.faq.find(({ q }) => cleanText.includes(q.toLowerCase()));
        if (faqMatch) reply = faqMatch.a;
      }

      // Free LLM fallback (HuggingFace, demo/low-usage only!)
      if (!reply) {
        reply = await getHuggingFaceReply(cleanText);
        if (!reply.trim()) {
          reply = "This conversation will be assigned to one of our team members. Please wait.";
        }
      }
      await sendMessage(from, reply);
    } catch (err) {
      console.error('❌ Error handling incoming message:', err);
    }
  });
}

async function sendMessage(to, text) {
  if (!sock) return;
  try {
    await sock.sendMessage(to, { text });
    console.log(`📤 Sent message to ${to}: "${text}"`);
  } catch (err) {
    console.error('❌ Failed to send message:', err);
  }
}

module.exports = { startSock, sendMessage };
if (require.main === module) startSock();
