const n = 50;
const array = [];
let audioCtx = null;

init();

function init() {
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showBars();
}

function playBubbleSort() {
    const swaps = bubbleSort([...array]);
    animate(swaps);
}

function playInsertionSort() {
    const swaps = insertionSort([...array]);
    animate(swaps);
}

function playSelectionSort() {
    const swaps = selectionSort([...array]);
    animate(swaps);
}

function playMergeSort() {
    const swaps = mergeSort([...array]);
    animate(swaps);
}

function playQuickSort() {
    const swaps = quickSort([...array], 0, array.length - 1);
    animate(swaps);
}

function animate(swaps) {
    if (swaps.length == 0) {
        showBars();
        return;
    }
    const [i, j] = swaps.shift();
    [array[i], array[j]] = [array[j], array[i]];
    showBars([i, j]);
    playNote(10 + array[i] * 8000);
    playNote(10 + array[j] * 100);

    setTimeout(function () {
        animate(swaps);
    }, 20);
}

function bubbleSort(array) {
    const swaps = [];
    let swapped;
    do {
        swapped = false;
        for (let i = 1; i < array.length; i++) {
            if (array[i - 1] > array[i]) {
                swaps.push([i - 1, i]);
                swapped = true;
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
            }
        }
    } while (swapped);
    return swaps;
}

function insertionSort(array) {
    const swaps = [];
    for (let i = 1; i < array.length; i++) {
        let j = i;
        while (j > 0 && array[j - 1] > array[j]) {
            swaps.push([j - 1, j]);
            [array[j - 1], array[j]] = [array[j], array[j - 1]];
            j--;
        }
    }
    return swaps;
}

function selectionSort(array) {
    const swaps = [];
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            swaps.push([minIndex, i]);
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
        }
    }
    return swaps;
}

function mergeSort(array) {
    if (array.length <= 1) return [];
    const mid = Math.floor(array.length / 2);
    const left = array.slice(0, mid);
    const right = array.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    const result = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    return result.concat(left.slice(i), right.slice(j));
}

function quickSort(array, left, right) {
    if (left >= right) return [];
    const pivot = array[Math.floor((left + right) / 2)];
    let i = left;
    let j = right;
    const swaps = [];
    while (i <= j) {
        while (array[i] < pivot) {
            i++;
        }
        while (array[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swaps.push([i, j]);
            [array[i], array[j]] = [array[j], array[i]];
            i++;
            j--;
        }
    }
    return swaps.concat(quickSort(array, left, j), quickSort(array, i, right));
}

function showBars(indices) {
    const container = document.getElementById("container");
    container.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("bar");
        if (indices && indices.includes(i)) {
            bar.style.backgroundColor = "cyan";
        }
        container.appendChild(bar);
    }
}

function playNote(freq) {
    if (audioCtx == null) {
        audioCtx = new (
            AudioContext ||
            webkitAudioContext ||
            window.webkitAudioContext
        )();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime + dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}
