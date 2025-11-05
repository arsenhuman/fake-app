document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('kv-form');
  const keyInput = document.getElementById('key');
  const valueInput = document.getElementById('value');
  const status = document.getElementById('status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const key = keyInput.value.trim();
    const value = valueInput.value.trim();

    if (!key || !value) return;

    try {
      const res = await fetch('/api/kv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });

      if (res.ok) {
        status.textContent = '✅ OK';
        status.style.color = 'green';
      } else {
        status.textContent = '❌ Failed';
        status.style.color = 'red';
      }
    } catch (err) {
      console.error('Fetch error:', err);
      status.textContent = '❌ Network error';
      status.style.color = 'red';
    }

    keyInput.value = '';
    valueInput.value = '';
  });
});

