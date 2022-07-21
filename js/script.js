// GLOBAL VARIABLES
let coloringState = "monochrome";
let currentColor = "none";
let previousColor = currentColor;

const errorText = document.querySelector("#error-text");
const container = document.querySelector("#container");
const root = document.querySelector(":root");

// PIXEL-MUTATOR
const numberOfPixels = document.querySelector("#num-pixels");
const plusButton = document.querySelector("#plus");
const minusButton = document.querySelector("#minus");

// DRAWING TOOLS
const brush = document.querySelector("#brush");
const rainbowBrush = document.querySelector("#rainbow");
const eraser = document.querySelector("#eraser");
const reset = document.querySelector("#reset");

// CREATE CANVAS
let pixels;
canvasSetup();

// **************************************************************************//
// TOOLS' EVENT LISTENERS
// **************************************************************************//

// Let the tab/window listen to keypresses to activate the different tools
window.addEventListener("keypress", activateTool);

// on clicking the tool buttons, activate them
brush.addEventListener("click", setToDraw);
rainbow.addEventListener("click", setToRainbowDraw);
eraser.addEventListener("click", setToErase);
reset.addEventListener("click", resetCanvas);

// **************************************************************************//
// TOOLS' FUNCTIONS
// **************************************************************************//

function activateTool(e) {
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

    case 43: // +
      mutateCanvasPlus(e);
      break;
    case 45: // -
      mutateCanvasMinus(e);
      break;

    default:
      break;
  }
}

function setToDraw(e) {
  coloringState = "monochrome";
  currentColor = "#00756d";

  brush.classList.add("pressed");
  rainbow.classList.remove("pressed");
  eraser.classList.remove("pressed");
}

function setToRainbowDraw(e) {
  coloringState = "multichrome";
  setRandomColor();

  rainbow.classList.add("pressed");
  brush.classList.remove("pressed");
  eraser.classList.remove("pressed");
}

function setToErase(e) {
  coloringState = "monochrome";
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

// **************************************************************************//
// COLORING FUNCTIONS
// **************************************************************************//

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
  let color = "rgb(" + r + ", " + g + ", " + b + ")";

  setCurrentColor(color);
}

// **************************************************************************//
// DRAWING EVENT LISTENERS
// **************************************************************************//

// *******//
// MOUSE
// *******//

// *******//
// TOUCH
// *******//
// pixels.forEach((px) => px.addEventListener("touchstart", startColorChange));
// pixels.forEach((px) => px.addEventListener("touchend", stopColorChange));

// **************************************************************************//
// CANVAS CREATION / MUTATION EVENT LISTENERS
// **************************************************************************//
plusButton.addEventListener("click", mutateCanvasPlus);
minusButton.addEventListener("click", mutateCanvasMinus);

// **************************************************************************//
// CANVAS CREATION / MUTATION FUNCTIONS
// **************************************************************************//

function canvasSetup() {
  createPixels();
  pixels = document.querySelectorAll(".pixel");

  // on mousedown, start adding color while mouse is moving,
  // and on mouseup, stop adding color
  pixels.forEach((px) => px.addEventListener("click", changeColor));
  pixels.forEach((px) => px.addEventListener("mousedown", startColorChange));
  pixels.forEach((px) => px.addEventListener("mouseup", stopColorChange));

  // if a drag action occurs and mouseup happens, then stop adding color
  pixels.forEach((px) => px.addEventListener("drag", stopColorChange));

  // prevent drag events from ever occurring
  pixels.forEach((px) =>
    px.addEventListener("dragstart", (e) => e.preventDefault())
  );
  pixels.forEach((px) =>
    px.addEventListener("drop", (e) => e.preventDefault())
  );

  // if while drawing the mouse moves out of the canvas, then stop adding color once the mouse is back inside the canvas
  container.addEventListener("mouseleave", stopColorChange);
}

// create canvas
function createPixels() {
  let numDivs = Number(getCSSVariable("--numPixels")); // default value
  numberOfPixels.textContent = numDivs.toString();

  container.textContent = "";
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

  currentColor = "#00756d"; // default
}

function mutatePixels(numPixels) {
  setCSSVariable("--numPixels", numPixels.toString());
}

function mutateCanvasPlus(e) {
  let numPixels = getCSSVariable("--numPixels");

  if (isEmpty(numPixels)) {
    // errorText.textContent = "Error in changing number of pixels of canvas.";
    return;
  }

  if (numPixels <= 32) {
    numPixels *= 2;
    setCSSVariable("--numPixels", numPixels);
    canvasSetup();
    numberOfPixels.textContent = numPixels.toString();
  }
}

function mutateCanvasMinus(e) {
  let numPixels = getCSSVariable("--numPixels");

  if (isEmpty(numPixels)) {
    errorText.textContent = "Error in changing number of pixels of canvas.";
    return;
  }

  if (numPixels > 1) {
    numPixels /= 2;
    setCSSVariable("--numPixels", numPixels);
    canvasSetup();
    numberOfPixels.textContent = numPixels.toString();
  }
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

// **************************************************************************//
// DRAWING FUNCTIONS
// **************************************************************************//

function startColorChange(e) {
  pixels.forEach((px) => px.addEventListener("mousemove", changeColor));
}

function stopColorChange(e) {
  pixels.forEach((px) => px.removeEventListener("mousemove", changeColor));
}

function changeColor(e) {
  if (coloringState == "multichrome") {
    setRandomColor();
  }
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
