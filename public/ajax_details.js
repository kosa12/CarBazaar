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
  const { username } = parsedData;
  const date = new Date(parsedData.date);

  detailsDiv.textContent = '';

  const ownerParagraph = document.createElement('p');
  ownerParagraph.textContent = `Owner: ${username}`;

  const dateParagraph = document.createElement('p');
  dateParagraph.textContent = `Published date: ${date.toLocaleString()}`;

  detailsDiv.appendChild(ownerParagraph);
  detailsDiv.appendChild(dateParagraph);
}

function handleViewDetailsClick(event) {
  event.preventDefault();
  const adId = this.getAttribute('data-id');
  const detailsDiv = document.getElementById(`details-${adId}`);

  fetchAdvertisementDetails(adId)
    .then((data) => {
      updateDetailsDiv(detailsDiv, data);
    })
    .catch((error) => {
      console.error('Error fetching advertisement details:', error);
    });
}

window.onload = () => {
  const viewDetailLinks = document.querySelectorAll('.view-details');

  viewDetailLinks.forEach((link) => {
    link.addEventListener('click', handleViewDetailsClick);
  });
};
