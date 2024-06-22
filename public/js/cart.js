document.addEventListener('DOMContentLoaded', function () {
  const cartIcons = document.querySelectorAll('.cart-icon');

  cartIcons.forEach((icon) => {
    icon.addEventListener('click', function (event) {
      event.preventDefault();
      const advertisementId = this.getAttribute('data-advertisement-id');
      const userId = this.getAttribute('data-user-id');

      if (!userId) {
        alert('You must be logged in to add to your cart.');
        return;
      }

      fetch(`/cart/add-to-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          advertisementId: advertisementId,
          userId: userId,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            alert('Car added to your cart!');
          } else {
            alert(data.message);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
        });
    });
  });
});
