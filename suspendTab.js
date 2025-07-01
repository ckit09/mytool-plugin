const IDLE_TIME_THRESHOLD = 60 * 1000; // 1 minute in milliseconds
const CHECK_INTERVAL = 5 * 1000; // Check every 5 seconds
const LOG_INTERVAL = 60 * 1000; // Log every 1 minute

let tabActivity = {}; // Stores {tabId: lastActiveTimestamp}

// Update activity on tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  tabActivity[activeInfo.tabId] = Date.now();
});

// Update activity on tab update (e.g., page load, URL change)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    tabActivity[tabId] = Date.now();
  }
});

// Periodically check for idle Google tabs to suspend
setInterval(() => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const lastActive = tabActivity[tab.id] || 0;
      const idleTime = Date.now() - lastActive;

      if (!tab.discarded && idleTime >= IDLE_TIME_THRESHOLD) {
        chrome.tabs.discard(tab.id);
        console.log(`Discarded tab ${tab.id} - ${tab.title} due to idling for ${Math.round(idleTime / 1000)} seconds.`);
      }
    });
  });
}, CHECK_INTERVAL);

// Periodically log status summary of all tabs
setInterval(() => {
  chrome.tabs.query({}, (tabs) => {
    const totalTabs = tabs.length;
    const suspendedTabs = tabs.filter(tab => tab.discarded).length;

    let logMessage = `--- Tab Status Summary (${new Date().toLocaleTimeString()}) ---\n`;
    logMessage += `Suspended Tabs: ${suspendedTabs} / ${totalTabs} are suspended\n\n`;
    logMessage += `List of each tab status:\n`;

    tabs.forEach((tab) => {
      const lastActive = tabActivity[tab.id] || 0;
      const idleTime = Date.now() - lastActive;
      const idleTimeSeconds = Math.round(idleTime / 1000);
      logMessage +=
        `ID: ${tab.id} | URL: "${tab.url}" | ` +
        `Discarded: ${tab.discarded} | Idle For: ${idleTimeSeconds} seconds\n`;
    });
    logMessage += `----------------------------------------------------`;

    console.log(logMessage);
  });
}, LOG_INTERVAL);

// Clean up tabActivity for closed tabs
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabActivity[tabId];
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "suspend_all_tabs",
    title: "Suspend All Tabs",
    contexts: ["action"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "suspend_all_tabs") {
    suspendAllTabs();
  }
});

function suspendAllTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (!tab.discarded) {
        chrome.tabs.discard(tab.id);
        console.log(`Tab ${tab.id} - ${tab.title} discarded.`);
      }
    });
  });
} 