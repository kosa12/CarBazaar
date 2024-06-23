document.addEventListener('DOMContentLoaded', function () {
  function decodeEntities(encodedString) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
  }

  var likesDataElement = document.getElementById('likesData');
  var likesDataEncoded = likesDataElement.textContent.trim();
  var likesDataDecoded = decodeEntities(likesDataEncoded);

  try {
    var likes = JSON.parse(likesDataDecoded);

    document.querySelectorAll('.likes-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        var adId = this.getAttribute('data-id');
        var users = likes[adId] || [];

        var modal = document.getElementById('likesModal');
        var likesList = modal.querySelector('#likesList');
        likesList.innerHTML = '';

        users.forEach(function (user) {
          var li = document.createElement('li');
          li.textContent = user;
          likesList.appendChild(li);
        });

        modal.style.display = 'block';
      });
    });

    var closeModal = function () {
      var modal = document.getElementById('likesModal');
      modal.style.display = 'none';
    };

    var span = document.getElementsByClassName('close')[0];
    if (span) {
      span.onclick = closeModal;
    }

    window.onclick = function (event) {
      var modal = document.getElementById('likesModal');
      if (event.target === modal) {
        closeModal();
      }
    };
  } catch (error) {
    console.error('Error parsing likes data:', error);
    console.error('Likes data:', likesDataDecoded);
  }
});
