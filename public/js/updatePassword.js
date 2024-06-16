document.addEventListener('DOMContentLoaded', () => {
  const usernameForm = document.getElementById('passwordForm');

  usernameForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const currentPassword = document.getElementById('currentPassword').value;
    const userId = usernameForm.action.split('/').slice(-3, -2)[0];

    try {
      const response = await fetch(`/user/${userId}/settings/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        window.location.href = `/user/${userId}/settings`;
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'An error occurred while updating the password.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the username.');
    }
  });
});
