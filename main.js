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

// searchUrbanDict = function(word){
//   var query = word.selectionText;
//   chrome.tabs.create({url: "http://www.urbandictionary.com/define.php?term=" + query});
// };

//   chrome.contextMenus.create({
//   title: "Search in UrbanDictionary",
//   contexts:["selection"],  // ContextType
//   onclick: searchUrbanDict // A callback function
// });

searchTerapeak = function(word){
  var query = word.selectionText;
  chrome.tabs.create({url: "https://www.ebay.com/sh/research?dayRange=365&sorting=-avgsalesprice&tabName=SOLD&keywords="
+ query});  };

chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create({
   id: "1",
   title: "Terapeak this!",
   contexts:["selection"],  // ContextType
  }); })

chrome.contextMenus.onClicked.addListener(searchTerapeak);