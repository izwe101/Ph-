//from Wana:    67.

let totalMs = 0;
let timer = null;
let running = false;

function updateDisplay() {
    const hrs  = String(Math.floor(totalMs / 3600000)).padStart(2, "0");
    const mins = String(Math.floor((totalMs % 3600000) / 60000)).padStart(2, "0");
    const secs = String(Math.floor((totalMs % 60000) / 1000)).padStart(2, "0");
    const ms   = String(Math.floor((totalMs % 1000) / 10)).padStart(2, "0");

    document.getElementById("display").textContent = `${hrs}:${mins}:${secs}:${ms}`;
}

function createPicker(id, max) {
    const picker = document.getElementById(id);

    for (let i = 0; i <= max; i++) {
        const item = document.createElement("div");
        item.textContent = String(i).padStart(2, "0");

        item.addEventListener("click", () => {
            picker.scrollTo({
                top: item.offsetTop - picker.clientHeight / 2 + item.clientHeight / 2,
                behavior: "smooth"
            });
        });

        picker.appendChild(item);
    }

    picker.addEventListener("scroll", () => highlightCenter(picker));
}

function highlightCenter(picker) {
    const items = picker.querySelectorAll("div");
    let center = picker.scrollTop + picker.clientHeight / 2;

    items.forEach(item => item.classList.remove("selected"));

    items.forEach(item => {
        const itemCenter = item.offsetTop + item.clientHeight / 2;
        if (Math.abs(itemCenter - center) < 25) {
            item.classList.add("selected");
        }
    });
}

function getSelectedTime() {
    const hr  = document.querySelector("#hr-picker .selected")?.textContent || "00";
    const min = document.querySelector("#min-picker .selected")?.textContent || "00";
    const sec = document.querySelector("#sec-picker .selected")?.textContent || "00";
    return { hr, min, sec };
}

function startFromPicker() {
    const { hr, min, sec } = getSelectedTime();

    totalMs =
        (parseInt(hr) * 3600 +
         parseInt(min) * 60 +
         parseInt(sec)) * 1000;

    updateDisplay();
    startTimer();
}

function startTimer() {
    if (running || totalMs <= 0) return;
    running = true;

    timer = setInterval(() => {
        if (totalMs > 0) {
            totalMs -= 10;
            updateDisplay();
        } else {
            clearInterval(timer);
            running = false;

            document.getElementById("alarm-sound").play();
            document.getElementById("alarm-wrapper").classList.add("active");
        }
    }, 10);
}

function pauseTimer() {
    clearInterval(timer);
    running = false;
}

function resetTimer() {
    clearInterval(timer);
    running = false;
    totalMs = 0;
    updateDisplay();

    document.getElementById("alarm-wrapper").classList.remove("active");

    const alarm = document.getElementById("alarm-sound");
    alarm.pause();
    alarm.currentTime = 0;
}

createPicker("hr-picker", 23);
createPicker("min-picker", 59);
createPicker("sec-picker", 59);
