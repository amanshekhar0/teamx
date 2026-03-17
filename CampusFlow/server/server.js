require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Student = require('./models/Student');
const Deadline = require('./models/Deadline');
const User = require('./models/User');
const n8nService = require('./n8nService');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_fallback_key_for_demo';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// --- Routes ---

// 0. Authentication Features
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required.' });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'User already exists.' });

    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (error) {
    console.error('Auth Register Error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'All fields are required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (error) {
    console.error('Auth Login Error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// 1. Registration Feature
app.post('/api/register', async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    // Validate (basic formatting check could be added)
    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'Name, phone, and email are required.' });
    }

    if (!phone.startsWith('+91')) {
      return res.status(400).json({ error: 'Phone must be in E.164 format starting with +91 (e.g. +91XXXXXXXXXX)' });
    }

    const newStudent = new Student({ name, phone, email });
    await newStudent.save();

    // Call n8n webhook
    const webhookResult = await n8nService.postToRegistrationWebhook(newStudent);

    res.status(201).json({
      message: 'Student registered successfully',
      student: newStudent,
      webhookSuccess: webhookResult.success,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// 2. Deadline Management
app.post('/api/deadline', async (req, res) => {
  try {
    const { title, dateTimeIso, associated_phone } = req.body;

    if (!title || !dateTimeIso || !associated_phone) {
      return res.status(400).json({ error: 'Title, dateTimeIso, and associated_phone are required.' });
    }

    const newDeadline = new Deadline({ title, dateTimeIso, associated_phone });
    await newDeadline.save();

    // Call n8n webhook
    const webhookResult = await n8nService.postToDeadlineWebhook(newDeadline);

    res.status(201).json({
      message: 'Deadline created successfully',
      deadline: newDeadline,
      webhookSuccess: webhookResult.success,
    });
  } catch (error) {
    console.error('Deadline Error:', error);
    res.status(500).json({ error: 'Server error during deadline creation' });
  }
});

app.get('/api/deadlines', async (req, res) => {
  try {
    const deadlines = await Deadline.find().sort({ dateTimeIso: 1 });
    res.json(deadlines);
  } catch (error) {
    console.error('Fetch Deadlines Error:', error);
    res.status(500).json({ error: 'Server error fetching deadlines' });
  }
});

// 3. AI Notice Broadcaster
app.post('/api/notice', async (req, res) => {
  try {
    const { raw_text } = req.body;

    if (!raw_text) {
      return res.status(400).json({ error: 'raw_text is required.' });
    }

    if (!process.env.GROK_API) {
      return res.status(500).json({ error: 'GROK_API key not found in .env' });
    }

    // Call Groq API directly using the key in your .env
    const axios = require('axios');
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { 
            role: "system", 
            content: "Summarize the provided college notice into up to 3 short bullet points. You must reply ONLY with a valid JSON array of strings. Do not include markdown formatting like ```json or any other text." 
          },
          { role: "user", content: raw_text }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROK_API}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let contentString = groqResponse.data.choices[0].message.content.trim();
    let summaryArray = [];
    
    try {
      // Clean up markdown blocks if the LLM leaked them
      if(contentString.startsWith('```')) {
        contentString = contentString.replace(/```(json)?/g, '').trim();
      }
      summaryArray = JSON.parse(contentString);
      if (!Array.isArray(summaryArray)) {
        summaryArray = [contentString];
      }
    } catch (e) {
      summaryArray = [contentString];
    }

    res.status(200).json({
      message: 'Notice summarized successfully via Groq AI',
      summary: summaryArray,
    });
    
  } catch (error) {
    console.error('Notice Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Server error processing notice with Groq' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
