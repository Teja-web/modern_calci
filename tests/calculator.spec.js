(() => {
  const results = document.querySelector("#results");
  const display = document.querySelector("#display");
  const status = document.querySelector("#status");
  const expression = document.querySelector("#expression");

  const testCases = [];

  function test(name, fn) {
    testCases.push({ name, fn });
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  function click(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Missing element: ${selector}`);
    }
    element.click();
  }

  function keydown(key) {
    window.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  }

  function reset() {
    click('[data-action="clear"]');
  }

  test("initial state is ready", () => {
    assert(display.textContent === "0", "Display should start at 0");
    assert(status.textContent === "Ready", "Status should start as Ready");
    assert(expression.textContent === "\u00a0", "Expression should start empty");
  });

  test("clicking the sign button does not toggle sign", () => {
    reset();
    click('[data-digit="5"]');
    click('button[aria-disabled="true"]');
    assert(display.textContent === "5", "Pointer interaction should not change sign");
  });

  test("sign toggle does not change zero", () => {
    reset();
    click('[data-action="sign"]');
    assert(display.textContent === "0", "Zero should remain unchanged");
  });

  test("backspace clears a lone negative sign to zero", () => {
    reset();
    click('[data-digit="7"]');
    click('[data-action="sign"]');
    click('[data-action="backspace"]');
    assert(display.textContent === "0", "Backspace should normalize a lone minus to zero");
  });

  test("keyboard digits and operators still work with sign changes in the flow", () => {
    reset();
    keydown("8");
    keydown("+");
    keydown("2");
    keydown("Enter");
    assert(display.textContent === "10", "Keyboard arithmetic should still work");
  });

  test("keyboard input does not provide a sign toggle shortcut", () => {
    reset();
    click('[data-digit="4"]');
    keydown("-");
    assert(display.textContent === "4", "Minus key should act as subtraction, not sign toggle");
  });

  test("F9 toggles the sign from the keyboard", () => {
    reset();
    click('[data-digit="4"]');
    keydown("F9");
    assert(display.textContent === "-4", "F9 should toggle the sign");
    keydown("F9");
    assert(display.textContent === "4", "F9 should toggle the sign back");
  });

  async function run() {
    const lines = [];
    let failures = 0;

    for (const { name, fn } of testCases) {
      try {
        fn();
        lines.push(`PASS ${name}`);
      } catch (error) {
        failures += 1;
        lines.push(`FAIL ${name}: ${error.message}`);
      }
    }

    results.innerHTML = lines
      .map((line) => {
        const cls = line.startsWith("PASS") ? "pass" : "fail";
        return `<div class="${cls}">${line}</div>`;
      })
      .join("");

    if (failures > 0) {
      document.title = `Calculator Tests - ${failures} failed`;
      console.error(`${failures} test(s) failed`);
    } else {
      document.title = "Calculator Tests - passing";
      console.log("All calculator tests passed");
    }
  }

  window.addEventListener("load", run);
})();
