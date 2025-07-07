const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.YT_API_KEY;

app.get('/random', async (req, res) => {
  const playlistId = req.query.playlist;

  if (!playlistId) {
    return res.status(400).json({ error: 'Missing playlist parameter' });
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: 'snippet',
        maxResults: 50,
        playlistId,
        key: API_KEY,
      },
    });

    const items = response.data.items;
    if (!items || items.length === 0) {
      return res.status(404).json({ error: 'No videos found in playlist' });
    }

    const randomItem = items[Math.floor(Math.random() * items.length)];
    const videoId = randomItem.snippet.resourceId.videoId;

    // Respond with a redirect to autoplay
    res.redirect(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching playlist' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
