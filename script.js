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
        if (calc_nums.length > 1 && calc_nums.length > calc_ops.length) {
            var results = calc_nums[0];
            for (let i = 0; i < calc_ops.length; i++) {
                expr = results + calc_ops[i] + calc_nums[i + 1];
                if (calc_ops[i] === "/" && parseInt(calc_nums[i + 1]) == 0) {
                    results = "ERROR!";
                    break;
                } else {
                    results = Function('return ' + expr)();
                }
            }
            elmBot.textContent = results;
        }
    } else {
        merged_arr = calc_nums;
    }
    elmTop.textContent = merged_arr.join("");
    if (calc_nums.length == 0) {
        elmBot.textContent = "0";
    } else if (calc_nums.length == 1) {
        elmBot.textContent = calc_nums[0];
    }
}

function clear() {
    const elmTop = document.getElementById("top");
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
    elmBot.textContent = "";
}

function del() {
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
        var last_item = calc_nums[calc_nums.length - 1];
        calc_nums[calc_nums.length - 1] = last_item + num;
    }
    updateDisplay();
}

function addDecimal() {
    if (calc_nums.length > 0) {
        var last_item = calc_nums[calc_nums.length - 1].toString();
        if (last_item.indexOf(".") == -1) {
            calc_nums[calc_nums.length - 1] = last_item + ".";
        }
    }
    updateDisplay();
}

function evaluate() {
    const elmBot = document.getElementById("bottom");
    if (calc_nums.length == calc_ops.length) {
        elmBot.textContent = "ERROR!";
    } else if (calc_nums.length === 1) {
        elmBot.textContent = calc_nums[0];
    } else if (calc_nums.length > 1 && calc_nums.length > calc_ops.length) {
        var results = calc_nums[0];
        for (let i = 0; i < calc_ops.length; i++) {
            expr = results + calc_ops[i] + calc_nums[i + 1];
            if (calc_ops[i] === "/" && parseInt(calc_nums[i + 1]) == 0) {
                results = "ERROR!";
                const buttons = document.getElementsByClassName("btn");
                for (let i = 0; i < buttons.length; i++) {
                    if (buttons[i].dataset.action !== "clear") {
                        buttons[i].style.pointerEvents = 'none';
                        buttons[i].style.backgroundColor = "rgb(183, 183, 183)";
                        buttons[i].style.color = "rgb(150, 150, 150)";
                    }
                }
                break;
            } else {
                results = Function('return ' + expr)();
            }
        }
        elmBot.textContent = results;
        calc_nums = [];
        calc_nums.push(results);
        calc_ops = [];
        updateDisplay();
    } else {
        elmBot.textContent = "0";
    }
}

document.addEventListener('DOMContentLoaded', function() {
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
            buttons[i].addEventListener("click", () => addDecimal(buttons[i].dataset.value));
        } else if (buttons[i].dataset.action === "evaluate") {
            buttons[i].addEventListener("click", evaluate);
        }
    }
}, false);