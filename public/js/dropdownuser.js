window.onload = () => {
  const dropdownButton = document.getElementById('dropdownUserAvatarButton');
  const dropdownMenu = document.getElementById('dropdownAvatar');

  dropdownButton.addEventListener('click', function () {
    dropdownMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', function (e) {
    if (!dropdownButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.add('hidden');
    }
  });
};
