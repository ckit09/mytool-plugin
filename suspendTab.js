// This script manages tab suspension and provides status logging for a Chrome Extension.
//
// Major Functionalities:
// 1. Automatic Tab Suspension: Automatically discards (suspends) tabs that have been idle
//    for a specified duration (currently 5 minute). This applies to all URLs.
// 2. Tab Activity Tracking: Monitors tab activation and updates to determine idle time
//    for each open tab.
// 3. Manual Tab Suspension: Provides a context menu item (triggered by right-clicking the
//    extension icon) that allows the user to manually suspend all active tabs.
//    (Note: This functionality is being migrated to a popup button for left-click action.)
// 4. Comprehensive Status Logging: Periodically (every 1 minute) logs a detailed summary
//    of all current tabs to the console. This includes:
//    - Total number of tabs and the count of currently suspended tabs.
//    - For each tab: ID, URL, discarded status, and calculated idle time.
// 5. Tab Activity Cleanup: Removes tracking data for tabs that have been closed to prevent
//    memory leaks.
//
// Expected Results:
// - Tabs that meet the idle criteria will be automatically suspended by the browser,
//   reducing memory usage.
// - Users can manually suspend all tabs via the extension's right-click context menu.
// - A clear, consolidated summary of tab statuses will be available in the browser's
//   developer console at regular intervals.
//
const IDLE_TIME_THRESHOLD = 5 * 60 * 1000; // 5 minute in milliseconds
const CHECK_INTERVAL = 5 * 1000; // Check every 5 seconds
const LOG_INTERVAL = 60 * 1000; // Log every 1 minute

let tabActivity = {}; // Stores {tabId: lastActiveTimestamp}
let exemptedTabIds = []; // Array to store IDs of tabs to be exempted from suspension

// Update activity on tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  tabActivity[activeInfo.tabId] = Date.now();
});

// Update activity on tab update (e.g., page load, URL change)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  tabActivity[tabId] = Date.now();
});

// Clean up tabActivity for closed tabs and remove from exemption list
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabActivity[tabId];
  const index = exemptedTabIds.indexOf(tabId);
  if (index > -1) {
    exemptedTabIds.splice(index, 1);
  }
});

// Periodically check for idle tabs to suspend
setInterval(() => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const lastActive = tabActivity[tab.id] || 0;
      const idleTime = Date.now() - lastActive;

      if (!tab.discarded && idleTime >= IDLE_TIME_THRESHOLD && !exemptedTabIds.includes(tab.id)) {
        chrome.tabs.discard(tab.id);
        console.log(`Discarded tab ${tab.id} - "${tab.title}" due to idling for ${Math.round(idleTime / 1000)} seconds.`);
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
      const idleTime = lastActive == 0 ? 0 : Date.now() - lastActive;
      const idleTimeSeconds = Math.round(idleTime / 1000);
      const isExempted = exemptedTabIds.includes(tab.id) ? " (EXEMPTED)" : "";
      logMessage +=
        `ID: ${tab.id} | URL: "${tab.url}" | ` +
        `Discarded: ${tab.discarded} | Idle For: ${idleTimeSeconds} seconds | isExempted: ${isExempted}\n`;
    });
    logMessage += `----------------------------------------------------`;

    console.log(logMessage);
  });
}, LOG_INTERVAL);

export function suspendAllTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (!tab.discarded && !exemptedTabIds.includes(tab.id)) { 
        chrome.tabs.discard(tab.id);
        console.log(`Suspended tab ${tab.id} - "${tab.title}".`);
      }
    });
  });
}

export function exemptTab(tabId) {
  if (!exemptedTabIds.includes(tabId)) {
    exemptedTabIds.push(tabId);
    console.log(`Tab ${tabId} added to exemption list.`);
  }
}

export function getExemptionList() {
  return exemptedTabIds;
}

export function removeExemption(tabId) {
  const index = exemptedTabIds.indexOf(tabId);
  if (index > -1) {
    exemptedTabIds.splice(index, 1);
    console.log(`Tab ${tabId} removed from exemption list.`);
  }
} 