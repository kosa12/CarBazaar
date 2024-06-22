document.addEventListener('DOMContentLoaded', function () {
  const buyButtons = document.querySelectorAll('.buy-btn');
  const offerButtons = document.querySelectorAll('.offer-btn');
  const removeButtons = document.querySelectorAll('.remove-btn');

  buyButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const advertisementId = this.getAttribute('data-advertisement-id');
      fetch(`/cart/buy/${advertisementId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ advertisementId }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            alert('Advertisement bought successfully!');
          } else {
            alert('Failed to buy advertisement.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
        });
    });
  });

  offerButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const advertisementId = this.getAttribute('data-advertisement-id');
      showOfferModal(advertisementId);
    });
  });

  function showOfferModal(advertisementId) {
    const modal = document.getElementById('offerModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const offerForm = document.getElementById('offerForm');
    offerForm.addEventListener('submit', handleOfferSubmission);

    function handleOfferSubmission(event) {
      event.preventDefault();
      const offerAmount = document.getElementById('offerAmount').value;
      fetch(`/cart/offer/${advertisementId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ advertisementId, offerAmount }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            alert(data.message);
            hideOfferModal();
          } else {
            alert('Failed to place offer.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
        });
    }
  }

  function hideOfferModal() {
    const modal = document.getElementById('offerModal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }

  removeButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const advertisementId = this.getAttribute('data-advertisement-id');
      fetch(`/cart/remove/${advertisementId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            alert('Advertisement removed from cart successfully!');
            this.closest('.advertisement').remove();
          } else {
            alert('Failed to remove advertisement from cart.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
        });
    });
  });
});
