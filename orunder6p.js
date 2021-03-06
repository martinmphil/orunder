var instruct = function (n, us, them, advUs, advThem, d100) {
    if (n === void 0) { n = 3; }
    if (us === void 0) { us = 1; }
    if (them === void 0) { them = 1; }
    if (advUs === void 0) { advUs = 0; }
    if (advThem === void 0) { advThem = 0; }
    if (d100 === void 0) { d100 = false; }
    var deltaAdv = advUs - advThem;
    var logarithmicScaling = function (delta) {
        return 2 * Math.log(Math.abs(delta) + 1);
    };
    var forceMultiplier = deltaAdv > 0
        ? logarithmicScaling(deltaAdv)
        : deltaAdv < 0
            ? 1 / logarithmicScaling(deltaAdv)
            : 1;
    var usVsThem = (us / them) * forceMultiplier;
    var nData = orunder6pDataFn().filter(function (x) {
        return x.n === n;
    });
    var actualFR = parseFloat(usVsThem.toPrecision(4));
    var diceData = nData.filter(function (x) {
        return x.d === 100 ? d100 : true;
    });
    var nearestFR = diceData
        .map(function (x) { return x.f; })
        .reduce(function (acc, curr) {
        return Math.abs(curr - actualFR) < Math.abs(acc - actualFR) ? curr : acc;
    });
    var encounter = nData.filter(function (x) {
        return x.f === nearestFR;
    })[0];
    var rule = encounter.t === 1 ? "=exactly" : "=orUnder";
    return "<div>" + n + "d" + encounter.d + "<small> " + rule + " </small>" + encounter.t + "<div>";
};
var state = {
    n: 3,
    us: 10,
    them: 10,
    advUs: 0,
    advThem: 0,
    d100: false
};
var nSet = function (a) {
    var n = 3;
    var x = parseInt(a);
    if (x < 1 || x > 9 || isNaN(x)) {
        n = 3;
    }
    else {
        n = x;
    }
    state.n = n;
    refresh(state);
};
var validForce = function (a) {
    if (a === 0 || isNaN(a)) {
        return false;
    }
    else
        return true;
};
var usSet = function (a) {
    var x = Math.abs(parseFloat(a));
    if (validForce(x)) {
        state.us = x;
        refresh(state);
    }
};
var themSet = function (a) {
    var x = Math.abs(parseFloat(a));
    if (validForce(x)) {
        state.them = x;
        refresh(state);
    }
};
var refresh = function (_a) {
    var n = _a.n, us = _a.us, them = _a.them, advUs = _a.advUs, advThem = _a.advThem, d100 = _a.d100;
    var ouput = document.querySelector("output");
    ouput.innerHTML = instruct(n, us, them, advUs, advThem, d100);
    var precisUs = document.getElementById("precisUs");
    precisUs.innerHTML = us + "<small>(adv " + advUs + ")</small>";
    var precisThem = document.getElementById("precisThem");
    precisThem.innerHTML = them + "<small>(adv " + advThem + ")</small>";
};
var setup = function () {
    var d100Input = document.getElementById("d100Input");
    d100Input.addEventListener("change", function () {
        state.d100 = d100Input.checked;
        refresh(state);
    });
    var usInput = document.getElementById("usInput");
    usInput.addEventListener("input", function () {
        usSet(usInput.value);
    });
    var minus1Us = document.getElementById("minus1Us");
    minus1Us.addEventListener("click", function () {
        var x = Math.round(--state.us);
        usSet(x.toString());
        if (x > 0) {
            usInput.value = x.toString();
        }
    });
    var plus1Us = document.getElementById("plus1Us");
    plus1Us.addEventListener("click", function () {
        var x = Math.round(++state.us);
        usSet(x.toString());
        usInput.value = x.toString();
    });
    var advUsInput = document.getElementById("advUsInput");
    advUsInput.addEventListener("input", function () {
        var x = parseFloat(advUsInput.value);
        if (!isNaN(x)) {
            state.advUs = x;
        }
        refresh(state);
    });
    var minus1AdvUs = document.getElementById("minus1AdvUs");
    minus1AdvUs.addEventListener("click", function () {
        var x = Math.round(--state.advUs);
        state.advUs = x;
        advUsInput.value = x.toString();
        refresh(state);
    });
    var plus1AdvUs = document.getElementById("plus1AdvUs");
    plus1AdvUs.addEventListener("click", function () {
        var x = Math.round(++state.advUs);
        state.advUs = x;
        advUsInput.value = x.toString();
        refresh(state);
    });
    var themInput = document.getElementById("themInput");
    themInput.addEventListener("input", function () {
        themSet(themInput.value);
    });
    var minus1Them = document.getElementById("minus1Them");
    minus1Them.addEventListener("click", function () {
        var x = Math.round(--state.them);
        themSet(x.toString());
        if (x > 0) {
            themInput.value = x.toString();
        }
    });
    var plus1Them = document.getElementById("plus1Them");
    plus1Them.addEventListener("click", function () {
        var x = Math.round(++state.them);
        themSet(x.toString());
        themInput.value = x.toString();
    });
    var advThemInput = document.getElementById("advThemInput");
    advThemInput.addEventListener("input", function () {
        var x = parseFloat(advThemInput.value);
        if (!isNaN(x)) {
            state.advThem = x;
        }
        refresh(state);
    });
    advThemInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            advThemInput.blur();
        }
    });
    var minus1AdvThem = document.getElementById("minus1AdvThem");
    minus1AdvThem.addEventListener("click", function () {
        var x = Math.round(--state.advThem);
        state.advThem = x;
        advThemInput.value = x.toString();
        refresh(state);
    });
    var plus1AdvThem = document.getElementById("plus1AdvThem");
    plus1AdvThem.addEventListener("click", function () {
        var x = Math.round(++state.advThem);
        state.advThem = x;
        advThemInput.value = x.toString();
        refresh(state);
    });
};
setup();
var reset = function () {
    state.n = 3;
    var n3 = document.getElementById("n3");
    n3.checked = true;
    state.us = 10;
    var usInput = document.getElementById("usInput");
    usInput.value = "10";
    state.them = 10;
    var themInput = document.getElementById("themInput");
    themInput.value = "10";
    state.advUs = 0;
    var advUsInput = document.getElementById("advUsInput");
    advUsInput.value = "0";
    state.advThem = 0;
    var advThemInput = document.getElementById("advThemInput");
    advThemInput.value = "0";
    state.d100 = false;
    var d100Input = document.getElementById("d100Input");
    d100Input.checked = false;
    refresh(state);
};
reset();
function orunder6pDataFn() {
    return [
        { n: 1, d: 6, t: 1, f: 0.3334 },
        { n: 1, d: 6, t: 2, f: 0.6666 },
        { n: 1, d: 6, t: 3, f: 1 },
        { n: 1, d: 6, t: 4, f: 1.667 },
        { n: 1, d: 6, t: 5, f: 2.999 },
        { n: 1, d: 8, t: 1, f: 0.25 },
        { n: 1, d: 8, t: 2, f: 0.5 },
        { n: 1, d: 8, t: 3, f: 0.75 },
        { n: 1, d: 8, t: 5, f: 1.5 },
        { n: 1, d: 8, t: 6, f: 2 },
        { n: 1, d: 8, t: 7, f: 4 },
        { n: 1, d: 12, t: 1, f: 0.1667 },
        { n: 1, d: 12, t: 5, f: 0.8334 },
        { n: 1, d: 12, t: 7, f: 1.333 },
        { n: 1, d: 12, t: 11, f: 6.002 },
        { n: 1, d: 20, t: 1, f: 0.1 },
        { n: 1, d: 20, t: 2, f: 0.2 },
        { n: 1, d: 20, t: 3, f: 0.3 },
        { n: 1, d: 20, t: 4, f: 0.4 },
        { n: 1, d: 20, t: 6, f: 0.6 },
        { n: 1, d: 20, t: 7, f: 0.7 },
        { n: 1, d: 20, t: 8, f: 0.8 },
        { n: 1, d: 20, t: 9, f: 0.9 },
        { n: 1, d: 20, t: 11, f: 1.2 },
        { n: 1, d: 20, t: 12, f: 1.4 },
        { n: 1, d: 20, t: 13, f: 1.6 },
        { n: 1, d: 20, t: 14, f: 1.8 },
        { n: 1, d: 20, t: 16, f: 2.5 },
        { n: 1, d: 20, t: 17, f: 3.333 },
        { n: 1, d: 20, t: 18, f: 5 },
        { n: 1, d: 20, t: 19, f: 10 },
        { n: 1, d: 100, t: 1, f: 0.02 },
        { n: 1, d: 100, t: 2, f: 0.04 },
        { n: 1, d: 100, t: 3, f: 0.06 },
        { n: 1, d: 100, t: 4, f: 0.08 },
        { n: 1, d: 100, t: 6, f: 0.12 },
        { n: 1, d: 100, t: 7, f: 0.14 },
        { n: 1, d: 100, t: 8, f: 0.16 },
        { n: 1, d: 100, t: 9, f: 0.18 },
        { n: 1, d: 100, t: 11, f: 0.22 },
        { n: 1, d: 100, t: 12, f: 0.24 },
        { n: 1, d: 100, t: 13, f: 0.26 },
        { n: 1, d: 100, t: 14, f: 0.28 },
        { n: 1, d: 100, t: 16, f: 0.32 },
        { n: 1, d: 100, t: 17, f: 0.34 },
        { n: 1, d: 100, t: 18, f: 0.36 },
        { n: 1, d: 100, t: 19, f: 0.38 },
        { n: 1, d: 100, t: 21, f: 0.42 },
        { n: 1, d: 100, t: 22, f: 0.44 },
        { n: 1, d: 100, t: 23, f: 0.46 },
        { n: 1, d: 100, t: 24, f: 0.48 },
        { n: 1, d: 100, t: 26, f: 0.52 },
        { n: 1, d: 100, t: 27, f: 0.54 },
        { n: 1, d: 100, t: 28, f: 0.56 },
        { n: 1, d: 100, t: 29, f: 0.58 },
        { n: 1, d: 100, t: 31, f: 0.62 },
        { n: 1, d: 100, t: 32, f: 0.64 },
        { n: 1, d: 100, t: 33, f: 0.66 },
        { n: 1, d: 100, t: 34, f: 0.68 },
        { n: 1, d: 100, t: 36, f: 0.72 },
        { n: 1, d: 100, t: 37, f: 0.74 },
        { n: 1, d: 100, t: 38, f: 0.76 },
        { n: 1, d: 100, t: 39, f: 0.78 },
        { n: 1, d: 100, t: 41, f: 0.82 },
        { n: 1, d: 100, t: 42, f: 0.84 },
        { n: 1, d: 100, t: 43, f: 0.86 },
        { n: 1, d: 100, t: 44, f: 0.88 },
        { n: 1, d: 100, t: 46, f: 0.92 },
        { n: 1, d: 100, t: 47, f: 0.94 },
        { n: 1, d: 100, t: 48, f: 0.96 },
        { n: 1, d: 100, t: 49, f: 0.98 },
        { n: 1, d: 100, t: 51, f: 1.04 },
        { n: 1, d: 100, t: 52, f: 1.08 },
        { n: 1, d: 100, t: 53, f: 1.12 },
        { n: 1, d: 100, t: 54, f: 1.16 },
        { n: 1, d: 100, t: 56, f: 1.24 },
        { n: 1, d: 100, t: 57, f: 1.28 },
        { n: 1, d: 100, t: 58, f: 1.32 },
        { n: 1, d: 100, t: 59, f: 1.36 },
        { n: 1, d: 100, t: 61, f: 1.44 },
        { n: 1, d: 100, t: 62, f: 1.48 },
        { n: 1, d: 100, t: 63, f: 1.52 },
        { n: 1, d: 100, t: 64, f: 1.56 },
        { n: 1, d: 100, t: 66, f: 1.64 },
        { n: 1, d: 100, t: 67, f: 1.68 },
        { n: 1, d: 100, t: 68, f: 1.72 },
        { n: 1, d: 100, t: 69, f: 1.76 },
        { n: 1, d: 100, t: 71, f: 1.84 },
        { n: 1, d: 100, t: 72, f: 1.88 },
        { n: 1, d: 100, t: 73, f: 1.92 },
        { n: 1, d: 100, t: 74, f: 1.96 },
        { n: 1, d: 100, t: 76, f: 2.083 },
        { n: 1, d: 100, t: 77, f: 2.174 },
        { n: 1, d: 100, t: 78, f: 2.273 },
        { n: 1, d: 100, t: 79, f: 2.381 },
        { n: 1, d: 100, t: 81, f: 2.632 },
        { n: 1, d: 100, t: 82, f: 2.778 },
        { n: 1, d: 100, t: 83, f: 2.941 },
        { n: 1, d: 100, t: 84, f: 3.125 },
        { n: 1, d: 100, t: 86, f: 3.571 },
        { n: 1, d: 100, t: 87, f: 3.846 },
        { n: 1, d: 100, t: 88, f: 4.167 },
        { n: 1, d: 100, t: 89, f: 4.545 },
        { n: 1, d: 100, t: 91, f: 5.556 },
        { n: 1, d: 100, t: 92, f: 6.25 },
        { n: 1, d: 100, t: 93, f: 7.143 },
        { n: 1, d: 100, t: 94, f: 8.333 },
        { n: 1, d: 100, t: 96, f: 12.5 },
        { n: 1, d: 100, t: 97, f: 16.67 },
        { n: 1, d: 100, t: 98, f: 25 },
        { n: 1, d: 100, t: 99, f: 50 },
        { n: 2, d: 6, t: 1, f: 0.6112 },
        { n: 2, d: 6, t: 2, f: 1.222 },
        { n: 2, d: 6, t: 3, f: 2 },
        { n: 2, d: 6, t: 4, f: 4.5 },
        { n: 2, d: 6, t: 5, f: 17.99 },
        { n: 2, d: 8, t: 1, f: 0.4688 },
        { n: 2, d: 8, t: 2, f: 0.875 },
        { n: 2, d: 8, t: 3, f: 1.438 },
        { n: 2, d: 8, t: 5, f: 3.556 },
        { n: 2, d: 8, t: 6, f: 8 },
        { n: 2, d: 8, t: 7, f: 32.05 },
        { n: 2, d: 12, t: 1, f: 0.3194 },
        { n: 2, d: 12, t: 5, f: 1.639 },
        { n: 2, d: 12, t: 7, f: 2.88 },
        { n: 2, d: 12, t: 11, f: 72.46 },
        { n: 2, d: 20, t: 1, f: 0.195 },
        { n: 2, d: 20, t: 2, f: 0.38 },
        { n: 2, d: 20, t: 3, f: 0.555 },
        { n: 2, d: 20, t: 4, f: 0.72 },
        { n: 2, d: 20, t: 6, f: 1.04 },
        { n: 2, d: 20, t: 7, f: 1.31 },
        { n: 2, d: 20, t: 8, f: 1.56 },
        { n: 2, d: 20, t: 9, f: 1.79 },
        { n: 2, d: 20, t: 11, f: 2.469 },
        { n: 2, d: 20, t: 12, f: 3.125 },
        { n: 2, d: 20, t: 13, f: 4.082 },
        { n: 2, d: 20, t: 14, f: 5.556 },
        { n: 2, d: 20, t: 16, f: 12.5 },
        { n: 2, d: 20, t: 17, f: 22.22 },
        { n: 2, d: 20, t: 18, f: 50 },
        { n: 2, d: 20, t: 19, f: 100 },
        { n: 2, d: 100, t: 1, f: 0.0398 },
        { n: 2, d: 100, t: 2, f: 0.0792 },
        { n: 2, d: 100, t: 3, f: 0.1182 },
        { n: 2, d: 100, t: 4, f: 0.1568 },
        { n: 2, d: 100, t: 6, f: 0.2328 },
        { n: 2, d: 100, t: 7, f: 0.2702 },
        { n: 2, d: 100, t: 8, f: 0.3072 },
        { n: 2, d: 100, t: 9, f: 0.3438 },
        { n: 2, d: 100, t: 11, f: 0.4158 },
        { n: 2, d: 100, t: 12, f: 0.4512 },
        { n: 2, d: 100, t: 13, f: 0.4862 },
        { n: 2, d: 100, t: 14, f: 0.5208 },
        { n: 2, d: 100, t: 16, f: 0.5888 },
        { n: 2, d: 100, t: 17, f: 0.6222 },
        { n: 2, d: 100, t: 18, f: 0.6552 },
        { n: 2, d: 100, t: 19, f: 0.6878 },
        { n: 2, d: 100, t: 21, f: 0.7518 },
        { n: 2, d: 100, t: 22, f: 0.7832 },
        { n: 2, d: 100, t: 23, f: 0.8142 },
        { n: 2, d: 100, t: 24, f: 0.8448 },
        { n: 2, d: 100, t: 26, f: 0.9048 },
        { n: 2, d: 100, t: 27, f: 0.9342 },
        { n: 2, d: 100, t: 28, f: 0.9632 },
        { n: 2, d: 100, t: 29, f: 0.9918 },
        { n: 2, d: 100, t: 31, f: 1.096 },
        { n: 2, d: 100, t: 32, f: 1.15 },
        { n: 2, d: 100, t: 33, f: 1.204 },
        { n: 2, d: 100, t: 34, f: 1.258 },
        { n: 2, d: 100, t: 36, f: 1.362 },
        { n: 2, d: 100, t: 37, f: 1.412 },
        { n: 2, d: 100, t: 38, f: 1.462 },
        { n: 2, d: 100, t: 39, f: 1.512 },
        { n: 2, d: 100, t: 41, f: 1.608 },
        { n: 2, d: 100, t: 42, f: 1.654 },
        { n: 2, d: 100, t: 43, f: 1.7 },
        { n: 2, d: 100, t: 44, f: 1.746 },
        { n: 2, d: 100, t: 46, f: 1.834 },
        { n: 2, d: 100, t: 47, f: 1.876 },
        { n: 2, d: 100, t: 48, f: 1.918 },
        { n: 2, d: 100, t: 49, f: 1.96 },
        { n: 2, d: 100, t: 51, f: 2.082 },
        { n: 2, d: 100, t: 52, f: 2.17 },
        { n: 2, d: 100, t: 53, f: 2.263 },
        { n: 2, d: 100, t: 54, f: 2.363 },
        { n: 2, d: 100, t: 56, f: 2.583 },
        { n: 2, d: 100, t: 57, f: 2.704 },
        { n: 2, d: 100, t: 58, f: 2.834 },
        { n: 2, d: 100, t: 59, f: 2.974 },
        { n: 2, d: 100, t: 61, f: 3.287 },
        { n: 2, d: 100, t: 62, f: 3.463 },
        { n: 2, d: 100, t: 63, f: 3.652 },
        { n: 2, d: 100, t: 64, f: 3.858 },
        { n: 2, d: 100, t: 66, f: 4.325 },
        { n: 2, d: 100, t: 67, f: 4.591 },
        { n: 2, d: 100, t: 68, f: 4.883 },
        { n: 2, d: 100, t: 69, f: 5.203 },
        { n: 2, d: 100, t: 71, f: 5.945 },
        { n: 2, d: 100, t: 72, f: 6.378 },
        { n: 2, d: 100, t: 73, f: 6.859 },
        { n: 2, d: 100, t: 74, f: 7.396 },
        { n: 2, d: 100, t: 76, f: 8.681 },
        { n: 2, d: 100, t: 77, f: 9.452 },
        { n: 2, d: 100, t: 78, f: 10.33 },
        { n: 2, d: 100, t: 79, f: 11.34 },
        { n: 2, d: 100, t: 81, f: 13.85 },
        { n: 2, d: 100, t: 82, f: 15.43 },
        { n: 2, d: 100, t: 83, f: 17.3 },
        { n: 2, d: 100, t: 84, f: 19.53 },
        { n: 2, d: 100, t: 86, f: 25.51 },
        { n: 2, d: 100, t: 87, f: 29.59 },
        { n: 2, d: 100, t: 88, f: 34.72 },
        { n: 2, d: 100, t: 89, f: 41.32 },
        { n: 2, d: 100, t: 91, f: 61.73 },
        { n: 2, d: 100, t: 92, f: 78.13 },
        { n: 3, d: 6, t: 1, f: 0.8426 },
        { n: 3, d: 6, t: 2, f: 1.815 },
        { n: 3, d: 6, t: 3, f: 4 },
        { n: 3, d: 6, t: 4, f: 13.51 },
        { n: 3, d: 6, t: 5, f: 100 },
        { n: 3, d: 8, t: 1, f: 0.6602 },
        { n: 3, d: 8, t: 2, f: 1.312 },
        { n: 3, d: 8, t: 3, f: 2.048 },
        { n: 3, d: 8, t: 5, f: 9.488 },
        { n: 3, d: 8, t: 6, f: 32.05 },
        { n: 3, d: 12, t: 1, f: 0.4594 },
        { n: 3, d: 12, t: 5, f: 2.519 },
        { n: 3, d: 12, t: 7, f: 6.916 },
        { n: 3, d: 20, t: 1, f: 0.2852 },
        { n: 3, d: 20, t: 2, f: 0.542 },
        { n: 3, d: 20, t: 3, f: 0.7718 },
        { n: 3, d: 20, t: 4, f: 0.976 },
        { n: 3, d: 20, t: 6, f: 1.628 },
        { n: 3, d: 20, t: 7, f: 1.902 },
        { n: 3, d: 20, t: 8, f: 2.315 },
        { n: 3, d: 20, t: 9, f: 3.005 },
        { n: 3, d: 20, t: 11, f: 5.488 },
        { n: 3, d: 20, t: 12, f: 7.813 },
        { n: 3, d: 20, t: 13, f: 11.66 },
        { n: 3, d: 20, t: 14, f: 18.52 },
        { n: 3, d: 20, t: 16, f: 62.5 },
        { n: 3, d: 100, t: 1, f: 0.0594 },
        { n: 3, d: 100, t: 2, f: 0.1176 },
        { n: 3, d: 100, t: 3, f: 0.1747 },
        { n: 3, d: 100, t: 4, f: 0.2306 },
        { n: 3, d: 100, t: 6, f: 0.3388 },
        { n: 3, d: 100, t: 7, f: 0.3912 },
        { n: 3, d: 100, t: 8, f: 0.4426 },
        { n: 3, d: 100, t: 9, f: 0.4928 },
        { n: 3, d: 100, t: 11, f: 0.59 },
        { n: 3, d: 100, t: 12, f: 0.637 },
        { n: 3, d: 100, t: 13, f: 0.683 },
        { n: 3, d: 100, t: 14, f: 0.7278 },
        { n: 3, d: 100, t: 16, f: 0.8146 },
        { n: 3, d: 100, t: 17, f: 0.8564 },
        { n: 3, d: 100, t: 18, f: 0.8972 },
        { n: 3, d: 100, t: 19, f: 0.9372 },
        { n: 3, d: 100, t: 21, f: 1.028 },
        { n: 3, d: 100, t: 22, f: 1.102 },
        { n: 3, d: 100, t: 23, f: 1.174 },
        { n: 3, d: 100, t: 24, f: 1.244 },
        { n: 3, d: 100, t: 26, f: 1.379 },
        { n: 3, d: 100, t: 27, f: 1.444 },
        { n: 3, d: 100, t: 28, f: 1.507 },
        { n: 3, d: 100, t: 29, f: 1.568 },
        { n: 3, d: 100, t: 31, f: 1.686 },
        { n: 3, d: 100, t: 32, f: 1.742 },
        { n: 3, d: 100, t: 33, f: 1.797 },
        { n: 3, d: 100, t: 34, f: 1.85 },
        { n: 3, d: 100, t: 36, f: 1.952 },
        { n: 3, d: 100, t: 37, f: 2 },
        { n: 3, d: 100, t: 38, f: 2.098 },
        { n: 3, d: 100, t: 39, f: 2.203 },
        { n: 3, d: 100, t: 41, f: 2.434 },
        { n: 3, d: 100, t: 42, f: 2.563 },
        { n: 3, d: 100, t: 43, f: 2.7 },
        { n: 3, d: 100, t: 44, f: 2.847 },
        { n: 3, d: 100, t: 46, f: 3.175 },
        { n: 3, d: 100, t: 47, f: 3.358 },
        { n: 3, d: 100, t: 48, f: 3.556 },
        { n: 3, d: 100, t: 49, f: 3.768 },
        { n: 3, d: 100, t: 51, f: 4.252 },
        { n: 3, d: 100, t: 52, f: 4.521 },
        { n: 3, d: 100, t: 53, f: 4.817 },
        { n: 3, d: 100, t: 54, f: 5.139 },
        { n: 3, d: 100, t: 56, f: 5.869 },
        { n: 3, d: 100, t: 57, f: 6.289 },
        { n: 3, d: 100, t: 58, f: 6.748 },
        { n: 3, d: 100, t: 59, f: 7.257 },
        { n: 3, d: 100, t: 61, f: 8.432 },
        { n: 3, d: 100, t: 62, f: 9.107 },
        { n: 3, d: 100, t: 63, f: 9.862 },
        { n: 3, d: 100, t: 64, f: 10.71 },
        { n: 3, d: 100, t: 66, f: 12.72 },
        { n: 3, d: 100, t: 67, f: 13.93 },
        { n: 3, d: 100, t: 68, f: 15.24 },
        { n: 3, d: 100, t: 69, f: 16.78 },
        { n: 3, d: 100, t: 71, f: 20.49 },
        { n: 3, d: 100, t: 72, f: 22.73 },
        { n: 3, d: 100, t: 73, f: 25.38 },
        { n: 3, d: 100, t: 74, f: 28.41 },
        { n: 3, d: 100, t: 76, f: 36.23 },
        { n: 3, d: 100, t: 77, f: 40.98 },
        { n: 3, d: 100, t: 78, f: 47.17 },
        { n: 3, d: 100, t: 79, f: 53.76 },
        { n: 3, d: 100, t: 81, f: 72.46 },
        { n: 3, d: 100, t: 82, f: 86.21 },
        { n: 4, d: 6, t: 1, f: 1.071 },
        { n: 4, d: 6, t: 2, f: 2.532 },
        { n: 4, d: 6, t: 3, f: 8 },
        { n: 4, d: 6, t: 4, f: 40.65 },
        { n: 4, d: 6, t: 5, f: 100 },
        { n: 4, d: 8, t: 1, f: 0.8276 },
        { n: 4, d: 8, t: 2, f: 1.734 },
        { n: 4, d: 8, t: 3, f: 3.277 },
        { n: 4, d: 8, t: 5, f: 25.25 },
        { n: 4, d: 12, t: 1, f: 0.5878 },
        { n: 4, d: 12, t: 5, f: 4.318 },
        { n: 4, d: 12, t: 7, f: 16.61 },
        { n: 4, d: 20, t: 1, f: 0.371 },
        { n: 4, d: 20, t: 2, f: 0.6878 },
        { n: 4, d: 20, t: 3, f: 0.956 },
        { n: 4, d: 20, t: 4, f: 1.362 },
        { n: 4, d: 20, t: 6, f: 2.082 },
        { n: 4, d: 20, t: 7, f: 2.801 },
        { n: 4, d: 20, t: 8, f: 3.858 },
        { n: 4, d: 20, t: 9, f: 5.464 },
        { n: 4, d: 20, t: 11, f: 12.2 },
        { n: 4, d: 20, t: 12, f: 19.53 },
        { n: 4, d: 20, t: 13, f: 33.33 },
        { n: 4, d: 20, t: 14, f: 61.73 },
        { n: 4, d: 100, t: 1, f: 0.0788 },
        { n: 4, d: 100, t: 2, f: 0.1553 },
        { n: 4, d: 100, t: 3, f: 0.2294 },
        { n: 4, d: 100, t: 4, f: 0.3014 },
        { n: 4, d: 100, t: 6, f: 0.4386 },
        { n: 4, d: 100, t: 7, f: 0.5038 },
        { n: 4, d: 100, t: 8, f: 0.5672 },
        { n: 4, d: 100, t: 9, f: 0.6286 },
        { n: 4, d: 100, t: 11, f: 0.7452 },
        { n: 4, d: 100, t: 12, f: 0.8006 },
        { n: 4, d: 100, t: 13, f: 0.8542 },
        { n: 4, d: 100, t: 14, f: 0.906 },
        { n: 4, d: 100, t: 16, f: 1.008 },
        { n: 4, d: 100, t: 17, f: 1.102 },
        { n: 4, d: 100, t: 18, f: 1.192 },
        { n: 4, d: 100, t: 19, f: 1.278 },
        { n: 4, d: 100, t: 21, f: 1.442 },
        { n: 4, d: 100, t: 22, f: 1.519 },
        { n: 4, d: 100, t: 23, f: 1.594 },
        { n: 4, d: 100, t: 24, f: 1.666 },
        { n: 4, d: 100, t: 26, f: 1.8 },
        { n: 4, d: 100, t: 27, f: 1.864 },
        { n: 4, d: 100, t: 28, f: 1.925 },
        { n: 4, d: 100, t: 29, f: 1.984 },
        { n: 4, d: 100, t: 31, f: 2.206 },
        { n: 4, d: 100, t: 32, f: 2.339 },
        { n: 4, d: 100, t: 33, f: 2.481 },
        { n: 4, d: 100, t: 34, f: 2.636 },
        { n: 4, d: 100, t: 36, f: 2.98 },
        { n: 4, d: 100, t: 37, f: 3.175 },
        { n: 4, d: 100, t: 38, f: 3.383 },
        { n: 4, d: 100, t: 39, f: 3.61 },
        { n: 4, d: 100, t: 41, f: 4.125 },
        { n: 4, d: 100, t: 42, f: 4.417 },
        { n: 4, d: 100, t: 43, f: 4.735 },
        { n: 4, d: 100, t: 44, f: 5.086 },
        { n: 4, d: 100, t: 46, f: 5.882 },
        { n: 4, d: 100, t: 47, f: 6.337 },
        { n: 4, d: 100, t: 48, f: 6.84 },
        { n: 4, d: 100, t: 49, f: 7.386 },
        { n: 4, d: 100, t: 51, f: 8.681 },
        { n: 4, d: 100, t: 52, f: 9.416 },
        { n: 4, d: 100, t: 53, f: 10.25 },
        { n: 4, d: 100, t: 54, f: 11.16 },
        { n: 4, d: 100, t: 56, f: 13.33 },
        { n: 4, d: 100, t: 57, f: 14.62 },
        { n: 4, d: 100, t: 58, f: 16.08 },
        { n: 4, d: 100, t: 59, f: 17.67 },
        { n: 4, d: 100, t: 61, f: 21.65 },
        { n: 4, d: 100, t: 62, f: 23.92 },
        { n: 4, d: 100, t: 63, f: 26.74 },
        { n: 4, d: 100, t: 64, f: 29.76 },
        { n: 4, d: 100, t: 66, f: 37.31 },
        { n: 4, d: 100, t: 67, f: 42.02 },
        { n: 4, d: 100, t: 68, f: 47.62 },
        { n: 4, d: 100, t: 69, f: 54.35 },
        { n: 4, d: 100, t: 71, f: 70.42 },
        { n: 4, d: 100, t: 72, f: 81.97 },
        { n: 4, d: 100, t: 73, f: 94.34 },
        { n: 5, d: 6, t: 1, f: 1.392 },
        { n: 5, d: 6, t: 2, f: 3.797 },
        { n: 5, d: 6, t: 3, f: 16.03 },
        { n: 5, d: 6, t: 4, f: 100 },
        { n: 5, d: 8, t: 1, f: 0.9742 },
        { n: 5, d: 8, t: 2, f: 2.107 },
        { n: 5, d: 8, t: 3, f: 5.241 },
        { n: 5, d: 8, t: 5, f: 67.57 },
        { n: 5, d: 12, t: 1, f: 0.7056 },
        { n: 5, d: 12, t: 5, f: 7.407 },
        { n: 5, d: 12, t: 7, f: 39.68 },
        { n: 5, d: 20, t: 1, f: 0.4524 },
        { n: 5, d: 20, t: 2, f: 0.819 },
        { n: 5, d: 20, t: 3, f: 1.225 },
        { n: 5, d: 20, t: 4, f: 1.689 },
        { n: 5, d: 20, t: 6, f: 2.974 },
        { n: 5, d: 20, t: 7, f: 4.31 },
        { n: 5, d: 20, t: 8, f: 6.427 },
        { n: 5, d: 20, t: 9, f: 9.94 },
        { n: 5, d: 20, t: 11, f: 27.03 },
        { n: 5, d: 20, t: 12, f: 49.02 },
        { n: 5, d: 20, t: 13, f: 94.34 },
        { n: 5, d: 100, t: 1, f: 0.09802 },
        { n: 5, d: 100, t: 2, f: 0.1922 },
        { n: 5, d: 100, t: 3, f: 0.2826 },
        { n: 5, d: 100, t: 4, f: 0.3692 },
        { n: 5, d: 100, t: 6, f: 0.5322 },
        { n: 5, d: 100, t: 7, f: 0.6086 },
        { n: 5, d: 100, t: 8, f: 0.6818 },
        { n: 5, d: 100, t: 9, f: 0.752 },
        { n: 5, d: 100, t: 11, f: 0.8832 },
        { n: 5, d: 100, t: 12, f: 0.9446 },
        { n: 5, d: 100, t: 13, f: 1.006 },
        { n: 5, d: 100, t: 14, f: 1.118 },
        { n: 5, d: 100, t: 16, f: 1.327 },
        { n: 5, d: 100, t: 17, f: 1.424 },
        { n: 5, d: 100, t: 18, f: 1.517 },
        { n: 5, d: 100, t: 19, f: 1.605 },
        { n: 5, d: 100, t: 21, f: 1.769 },
        { n: 5, d: 100, t: 22, f: 1.845 },
        { n: 5, d: 100, t: 23, f: 1.917 },
        { n: 5, d: 100, t: 24, f: 1.986 },
        { n: 5, d: 100, t: 26, f: 2.253 },
        { n: 5, d: 100, t: 27, f: 2.412 },
        { n: 5, d: 100, t: 28, f: 2.584 },
        { n: 5, d: 100, t: 29, f: 2.772 },
        { n: 5, d: 100, t: 31, f: 3.197 },
        { n: 5, d: 100, t: 32, f: 3.439 },
        { n: 5, d: 100, t: 33, f: 3.704 },
        { n: 5, d: 100, t: 34, f: 3.994 },
        { n: 5, d: 100, t: 36, f: 4.655 },
        { n: 5, d: 100, t: 37, f: 5.04 },
        { n: 5, d: 100, t: 38, f: 5.459 },
        { n: 5, d: 100, t: 39, f: 5.917 },
        { n: 5, d: 100, t: 41, f: 6.993 },
        { n: 5, d: 100, t: 42, f: 7.622 },
        { n: 5, d: 100, t: 43, f: 8.306 },
        { n: 5, d: 100, t: 44, f: 9.074 },
        { n: 5, d: 100, t: 46, f: 10.89 },
        { n: 5, d: 100, t: 47, f: 11.96 },
        { n: 5, d: 100, t: 48, f: 13.16 },
        { n: 5, d: 100, t: 49, f: 14.49 },
        { n: 5, d: 100, t: 51, f: 17.73 },
        { n: 5, d: 100, t: 52, f: 19.61 },
        { n: 5, d: 100, t: 53, f: 21.83 },
        { n: 5, d: 100, t: 54, f: 24.27 },
        { n: 5, d: 100, t: 56, f: 30.3 },
        { n: 5, d: 100, t: 57, f: 34.01 },
        { n: 5, d: 100, t: 58, f: 38.17 },
        { n: 5, d: 100, t: 59, f: 43.1 },
        { n: 5, d: 100, t: 61, f: 55.56 },
        { n: 5, d: 100, t: 62, f: 63.29 },
        { n: 5, d: 100, t: 63, f: 72.46 },
        { n: 5, d: 100, t: 64, f: 83.33 },
        { n: 6, d: 6, t: 1, f: 1.66 },
        { n: 6, d: 6, t: 2, f: 5.695 },
        { n: 6, d: 6, t: 3, f: 32.05 },
        { n: 6, d: 6, t: 4, f: 100 },
        { n: 6, d: 8, t: 1, f: 1.205 },
        { n: 6, d: 8, t: 2, f: 2.809 },
        { n: 6, d: 8, t: 3, f: 8.389 },
        { n: 6, d: 12, t: 1, f: 0.8134 },
        { n: 6, d: 12, t: 5, f: 12.69 },
        { n: 6, d: 12, t: 7, f: 96.15 },
        { n: 6, d: 20, t: 1, f: 0.5298 },
        { n: 6, d: 20, t: 2, f: 0.9372 },
        { n: 6, d: 20, t: 3, f: 1.492 },
        { n: 6, d: 20, t: 4, f: 1.952 },
        { n: 6, d: 20, t: 6, f: 4.252 },
        { n: 6, d: 20, t: 7, f: 6.631 },
        { n: 6, d: 20, t: 8, f: 10.71 },
        { n: 6, d: 20, t: 9, f: 18.05 },
        { n: 6, d: 20, t: 11, f: 60.24 },
        { n: 6, d: 100, t: 1, f: 0.117 },
        { n: 6, d: 100, t: 2, f: 0.2284 },
        { n: 6, d: 100, t: 3, f: 0.334 },
        { n: 6, d: 100, t: 4, f: 0.4344 },
        { n: 6, d: 100, t: 6, f: 0.6202 },
        { n: 6, d: 100, t: 7, f: 0.706 },
        { n: 6, d: 100, t: 8, f: 0.7872 },
        { n: 6, d: 100, t: 9, f: 0.8642 },
        { n: 6, d: 100, t: 11, f: 1.012 },
        { n: 6, d: 100, t: 12, f: 1.142 },
        { n: 6, d: 100, t: 13, f: 1.266 },
        { n: 6, d: 100, t: 14, f: 1.382 },
        { n: 6, d: 100, t: 16, f: 1.595 },
        { n: 6, d: 100, t: 17, f: 1.692 },
        { n: 6, d: 100, t: 18, f: 1.784 },
        { n: 6, d: 100, t: 19, f: 1.87 },
        { n: 6, d: 100, t: 21, f: 2.057 },
        { n: 6, d: 100, t: 22, f: 2.22 },
        { n: 6, d: 100, t: 23, f: 2.399 },
        { n: 6, d: 100, t: 24, f: 2.595 },
        { n: 6, d: 100, t: 26, f: 3.045 },
        { n: 6, d: 100, t: 27, f: 3.305 },
        { n: 6, d: 100, t: 28, f: 3.589 },
        { n: 6, d: 100, t: 29, f: 3.903 },
        { n: 6, d: 100, t: 31, f: 4.634 },
        { n: 6, d: 100, t: 32, f: 5.056 },
        { n: 6, d: 100, t: 33, f: 5.525 },
        { n: 6, d: 100, t: 34, f: 6.046 },
        { n: 6, d: 100, t: 36, f: 7.278 },
        { n: 6, d: 100, t: 37, f: 8 },
        { n: 6, d: 100, t: 38, f: 8.803 },
        { n: 6, d: 100, t: 39, f: 9.709 },
        { n: 6, d: 100, t: 41, f: 11.85 },
        { n: 6, d: 100, t: 42, f: 13.12 },
        { n: 6, d: 100, t: 43, f: 14.58 },
        { n: 6, d: 100, t: 44, f: 16.23 },
        { n: 6, d: 100, t: 46, f: 20.16 },
        { n: 6, d: 100, t: 47, f: 22.52 },
        { n: 6, d: 100, t: 48, f: 25.25 },
        { n: 6, d: 100, t: 49, f: 28.41 },
        { n: 6, d: 100, t: 51, f: 36.23 },
        { n: 6, d: 100, t: 52, f: 40.98 },
        { n: 6, d: 100, t: 53, f: 46.3 },
        { n: 6, d: 100, t: 54, f: 52.63 },
        { n: 6, d: 100, t: 56, f: 68.49 },
        { n: 6, d: 100, t: 57, f: 79.37 },
        { n: 6, d: 100, t: 58, f: 90.91 },
    ];
}
