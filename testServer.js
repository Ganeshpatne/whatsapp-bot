const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('✅ Webhook received:', req.body);
  res.status(200).send({ ok: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
});
