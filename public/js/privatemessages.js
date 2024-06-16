document.addEventListener('DOMContentLoaded', () => {
  const userList = document.getElementById('userList');
  const conversationDiv = document.getElementById('conversation');
  const messageInput = document.getElementById('messageInput');
  const sendMessageButton = document.getElementById('sendMessageButton');
  let currentUserId = null;

  userList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('user-button')) {
      currentUserId = event.target.getAttribute('data-user-id');
      await loadConversation(currentUserId);
    }
  });

  async function loadConversation(userId) {
    try {
      const response = await fetch(`/privatemessages/conversation/${userId}`);
      const data = await response.json();
      renderConversation(data.messages);
    } catch (error) {
      console.error('Error loading conversation:', error);
      renderError('Error loading conversation.');
    }
  }

  function renderConversation(messages) {
    conversationDiv.innerHTML = '';
    messages.forEach((message) => {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', 'p-2', 'mb-2', 'bg-gray-200', 'rounded-lg');

      const senderText = document.createElement('strong');
      senderText.textContent = `${message.sender_username}: `;
      messageDiv.appendChild(senderText);

      const messageText = document.createElement('span');
      messageText.textContent = message.message_content;
      messageDiv.appendChild(messageText);

      const timestampText = document.createElement('small');
      const timestamp = new Date(message.timestamp);
      timestampText.textContent = formatTimestamp(timestamp);
      messageDiv.appendChild(document.createElement('br'));
      messageDiv.appendChild(timestampText);

      conversationDiv.appendChild(messageDiv);
    });
  }

  function formatTimestamp(timestamp) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(timestamp);
  }

  function renderError(message) {
    conversationDiv.innerHTML = `<p>${message}</p>`;
  }

  sendMessageButton.addEventListener('click', async () => {
    const messageContent = messageInput.value.trim();
    if (currentUserId && messageContent) {
      await sendMessage(currentUserId, messageContent);
      messageInput.value = '';
    }
  });

  async function sendMessage(receiverId, messageContent) {
    try {
      const response = await fetch(`/privatemessages/conversation/${receiverId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageContent }),
      });

      const data = await response.json();
      if (data.message) {
        await loadConversation(receiverId);
      } else {
        console.error('Error sending message:', data.error || 'Unknown error');
        renderError('Failed to send message.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      renderError('An error occurred while sending the message.');
    }
  }
});
