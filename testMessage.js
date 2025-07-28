const axios = require('axios');

// ✅ Use your ngrok public forwarding URL here
const WEBHOOK_URL = 'https://19052999608b.ngrok-free.app/webhook';

// ✅ Simulated webhook payload matching your test client (from MongoDB)
const testPayload = {
  object: 'whatsapp_business_account',
  entry: [{
    id: 'entry_id_1',
    changes: [{
      value: {
        metadata: {
          phone_number_id: '1234567890' // 👈 This MUST match the client.numberID in DB
        },
        messages: [{
          from: '919999999999',
          text: {
            body: 'hi'
          },
          id: 'wamid.test'
        }]
      },
      field: 'messages'
    }]
  }]
};

// 🚀 Send test webhook to the running server (via ngrok tunnel)
axios.post('https://3d56a56d1884.ngrok-free.app/webhook', testPayload)
  .then(response => {
    console.log('✅ Test message sent:', response.status);
    console.log('📝 Response data:', response.data);
  })
  .catch(error => {
  if (error.response) {
    console.error('❌ Response error:', error.response.status, error.response.data);
  } else if (error.request) {
    console.error('❌ No response received:', error.request);
  } else {
    console.error('❌ Request setup error:', error.message);
  }
});
