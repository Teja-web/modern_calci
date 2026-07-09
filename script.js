const historyList = document.querySelector("#historyList");
const clearHistoryBtn = document.querySelector("#clearHistory");
const themeToggle = document.querySelector("#themeToggle");
const currentDate = document.querySelector("#currentDate");
const currentTime = document.querySelector("#currentTime");
const memoryStatus = document.querySelector("#memoryStatus");
const calculationHistory = [];
let memoryValue = null;
function addToHistory(expression, result) {
  calculationHistory.unshift(`${expression} = ${result}`);

  if (calculationHistory.length > 10) {
    calculationHistory.pop();
  }

  renderHistory();
}

function renderHistory() {
  if (!historyList) return;

  historyList.innerHTML = "";

  if (calculationHistory.length === 0) {
    historyList.innerHTML = "<li>No calculations yet.</li>";
    return;
  }

  calculationHistory.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}
state.displayValue = formatNumber(result);

const expressionText = `${formatNumber(state.storedValue)} ${
  operators[state.operator].symbol
} ${inputValue}`;

addToHistory(expressionText, formatNumber(result));

function updateClock() {
  const now = new Date();

  if (currentDate) {
    currentDate.textContent = now.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  if (currentTime) {
    currentTime.textContent = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
}

updateClock();
setInterval(updateClock, 1000);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    themeToggle.textContent =
      document.body.classList.contains("dark-theme")
        ? "☀️"
        : "🌙";
  });
}


if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener("click", () => {
    calculationHistory.length = 0;
    renderHistory();
  });
}
function updateMemoryStatus() {
  if (!memoryStatus) return;

  memoryStatus.textContent =
    memoryValue === null ? "Empty" : memoryValue;
}


updateMemoryStatus();

else if (key.toLowerCase() === "t") {
    document.body.classList.toggle("dark-theme");

    if (themeToggle) {
        themeToggle.textContent =
            document.body.classList.contains("dark-theme")
                ? "☀️"
                : "🌙";
    }
}
render();
render();
renderHistory();
updateMemoryStatus();
updateClock();
