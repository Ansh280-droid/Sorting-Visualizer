import { useEffect, useState } from "react";

export default function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [size, setSize] = useState(20);
  const [speed, setSpeed] = useState(200);
  const [algo, setAlgo] = useState("bubble");
  const [isSorting, setIsSorting] = useState(false);

  // generate array
  const generateArray = (n = size) => {
    const newArr = Array.from({ length: n }, () =>
      Math.floor(Math.random() * 300) + 20
    );
    setArray(newArr);
  };

  useEffect(() => {
    generateArray(size);
  }, [size]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // swap helper
  const swap = (arr, i, j) => {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  };

  // Bubble Sort
  const bubbleSort = async () => {
    let arr = [...array];
    setIsSorting(true);

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          swap(arr, j, j + 1);
          setArray([...arr]);
          await sleep(speed);
        }
      }
    }

    setIsSorting(false);
  };
  // Selection Sort
const selectionSort = async () => {
  let arr = [...array];
  setIsSorting(true);

  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      swap(arr, i, minIndex);
      setArray([...arr]);
      await sleep(speed);
    }
  }

  setIsSorting(false);
};


  const startSorting = async () => {
  if (isSorting) return;

  if (algo === "bubble") await bubbleSort();
  else if (algo === "selection") await selectionSort();
  else alert(`${algo} sort will be added next 😄`);
};


  return (
    <div style={{ padding: "20px" }}>
      <h1>Sorting Visualizer</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select disabled={isSorting} value={algo} onChange={(e) => setAlgo(e.target.value)}>
          <option value="bubble">Bubble Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="merge">Merge Sort</option>
          <option value="quick">Quick Sort</option>
          <option value="heap">Heap Sort</option>
        </select>

        <label>
          Size:
          <input
            disabled={isSorting}
            type="range"
            min="10"
            max="100"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
          />
        </label>

        <label>
          Speed:
          <input
            disabled={isSorting}
            type="range"
            min="10"
            max="1000"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
          />
        </label>

        <button disabled={isSorting} onClick={() => generateArray(size)}>
          Randomize
        </button>

        <button onClick={startSorting} disabled={isSorting}>
          {isSorting ? "Sorting..." : "Start"}
        </button>
      </div>

      {/* Bars */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          height: "400px",
          border: "2px solid black",
          gap: "2px",
        }}
      >
        {array.map((value, index) => (
          <div
            key={index}
            style={{
              width: "10px",
              height: `${value}px`,
              background: "#3498db",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
