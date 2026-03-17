const axios = require('axios');

/**
 * Service to handle standard interactions with n8n webhooks.
 */

const postToRegistrationWebhook = async (studentData) => {
  if (!process.env.N8N_WEBHOOK_REGISTRATION) {
    console.warn('Warning: N8N_WEBHOOK_REGISTRATION not set');
    return { success: false, error: 'Webhook URL not configured' };
  }

  const payload = {
    event_type: 'STUDENT_REGISTRATION',
    timestamp: new Date().toISOString(),
    data: {
      student_name: studentData.name,
      student_phone_formatted: studentData.phone,
      student_email_gmail: studentData.email,
    },
  };

  try {
    const response = await axios.post(process.env.N8N_WEBHOOK_REGISTRATION, payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending to registration webhook:', error.message);
    return { success: false, error: error.message };
  }
};

const postToDeadlineWebhook = async (deadlineData) => {
  if (!process.env.N8N_WEBHOOK_DEADLINE) {
    console.warn('Warning: N8N_WEBHOOK_DEADLINE not set');
    return { success: false, error: 'Webhook URL not configured' };
  }

  const payload = {
    event_type: 'ADD_DEADLINE',
    deadline_id: deadlineData._id.toString(),
    data: {
      title: deadlineData.title,
      dateTimeIso: new Date(deadlineData.dateTimeIso).toISOString(),
      associated_phone: deadlineData.associated_phone,
    },
  };

  try {
    const response = await axios.post(process.env.N8N_WEBHOOK_DEADLINE, payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending to deadline webhook:', error.message);
    return { success: false, error: error.message };
  }
};

const postToNoticeWebhook = async (rawText) => {
  if (!process.env.N8N_WEBHOOK_NOTICE) {
    console.warn('Warning: N8N_WEBHOOK_NOTICE not set');
    return { success: false, error: 'Webhook URL not configured' };
  }

  const payload = {
    event_type: 'ANALYZE_NOTICE',
    data: {
      raw_text: rawText,
      return_summary: true,
    },
  };

  try {
    const response = await axios.post(process.env.N8N_WEBHOOK_NOTICE, payload);
    return { success: true, data: response.data }; // Extracted summary expected in response.data
  } catch (error) {
    console.error('Error sending to notice webhook:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  postToRegistrationWebhook,
  postToDeadlineWebhook,
  postToNoticeWebhook,
};
