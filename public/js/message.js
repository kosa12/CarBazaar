document.addEventListener('DOMContentLoaded', () => {
  const messageForm = document.getElementById('messageForm');

  if (messageForm) {
    messageForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const messageContent = document.getElementById('messageContent').value;
      const senderID = messageForm.getAttribute('data-sender-id');
      const receiverUsername = messageForm.getAttribute('data-receiver-username');

      try {
        const response = await fetch(`/advertisement/addmessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messageContent, senderID, receiverUsername }),
        });

        if (response.ok) {
          const data = await response.json();
          alert(data.message);
          messageForm.reset();
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Failed to send message.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while sending the message.');
      }
    });
  }
});
