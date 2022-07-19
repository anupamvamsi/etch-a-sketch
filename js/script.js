const container = document.querySelector("#container");
const root = document.querySelector(":root");

function setCSSVariable(variable, value) {
  root.style.setProperty(variable, value);
}

function createPixels() {
  let numDivs = 16;
  let canvasSize = "512px";
  setCSSVariable("--numPixels", numDivs.toString());
  setCSSVariable("--canvasSize", canvasSize);
  // console.log(numDivs);

  for (let i = 0; i < numDivs; i++) {
    // console.log(1);
    for (let j = 0; j < numDivs; j++) {
      // console.log(2);
      let pixelDiv = document.createElement("div");
      // pixelDiv.textContent = i * numDivs + j + 1;
      pixelDiv.classList.add("pixel");
      container.appendChild(pixelDiv);
    }
  }
}

createPixels();

function changeColor(e) {
  console.log(e.target.style.background);
  e.target.style.background = "black";
}

let pixelDivs = document.querySelectorAll(".pixel");
pixelDivs.forEach((pixel) => pixel.addEventListener("mousemove", changeColor));
