const messageQueue = [];
let isProcessing = false;
let isConnected = false;

const getRandomDelay = () => Math.floor(Math.random() * (15000 - 3000 + 1) + 3000);


async function sendMessage(message) {
  try {
    await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

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
  if (isProcessing || messageQueue.length === 0 || !isConnected) return;

  isProcessing = true;

  while (messageQueue.length > 0 && isConnected) {
    const message = messageQueue.shift();
    const result = await sendMessage(message);
    
    self.postMessage({
      type: 'MESSAGE_RESULT',
      payload: result
    });
  }

  isProcessing = false;
}

self.addEventListener('message', async (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SET_CONNECTION_STATUS':
      isConnected = payload.isConnected;
      if (isConnected) {
        processQueue();
      }
      break;

    case 'SEND_MESSAGE':
      messageQueue.push(payload);
      if (isConnected) {
        processQueue();
      }
      break;

    case 'SEND_MULTIPLE_MESSAGES':
      messageQueue.push(...payload);
      if (isConnected) {
        processQueue();
      }
      break;

    case 'ADD_PENDING_MESSAGES':
      const newMessages = payload.filter(msg => 
        !messageQueue.some(qMsg => qMsg.key === msg.key)
      );
      if (newMessages.length > 0) {
        messageQueue.push(...newMessages);
        if (isConnected) {
          processQueue();
        }
      }
      break;

    default:
      console.warn('Unknown message type:', type);
  }
});