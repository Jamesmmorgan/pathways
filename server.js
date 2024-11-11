onst express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const apiKey = 'YOUR_ACTUAL_API_KEY'; // Keep this secure
let sessionId = ''; // Will be generated

// Endpoint to create a session and get sessionId
app.get('/api/get-session', async (req, res) => {
  const url = 'https://api.on-demand.io/chat/v1/sessions';
  const headers = {
    'accept': 'application/json',
    'apikey': apiKey,
    'content-type': 'application/json'
  };
  const payload = {
    "externalUserId": "user_1",
    "pluginIds": ["plugin-1731243763"]
  };

  try {
    const response = await axios.post(url, payload, { headers });
    sessionId = response.data.data.id;
    res.json({ sessionId });
  } catch (error) {
    console.error('Error creating session:', error.response.data);
    res.status(500).json({ error: 'Error creating session' });
  }
});

// Endpoint to fetch course suggestions
app.post('/api/get-course-suggestions', async (req, res) => {
  const userSkills = req.body.skills;
  const url = `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`;
  const headers = {
    'apikey': apiKey,
    'Content-Type': 'application/json'
  };
  const payload = {
    "endpointId": "predefined-openai-gpt4o",
    "query": `Suggest courses for the following skills: ${userSkills.join(', ')}.`,
    "pluginIds": ["plugin-1731243763"],
    "responseMode": "sync"
  };

  try {
    const response = await axios.post(url, payload, { headers });
    const courses = response.data.data.courses;
    res.json({ courses });
  } catch (error) {
    console.error('Error fetching course suggestions:', error.response.data);
    res.status(500).json({ error: 'Error fetching course suggestions' });
  }
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
