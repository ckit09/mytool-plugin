// adding a new bookmark row to the popup
const addNewBookmark = () => {};

const viewBookmarks = () => {};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#testAPI").addEventListener("click", () => {
    sendRequest();
  });
  document.querySelector("#openNewTab").addEventListener("click", () => {
    openNewTab();
  });
  document.querySelector("#suspendAllTabsBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "suspendAllTabs" });
    window.close(); // Close the popup after action
  });
  document.querySelector("#exemptCurrentTabBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.runtime.sendMessage({ action: "exemptCurrentTab", tabId: tabs[0].id });
        // alert(`Tab "${tabs[0].title}" exempted from suspension.`);
      }
    });
  });
  document.querySelector("#listExemptionsBtn").addEventListener("click", async () => {
    const response = await chrome.runtime.sendMessage({ action: "getExemptionList" });
    const exemptionListDisplay = document.getElementById("exemptionListContainer");
    exemptionListDisplay.innerHTML = ''; // Clear previous list

    if (response && response.exemptedTabs && response.exemptedTabs.length > 0) {
      for (const tabId of response.exemptedTabs) {
        let tabTitle = `ID: ${tabId} (Tab not found/closed)`;
        try {
          const tab = await chrome.tabs.get(tabId);
          tabTitle = `"${tab.title}" (ID: ${tab.id})`;
        } catch (e) {
          console.warn(`Could not get details for exempted tab ID ${tabId}:`, e);
        }

        const tabEntry = document.createElement('div');
        tabEntry.className = 'exemption-item';
        tabEntry.innerHTML = `
          <button class="remove-exemption-btn" data-tab-id="${tabId}">✖</button>
          <span>${tabTitle}</span>
        `;
        exemptionListDisplay.appendChild(tabEntry);
      }
    } else {
      exemptionListDisplay.innerHTML = '<p>No tabs currently exempted.</p>';
    }
  });

  // Add event listener for dynamically created remove buttons
  document.getElementById("exemptionListContainer").addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-exemption-btn")) {
      const tabIdToRemove = parseInt(event.target.dataset.tabId);
      chrome.runtime.sendMessage({ action: "removeExemption", tabId: tabIdToRemove });
      event.target.closest('.exemption-item').remove(); // Remove the item from display
      // alert(`Tab (ID: ${tabIdToRemove}) removed from exemption.`);
    }
  });
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