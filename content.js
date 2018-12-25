function reverseImageSearch(rawimage) {
  var blob = dataURItoBlob(rawimage);
  var fd = new FormData();
  fd.append("file", blob);

  var xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open("POST", "https://file.io", true);
  xhr.onload = function() {
    // Request finished, now opening new tab with google image search url.
    if (this.response.success && this.response.success === true) {
      /*opening new tab with the search results*/
      var searchURL =
        "https://www.google.com/searchbyimage?&image_url=" + this.response.link;
      chrome.tabs.create({
        url: searchURL
      });
    } else {
      console.log("Sorry, Unable to perform reverse search!");
    }
  };
  xhr.send(fd);
}

function reverseSearch() {
  chrome.tabs.captureVisibleTab(function(screenshotUrl) {
    /*uploading the screenshot to a sever & generating url*/

    //asking for image crop from user
    if (confirm("Do you want to crop the image?")) {
      // get cropped image & proceed
      getCroppedImage(screenshotUrl, "reversesearch");
      chrome.runtime.onMessage.addListener(function(
        message,
        sender,
        sendResponse
      ) {
        if (message.callbackMethod === "reversesearch") {
          reverseImageSearch(message.croppedImage);
        }
        //removing message listener
        chrome.runtime.onMessage.removeListener(arguments.callee);
      });
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

function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {
    type: mimeString
  });
}
