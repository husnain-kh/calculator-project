
const menuBtn = document.querySelector(".menu");
const menuList = document.querySelector(".list");
menuBtn.addEventListener("click", () => {
    menuList.classList.toggle("active");
    menuBtn.classList.toggle("open");

})



/**
 * for land and potrate
 */
const repeatBtn = document.querySelector(".repeat");
const calculator = document.querySelector(".calculator");
const potratMode = document.querySelector(".potrat-mode");
const header = document.querySelector(".header");

repeatBtn.addEventListener("click", () => {
    calculator.classList.toggle("land-scape");
    potratMode.classList.toggle("to-land-scape");
    header.classList.toggle("not");
})


// Scientific Calculator Logic (app.js)

// --- Query Dom elements ----
// --- Query DOM elements ---
const display = document.querySelector("#display");
const modeButton = document.querySelector("#mode");
const allButtons = document.querySelectorAll(".calc-btn");

// --- State ---
let currentExpr = "";
let memory = 0;
let degMode = false;

// --- Display Helpers ---
function updateDisplay(value) {
    display.value = value;
}
function appendToExpression(text) {
    currentExpr += text;
    updateDisplay(currentExpr);
}

// --- Clear / Backspace ---
function clearAll() {
    currentExpr = "";
    updateDisplay("0");
}
function deleteLast() {
    currentExpr = currentExpr.slice(0, -1);
    updateDisplay(currentExpr || "0");
}

// --- Random & Factorial ---
function appendRandom() {
    appendToExpression(Math.random().toString());
}
function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) throw "Factorial error";
    return n === 0 ? 1 : n * factorial(n - 1);
}

// --- Mode Toggle ---
function toggleMode() {
    degMode = !degMode;
    if (modeButton) modeButton.textContent = degMode ? "Deg" : "Rad";
}

// --- Memory ---
function memoryClear() { memory = 0; }
function memoryPlus() { memory += parseFloat(display.value) || 0; }
function memoryMinus() { memory -= parseFloat(display.value) || 0; }
function memoryRecall() { currentExpr = memory.toString(); updateDisplay(currentExpr); }

// --- Evaluate ---
function evaluateExpression() {
    try {
        let expr = currentExpr
            .replace(/%/g, "/100")
            .replace(/π/g, `(${Math.PI})`)
            .replace(/e(?![a-zA-Z])/g, `(${Math.E})`);

        // trig
        ["sin", "cos", "tan"].forEach(fn => {
            expr = expr.replace(
                new RegExp(`${fn}\\(`, "g"),
                degMode
                    ? `Math.${fn}(Math.PI/180*`
                    : `Math.${fn}(`
            );
        });

        // hyperbolic, logs, roots
        expr = expr
            .replace(/sinh\(/g, "Math.sinh(")
            .replace(/cosh\(/g, "Math.cosh(")
            .replace(/tanh\(/g, "Math.tanh(")
            .replace(/lg\(/g, "Math.log10(")
            .replace(/ln\(/gi, "Math.log(")
            .replace(/exp\(/g, "Math.exp(")
            .replace(/√\(/g, "Math.sqrt(")
            .replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?)/g, "Math.pow($1,$3)")
            .replace(/(\d+)!/g, (_, n) => factorial(+n));

        if (/[^0-9+\-*/%^().,eE MathPIlogsinschtanoprtdgxy!]/i.test(expr)) {
            throw "Invalid characters";
        }

        const result = Function('"use strict"; return (' + expr + ')')();
        currentExpr = result.toString();
        updateDisplay(result);

    } catch {
        updateDisplay("Error");
        currentExpr = "";
    }
}

// --- Button mappings ---
const appendMap = {
    plus: "+",
    minus: "-",
    multiply: "*",
    divide: "/",
    percent: "%",
    "^": "^",
    ee: "E",
};

// --- Wire up buttons ---
allButtons.forEach(btn => {
    const id = btn.dataset.id;
    const text = btn.textContent.trim();

    switch (id) {
        case "clear": btn.addEventListener("click", clearAll); break;
        case "backspace": btn.addEventListener("click", deleteLast); break;
        case "equals": btn.addEventListener("click", evaluateExpression); break;
        case "mc": btn.addEventListener("click", memoryClear); break;
        case "mPlus": btn.addEventListener("click", memoryPlus); break;
        case "mMinus": btn.addEventListener("click", memoryMinus); break;
        case "mr": btn.addEventListener("click", memoryRecall); break;
        case "rand": btn.addEventListener("click", appendRandom); break;
        case "mode": btn.addEventListener("click", toggleMode); break;
        default:
            // if data-id maps to a symbol, use that, otherwise button text
            const toAppend = appendMap[id] ?? text;
            btn.addEventListener("click", () => appendToExpression(toAppend));
    }
});

// --- Keyboard support ---
document.addEventListener("keydown", e => {
    const k = e.key;
    if (/[\d.]/.test(k)) appendToExpression(k);
    else if ("+-*/%^".includes(k)) appendToExpression(k);
    else if (k === "Enter") evaluateExpression();
    else if (k === "Backspace") deleteLast();
    else if (k === "Escape") clearAll();
    else if (k === "(" || k === ")") appendToExpression(k);
    else if (k === "r") appendRandom();
});
