const CELL_SIZE = 8;
const CELL_GAP = 3;
const CELL_STEP = CELL_SIZE + CELL_GAP;
const ASCII_COLOR = "#dadada";
const ASCII_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const BRIGHTNESS_THRESHOLD = 0.5;
const ASCII_MIN_WIDTH = 1000;
const HOVER_RADIUS = 10;
const HOVER_PUSH = 7;
const HOVER_EASE = 0.1;
const SCATTER_RANGE = 20;
const SCATTER_EASE = 0.075;
const GRAVITY = 0.05;
const BOUNCE = 0.25;
const RESET_EASE = 0.05;
const STAGGER_FRAMES = 18;

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const logo = document.querySelector("footer img");
const pixelRatio = window.devicePixelRatio || 1;

let phase = "logo";
const cursor = { col: -999, row: -999 };
let gridCols, gridRows, asciiCells;

function randomAsciiChar() {
  return ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
}

function buildAsciiFromLogo() {
  if (window.innerWidth < ASCII_MIN_WIDTH) {
    asciiCells = [];
    return;
  }

  gridCols = Math.floor(window.innerWidth / CELL_STEP);
  gridRows = Math.floor(window.innerHeight / CELL_STEP);
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const logoRect = logo.getBoundingClientRect();
  const sampler = document.createElement("canvas");
  sampler.width = gridCols;
  sampler.height = gridRows;
  const samplerContext = sampler.getContext("2d");
  samplerContext.drawImage(
    logo,
    logoRect.left / CELL_STEP,
    logoRect.top / CELL_STEP,
    logoRect.width / CELL_STEP,
    logoRect.height / CELL_STEP,
  );
  const { data } = samplerContext.getImageData(0, 0, gridCols, gridRows);

  const litCells = new Set();
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const pixel = (row * gridCols + col) * 4;
      const alpha = data[pixel + 3] / 255;
      const brightness =
        ((data[pixel] * 0.299 +
          data[pixel + 1] * 0.587 +
          data[pixel + 2] * 0.114) /
          255) *
        alpha;

      if (brightness > BRIGHTNESS_THRESHOLD) {
        litCells.add(`${col},${row}`);
        litCells.add(`${col + 1},${row}`);
      }
    }
  }

  asciiCells = [];
  for (const key of litCells) {
    const [col, row] = key.split(",").map(Number);
    asciiCells.push({
      col,
      row,
      char: randomAsciiChar(),
      offsetX: 0,
      offsetY: 0,
      fallSpeed: 0,
      wait: 0,
      scatterX: (Math.random() - 0.5) * SCATTER_RANGE,
      scatterY: (Math.random() - 0.5) * SCATTER_RANGE,
    });
  }
}

function easeToward(cell, targetX, targetY, ease) {
  cell.offsetX += (targetX - cell.offsetX) * ease;
  cell.offsetY += (targetY - cell.offsetY) * ease;
}

function staggerCells() {
  for (const cell of asciiCells) {
    cell.wait = Math.floor(Math.random() * STAGGER_FRAMES);
  }
}

function updateAsciiCells() {
  let everyoneHome = phase === "returning";

  for (const cell of asciiCells) {
    if (cell.wait > 0) {
      cell.wait--;
      everyoneHome = false;
      continue;
    }

    if (phase === "scattered") {
      easeToward(cell, cell.scatterX, cell.scatterY, SCATTER_EASE);
    } else if (phase === "fallen") {
      const floorOffset = gridRows - 1 - cell.row;
      cell.fallSpeed += GRAVITY;
      cell.offsetY += cell.fallSpeed;

      if (cell.offsetY > floorOffset) {
        cell.offsetY = floorOffset;
        cell.fallSpeed *= -BOUNCE;
      }
    } else if (phase === "returning") {
      easeToward(cell, 0, 0, RESET_EASE);
      if (Math.abs(cell.offsetX) > 0.05 || Math.abs(cell.offsetY) > 0.05) {
        everyoneHome = false;
      }
    } else {
      let targetX = 0;
      let targetY = 0;
      const distX = cell.col - cursor.col;
      const distY = cell.row - cursor.row;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < HOVER_RADIUS && distance > 0) {
        const push = (1 - distance / HOVER_RADIUS) * HOVER_PUSH;
        targetX = (distX / distance) * push;
        targetY = (distY / distance) * push;
      }
      easeToward(cell, targetX, targetY, HOVER_EASE);
    }
  }

  if (everyoneHome) phase = "logo";
}

function drawAscii() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  context.font = `${CELL_SIZE + 2}px monospace`;
  context.textBaseline = "top";
  context.textAlign = "center";
  context.fillStyle = ASCII_COLOR;

  for (const { col, row, char, offsetX, offsetY } of asciiCells) {
    const x = (col + offsetX) * CELL_STEP + CELL_SIZE / 2;
    const y = (row + offsetY) * CELL_STEP;
    context.fillText(char, x, y);
  }
}

function renderLoop() {
  if (asciiCells.length > 0) {
    updateAsciiCells();
    drawAscii();
  }
  requestAnimationFrame(renderLoop);
}

window.addEventListener("mousemove", (event) => {
  cursor.col = event.clientX / CELL_STEP;
  cursor.row = event.clientY / CELL_STEP;
});

window.addEventListener("click", () => {
  if (asciiCells.length === 0) return;

  if (phase === "logo") {
    phase = "scattered";
    staggerCells();
  } else if (phase === "scattered") {
    phase = "fallen";
    for (const cell of asciiCells) cell.fallSpeed = 0;
  } else if (phase === "fallen") {
    phase = "returning";
    staggerCells();
  }
});

logo.addEventListener("load", buildAsciiFromLogo);
window.addEventListener("resize", buildAsciiFromLogo);
if (logo.complete) buildAsciiFromLogo();

renderLoop();
