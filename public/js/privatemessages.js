document.addEventListener('DOMContentLoaded', () => {
  const userList = document.getElementById('userList');
  const conversationDiv = document.getElementById('conversation');
  const messageInput = document.getElementById('messageInput');
  const sendMessageButton = document.getElementById('sendMessageButton');
  let currentUserId = null;

  function formatTimestamp(timestamp) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(timestamp);
  }

  // Function to render conversation
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
    conversationDiv.scrollTo(0, conversationDiv.scrollHeight);
  }

  async function loadConversation(userId) {
    try {
      const response = await fetch(`/privatemessages/conversation/${userId}`);
      const data = await response.json();
      renderConversation(data.messages);
    } catch (error) {
      console.error('Error loading conversation:', error);
      conversationDiv.innerHTML = '<p>Error loading conversation.</p>';
    }
  }

  userList.addEventListener('click', (event) => {
    if (event.target.classList.contains('user-button')) {
      currentUserId = event.target.getAttribute('data-user-id');
      loadConversation(currentUserId);
    }
  });

  sendMessageButton.addEventListener('click', () => {
    if (currentUserId && messageInput.value.trim()) {
      sendMessage(currentUserId, messageInput.value.trim());
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
        loadConversation(receiverId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  const firstUserButton = userList.querySelector('.user-button');
  if (firstUserButton) {
    firstUserButton.click();
  }
});
