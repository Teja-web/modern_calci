const display = document.querySelector("#display");
const expression = document.querySelector("#expression");
const statusText = document.querySelector("#status");
const keypad = document.querySelector(".keypad");

const state = {
  displayValue: "0",
  storedValue: null,
  operator: null,
  waitingForNextValue: false,
  error: false,
};

const operators = {
  add: { symbol: "+", calculate: (left, right) => left + right },
  subtract: { symbol: "-", calculate: (left, right) => left - right },
  multiply: { symbol: "x", calculate: (left, right) => left * right },
  divide: {
    symbol: "/",
    calculate: (left, right) => {
      if (right === 0) {
        return null;
      }



function resetState() {
  state.displayValue = "0";
  state.storedValue = null;
  state.operator = null;
  state.waitingForNextValue = false;
  state.error = false;
  render();
}

function clearErrorIfNeeded() {
  if (state.error) {
    resetState();
  }
}

function inputDigit(digit) {
  clearErrorIfNeeded();

  if (state.waitingForNextValue) {
    state.displayValue = digit;
    state.waitingForNextValue = false;
    render();
    return;
 

  state.displayValue = state.displayValue === "0" ? digit : state.displayValue + digit;


function inputDecimal() {
  clearErrorIfNeeded();

  if (state.waitingForNextValue) {
    state.displayValue = "0.";
    state.waitingForNextValue = false;
    render();
    return;
  }

  if (!state.displayValue.includes(".")) {
    state.displayValue += ".";
  }

  render();
}

function toggleSign() {
  clearErrorIfNeeded();

  if (state.displayValue === "0") {
 

  state.displayValue = state.displayValue.startsWith("-")
    ? state.displayValue.slice(1)
    : `-${state.displayValue}`;
  render();
}

function backspace() {
  clearErrorIfNeeded();

  if (state.waitingForNextValue) {

  const nextValue = state.displayValue.slice(0, -1);
  state.displayValue = nextValue && nextValue !== "-" ? nextValue : "0";
  render();
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const rounded = Number.parseFloat(value.toPrecision(12));
  return String(rounded);
}

function applyPendingOperation(nextOperator) {
  clearErrorIfNeeded();

  const inputValue = Number.parseFloat(state.displayValue);

  if (state.operator && state.waitingForNextValue) {
    state.operator = nextOperator;
    render();
    return;
  }

  if (state.storedValue === null) {
    state.storedValue = inputValue;
  } else if (state.operator) {
    const result = operators[state.operator].calculate(state.storedValue, inputValue);

    if (result === null) {
      setError("Cannot divide by zero");
      return;
    }

    state.displayValue = formatNumber(result);
    state.storedValue = result;
  }

  state.operator = nextOperator;
  state.waitingForNextValue = true;
  render();
}

function calculateResult() {
  clearErrorIfNeeded();

  if (!state.operator || state.storedValue === null || state.waitingForNextValue) {
    return;
  }

  const inputValue = Number.parseFloat(state.displayValue);
  const result = operators[state.operator].calculate(state.storedValue, inputValue);

  if (result === null) {
    setError("Cannot divide by zero");
    return;
  }

  state.displayValue = formatNumber(result);
  state.storedValue = null;
  state.operator = null;
  state.waitingForNextValue = true;
  render();
}

function setError(message) {
  state.displayValue = message;
  state.storedValue = null;
  state.operator = null;
  state.waitingForNextValue = true;
  state.error = true;
  render();
}

function getExpressionText() {
  if (state.error) {
    return "";
  }

  if (state.operator && state.storedValue !== null) {
    return `${formatNumber(state.storedValue)} ${operators[state.operator].symbol}`;
  }

  return "";
}

function render() {
  display.value = state.displayValue;
  display.textContent = state.displayValue;
  expression.textContent = getExpressionText() || "\u00a0";
  statusText.textContent = state.error ? "Error" : "Ready";
  statusText.classList.toggle("error", state.error);
}

function handleAction(action) {
  if (action === "clear") {
    resetState();
  } else if (action === "backspace") {
    backspace();
  } else if (action === "decimal") {
    inputDecimal();
  } else if (action === "equals") {
    calculateResult();
  } else if (action === "sign") {
    toggleSign();
  }
}

function flashKey(selector) {
  const key = document.querySelector(selector);

  if (!key) {
    return;
  }

  key.classList.add("pressed");
  window.setTimeout(() => key.classList.remove("pressed"), 120);
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  if (button.dataset.digit) {
    inputDigit(button.dataset.digit);
  } else if (button.dataset.operator) {
    applyPendingOperation(button.dataset.operator);
  } else if (button.dataset.action) {
    handleAction(button.dataset.action);
  }
});

window.addEventListener("keydown", (event) => {
  const { key } = event;

  if (/^\d$/.test(key)) {
    event.preventDefault();
    inputDigit(key);
    flashKey(`[data-digit="${key}"]`);
  } else if (key === ".") {
    event.preventDefault();
    inputDecimal();
    flashKey('[data-action="decimal"]');
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    event.preventDefault();
    const keyToOperator = {
      "+": "add",
      "-": "subtract",
      "*": "multiply",
      "/": "divide",
    };
    const operator = keyToOperator[key];
    applyPendingOperation(operator);
    flashKey(`[data-operator="${operator}"]`);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculateResult();
    flashKey('[data-action="equals"]');
  } else if (key === "Backspace") {
    event.preventDefault();
    backspace();
    flashKey('[data-action="backspace"]');
  } else if (key === "Escape") {
    event.preventDefault();
    resetState();
    flashKey('[data-action="clear"]');
  }
});

render();
