const express = require('express');
const path = require('path');
const { createClient } = require('redis');

const app = express();
const PORT =  3000;

let redisClient = null;

(async () => {
  try {
    redisClient = createClient({ 
      url: "redis://redis:6379",
      database: 0,
      socket: {
        reconnectStrategy: false 
      }
    });
    
    redisClient.on('error', (err) => {
    });
    
    redisClient.on('end', () => {
      redisClient = null;
    });
    
    await redisClient.connect();
    
  } catch (err) {
    redisClient = null;
  }
})();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/kv', async (req, res) => {
  const { key, value } = req.body;

  if (!key || !value) {
    return res.status(400).json({ error: 'Key and value are required' });
  }

  res.status(200).json({ success: true });

  if (redisClient && redisClient.isOpen) {
    redisClient.set(key, value).catch(() => {
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);

});

