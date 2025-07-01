import { suspendAllTabs, exemptTab, getExemptionList, removeExemption } from './suspendTab.js';
console.log("trigger main.js");

chrome.contextMenus.onClicked.addListener(genericOnClick);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "suspendAllTabs") {
    suspendAllTabs();
  } else if (request.action === "exemptCurrentTab") {
    exemptTab(request.tabId);
  } else if (request.action === "getExemptionList") {
    sendResponse({ exemptedTabs: getExemptionList() });
    return true; // Indicates that sendResponse will be called asynchronously
  } else if (request.action === "removeExemption") {
    removeExemption(request.tabId);
  }
});

const searchDictionary = function (word) {
  var query = word;
  console.log("query: ", query);
  chrome.tabs.create({url: "http://www.urbandictionary.com/define.php?term=" + query});
};

// A generic onclick callback function.l
function genericOnClick(info) {
  console.log("info", info);
  switch (info.menuItemId) {
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