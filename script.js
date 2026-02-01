// ======================
// Helper Function
// ======================
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ======================
// Complexity Data Map
// ======================
const complexityData = {
  bubble: { name: "Bubble Sort", best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
  selection: { name: "Selection Sort", best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
  insertion: { name: "Insertion Sort", best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
  merge: { name: "Merge Sort", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
  quick: { name: "Quick Sort", best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
  heap: { name: "Heap Sort", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(1)" },
};
// ===== HELP MODAL OPEN / CLOSE =====
const helpBtn = document.getElementById("helpBtn");
const helpModal = document.getElementById("helpModal");
const closeHelp = document.getElementById("closeHelp");

helpBtn.addEventListener("click", () => {
  helpModal.classList.add("active");
});

closeHelp.addEventListener("click", () => {
  helpModal.classList.remove("active");
});

// Close modal when clicking outside content
helpModal.addEventListener("click", (e) => {
  if (e.target === helpModal) {
    helpModal.classList.remove("active");
  }
});

// ======================
// Algorithm Definitions
// ======================
const algoDefinitions = {
  bubble: {
    title: "Bubble Sort",
    definition:
      "Bubble Sort repeatedly compares adjacent elements and swaps them if they are in the wrong order until the array is sorted."
  },
  selection: {
    title: "Selection Sort",
    definition:
      "Selection Sort finds the smallest element from the unsorted part and places it at the correct position. It repeats until sorted."
  },
  insertion: {
    title: "Insertion Sort",
    definition:
      "Insertion Sort builds the sorted part step-by-step by inserting each element into its correct position in the already sorted section."
  },
  merge: {
    title: "Merge Sort",
    definition:
      "Merge Sort uses divide & conquer: split the array into halves, sort them recursively, then merge the sorted halves."
  },
  quick: {
    title: "Quick Sort",
    definition:
      "Quick Sort picks a pivot, partitions elements smaller and greater than pivot, then recursively sorts partitions."
  },
  heap: {
    title: "Heap Sort",
    definition:
      "Heap Sort builds a max-heap and repeatedly extracts the maximum element to sort the array."
  }
};

// ======================
// Global Variables
// ======================
let array = [];
let delay = 300;
let size = 20;

let stopRequested = false;
let isSorting = false;

// ======================
// DOM Elements
// ======================
const barsContainer = document.getElementById("barsContainer");

const algoSelect = document.getElementById("sorting");
const randomizeBtn = document.getElementById("randomize");
const startSortBtn = document.getElementById("startSort");
const stopBtn = document.getElementById("stopSort");
const generateBtn = document.getElementById("generateBtn");

const algoName = document.getElementById("algoName");
const bestTC = document.getElementById("bestTC");
const avgTC = document.getElementById("avgTC");
const worstTC = document.getElementById("worstTC");
const spaceTC = document.getElementById("spaceTC");

const sizeSlider = document.getElementById("sizeSlider");
const speedSlider = document.getElementById("speedSlider");
const sizeValue = document.getElementById("sizeValue");
const speedValue = document.getElementById("speedValue");

const statusText = document.getElementById("statusText");
const statusDot = document.getElementById("statusDot");

const sortSong = document.getElementById("sortSong");
const algoBadge = document.getElementById("algoBadge");

const defTitle = document.getElementById("algoDefTitle");
const defText = document.getElementById("algoDefText");

// ======================
// UI Helpers
// ======================
function setButtonsSortingState(running) {
  if (startSortBtn) startSortBtn.disabled = running;
  if (randomizeBtn) randomizeBtn.disabled = running;
  if (generateBtn) generateBtn.disabled = running;
  if (algoSelect) algoSelect.disabled = running;
  if (sizeSlider) sizeSlider.disabled = running;
}

function setStatus(message, state) {
  if (!statusText || !statusDot) return;

  statusText.textContent = message || "";
  statusDot.classList.remove("sorting", "sorted");

  if (!message) {
    statusDot.style.display = "none";
    return;
  }

  statusDot.style.display = "inline-block";
  if (state) statusDot.classList.add(state);
}

function playSortingSong() {
  if (!sortSong) return;
  sortSong.currentTime = 0;
  sortSong.play().catch(() => {});
}

function stopSortingSong() {
  if (!sortSong) return;
  sortSong.pause();
  sortSong.currentTime = 0;
}

// ======================
// UI Update Functions
// ======================
function updateComplexityUI() {
  if (!algoSelect) return;

  const selectedAlgo = algoSelect.value;
  const data = complexityData[selectedAlgo];
  if (!data) return;

  if (algoName) algoName.textContent = data.name;
  if (bestTC) bestTC.textContent = data.best;
  if (avgTC) avgTC.textContent = data.average;
  if (worstTC) worstTC.textContent = data.worst;
  if (spaceTC) spaceTC.textContent = data.space;

  if (algoBadge) algoBadge.textContent = data.average || "O(?)";
}

function updateAlgoDefinitionUI() {
  if (!algoSelect || !defTitle || !defText) return;

  const selectedAlgo = algoSelect.value;
  const data = algoDefinitions[selectedAlgo];

  if (!data) {
    defTitle.textContent = "Algorithm";
    defText.textContent = "Select any algorithm to see its definition here.";
    return;
  }

  defTitle.textContent = data.title;
  defText.textContent = data.definition;
}

// ======================
// Render Bars + Badge
// ======================
function renderBars() {
  if (!barsContainer) return;

  barsContainer.innerHTML = `<div id="arrayCountBadge" class="arrayCountBadge"></div>`;

  array.forEach((val) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${val}px`;
    barsContainer.appendChild(bar);
  });

  const badge = document.getElementById("arrayCountBadge");
  if (badge) badge.textContent = `Size: ${array.length}`;
}

// ======================
// Generate Array
// ======================
function generateArray(newSize = 20) {
  array = [];
  for (let i = 0; i < newSize; i++) {
    array.push(Math.floor(Math.random() * 300) + 20);
  }
  renderBars();
}

// ======================
// STOP CHECK (Reusable)
// ======================
function checkStop() {
  if (stopRequested) throw new Error("STOPPED");
}

// ======================
// Sorting Algorithms
// ======================
async function bubbleSort() {
  const bars = document.getElementsByClassName("bar");

  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      checkStop();

      bars[j].style.background = "orange";
      bars[j + 1].style.background = "orange";

      await sleep(delay);
      checkStop();

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars[j].style.height = `${array[j]}px`;
        bars[j + 1].style.height = `${array[j + 1]}px`;
      }

      bars[j].style.background = "#3498db";
      bars[j + 1].style.background = "#3498db";
    }
    bars[array.length - i - 1].style.background = "green";
  }

  if (bars[0]) bars[0].style.background = "green";
}

async function selectionSort() {
  const bars = document.getElementsByClassName("bar");

  for (let i = 0; i < array.length; i++) {
    checkStop();

    let minIndex = i;
    bars[i].style.background = "orange";

    for (let j = i + 1; j < array.length; j++) {
      checkStop();

      bars[j].style.background = "red";
      await sleep(delay);
      checkStop();

      if (array[j] < array[minIndex]) {
        if (minIndex !== i) bars[minIndex].style.background = "#3498db";
        minIndex = j;
        bars[minIndex].style.background = "yellow";
      } else {
        bars[j].style.background = "#3498db";
      }
    }

    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      bars[i].style.height = `${array[i]}px`;
      bars[minIndex].style.height = `${array[minIndex]}px`;
    }

    bars[i].style.background = "green";
    if (minIndex !== i) bars[minIndex].style.background = "#3498db";
  }
}

async function insertionSort() {
  const bars = document.getElementsByClassName("bar");

  for (let i = 1; i < array.length; i++) {
    checkStop();

    let key = array[i];
    let j = i - 1;

    bars[i].style.background = "yellow";
    await sleep(delay);
    checkStop();

    while (j >= 0 && array[j] > key) {
      checkStop();

      bars[j].style.background = "red";
      array[j + 1] = array[j];
      bars[j + 1].style.height = `${array[j + 1]}px`;

      await sleep(delay);
      checkStop();

      bars[j].style.background = "#3498db";
      j--;
    }

    array[j + 1] = key;
    bars[j + 1].style.height = `${key}px`;

    for (let k = 0; k <= i; k++) bars[k].style.background = "green";
    await sleep(delay);
  }

  for (let i = 0; i < array.length; i++) bars[i].style.background = "green";
}

// Merge Sort
async function mergeSort() {
  const bars = document.getElementsByClassName("bar");
  await mergeSortHelper(0, array.length - 1, bars);
  for (let i = 0; i < array.length; i++) bars[i].style.background = "green";
}

async function mergeSortHelper(left, right, bars) {
  checkStop();
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);
  await mergeSortHelper(left, mid, bars);
  await mergeSortHelper(mid + 1, right, bars);
  await merge(left, mid, right, bars);
}

async function merge(left, mid, right, bars) {
  checkStop();

  let temp = [];
  let i = left;
  let j = mid + 1;

  for (let k = left; k <= right; k++) bars[k].style.background = "orange";
  await sleep(delay);
  checkStop();

  while (i <= mid && j <= right) {
    checkStop();

    bars[i].style.background = "red";
    bars[j].style.background = "red";
    await sleep(delay);
    checkStop();

    if (array[i] <= array[j]) temp.push(array[i++]);
    else temp.push(array[j++]);
  }

  while (i <= mid) temp.push(array[i++]);
  while (j <= right) temp.push(array[j++]);

  for (let k = left; k <= right; k++) {
    checkStop();
    array[k] = temp[k - left];
    bars[k].style.height = `${array[k]}px`;
    bars[k].style.background = "#3498db";
    await sleep(delay);
  }
}

// Quick Sort
async function quickSort() {
  const bars = document.getElementsByClassName("bar");
  await quickSortHelper(0, array.length - 1, bars);
  for (let i = 0; i < array.length; i++) bars[i].style.background = "green";
}

async function quickSortHelper(low, high, bars) {
  checkStop();
  if (low < high) {
    const pi = await partition(low, high, bars);
    await quickSortHelper(low, pi - 1, bars);
    await quickSortHelper(pi + 1, high, bars);
  }
}

async function partition(low, high, bars) {
  checkStop();

  const pivot = array[high];
  bars[high].style.background = "yellow";

  let i = low - 1;

  for (let j = low; j < high; j++) {
    checkStop();

    bars[j].style.background = "red";
    await sleep(delay);
    checkStop();

    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      bars[i].style.height = `${array[i]}px`;
      bars[j].style.height = `${array[j]}px`;

      bars[i].style.background = "orange";
      if (i !== j) bars[j].style.background = "#3498db";
    } else {
      bars[j].style.background = "#3498db";
    }
  }

  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  bars[i + 1].style.height = `${array[i + 1]}px`;
  bars[high].style.height = `${array[high]}px`;

  bars[high].style.background = "#3498db";
  bars[i + 1].style.background = "green";

  await sleep(delay);
  return i + 1;
}

// Heap Sort
async function heapSort() {
  const bars = document.getElementsByClassName("bar");
  const n = array.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    checkStop();
    await heapify(n, i, bars);
  }

  for (let i = n - 1; i > 0; i--) {
    checkStop();

    [array[0], array[i]] = [array[i], array[0]];
    bars[0].style.height = `${array[0]}px`;
    bars[i].style.height = `${array[i]}px`;

    bars[i].style.background = "green";
    await sleep(delay);

    await heapify(i, 0, bars);
  }

  bars[0].style.background = "green";
}

async function heapify(n, i, bars) {
  checkStop();

  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  bars[i].style.background = "orange";
  await sleep(delay);
  checkStop();

  if (left < n) bars[left].style.background = "red";
  if (right < n) bars[right].style.background = "red";
  await sleep(delay);
  checkStop();

  if (left < n && array[left] > array[largest]) largest = left;
  if (right < n && array[right] > array[largest]) largest = right;

  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    bars[i].style.height = `${array[i]}px`;
    bars[largest].style.height = `${array[largest]}px`;

    await sleep(delay);
    checkStop();

    bars[i].style.background = "#3498db";
    bars[largest].style.background = "#3498db";

    await heapify(n, largest, bars);
  } else {
    bars[i].style.background = "#3498db";
    if (left < n) bars[left].style.background = "#3498db";
    if (right < n) bars[right].style.background = "#3498db";
  }
}

// ======================
// MAIN START SORT FUNCTION
// ======================
async function startSorting() {
  if (isSorting) return;

  stopRequested = false;
  isSorting = true;

  setButtonsSortingState(true);
  stopSortingSong();
  setStatus("Sorting...", "sorting");
  playSortingSong();

  try {
    const algo = algoSelect.value;

    if (algo === "bubble") await bubbleSort();
    else if (algo === "selection") await selectionSort();
    else if (algo === "insertion") await insertionSort();
    else if (algo === "merge") await mergeSort();
    else if (algo === "quick") await quickSort();
    else if (algo === "heap") await heapSort();
    else setStatus("Select a valid algorithm", "");

    stopSortingSong();
    setStatus("Sorted ✅", "sorted");
  } catch (err) {
    stopSortingSong();

    if (err.message === "STOPPED") {
      setStatus("Sorting Stopped 🛑", "");
    } else {
      console.error(err);
      setStatus("Error occurred ❌", "");
    }
  } finally {
    isSorting = false;
    setButtonsSortingState(false);
  }
}

// ======================
// STOP SORT FUNCTION
// ======================
function stopSorting() {
  if (!isSorting) return;

  stopRequested = true;
  stopSortingSong();
  setStatus("Stopping...", "");
}

// ======================
// Event Listeners
// ======================
if (sizeSlider) {
  sizeSlider.addEventListener("input", () => {
    size = parseInt(sizeSlider.value);
    if (sizeValue) sizeValue.textContent = size;
    generateArray(size);
    setStatus("", "");
  });
}

if (speedSlider) {
  speedSlider.addEventListener("input", () => {
    delay = parseInt(speedSlider.value);
    if (speedValue) speedValue.textContent = delay + " ms";
  });
}

if (generateBtn) {
  generateBtn.addEventListener("click", () => {
    if (isSorting) return;
    stopSortingSong();
    generateArray(size);
    setStatus("", "");
  });
}

if (randomizeBtn) {
  randomizeBtn.addEventListener("click", () => {
    if (isSorting) return;
    stopSortingSong();
    generateArray(size);
    setStatus("", "");
  });
}

if (algoSelect) {
  algoSelect.addEventListener("change", () => {
    if (isSorting) return;
    stopSortingSong();
    updateComplexityUI();
    updateAlgoDefinitionUI();
    setStatus("", "");
  });
}

if (startSortBtn) startSortBtn.addEventListener("click", startSorting);
if (stopBtn) stopBtn.addEventListener("click", stopSorting);

// ======================
// Preloader Logic
// ======================
window.addEventListener("load", () => {
  if (sizeSlider) size = parseInt(sizeSlider.value);
  if (speedSlider) delay = parseInt(speedSlider.value);

  if (sizeValue) sizeValue.textContent = size;
  if (speedValue) speedValue.textContent = delay + " ms";

  updateComplexityUI();
  updateAlgoDefinitionUI();
  generateArray(size);
  setStatus("Sorting Visualizer Ready 🚀", "sorted");

  const preloader = document.getElementById("preloader");
  const progressFill = document.getElementById("progressFill");

  if (!preloader || !progressFill) return;

  let progress = 0;

  const timer = setInterval(() => {
    progress += 5;
    progressFill.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(timer);

      preloader.classList.add("preloaderHide");

      setTimeout(() => {
        preloader.style.display = "none";
      }, 650);
    }
  }, 250);
});
