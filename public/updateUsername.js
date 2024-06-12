window.onload = () => {
  const usernameForm = document.getElementById('usernameForm');

  usernameForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newUsername = document.getElementById('newUsername').value;
    const userId = usernameForm.action.split('/').slice(-3, -2)[0];
    try {
      const response = await fetch(`/user/${userId}/settings/username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newUsername }),
      });

      if (response.status === 200) {
        alert('Username updated successfully!');
        window.location.href = `/user/${userId}/settings`;
      } else if (response.status === 409) {
        alert('Username already exists. Please choose a different username.');
      } else if (response.status === 403) {
        alert('Unauthorized access.');
      } else if (response.status === 404) {
        alert('User not found or username not updated.');
      } else {
        alert('An error occurred while updating the username.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the username.');
    }
  });
};
