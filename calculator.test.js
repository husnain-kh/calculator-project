/** @jest-environment jsdom */
const {
    updateDisplay,
    appendToExpression,
    clearAll,
    deleteLast,
    appendRandom,
    factorial,
    toggleMode,
    memoryClear,
    memoryPlus,
    memoryMinus,
    memoryRecall,
    evaluateExpression,
} = require('./index'); // adjust path as needed

describe('Calculator Core Functions', () => {
    beforeEach(() => {
        // Set up a mock display
        document.body.innerHTML = '<textarea id="display">0</textarea>';
    });

    test('updateDisplay sets display.value', () => {
        updateDisplay('123');
        const display = document.querySelector('#display');
        expect(display.value).toBe('123');
    });

    test('appendToExpression accumulates expression and updates display', () => {
        appendToExpression('1');
        appendToExpression('+');
        appendToExpression('2');
        const display = document.querySelector('#display');
        expect(display.value).toBe('1+2');
    });

    test('clearAll resets expression and display', () => {
        appendToExpression('5');
        clearAll();
        const display = document.querySelector('#display');
        expect(display.value).toBe('0');
    });

    test('deleteLast removes last character', () => {
        appendToExpression('123');
        deleteLast();
        const display = document.querySelector('#display');
        expect(display.value).toBe('12');
    });

    test('appendRandom appends a numeric string', () => {
        appendRandom();
        const display = document.querySelector('#display');
        expect(/[0]\.[0-9]+/.test(display.value)).toBe(true);
    });

    test('factorial computes correctly', () => {
        expect(factorial(0)).toBe(1);
        expect(factorial(5)).toBe(120);
    });

    test('toggleMode toggles degMode and updates button text', () => {
        document.body.innerHTML = '<button id="mode">Rad</button>';
        const modeButton = document.querySelector('#mode');
        // initial text 'Rad'
        toggleMode();
        expect(modeButton.textContent).toBe('Deg');
        toggleMode();
        expect(modeButton.textContent).toBe('Rad');
    });

    describe('Memory Functions', () => {
        test('memoryClear resets memory to 0', () => {
            memoryPlus(); // from 0 to value of display(0)
            memoryClear();
            // no direct way to read memory, but recall should return '0'
            memoryRecall();
            const display = document.querySelector('#display');
            expect(display.value).toBe('0');
        });

        test('memoryPlus and memoryMinus store and recall correctly', () => {
            updateDisplay('10');
            memoryPlus();
            updateDisplay('3');
            memoryMinus();
            memoryRecall();
            const display = document.querySelector('#display');
            // 10 + 0 - 3 = 7
            expect(parseFloat(display.value)).toBeCloseTo(7);
        });
    });

    describe('evaluateExpression', () => {
        test('simple arithmetic', () => {
            appendToExpression('2+3*4');
            evaluateExpression();
            const display = document.querySelector('#display');
            expect(display.value).toBe('14');
        });

        test('percent operator', () => {
            appendToExpression('50%');
            evaluateExpression();
            const display = document.querySelector('#display');
            expect(parseFloat(display.value)).toBeCloseTo(0.5);
        });

        test('power operator', () => {
            appendToExpression('2^3');
            evaluateExpression();
            const display = document.querySelector('#display');
            expect(display.value).toBe('8');
        });

        test('factorial postfix', () => {
            appendToExpression('4!');
            evaluateExpression();
            const display = document.querySelector('#display');
            expect(display.value).toBe('24');
        });

        test('trig in deg and rad mode', () => {
            // radians mode
            appendToExpression('sin(0)');
            evaluateExpression();
            let display = document.querySelector('#display');
            expect(display.value).toBe('0');
            clearAll();
            // degrees mode: sin(30°) ≈ 0.5
            toggleMode();
            appendToExpression('sin(30)');
            evaluateExpression();
            display = document.querySelector('#display');
            expect(parseFloat(display.value)).toBeCloseTo(0.5);
        });
    });
});
  