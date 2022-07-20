// GLOBAL VARIABLES
let currentColor = "none";
let previousColor = currentColor;

const container = document.querySelector("#container");
const root = document.querySelector(":root");

// DRAWING TOOLS
const brush = document.querySelector("#brush");
const eraser = document.querySelector("#eraser");

// CREATE CANVAS
createPixels();
let pixels = document.querySelectorAll(".pixel");

// Let the tab/window listen to keypresses to activate the different tools
window.addEventListener("keypress", activateTool);

// on clicking the tool buttons, activate them
brush.addEventListener("click", setToDraw);
eraser.addEventListener("click", setToErase);

function activateTool(e) {
  console.log(e.keyCode, String.fromCharCode(e.keyCode));
  switch (e.keyCode) {
    case 69: // E
    case 101: // e
      setToErase(e);
      break;

    case 66: // B
    case 98: // b
      setToDraw(e);

    default:
      break;
  }
}

function setToDraw(e) {
  currentColor = "black";

  brush.classList.add("pressed");
  eraser.classList.remove("pressed");
}

function setToErase(e) {
  currentColor = "none";

  eraser.classList.add("pressed");
  brush.classList.remove("pressed");
}

function setCurrentColor(colorValue) {
  currentColor = colorValue;
}

function getCurrentColor() {
  return currentColor;
}

// **************************************************************************//
// DRAWING EVENT LISTENERS
// **************************************************************************//

// on mousedown, start adding color while mouse is moving,
// and on mouseup, stop adding color
pixels.forEach((pixel) => pixel.addEventListener("click", changeColor));
pixels.forEach((pixel) => pixel.addEventListener("mousedown", addColorChange));
pixels.forEach((pixel) => pixel.addEventListener("mouseup", removeColorChange));

// if a drag action occurs and mouseup happens, then stop adding color
pixels.forEach((pixel) => pixel.addEventListener("drag", removeColorChange));

// prevent drag events from ever occurring
pixels.forEach((pixel) =>
  pixel.addEventListener("dragstart", (e) => e.preventDefault())
);
pixels.forEach((pixel) =>
  pixel.addEventListener("drop", (e) => e.preventDefault())
);

// if while drawing the mouse moves out of the canvas, then stop adding color once the mouse is back inside the canvas
container.addEventListener("mouseleave", removeColorChange);

// **************************************************************************//
// DRAWING FUNCTIONS
// **************************************************************************//

// create canvas of pixels
function createPixels() {
  let numDivs = 16; // default value

  // create pixels in each row
  // the css prevents all pixelDivs from being
  // created in one continuous row
  for (let i = 0; i < numDivs; i++) {
    for (let j = 0; j < numDivs; j++) {
      let pixelDiv = document.createElement("div");
      pixelDiv.classList.add("pixel");
      pixelDiv.setAttribute("draggable", "false");

      container.appendChild(pixelDiv);
    }
  }

  currentColor = "black";
}

function mutateCanvasAndPixels(numPixels, canvasSize) {
  setCSSVariable("--numPixels", numPixels.toString());
  setCSSVariable("--canvasSize", canvasSize);
}

function setCSSVariable(variable, value) {
  root.style.setProperty(variable, value);
}

// console.log(getCSSVariable("--numPixels"));

function getCSSVariable(variable) {
  let x = root.style.getPropertyValue(variable);
  console.log(x);
  return root.style.getPropertyValue(variable);
}

function addColorChange(e) {
  pixels.forEach((pixel) => pixel.addEventListener("mousemove", changeColor));
}

function removeColorChange(e) {
  pixels.forEach((pixel) =>
    pixel.removeEventListener("mousemove", changeColor)
  );
}

function changeColor(e) {
  e.target.style.background = getCurrentColor();
}
