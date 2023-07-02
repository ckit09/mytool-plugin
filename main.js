console.log("trigger main.js");

chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      const queryParameters = tab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
  
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        videoId: urlParameters.get("v"),
      });
    }
  });

searchDictionary = function(word){
  var query = word.selectionText;
  console.log('query: ', query);
  chrome.tabs.create({url: "http://www.urbandictionary.com/define.php?term=" + query})
};

chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create({
   id: "1",
   title: "Search in UrbanDictionary",
   contexts:["selection"],  // ContextType
  }); 
  chrome.contextMenus.create({
   id: "2",
   type: "checkbox",
   checked: true,
   title: "test",
   contexts:["browser_action"],  // ContextType
  }); 
})

chrome.contextMenus.onClicked.addListener(searchDictionary);