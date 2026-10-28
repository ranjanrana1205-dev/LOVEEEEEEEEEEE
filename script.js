const openingScreen = document.querySelector("#opening-screen");
const startJourneyButton = document.querySelector("#start-journey");
const welcomeHero = document.querySelector(".welcome-hero");
const typewriterText = document.querySelector("#typewriter-text");
const anniversaryDateInput = document.querySelector("#anniversary-date");
const countdownMessage = document.querySelector("#countdown-message");
const countdownDays = document.querySelector("#countdown-days");
const countdownHours = document.querySelector("#countdown-hours");
const countdownMinutes = document.querySelector("#countdown-minutes");
const countdownSeconds = document.querySelector("#countdown-seconds");
const openingMessage = "One Year, One Beautiful Story ❤️";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.body.classList.add("intro-active");

const timelineItems = document.querySelectorAll(".timeline-item");

if (timelineItems.length > 0 && !prefersReducedMotion && "IntersectionObserver" in window) {
    document.body.classList.add("has-motion");

    const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -35px 0px",
    });

    timelineItems.forEach((item) => timelineObserver.observe(item));
}

const yearCounter = document.querySelector(".year-counter");
const yearCounterValues = yearCounter.querySelectorAll("[data-count]");

const animateYearCounter = () => {
    yearCounterValues.forEach((value) => {
        const target = Number(value.dataset.count);
        const duration = 1800;
        const startTime = performance.now();

        value.textContent = "0";

        const updateValue = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = 1 - (1 - progress) ** 4;

            value.textContent = Math.floor(target * easedProgress).toLocaleString("en-US");

            if (progress < 1) {
                window.requestAnimationFrame(updateValue);
            }
        };

        window.requestAnimationFrame(updateValue);
    });
};

if (yearCounter && !prefersReducedMotion && "IntersectionObserver" in window) {
    const yearCounterObserver = new IntersectionObserver((entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
            animateYearCounter();
            observer.disconnect();
        }
    }, { threshold: 0.25 });

    yearCounterObserver.observe(yearCounter);
}

const reasonCards = document.querySelectorAll(".reason-card");
const reasonsSection = document.querySelector("#reasons");
const reasonsNavLink = document.querySelector(".reasons-nav-link");

reasonCards.forEach((card) => {
    const front = card.querySelector(".reason-front");
    const back = card.querySelector(".reason-back");

    card.addEventListener("click", () => {
        const isFlipped = card.classList.toggle("is-flipped");
        card.setAttribute("aria-pressed", String(isFlipped));
        front.setAttribute("aria-hidden", String(isFlipped));
        back.setAttribute("aria-hidden", String(!isFlipped));
        card.setAttribute(
            "aria-label",
            isFlipped
                ? `${card.querySelector(".reason-title").textContent}. Hide the reason.`
                : `${card.querySelector(".reason-title").textContent}. Reveal why I love it.`,
        );
    });
});

reasonsNavLink.addEventListener("click", () => {
    reasonsSection.classList.remove("is-heartburst");
    window.requestAnimationFrame(() => reasonsSection.classList.add("is-heartburst"));
});

if (prefersReducedMotion) {
    typewriterText.textContent = openingMessage;
} else {
    let typedCharacters = 0;
    const typeNextCharacter = () => {
        typewriterText.textContent = openingMessage.slice(0, typedCharacters);
        typedCharacters += 1;

        if (typedCharacters <= openingMessage.length) {
            window.setTimeout(typeNextCharacter, 75);
        }
    };

    window.setTimeout(typeNextCharacter, 550);
}

const padNumber = (value) => String(value).padStart(2, "0");

const setCountdownPlaceholders = () => {
    countdownDays.textContent = "--";
    countdownHours.textContent = "--";
    countdownMinutes.textContent = "--";
    countdownSeconds.textContent = "--";
};

const updateCountdown = () => {
    const selectedDate = anniversaryDateInput.value;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(selectedDate);

    if (!match) {
        setCountdownPlaceholders();
        countdownMessage.textContent = "Choose our special date to start the countdown.";
        return;
    }

    const [, year, month, day] = match;
    const chosenDate = new Date(Number(year), Number(month) - 1, Number(day));

    if (
        chosenDate.getFullYear() !== Number(year) ||
        chosenDate.getMonth() !== Number(month) - 1 ||
        chosenDate.getDate() !== Number(day)
    ) {
        setCountdownPlaceholders();
        countdownMessage.textContent = "Please choose a valid anniversary date.";
        return;
    }

    const now = new Date();
    let nextAnniversary = new Date(now.getFullYear(), chosenDate.getMonth(), chosenDate.getDate());

    if (nextAnniversary < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
        nextAnniversary = new Date(now.getFullYear() + 1, chosenDate.getMonth(), chosenDate.getDate());
    }

    if (nextAnniversary.getTime() <= now.getTime() && nextAnniversary.toDateString() === now.toDateString()) {
        setCountdownPlaceholders();
        countdownMessage.textContent = "It's our anniversary today! Happy first anniversary ❤️";
        return;
    }

    const millisecondsLeft = nextAnniversary.getTime() - now.getTime();
    const totalSeconds = Math.floor(millisecondsLeft / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdownDays.textContent = String(days);
    countdownHours.textContent = padNumber(hours);
    countdownMinutes.textContent = padNumber(minutes);
    countdownSeconds.textContent = padNumber(seconds);
    countdownMessage.textContent = `Counting down to ${nextAnniversary.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    })}.`;
};

anniversaryDateInput.addEventListener("input", updateCountdown);
anniversaryDateInput.addEventListener("change", updateCountdown);
window.setInterval(updateCountdown, 1000);

startJourneyButton.addEventListener("click", () => {
    welcomeHero.classList.add("is-revealed");
    openingScreen.classList.add("is-leaving");
    document.body.classList.remove("intro-active");
    window.setTimeout(() => {
        openingScreen.hidden = true;
    }, 700);
});
