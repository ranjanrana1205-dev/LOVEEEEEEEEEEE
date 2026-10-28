const scene = document.querySelector("#scene");
const stage = document.querySelector(".stage");
const introStatus = document.querySelector("#intro-status");
const startButton = document.querySelector("#startBtn");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let navigationStarted = false;
let automaticNavigationTimer;

const openAnniversaryPage = () => {
    if (navigationStarted) {
        return;
    }

    navigationStarted = true;
    window.clearTimeout(automaticNavigationTimer);
    scene.classList.add("opening");
    window.setTimeout(() => {
        window.location.replace("index.html?introComplete=1");
    }, prefersReducedMotion ? 0 : 1200);
};

startButton.addEventListener("click", openAnniversaryPage);

if (prefersReducedMotion) {
    scene.classList.add("motion-disabled");
    stage.classList.add("is-hit");
    introStatus.textContent = "Bullseye! Our story is ready.";
    startButton.hidden = false;
    automaticNavigationTimer = window.setTimeout(openAnniversaryPage, 1400);
} else {
    window.setTimeout(() => {
        scene.classList.add("is-shooting");
        introStatus.textContent = "Letting love fly…";
    }, 500);

    window.setTimeout(() => {
        stage.classList.add("is-hit");
        introStatus.textContent = "Bullseye! Opening our story…";
        automaticNavigationTimer = window.setTimeout(openAnniversaryPage, 900);
    }, 2500);

    window.setTimeout(() => {
        startButton.hidden = false;
    }, 3100);
}
