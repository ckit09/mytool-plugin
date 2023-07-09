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

searchDictionary = function (word) {
  var query = word;
  console.log("query: ", query);
  chrome.tabs.create({
    url: "http://www.urbandictionary.com/define.php?term=" + query,
  });
};

chrome.contextMenus.onClicked.addListener(genericOnClick);

// A generic onclick callback function.l
function genericOnClick(info) {
  console.log('info', info);
  switch (info.menuItemId) {
    case "dictionary":
      // Radio item function
      console.log("dictionary item clicked, selected text: " + info.selectionText);
      searchDictionary(info.selectionText)
      break;
    case "checkbox":
      // Checkbox item function
      console.log("Checkbox item clicked. Status:", info.checked);
      break;
    default:
      // Standard context menu item function
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

  // // Create a radio item.
  // chrome.contextMenus.create({
  //   title: "radio",
  //   type: "radio",
  //   id: "radio",
  // });

  // Create a checkbox item.
  chrome.contextMenus.create({
    title: "checkbox_button",
    type: "checkbox",
    id: "checkbox",
  });
});
