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
    const result = document.querySelector("#result");
    if (result) {
      alert("api response already retrieved")
      return
    };

    var div = document.createElement('div');
    div.id = "result"
    div.innerHTML = data;
    document.body.appendChild(div)
    console.log(data);
    // alert(data)
  })
  .catch(error => {
    console.log('Error:', error);
  });
}