document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded and parsed');

  const offerList = document.getElementById('offerList');

  if (offerList) {
    const advertisementIdElement = document.getElementById('advertisementId');
    const advertisementId = advertisementIdElement.getAttribute('data-advertisement-id');
    fetchOffers(advertisementId)
      .then((data) => {
        if (data && data.success && data.offers) {
          renderOffers(data);
        } else {
          displayNoOffersMessage(offerList);
        }
      })
      .catch((error) => {
        console.error('Error fetching offers:', error);
        displayErrorMessage(offerList);
      });

    offerList.addEventListener('click', function (event) {
      if (event.target.classList.contains('accept-offer-button')) {
        const offerId = event.target.dataset.offerId;
        const confirmation = confirm(`Are you sure you want to sell this car?`);
        if (confirmation) {
          handleOfferAction(offerId, 'accept');
        }
      } else if (event.target.classList.contains('decline-offer-button')) {
        const offerId = event.target.dataset.offerId;
        handleOfferAction(offerId, 'decline');
      }
    });
  } else {
    console.error('Element with ID offerList not found.');
  }
});

function fetchOffers(advertisementId) {
  return fetch(`/advertisement/${advertisementId}/offers`)
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(errorData)}`);
        });
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error fetching offers:', error);
      throw error;
    });
}

function handleOfferAction(offerId, action) {
  fetch(`/offers/${offerId}/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(errorData)}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        if (data.success) {
          const offerElement = document.getElementById(`offer-${offerId}`);
          if (offerElement) {
            offerElement.remove();
          } else {
            console.error('Offer element not found in DOM');
          }
          alert(data.message);
        } else {
          console.error('Error with offer action:', data.message);
        }
      } else {
        console.error('Error with offer action:', data.message);
      }
    })
    .catch((error) => {
      console.error('Error with offer action:', error);
    });
}

function renderOffers(responseData) {
  const offerList = document.getElementById('offerList');

  if (offerList) {
    while (offerList.firstChild) {
      offerList.removeChild(offerList.firstChild);
    }

    const centerDiv = document.createElement('div');
    centerDiv.className = 'p-4 flex items-center justify-center flex-col';
    offerList.appendChild(centerDiv);

    const title = document.createElement('div');
    title.className = 'title mb-4 mt-10 text-2xl font-semibold text-center';
    title.textContent = 'Offers:';
    centerDiv.appendChild(title);

    const table = document.createElement('table');
    table.className = 'w-full mb-8 border-2 border-gray-300 rounded-lg';
    centerDiv.appendChild(table);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    if (responseData && responseData.offers && Array.isArray(responseData.offers)) {
      const offers = responseData.offers;

      if (offers.length > 0) {
        offers.forEach((offer) => {
          const row = document.createElement('tr');
          row.id = `offer-${offer.id}`;

          const createdAt = new Date(offer.created_at);
          const formattedDate = `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`;

          const priceCell = document.createElement('td');
          priceCell.className = 'ml-4 text-xl px-4 py-2 border-b border-gray-200 rounded-lg';
          priceCell.textContent = `$${offer.price}`;
          row.appendChild(priceCell);

          const dateCell = document.createElement('td');
          dateCell.className = 'text-xl px-4 py-2 border-b border-gray-200 rounded-lg';
          dateCell.textContent = formattedDate;
          row.appendChild(dateCell);

          const usernameCell = document.createElement('td');
          usernameCell.className = 'text-xl px-4 py-2 border-b border-gray-200 rounded-lg';
          usernameCell.textContent = offer.username;
          row.appendChild(usernameCell);

          const acceptCell = document.createElement('td');
          acceptCell.className = 'text-xl px-4 py-2 border-b border-gray-200 rounded-lg';
          const acceptButton = document.createElement('button');
          acceptButton.textContent = 'Accept';
          acceptButton.className =
            'accept-offer-button bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-md mr-2';
          acceptButton.dataset.offerId = offer.id;
          acceptCell.appendChild(acceptButton);
          row.appendChild(acceptCell);

          const declineCell = document.createElement('td');
          declineCell.className = 'text-xl px-4 py-2 border-b border-gray-200 rounded-lg';
          const declineButton = document.createElement('button');
          declineButton.textContent = 'Decline';
          declineButton.className = 'decline-offer-button bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded-md';
          declineButton.dataset.offerId = offer.id;
          declineCell.appendChild(declineButton);
          row.appendChild(declineCell);

          tbody.appendChild(row);
        });
      } else {
        displayNoOffersMessage(centerDiv);
      }
    } else {
      displayNoOffersMessage(centerDiv);
    }
  }
}

function displayNoOffersMessage(container) {
  // Clear previous content
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Add message in the center
  const message = document.createElement('div');
  message.className = 'text-center py-4';
  message.textContent = 'No offers yet.';
  container.appendChild(message);
}

function displayErrorMessage(container) {
  // Clear previous content
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Add message in the center
  const message = document.createElement('div');
  message.className = 'text-center py-4';
  message.textContent = 'Error fetching offers. Please try again later.';
  container.appendChild(message);
}
