document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.heart-icon').forEach((icon) => {
    icon.addEventListener('click', async (event) => {
      event.preventDefault(); // Prevent default anchor behavior

      const heartIcon = event.currentTarget;
      const advertisementId = heartIcon.dataset.advertisementId;
      const userId = heartIcon.dataset.userId;

      const isLiked = heartIcon.querySelector('img').src.includes('full-heart.png');

      try {
        if (isLiked) {
          heartIcon.querySelector('img').src = '/icons/heart.png';

          fetch(`/unliked`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, advertisementId }),
          });
        } else {
          heartIcon.querySelector('img').src = '/icons/full-heart.png';

          await fetch(`/liked`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, advertisementId }),
          });
        }
      } catch (error) {
        console.error('Error updating like status:', error);
        // Optionally display an error message to the user
      }
    });
  });
});
