let currentColor = "none";
let previousColor = currentColor;
const container = document.querySelector("#container");
const root = document.querySelector(":root");

// DRAWING TOOLS
const brush = document.querySelector("#brush");
const eraser = document.querySelector("#eraser");

createPixels(); // once page loads this is executed and the canvas is created
let pixels = document.querySelectorAll(".pixel");

// brush.addEventListener("click", setToDraw);
eraser.addEventListener("click", setToErase);
window.addEventListener("keypress", setToErase);

// function setToDraw(e) {
//   if ((currentColor = "none")) {
//     currentColor = "black";
//   }
// }

function setToErase(e) {
  console.log(e.keyCode, String.fromCharCode(e.keyCode));
  if (
    e.type == "click" ||
    e.keyCode == 101 ||
    (currentColor == "none" && e.keyCode == 98)
  ) {
    let tempColor = previousColor;
    previousColor = currentColor;
    currentColor = tempColor;

    eraser.classList.toggle("pressed");
    brush.classList.toggle("pressed");
  }
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
