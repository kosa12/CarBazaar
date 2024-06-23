async function deleteAdvertisement(advertisementId) {
  try {
    const response = await fetch(`/advertisement/${advertisementId}/admin`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete advertisement');
    }

    const result = await response.json();
    if (result.success) {
      alert('Advertisement deleted successfully');
      location.reload();
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

document.querySelectorAll('.delete-btn').forEach((button) => {
  button.addEventListener('click', async (event) => {
    const advertisementId = event.target.dataset.id;
    await deleteAdvertisement(advertisementId);
  });
});
