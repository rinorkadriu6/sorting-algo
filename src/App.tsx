import React, { useState } from "react";
import "./App.scss";

interface ColumnProps {
  value: number;
  index: number;
}

const Column: React.FC<ColumnProps> = ({ value, index }) => {
  return <div className="column" style={{ height: value * 10 }}></div>;
};

interface ColumnListProps {
  values: number[];
}

const shuffle = (array: number[]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

const ColumnList: React.FC<ColumnListProps> = ({ values }) => {
  const [sortedValues, setSortedValues] = useState<number[]>(values);
  const [withDelay, setWithDelay] = useState<boolean>(true);
  const [delay, setDelay] = useState<number>(10);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<string>("bubbleSort");

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const bubbleSort = async () => {
    setIsSorting(true);
    for (let i = 0; i < sortedValues.length; i++) {
      for (let j = 0; j < sortedValues.length; j++) {
        if (sortedValues[j] > sortedValues[j + 1]) {
          const temp = sortedValues[j];
          sortedValues[j] = sortedValues[j + 1];
          sortedValues[j + 1] = temp;
          if (withDelay) {
            await sleep(delay);
          }
          setSortedValues([...sortedValues]);
        }
      }
    }
    setIsSorting(false);
  };

  const partition = async (arr: number[], low: number, high: number) => {
    const pivot = arr[high];
    let i = low - 1;
    for(let j = low; j < high; j++) {
      if(arr[j] < pivot){
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        if (withDelay) {
          await sleep(delay);
        }
        setSortedValues([...arr]);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    return i + 1; 
  }

  const quickSort = async (arr: number[], low: number = 0, high: number = arr.length - 1) => {
    if (low < high) {
      const partitionIndex = await partition(arr, low, high);
      await quickSort(arr, low, partitionIndex - 1);
      await quickSort(arr, partitionIndex + 1, high);
    }
    return arr;
  }

  const handleQuickSort = async () => {
    setIsSorting(true);
    setSortedValues(await quickSort([...values], 0, values.length - 1));
    setIsSorting(false);
  }

  const mergeSort = async (
    arr: number[],
    left: number = 0,
    right: number = arr.length - 1
  ) => {
    if (left >= right) {
      return;
    }
    const middle = Math.floor((left + right) / 2);
    await mergeSort(arr, left, middle);
    await mergeSort(arr, middle + 1, right);
    await merge(arr, left, middle, right);
  };

  const merge = async (
    arr: number[],
    left: number,
    middle: number,
    right: number
  ) => {
    const leftArr = arr.slice(left, middle + 1);
    const rightArr = arr.slice(middle + 1, right + 1);

    let i = 0,
      j = 0,
      k = left;

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      if (withDelay) {
        await sleep(delay);
      }
      setSortedValues([...arr]);
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      if (withDelay) {
        await sleep(delay);
      }
      setSortedValues([...arr]);
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      if (withDelay) {
        await sleep(delay);
      }
      setSortedValues([...arr]);
      j++;
      k++;
    }
  };

  const handleMergeSort = async (values: number[]) => {
    setIsSorting(true);
    await mergeSort(values);
    setIsSorting(false);
  };

  const SortAlgorithms: any = {
    bubbleSort: { name: "Bubble Sort", sortFunc: bubbleSort },
    mergeSort: {name: "Merge Sort", sortFunc: handleMergeSort},
    quickSort: {name: "Quick Sort", sortFunc: handleQuickSort}
  };

  const handleReset = () => {
    setSortedValues([...shuffle(values)]);
  };

  const handleSort = async () => {
    await SortAlgorithms[selectedSort].sortFunc(values);
  };

  return (
    <div className="column-list-container">
      <div className="column-list">
        {sortedValues.map((value, index) => (
          <Column key={index} value={value} index={index} />
        ))}
      </div>
      <div className="button-container">
        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          {Object.keys(SortAlgorithms).map((sortKey) => (
            <option key={sortKey} value={sortKey}>
              {sortKey}
            </option>
          ))}
        </select>
        <button onClick={handleSort} disabled={isSorting}>
          {isSorting ? "Sorting..." : "Sort"}
        </button>
        <button disabled={isSorting} onClick={handleReset}>
          Reset
        </button>
      </div>
      <div className="timer-container">
        <div>
          <p>delay</p>
          <input
            disabled={isSorting}
            checked={withDelay}
            onChange={(e) => setWithDelay(e.target.checked)}
            type="checkbox"
          />
        </div>
        <div>
          <p>ms</p>
          <input
            disabled={isSorting}
            value={delay}
            onChange={(e) => setDelay(parseInt(e.target.value))}
            type="number"
          />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  let columns = [];
  for (let i = 0; i < 70; i++) {
    columns.push(i + 1);
  }

  shuffle(columns);

  return (
    <div className="App">
      <ColumnList values={columns} />
    </div>
  );
}
