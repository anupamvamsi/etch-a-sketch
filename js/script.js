// GLOBAL VARIABLES
let currentColor = "none";
let previousColor = currentColor;

const errorText = document.querySelector("#error-text");
const container = document.querySelector("#container");
const root = document.querySelector(":root");

// DRAWING TOOLS
const brush = document.querySelector("#brush");
const rainbowBrush = document.querySelector("#rainbow");
const eraser = document.querySelector("#eraser");
const reset = document.querySelector("#reset");

// CREATE CANVAS
createPixels();
let pixels = document.querySelectorAll(".pixel");

// Let the tab/window listen to keypresses to activate the different tools
window.addEventListener("keypress", activateTool);

// on clicking the tool buttons, activate them
brush.addEventListener("click", setToDraw);
rainbow.addEventListener("click", setToRainbowDraw);
eraser.addEventListener("click", setToErase);
reset.addEventListener("click", resetCanvas);

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
      break;

    case 82: // R
    case 114: // r
      setToRainbowDraw(e);
      break;

    default:
      break;
  }
}

function setToDraw(e) {
  currentColor = "#00756d";

  brush.classList.add("pressed");
  rainbow.classList.remove("pressed");
  eraser.classList.remove("pressed");
}

function setToRainbowDraw(e) {
  setRandomColor();
  // console.log(currentColor);

  rainbow.classList.add("pressed");
  brush.classList.remove("pressed");
  eraser.classList.remove("pressed");
}

function setToErase(e) {
  currentColor = "none";

  eraser.classList.add("pressed");
  brush.classList.remove("pressed");
  rainbow.classList.remove("pressed");
}

function resetCanvas(e) {
  pixels.forEach((pixel) => {
    if (pixel.style.background) {
      pixel.style.background = "none";
    }
  });
}

function setCurrentColor(colorValue) {
  currentColor = colorValue;
}

function getCurrentColor() {
  return currentColor;
}

function setRandomColor() {
  let r = random(0, 255);
  let g = random(0, 255);
  let b = random(0, 255);
  console.log(r);
  console.log(g);
  console.log(b);
  let color = "rgb(" + r + ", " + g + ", " + b + ")";
  console.log("Color: ", color);
  setCurrentColor(color.toString());
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
  let numDivs = Number(getCSSVariable("--numPixels")); // default value

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

  currentColor = "#00756d";
}

function mutateCanvasAndPixels(numPixels, canvasSize) {
  setCSSVariable("--numPixels", numPixels.toString());
  setCSSVariable("--canvasSize", canvasSize);
}

function setCSSVariable(variable, value) {
  root.style.setProperty(variable, value);
}

function getCSSVariable(variable) {
  let x = getComputedStyle(document.body);

  if (x) {
    let y = x.getPropertyValue(variable);

    // for some unknown reason, an empty string is being returned sometimes
    if (!isEmpty(y)) {
      return y;
    } else {
      errorText.textContent =
        "Error in loading canvas. Creating a 16×16 canvas.";
      return "16";
    }
  }
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

// **************************************************************************//
// UTILITY FUNCTIONS
// **************************************************************************//

function isEmpty(str) {
  if (str === "") {
    return true;
  }
  return false;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
