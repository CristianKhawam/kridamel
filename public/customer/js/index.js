// Script for index.html. Working example of the pattern every page follows:
// show "loading", call the API with api(), then show the data or the error.
const statusEl = document.getElementById('status');

async function checkServer() {
  statusEl.textContent = 'Checking server…';
  try {
    const data = await api('/api/health');
    statusEl.textContent = `Server status: ${data.status}`;
  } catch (err) {
    statusEl.textContent = `Could not reach the server: ${err.message}`;
    statusEl.classList.add('error');
  }
}

checkServer();
