
document.addEventListener('DOMContentLoaded', function() {
    // Get reference to the button
    const askAiButton = document.getElementById('ask-ai');
    
    // Create a response container if it doesn't exist yet
    let responseContainer = document.getElementById('response-container');
    if(!responseContainer) {
        responseContainer = document.createElement('div');
        responseContainer.id = 'response-container';
        document.body.appendChild(responseContainer);
    }
   
    // Add click event listener
    askAiButton.addEventListener('click', function() {
      // Show loading indicator
      responseContainer.textContent = 'Loading...';

      //Get current tab information and content
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currrentTab = tabs[0];
        const currentUrl = currrentTab.url;

      //Eecute the script to get the page content
      chrome.scripting.executeScript({
        target: {tabId:currrentTab.id},
        function:getPageContent
      }, (results) => {
        //Check if the script executed successfully
        const pageContent = results && results[0] ? results[0].result:"";

        //get history from storage for additional context
        chrome.storage.local.get(['history'], (result) => {
          const history = result.history || [];    
        // Call your AI service API
        fetch('http://localhost:5000/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            input: `Analyze this page: ${currentUrl}`,
            context: pageContent,
            history: history
          })
        })
        .then(response => response.json())
        .then(data => {

          // Display the AI response 
          responseContainer.textContent = data.response;

          // Store interaction in history
          chrome.runtime.sendMessage({
            type: 'STORE_CONTEXT',
            input: `Analyze this page: ${currentUrl}`,
            response: data.response,
            url: currentUrl
          }, function(response) {
            console.log('Context stored:', response?.success);
          });
        })
        .catch(error => {
          console.error('Error:', error);
          responseContainer.textContent = 'Error connecting to AI service ' + error.message;
        });
      });
    });
  });
});
});

function getPageContent() {
  // Get the entire page content
  // return document.documentElement.innerText;
  //Get the visible text content
  console.log(document.body.innerText)
  return document.body.innerText;
  
}