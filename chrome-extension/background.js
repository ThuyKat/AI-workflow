// background.js
chrome.runtime.onInstalled.addListener(() => {
    console.log('AI Assistant installed');
    
    // Initialize context storage
    chrome.storage.local.set({
      history: [],
      settings: {
        contextDepth: 5,  // Store last 5 interactions
        autoSuggest: true
      }
    });
  });
  
  // Listen for messages from popup or content scripts
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'STORE_CONTEXT') {
      // Store interaction in history
      chrome.storage.local.get(['history'], (result) => {
        const history = result.history || [];
        
        const updatedHistory = [...history, {
          timestamp: new Date().toISOString(),
          input: request.input,
          response: request.response,
          url: request.url
        }].slice(-5); // Keep only last 5
        
        chrome.storage.local.set({ history: updatedHistory });
      });
      
      sendResponse({success: true});
    }
    
    return true; // Required for async response
  });