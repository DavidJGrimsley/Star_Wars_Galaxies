import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8081;

// Enable CORS
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(process.cwd(), 'public')));

// Proxy SWAPI people endpoint
app.get('/api/people', async (req, res) => {
  console.log('Start app.get from SWAPI...');
  try {
    console.log('Trying to fetch people from SWAPI...');
    let allPeople = [];
    let nextUrl = 'https://swapi.py4e.com/api/people/';
    console.log('Initial URL:', nextUrl);
    while (nextUrl) {
      console.log('Next URL:', nextUrl);
      const response = await fetch(nextUrl);
      if (!response.ok) throw new Error('Failed to fetch people');
      console.log('Response received from SWAPI:', response.status);
      const data = await response.json();
      allPeople = [...allPeople, ...data.results];
      nextUrl = data.next;
    }
    res.json(allPeople);
  } catch (err) {
    console.error('Error fetching people from SWAPI:', err);
    res.status(500).json({ error: err.message });
  }
});



// Catch-all route to serve the main HTML file
app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});