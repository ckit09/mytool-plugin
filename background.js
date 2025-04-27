// Create context menu item
chrome.contextMenus.create({
  id: "openTabNext",
  title: "Open New Tab Next",
  contexts: ["all"]
}, () => {
  if (chrome.runtime.lastError) {
    console.error("Error creating context menu:", chrome.runtime.lastError.message);
  } else {
    console.log("Context menu 'Open New Tab Next' created successfully");
  }
});

// Function to open a new tab next to the current tab
function openTabNext(currentTab) {
  if (!currentTab) {
    console.error("No valid tab provided");
    chrome.tabs.create({ url: "about:blank", active: true });
    return;
  }
  console.log(`Opening tab next to Tab ID: ${currentTab.id}, Index: ${currentTab.index}, URL: ${currentTab.url}`);

  // Validate tab index
  if (typeof currentTab.index !== "number" || currentTab.index < 0) {
    console.warn("Invalid tab index, opening tab at the end");
    chrome.tabs.create({
      url: "about:blank",
      active: true
    }, (newTab) => {
      if (chrome.runtime.lastError) {
        console.error("Error creating tab:", chrome.runtime.lastError.message);
      } else {
        console.log(`New tab created with ID: ${newTab.id}, Index: ${newTab.index}`);
      }
    });
    return;
  }

  // Open new tab at index + 1
  chrome.tabs.create({
    url: "about:blank",
    index: currentTab.index + 1,
    active: true
  }, (newTab) => {
    if (chrome.runtime.lastError) {
      console.error("Error creating tab:", chrome.runtime.lastError.message);
      chrome.tabs.create({ url: "about:blank", active: true });
    } else {
      console.log(`New tab created with ID: ${newTab.id}, Index: ${newTab.index}`);
    }
  });
}

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openTabNext") {
    console.log("Context menu 'Open New Tab Next' clicked");
    openTabNext(tab);
  }
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "open-tab-next") {
    console.log("Shortcut 'open-tab-next' (Ctrl+Shift+N) triggered");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        openTabNext(tabs[0]);
      } else {
        console.error("No active tab found");
        chrome.tabs.create({ url: "about:blank", active: true });
      }
    });
  }
});

// Handle toolbar button click
chrome.action.onClicked.addListener((tab) => {
  console.log("Toolbar button clicked");
  openTabNext(tab);
});

// Handle messages from content script (Ctrl+T)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openTabNext") {
    console.log("Ctrl+T intercepted by content script");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        openTabNext(tabs[0]);
        sendResponse({ success: true });
      } else {
        console.error("No active tab found");
        sendResponse({ success: false });
      }
    });
    return true; // Keep message channel open for async response
  }
});