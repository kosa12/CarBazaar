async function fetchAdvertisementDetails(adId) {
  try {
    const response = await fetch(`/advertisement/${adId}/details`);
    if (!response.ok) {
      throw new Error('Failed to fetch advertisement details');
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching advertisement details:', error);
    throw error;
  }
}

function updateDetailsDiv(detailsDiv, data) {
  const parsedData = JSON.parse(data);
  const fuel_type = parsedData.fuel_type;
  const transmission = parsedData.transmission;
  const kilometers = parsedData.kilometers;
  const likeCount = parsedData.likes;

  detailsDiv.textContent = '';

  const fuelTypeParagraph = document.createElement('p');
  fuelTypeParagraph.textContent = `Fuel Type: ${fuel_type}`;

  const transmissionParagraph = document.createElement('p');
  transmissionParagraph.textContent = `Transmission: ${transmission}`;

  const kilometersParagraph = document.createElement('p');
  kilometersParagraph.textContent = `Kilometers used: ${kilometers} km`;

  const likeCountParagraph = document.createElement('p');
  likeCountParagraph.textContent = `Liked by: ${likeCount} users`;

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

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded and parsed. Adding event listeners.');

  const viewDetailLinks = document.querySelectorAll('.view-details');

  viewDetailLinks.forEach((link) => {
    link.addEventListener('click', handleViewDetailsClick);
  });
});
