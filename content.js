function reverseSearch() {
  chrome.tabs.captureVisibleTab(function(screenshotUrl) {
    /*uploading the screenshot to a sever & generating url*/

    //asking for image crop from user
    if (confirm("Do you want to crop the image?")) {
      // get cropped image & proceed
      getCroppedImage(screenshotUrl, "reversesearch");
    } else {
      reverseImageSearch(screenshotUrl);
    }
  });
}

function getCroppedImage(image, callbackMethod) {
  //   console.log("cropping image : callbackMethod : " + callbackMethod);
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    function(tabs) {
      var tabid = tabs[0].id;

      chrome.tabs.executeScript(
        tabid,
        {
          code:
            'var imageurl ="' +
            image +
            '", callbackMethod = "' +
            callbackMethod +
            '";'
        },
        function() {
          /*injecting cropperjs into current tab*/
          chrome.tabs.executeScript(
            tabid,
            {
              file: "./cropperjs/cropper.js"
            },
            function(response) {
              /*injecting our content script into current tab*/
              chrome.tabs.executeScript(
                tabid,
                {
                  file: "./content_script.js"
                },
                function(response) {
                  //   console.log("Indside background script!! id:" + tabid + ", response: " + JSON.stringify(response, null, 4));
                }
              );
            }
          );
        }
      );
    }
  );
}
