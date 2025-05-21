const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const facilities = [
  {
    id: 1,
    name: 'Badminton Court',
    address: '123 HDB Road, Singapore 123456',
    type: 'badminton',
    lat: 1.3521,
    lng: 103.8198,
  },
  {
    id: 2,
    name: 'Basketball Court',
    address: '456 HDB Ave, Singapore 654321',
    type: 'basketball',
    lat: 1.35,
    lng: 103.82,
  },
];

app.get('/api/facilities', (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing lat/lng' });
  }
  res.json(facilities);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});