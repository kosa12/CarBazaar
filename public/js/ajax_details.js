// Define the fetchAdvertisementDetails function to fetch advertisement details asynchronously
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

// Function to update details in the DOM based on fetched data
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

// Event handler function for clicking on "View More Info" buttons
function handleViewDetailsClick(event) {
  event.preventDefault();
  const adId = this.getAttribute('data-id');
  const detailsDiv = document.getElementById(`details-${adId}`);

  console.log(`View More Info clicked for adId: ${adId}`);

  // Fetch advertisement details and update detailsDiv on success
  fetchAdvertisementDetails(adId)
    .then((data) => {
      console.log('Received data:', data);
      updateDetailsDiv(detailsDiv, data);
    })
    .catch((error) => {
      console.error('Error fetching advertisement details:', error);
    });
}

// Select all elements with class "view-details" and attach event listener
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded and parsed. Adding event listeners.');

  const viewDetailLinks = document.querySelectorAll('.view-details');

  viewDetailLinks.forEach((link) => {
    link.addEventListener('click', handleViewDetailsClick);
  });
});
