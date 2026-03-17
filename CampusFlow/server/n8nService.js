const axios = require('axios');

/**
 * Service to handle standard interactions with n8n webhooks.
 * Conforms strictly to the provided WhatsApp JSON payload schematic.
 */

const postToRegistrationWebhook = async (studentData) => {
  if (!process.env.N8N_WEBHOOK_REGISTRATION) {
    console.warn('Warning: N8N_WEBHOOK_REGISTRATION not set');
    return { success: false, error: 'Webhook URL not configured' };
  }

  const d = new Date();
  const startTime = d.toISOString().split('.')[0]; // YYYY-MM-DDTHH:mm:ss
  const dEnd = new Date(d.getTime() + 60 * 60 * 1000); // Add 1 hour delay
  const endTime = dEnd.toISOString().split('.')[0];
  
  // Clean phone string according to user specification (remove '+' sign)
  const phoneStr = studentData.phone.replace('+', '');

  const payload = {
    message: `Welcome to CampusFlow, ${studentData.name}! Your account has been registered successfully.`,
    phone: phoneStr,
    title: "Student Registration",
    start_time: startTime,
    end_time: endTime
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

  const d = new Date(deadlineData.dateTimeIso);
  const startTime = d.toISOString().split('.')[0]; // YYYY-MM-DDTHH:mm:ss
  const dEnd = new Date(d.getTime() + 60 * 60 * 1000); // Add 1 hour delay
  const endTime = dEnd.toISOString().split('.')[0];
  
  // Clean phone string according to user specification (remove '+' sign)
  const phoneStr = deadlineData.associated_phone.replace('+', '');

  let aiMessage = `Reminder: ${deadlineData.title} is coming up!`;

  try {
    if (process.env.GROK_API) {
      const groqResponse = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: "llama-3.1-8b-instant",
          messages: [
            { 
              role: "system", 
              content: "You are CampusFlow AI. Create a highly professional, 3-bullet point WhatsApp reminder for a student about their upcoming deadline. Be concise and use emojis. Do not use markdown format blocks." 
            },
            { role: "user", content: `Generate a WhatsApp reminder for the task: "${deadlineData.title}". The deadline is on ${d.toLocaleString()}.` }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.GROK_API}`,
            'Content-Type': 'application/json'
          }
        }
      );
      aiMessage = groqResponse.data.choices[0].message.content.trim();
    }
  } catch (err) {
    console.error('Groq AI enhancement failed, falling back to standard message:', err.message);
  }

  const payload = {
    message: aiMessage,
    phone: phoneStr,
    title: deadlineData.title,
    start_time: startTime,
    end_time: endTime
  };

  try {
    // Send it to the exact webhook defined
    const response = await axios.post(process.env.N8N_WEBHOOK_DEADLINE, payload);
    return { success: true, data: response.data, aiMessage };
  } catch (error) {
    console.error('Error sending to deadline webhook:', error.message);
    return { success: false, error: error.message, aiMessage };
  }
};

module.exports = {
  postToRegistrationWebhook,
  postToDeadlineWebhook,
};
