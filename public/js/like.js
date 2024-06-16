document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.heart-icon').forEach((icon) => {
    icon.addEventListener('click', async (event) => {
      event.preventDefault();

      const heartIcon = event.currentTarget;
      const advertisementId = heartIcon.dataset.advertisementId;
      const userId = heartIcon.dataset.userId;

      if (!userId) {
        alert('You must be logged in to like advertisements.');
        return;
      }

      const isLiked = heartIcon.querySelector('img').src.includes('full-heart.png');

      try {
        if (isLiked) {
          heartIcon.querySelector('img').src = '/icons/heart.png';

          await fetch(`/unliked`, {
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

        const detailsDiv = document.getElementById(`details-${advertisementId}`);
        const detailsData = await fetchAdvertisementDetails(advertisementId);
        updateDetailsDiv(detailsDiv, detailsData);
      } catch (error) {
        console.error('Error updating like status:', error);
      }
    });
  });

  const viewDetailLinks = document.querySelectorAll('.view-details');

  viewDetailLinks.forEach((link) => {
    link.addEventListener('click', handleViewDetailsClick);
  });
});

async function fetchAdvertisementDetails(adId) {
  try {
    const response = await fetch(`/advertisement/${adId}/details`);
    if (!response.ok) {
      throw new Error('Failed to fetch advertisement details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching advertisement details:', error);
    throw error;
  }
}

function updateDetailsDiv(detailsDiv, data) {
  const { fuel_type, transmission, kilometers, likes } = data;

  detailsDiv.textContent = '';

  const fuelTypeParagraph = document.createElement('p');
  fuelTypeParagraph.textContent = `Fuel Type: ${fuel_type}`;

  const transmissionParagraph = document.createElement('p');
  transmissionParagraph.textContent = `Transmission: ${transmission}`;

  const kilometersParagraph = document.createElement('p');
  kilometersParagraph.textContent = `Kilometers used: ${kilometers} km`;

  const likeCountParagraph = document.createElement('p');
  likeCountParagraph.textContent = `Liked by: ${likes} users`;

  const createDelimiter = () => {
    const delimiter = document.createElement('div');
    delimiter.style.borderTop = '1px solid #ccc';
    delimiter.style.margin = '10px 0';
    return delimiter;
  };

  detailsDiv.appendChild(fuelTypeParagraph);
  detailsDiv.appendChild(createDelimiter());
  detailsDiv.appendChild(transmissionParagraph);
  detailsDiv.appendChild(createDelimiter());
  detailsDiv.appendChild(kilometersParagraph);
  detailsDiv.appendChild(createDelimiter());
  detailsDiv.appendChild(likeCountParagraph);
}

function handleViewDetailsClick(event) {
  event.preventDefault();
  const adId = this.getAttribute('data-id');
  const detailsDiv = document.getElementById(`details-${adId}`);

  console.log(`View More Info clicked for adId: ${adId}`);

  fetchAdvertisementDetails(adId)
    .then((data) => {
      console.log('Received data:', data);
      updateDetailsDiv(detailsDiv, data);
    })
    .catch((error) => {
      console.error('Error fetching advertisement details:', error);
    });
}
