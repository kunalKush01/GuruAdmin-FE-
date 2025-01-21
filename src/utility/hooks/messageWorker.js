const messageQueue = [];
let isProcessing = false;

async function sendMessage(message) {
  try {
    const response = await fetch(`${message.baseUrl}/send-group-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        number: message.destination,
        message: message.msgBody,
        variables: message.variables || {}
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return {
      success: true,
      messageId: message.key,
      status: 'sent'
    };
  } catch (error) {
    return {
      success: false,
      messageId: message.key,
      error: error.message
    };
  }
}

async function processQueue() {
  if (isProcessing || messageQueue.length === 0) return;

  isProcessing = true;

  while (messageQueue.length > 0) {
    const message = messageQueue.shift();
    const result = await sendMessage(message);
    
    // Send result back to main thread
    self.postMessage({
      type: 'MESSAGE_RESULT',
      payload: result
    });
  }

  isProcessing = false;
}

// Listen for messages from main thread
self.addEventListener('message', async (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SEND_MESSAGE':
      messageQueue.push(payload);
      processQueue();
      break;

    case 'SEND_MULTIPLE_MESSAGES':
      messageQueue.push(...payload);
      processQueue();
      break;

    default:
      console.warn('Unknown message type:', type);
  }
});