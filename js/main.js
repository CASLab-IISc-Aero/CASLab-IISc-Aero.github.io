// Function to load a partial HTML file into a container
function loadPartial(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(html => document.getElementById(id).innerHTML = html)
    .then(() => {
      if (id === 'nav') bindTabEvents();  // Bind events after nav is loaded
    });
}

// Load common partials
loadPartial('header', 'partials/header.html');
loadPartial('nav', 'partials/nav.html');
loadPartial('main-content', 'partials/home.html');  // Load default tab

// Handle tab switching
function bindTabEvents() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const tabId = button.getAttribute('data-tab');
      loadPartial('main-content', `partials/${tabId}.html`);
    });
  });
}

// Optional: Smooth scroll
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `html { scroll-behavior: smooth; }`;
  document.head.appendChild(style);
});
