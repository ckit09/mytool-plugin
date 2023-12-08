console.log("trigger main.js");

// chrome.tabs.onUpdated.addListener((tabId, tab) => {
//   if (tab.url && tab.url.includes("youtube.com/watch")) {
//     const queryParameters = tab.url.split("?")[1];
//     const urlParameters = new URLSearchParams(queryParameters);

//     chrome.tabs.sendMessage(tabId, {
//       type: "NEW",
//       videoId: urlParameters.get("v"),
//     });
//   }
// });

chrome.contextMenus.onClicked.addListener(genericOnClick);

// A generic onclick callback function.l
function genericOnClick(info) {
  console.log("info", info);
  switch (info.menuItemId) {
    case "api":
      sendRequest();
      break;
    case "go_dictionary":
      chrome.tabs.create({url: "http://www.urbandictionary.com/"});
      break;
    case "dictionary":
      console.log("dictionary item clicked, selected text: " + info.selectionText);
      searchDictionary(info.selectionText);
      break;
    case "checkbox":
      console.log("Checkbox item clicked. Status:", info.checked);
      break;
    default:
      console.log("Standard context menu item clicked.");
  }
}

chrome.runtime.onInstalled.addListener(function () {
  //create dictionary query
  chrome.contextMenus.removeAll(function () {
    chrome.contextMenus.create({
      id: "dictionary",
      title: "Search in UrbanDictionary",
      contexts: ["selection"], // ContextType
    });
  });

  chrome.contextMenus.create({
    title: "api",
    id: "api",
  });
  chrome.contextMenus.create({
    title: "Go to Urban Dictionary",
    id: "go_dictionary",
  });
  // Create a parent item and two children.
  let parent = chrome.contextMenus.create({
    title: "Test parent item",
    id: "parent",
  });
  chrome.contextMenus.create({
    title: "Child 1",
    parentId: parent,
    id: "child1",
  });
  chrome.contextMenus.create({
    title: "Child 2",
    parentId: parent,
    id: "child2",
  });

  chrome.contextMenus.create({
    title: "checkbox_button",
    type: "checkbox",
    id: "checkbox",
  });
});

searchDictionary = function (word) {
  var query = word;
  console.log("query: ", query);
  chrome.tabs.create({url: "http://www.urbandictionary.com/define.php?term=" + query});
};

function sendRequest () {
  // const apiUrl = 'https://cors-anywhere.herokuapp.com/https://example.com/';
  const apiUrl = 'https://example.com';
  
  fetch(apiUrl, {})
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Process the API response here
  })
  .catch(error => {
    console.log('Error:', error);
  });
}
