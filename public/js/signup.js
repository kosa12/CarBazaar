document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const errorMessage = document.getElementById('errorMessage');

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(signupForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An unexpected error occurred');
      }

      window.location.href = '/';
    } catch (error) {
      if (errorMessage) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
      } else {
        console.error('Error message element not found:', error);
      }
    }
  });
});
