// adding a new bookmark row to the popup
const addNewBookmark = () => {};

const viewBookmarks = () => {};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

document.addEventListener("DOMContentLoaded", () => {});
document.querySelector("#testAPI").addEventListener("click", () => {
  sendRequest()
});
document.querySelector("#openNewTab").addEventListener("click", () => {
  openNewTab()
});

function openNewTab () {
  const script = document.createElement('script');
  script.src = 'https://example.com';
  document.body.appendChild(script);
  window.open("https://example.com","_blank")
}

function sendRequest () {
  const apiUrl = 'https://cors-anywhere.herokuapp.com/https://example.com/';
  // const apiUrl = 'https://example.com';
  
  fetch(apiUrl, {})
  .then(response => response.text())
  .then(data => {
    console.log(data);
    // Process the API response here
  })
  .catch(error => {
    console.log('Error:', error);
  });
}