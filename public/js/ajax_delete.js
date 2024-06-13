document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.delete-image').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const imageDiv = event.target.closest('.image');
      const adID = imageDiv.getAttribute('data-id');
      const imageID = adID.split('/')[2];
      try {
        const response = await fetch(`/advertisement/${imageID}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete image');
        }

        if (response.status === 200) {
          imageDiv.remove();
          alert('Image deleted successfully');
        } else {
          alert('Failed to delete image');
        }
      } catch (error) {
        console.error('Failed to delete image:', error);
        alert('An unexpected error occurred. Please try again later.');
      }
    });
  });
});
