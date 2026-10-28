const letterScene = document.querySelector("#letter-scene");
const openSpecialLetterButton = document.querySelector("#open-special-letter");
const letterSheet = document.querySelector("#letter-sheet");
const envelopePrompt = document.querySelector("#envelope-prompt");
const letterOpenStatus = document.querySelector("#letter-open-status");
const letterPageContent = document.querySelector(".letter-page-content");
const celebrateButton = document.querySelector("#celebrate-anniversary");
const celebrationScreen = document.querySelector("#celebration-screen");
const closeCelebrationButton = document.querySelector("#close-celebration");
const celebrationDayCount = document.querySelector("#celebration-day-count");
const finalSurpriseButton = document.querySelector("#open-final-surprise");
const finalSurpriseDialog = document.querySelector("#final-surprise");
const closeFinalSurpriseButton = document.querySelector("#close-final-surprise");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let celebrationAnimationFrame;

openSpecialLetterButton.addEventListener("click", () => {
    if (letterScene.classList.contains("is-open")) {
        return;
    }

    letterScene.classList.add("is-open");
    openSpecialLetterButton.setAttribute("aria-expanded", "true");
    openSpecialLetterButton.setAttribute("aria-label", "Your anniversary letter is open");
    letterSheet.setAttribute("aria-hidden", "false");
    envelopePrompt.textContent = "A little letter, with all my love";
    letterOpenStatus.textContent = "Your anniversary letter is open.";
    letterPageContent.classList.add("is-letter-open");
});

const closeCelebration = () => {
    celebrationScreen.hidden = true;
    document.body.classList.remove("celebration-active");
    letterPageContent.classList.add("is-celebrated");
    window.cancelAnimationFrame(celebrationAnimationFrame);
    celebrationDayCount.textContent = "365";
    finalSurpriseButton.focus();
};

celebrateButton.addEventListener("click", () => {
    celebrationScreen.hidden = false;
    document.body.classList.add("celebration-active");
    closeCelebrationButton.focus();

    if (prefersReducedMotion) {
        celebrationDayCount.textContent = "365";
        return;
    }

    celebrationDayCount.textContent = "0";
    const startTime = performance.now();
    const countDuration = 1800;

    const animateDayCount = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / countDuration, 1);
        celebrationDayCount.textContent = String(Math.round(progress * 365));

        if (progress < 1) {
            celebrationAnimationFrame = window.requestAnimationFrame(animateDayCount);
        }
    };

    celebrationAnimationFrame = window.requestAnimationFrame(animateDayCount);
});

closeCelebrationButton.addEventListener("click", closeCelebration);

const finalSurpriseLines = {
    first: document.querySelector("#final-surprise-line-one"),
    second: document.querySelector("#final-surprise-line-two"),
    title: document.querySelector("#final-surprise-title"),
    couple: document.querySelector("#final-surprise-message"),
    love: document.querySelector("#final-surprise-love"),
};
let finalSurpriseTimers = [];

const resetFinalSurprise = () => {
    finalSurpriseTimers.forEach((timer) => window.clearTimeout(timer));
    finalSurpriseTimers = [];
    finalSurpriseDialog.classList.remove("is-revealed");
    finalSurpriseLines.first.classList.remove("is-visible");
    finalSurpriseLines.second.classList.remove("is-visible");
    finalSurpriseLines.title.classList.remove("is-visible");
    finalSurpriseLines.couple.classList.remove("is-visible");
    finalSurpriseLines.love.classList.remove("is-visible");
};

const revealFinalSurprise = () => {
    finalSurpriseDialog.classList.add("is-revealed");

    if (prefersReducedMotion) {
        Object.values(finalSurpriseLines).forEach((line) => line.classList.add("is-visible"));
        return;
    }

    finalSurpriseTimers.push(window.setTimeout(() => {
        finalSurpriseLines.first.classList.add("is-visible");
    }, 150));

    finalSurpriseTimers.push(window.setTimeout(() => {
        finalSurpriseLines.second.classList.add("is-visible");
    }, 2150));

    finalSurpriseTimers.push(window.setTimeout(() => {
        finalSurpriseLines.title.classList.add("is-visible");
        finalSurpriseLines.couple.classList.add("is-visible");
        finalSurpriseLines.love.classList.add("is-visible");
    }, 3600));
};

finalSurpriseButton.addEventListener("click", () => {
    resetFinalSurprise();
    finalSurpriseDialog.showModal();
    revealFinalSurprise();
});

closeFinalSurpriseButton.addEventListener("click", () => {
    finalSurpriseDialog.close();
    finalSurpriseButton.focus();
    resetFinalSurprise();
});

finalSurpriseDialog.addEventListener("click", (event) => {
    if (event.target === finalSurpriseDialog) {
        finalSurpriseDialog.close();
        finalSurpriseButton.focus();
        resetFinalSurprise();
    }
});

finalSurpriseDialog.addEventListener("close", () => {
    resetFinalSurprise();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !celebrationScreen.hidden) {
        closeCelebration();
    }
});
