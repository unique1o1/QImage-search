function reverseSearch() {
  chrome.tabs.captureVisibleTab(function(screenshotUrl) {
    /*uploading the screenshot to a sever & generating url*/

    //asking for image crop from user
    if (confirm("Do you want to crop the image?")) {
    } else {
      reverseImageSearch(screenshotUrl);
    }
  });
}
