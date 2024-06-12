window.onload = () => {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/login', {
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
      errorMessage.textContent = error.message;
      errorMessage.style.display = 'block';
    }
  });
};
