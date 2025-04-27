document.addEventListener("keydown", (event) => {
    // Check for Ctrl+T (or Cmd+T on Mac)
    if ((event.ctrlKey || event.metaKey) && event.key === "t") {
      console.log("Ctrl+T detected in content script");
      event.preventDefault(); // Prevent default Chrome Ctrl+T behavior
      event.stopPropagation(); // Stop event from bubbling
  
      // Send message to background script to open tab
      chrome.runtime.sendMessage({ action: "openTabNext" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message to background:", chrome.runtime.lastError.message);
        } else if (response && response.success) {
          console.log("Tab opened successfully via Ctrl+T");
        } else {
          console.error("Failed to open tab via Ctrl+T");
        }
      });
    }
  }, true); // Use capture phase to intercept early