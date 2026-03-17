require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Student = require('./models/Student');
const Deadline = require('./models/Deadline');
const n8nService = require('./n8nService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// --- Routes ---

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

    // Call webhook (Temporary bypass)
    // const webhookResult = await n8nService.postToRegistrationWebhook(newStudent);

    res.status(201).json({
      message: 'Student registered successfully (n8n bypassed)',
      student: newStudent,
      webhookSuccess: true, // webhookResult.success,
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

    // Call webhook (Temporary bypass)
    // const webhookResult = await n8nService.postToDeadlineWebhook(newDeadline);

    res.status(201).json({
      message: 'Deadline created successfully (n8n bypassed)',
      deadline: newDeadline,
      webhookSuccess: true, // webhookResult.success,
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

    // Call webhook and expect summary back (Temporary bypass)
    // const webhookResult = await n8nService.postToNoticeWebhook(raw_text);
    
    // Simulate n8n response for now
    const webhookResult = {
      success: true,
      data: "Simulation: 1. Notice Processed 2. Broadcasted to students 3. (n8n is bypassed)"
    };

    if (webhookResult.success) {
      res.status(200).json({
        message: 'Notice broadcasted successfully',
        summary: webhookResult.data,
      });
    } else {
      res.status(500).json({ error: 'Failed to process notice with n8n.' });
    }
  } catch (error) {
    console.error('Notice Error:', error);
    res.status(500).json({ error: 'Server error processing notice' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
