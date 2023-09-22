const server = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const buttons = ['create', 'read', 'update', 'delete'];
  buttons.forEach((button) => document.getElementById(button).addEventListener('click', submit));
});

function submit(event) {
  const action = event.target.id;
  const userId = document.getElementById('userId').value;
  const collectionId = document.getElementById('collectionId').value;
  const documentId = document.getElementById('documentId').value;
  const content = document.getElementById('content').value || 'Default content';

  const url = `${server}/${action}?userId=${userId}&collectionId=${collectionId}&documentId=${documentId}&content=${content}`;

  fetch(url, {method: 'POST'})
  .then((response) => response.json())
  .then((data) => {
      const output = document.getElementById('output');
      output.innerText = JSON.stringify(data, null, 2);
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}
