# CampusFlow n8n & API Architecture

This document outlines the complete integration flow between the CampusFlow application, the `nikhiln8n2342` n8n cloud instance, and the Groq AI engine.

## The n8n Webhook Endpoint
The system routes WhatsApp triggers through a unified cloud webhook:
`https://nikhiln8n2342.app.n8n.cloud/webhook/whatsapp-reminder`

## 1. Student Registration Flow
When you add a new student via the `/register-student` UI:

1. **Frontend**: Validates input and sends a `POST /api/register` to the Node.js backend.
2. **Backend**: Saves the student into MongoDB.
3. **n8n Bridge**: The `n8nService.js` file fires an HTTP POST to the webhook with the **Exact Payload required for WhatsApp**:
   ```json
   {
     "message": "Welcome to CampusFlow, Aman Shekhar! Your account has been registered successfully.",
     "phone": "919876543210",
     "title": "Student Registration",
     "start_time": "2026-03-17T12:00:00",
     "end_time": "2026-03-17T13:00:00"
   }
   ```
4. **n8n Processing**: The webhook catches this exact JSON structure and maps it directly into the WhatsApp template nodes to send a confirmation text.

## 2. Deadline Scheduling Flow
When you add a new task deadline from the Dashboard:

1. **Frontend**: Sends the date/time and linked phone number to `POST /api/deadline`.
2. **Backend**: Stores the deadline entity in MongoDB.
3. **n8n Bridge**: The `n8nService.js` file structures the data precisely to the n8n spec:
   ```json
   {
     "message": "Reminder: OS Midterm Prep is coming up!",
     "phone": "919876543210",
     "title": "OS Midterm Prep",
     "start_time": "2026-03-18T10:00:00",
     "end_time": "2026-03-18T11:00:00"
   }
   ```
4. **n8n Processing**: The webhook takes this payload and drops it into a delayed queue (or cron scheduler) to fire a WhatsApp reminder using the `phone` and `message` properties.

## 3. AI Notice Broadcaster
Because the n8n webhook only accepts the rigorous WhatsApp JSON payload above, the Notice Broadcaster **bypasses n8n** and taps directly into the Groq AI pipeline internally.

If you ever send raw text from the notice box:
1. **Frontend**: Hits `POST /api/notice`.
2. **Backend**: Takes the text and requests a summary from `llama-3.1-8b-instant` via the Groq SDK (`GROK_API` key in `.env`).
3. **Groq Engine**: Processes the prompt and returns a clean, structured JSON array in under 500ms.
4. **Result**: The array is pushed live back to the frontend dashboard UI under the "AI Summary" section. No webhook dependency is required.
