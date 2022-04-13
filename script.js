var calc_nums = [];
var calc_ops = [];
var merged_arr = [];

function updateDisplay() {
    const elmTop = document.getElementById("top");
    const elmBot = document.getElementById("bottom");
    elmTop.textContent = "";
    merged_arr = [];
    if (calc_ops.length > 0) {
        for (let i = 0; i < calc_ops.length + 1; i++) {
            try {
                merged_arr.push(calc_nums[i]);
                merged_arr.push(calc_ops[i]);
            } finally {
                continue
            }
        }
        full_arr = merged_arr.join("");
        if (full_arr.length >= 20) {
            const elmMid = document.getElementById("mid");
            elmMid.textContent = "Input too large!";
            del();
        }
        if (calc_nums.length > 1 && calc_nums.length > calc_ops.length) {
            var results = calc_nums[0];
            for (let i = 0; i < calc_ops.length; i++) {
                expr = results + calc_ops[i] + calc_nums[i + 1];
                if (calc_ops[i] === "/" && parseInt(calc_nums[i + 1]) == 0) {
                    const elmMid = document.getElementById("mid");
                    elmMid.textContent = "Illegal calculation!";
                    results = "NaN";
                    break;
                } else {
                    results = Function('return ' + expr)();
                }
            }
            try {
                elmBot.textContent = results.toFixed(2).replace(/\.00$/, '');
            } catch {
                elmBot.textContent = results;
            }
        }
    } else {
        merged_arr = calc_nums;
        if (merged_arr.length > 0 && merged_arr[0].length >= 20) {
            const elmMid = document.getElementById("mid");
            elmMid.textContent = "Input too large!";
            del();
        }
    }
    elmTop.textContent = merged_arr.join("");
    if (calc_nums.length == 0) {
        elmBot.textContent = "0";
    } else if (calc_nums.length == 1) {
        safe_num = Number(calc_nums[0]).toFixed(2).replace(/\.00$/, '');
        elmBot.textContent = safe_num;
    }
}

function clear() {
    const elmTop = document.getElementById("top");
    const elmMid = document.getElementById("mid");
    const elmBot = document.getElementById("bottom");
    calc_nums = [];
    calc_ops = [];
    const buttons = document.getElementsByClassName("btn");
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].dataset.action !== "clear") {
            buttons[i].style.pointerEvents = 'auto';
            buttons[i].style.backgroundColor = null;
            buttons[i].style.color = null;
        }
    }
    elmTop.textContent = "";
    elmMid.textContent = "";
    elmBot.textContent = "";
}

function del(e) {
    if (e) {
        const elmMid = document.getElementById("mid");
        elmMid.textContent = "";
    }
    if (calc_nums.length == calc_ops.length) {
        calc_ops.pop();
    } else if (calc_nums.length > 0) {
        var last_item = calc_nums[calc_nums.length - 1];
        if (last_item.length > 1) {
            calc_nums[calc_nums.length - 1] = last_item.substring(0, last_item.length - 1);
        } else {
            calc_nums.pop();
        }
    }
    updateDisplay();
}

function addOperation(op) {
    const elmMid = document.getElementById("mid");
    elmMid.textContent = "";
    if (calc_nums.length !== calc_ops.length) {
        calc_ops.push(op);
    } else if (calc_ops[calc_ops.length - 1] !== op) {
        calc_ops[calc_ops.length - 1] = op;
    }
    updateDisplay();
}

function addValue(num) {
    if (calc_nums.length == calc_ops.length) {
        calc_nums.push(num);
    } else {
        var last_item = calc_nums[calc_nums.length - 1] + num;
        if (last_item < Number.MAX_SAFE_INTEGER && last_item > Number.MIN_SAFE_INTEGER) {
            calc_nums[calc_nums.length - 1] = last_item;
        } else {
            const elmMid = document.getElementById("mid");
            elmMid.textContent = "Number out of range!";
        }
    }
    updateDisplay();
}

function addDecimal() {
    if (calc_nums.length > calc_ops.length) {
        var last_item = calc_nums[calc_nums.length - 1].toString();
        if (last_item.indexOf(".") == -1) {
            calc_nums[calc_nums.length - 1] = last_item + ".";
        }
    }
    updateDisplay();
}

function throwError() {
    const buttons = document.getElementsByClassName("btn");
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].dataset.action !== "clear") {
            buttons[i].style.pointerEvents = 'none';
            buttons[i].style.backgroundColor = "rgb(183, 183, 183)";
            buttons[i].style.color = "rgb(150, 150, 150)";
        }
    }
}

function evaluate() {
    const elmMid = document.getElementById("mid");
    elmMid.textContent = ""
    const elmBot = document.getElementById("bottom");
    if (calc_nums.length == calc_ops.length) {
        elmMid.textContent = "Missing arguments!";
        elmBot.textContent = "NaN";
    } else if (calc_nums.length === 1) {
        elmBot.textContent = calc_nums[0];
    } else if (calc_nums.length > 1 && calc_nums.length > calc_ops.length) {
        var results = calc_nums[0];
        for (let i = 0; i < calc_ops.length; i++) {
            expr = results + calc_ops[i] + calc_nums[i + 1];
            if (calc_ops[i] === "/" && parseInt(calc_nums[i + 1]) == 0) {
                elmMid.textContent = "Illegal calculation!";
                results = "NaN";
                throwError();
                break;
            } else {
                results = Function('return ' + expr)();
            }
        }
        try {
            results = results.toFixed(2).replace(/\.00$/, '');
        } catch {
            results = results;
        }
        elmBot.textContent = results;
        if (results === "NaN") {
            throwError();
        }
        calc_nums = [];
        calc_nums.push(results);
        calc_ops = [];
        updateDisplay();
    } else {
        elmBot.textContent = "0";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.getElementsByClassName("btn");
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].dataset.action === "clear") {
            buttons[i].addEventListener("click", clear);
        } else if (buttons[i].dataset.action === "delete") {
            buttons[i].addEventListener("click", del);
        } else if (buttons[i].dataset.action === "operation") {
            buttons[i].addEventListener("click", () => addOperation(buttons[i].dataset.value));
        } else if (buttons[i].dataset.action === "value") {
            buttons[i].addEventListener("click", () => addValue(buttons[i].dataset.value));
        } else if (buttons[i].dataset.action === "decimal") {
            buttons[i].addEventListener("click", addDecimal);
        } else if (buttons[i].dataset.action === "evaluate") {
            buttons[i].addEventListener("click", evaluate);
        }
    }
}, false);

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        clear();
    } else if (e.key === "Backspace") {
        del();
    } else if (["%", "/", "*", "-", "+"].indexOf(e.key) >= 0) {
        addOperation(e.key);
    } else if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].indexOf(e.key) >= 0) {
        addValue(e.key);
    } else if (e.key === ".") {
        del();
    } else if (["=", "Enter"].indexOf(e.key) >= 0) {
        evaluate();
    }
});