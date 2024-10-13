const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(cors({
  origin: 'https://sweetdesign.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log(err));

const requestSchema = new mongoose.Schema({
  requestId: String,
  contextName: String,
  status: String,
  data: String,
});

const Request = mongoose.model('Request', requestSchema);

app.get('/api/requests/context', async (req, res) => {
  const contextName = req.query.contextName;
  console.log("Received contextName:", contextName); // Log the received contextName

  if (!contextName) {
    return res.status(400).send({ error: 'contextName query parameter is required' });
  }

  try {
    const requests = await Request.find({ contextName: contextName });
    console.log("Found requests:", requests); // Log the found requests
    if (requests.length === 0) {
      return res.status(404).send({ message: 'No requests found for this context name' });
    }
    res.status(200).send(requests);
  } catch (error) {
    console.error("Error during database query:", error); // Log any errors
    res.status(500).send({ error: error.message });
  }
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});