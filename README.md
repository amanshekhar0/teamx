# 🚀 CampusFlow – Intelligent Academic Reminder & Scheduling System

CampusFlow is a workflow-driven automation system that helps students manage academic deadlines by automatically creating calendar events and sending real-time reminders via SMS/WhatsApp.

It eliminates missed deadlines by integrating scheduling and notification systems into a single automated pipeline.

---

## 📌 Problem

Students often miss assignments, tests, and deadlines due to:
- Lack of structured tracking
- No timely reminders
- Manual effort in maintaining schedules

---

## 💡 Solution

CampusFlow automates the entire process:
- Accepts event data via webhook
- Creates events in Google Calendar
- Sends instant reminders via Twilio (SMS/WhatsApp)

---

## ✨ Features

- 📅 Automatic Google Calendar event creation  
- 🔔 Instant reminders via SMS / WhatsApp  
- ⚡ Real-time webhook trigger system  
- 🔄 Fully automated workflow using n8n  
- 📲 Multi-channel notification support  

---

## 🏗️ Architecture

    POST Request (Webhook)
              ↓
        n8n Workflow
        ↙         ↘
 Twilio API     Google Calendar API

(Notification) (Event Creation)


---

## 🔄 How It Works

1. User sends event data through a webhook  
2. n8n workflow gets triggered  
3. Twilio sends a reminder message  
4. Google Calendar creates the event  

---

## 🖼️ Screenshots

### Workflow Automation
![Workflow](./assets/workflow.png)

### Calendar Events
![Calendar](./assets/calendar.png)

### Notification Output
![Notifications](./assets/notification.png)

---

## ⚙️ Tech Stack

- **Automation Tool:** n8n  
- **Messaging API:** Twilio  
- **Calendar Integration:** Google Calendar API  
- **Trigger Mechanism:** Webhooks (HTTP POST)  

---

## 🚀 Setup Guide

### 1. Clone Repository
```bash
git clone https://github.com/amanshekhar0/teamx.git
cd teamx
2. Install n8n
npm install -g n8n
n8n start
3. Configure Services
Twilio Setup

Create account at https://www.twilio.com

Get:

Account SID

Auth Token

Twilio Phone Number

Google Calendar Setup

Enable Google Calendar API

Generate OAuth credentials

🔐 Environment Variables

Create .env file:

TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_number
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
📥 Sample API Request
{
  "title": "Math Assignment",
  "time": "2026-03-18T04:30:00",
  "message": "Assignment due tomorrow!"
}
📊 Example Output

✅ Calendar event created

✅ WhatsApp/SMS reminder sent

📈 Future Improvements

🤖 AI-based task prioritization

📊 Web dashboard for tracking events

🔐 User authentication system

🔁 Recurring reminders

📱 Mobile app integration
