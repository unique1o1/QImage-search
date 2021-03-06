/*Content Script 
	It is used to execute/inject code on the webpage, 
	as required for cropping interface for screenshot & reverse image search 
	
	It is injected by background script on user action
*/
console.log("callbackMethod : " + callbackMethod);

//injecting croppingjs.css stylesheet to the webpage
var link = document.createElement("link");
link.rel = "stylesheet";
// link.type = "text/css";
link.href = "https://cdnjs.cloudflare.com/ajax/libs/cropper/4.0.0/cropper.css";
document.querySelector("head").appendChild(link);

//hiding the webpage
var body = document.querySelector("body");
body.style.display = "none";
//creating a img inside div
if (!document.querySelector("#cropping-tool")) {
  console.log("creating a new cropping tool div on page");
  var div = document.createElement("div");
  div.id = "cropping-tool";
  div.style.height = "100%";
  div.style.width = "100%";
  div.position = "absolute";
  div.top = "0";
  div.bottom = "0";
  div.style.background = "yellow";
  var div2 = document.createElement("div");
  div2.style.height = "100%";
  div2.style.width = "100%";
  var img = document.createElement("img");
  img.src = imageurl;
  img.id = "image";
  img.style["max-width"] = "100%";
  var button = document.createElement("input");
  button.setAttribute("value", "Crop");
  button.setAttribute("type", "button");
  //button.setAttribute("onclick","doneCropping(cropper)");
  div2.appendChild(img);
  div.appendChild(div2);
  //div.appendChild(button);
  document.querySelector("html").appendChild(div);

  /*creating a cropper tool*/
  var image = document.getElementById("image");
  var cropper = new Cropper(image, {
    autoCrop: true,
    zoomable: false,
    movable: true,
    rotatable: true,
    cropend: function(e) {}
  });

  //function to handle key press event on cropping interface
  function handleKeyPress(e) {
    // use e.keyCode
    if (e.which != 27) {
      console.log("------------------- Image Cropped!! ---------------------");
      var i = cropper.getCroppedCanvas().toDataURL("image/jpeg");

      /*make the webpage visible again*/
      document.querySelector("body").removeAttribute("style");

      //removing key listener
      document.removeEventListener("keydown", handleKeyPress);

      /*remove div#cropping-tool element*/
      document.querySelector("#cropping-tool").remove();

      //send message to background script with cropped image
      chrome.runtime.sendMessage(
        { callbackMethod: callbackMethod, croppedImage: i },
        function(response) {
          //do nothing
        }
      );
      console.log("cropped image sent to background script");
    } else {
      /*make the webpage visible again*/
      document.querySelector("body").removeAttribute("style");

      //removing key listener
      document.removeEventListener("keydown", handleKeyPress);

      /*remove div#cropping-tool element*/
      document.querySelector("#cropping-tool").remove();
      //send message to background script with cropped image
      chrome.runtime.sendMessage(
        { callbackMethod: "empty", croppedImage: null },
        function(response) {
          //do nothing
        }
      );
    }
  }

  //adding event listener for key press event on cropping interface
  document.addEventListener("keydown", handleKeyPress);
}
