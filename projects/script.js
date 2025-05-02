document.addEventListener('DOMContentLoaded', () => {
    const totalSlides = 7;
    let currentSlideNum = 1;
    let isAnimating = false;
    let scrollAllowed = true;
    let lastScrollTime = 0;
    let currentSection = 1; // Always in slider section
    let inStickySection = true;

    const slideTitles = [
        "MindfulMe",
        "AI Chatbot",
    ];

    const slideDescriptions = [
        "AI-Powered Mood Tracking App",
        "Emotionally Intelligent AI Chat Companion"
    ];

    // Define image pairs for each slide - [background image, center image]
    const slideImagePairs = {
        1: ["img1", "8"],      // Background: img1.jpeg, Center: 8.jpeg
        2: ["img2", "9"],      // Background: img2.jpeg, Center: 9.jpeg
    };

    // Initialize scroll position
    window.scrollTo(0, 0);

    function createSlide(slideNumber, direction) {
        const slide = document.createElement('div');
        slide.className = 'slide';

        const slideBgImg = document.createElement('div');
        slideBgImg.className = 'slide-bg-img';

        const img = document.createElement('img');
        // Use the background image from the pair
        img.src = `./assets/${slideImagePairs[slideNumber][0]}.jpeg`;
        img.alt = ""

        slideBgImg.appendChild(img);
        slide.appendChild(slideBgImg);

        if (direction === 'down') {
            slideBgImg.style.clipPath = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
        } else {
            slideBgImg.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
        }
        return slide;
    }

    function createMainImageWrapper(slideNumber, direction) {
        const wrapper = document.createElement('div');
        wrapper.className = 'slide-main-img-wrapper';

        const img = document.createElement('img');
        // Use the center image from the pair
        img.src = `./assets/${slideImagePairs[slideNumber][1]}.jpeg`;
        img.alt = ""

        wrapper.appendChild(img);

        if (direction === 'down') {
            wrapper.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
        } else {
            wrapper.style.clipPath = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
        }

        return wrapper;
    }

    function createTextElements(slideNumber, direction) {
        const newTitle = document.createElement('h1');
        newTitle.textContent = slideTitles[slideNumber - 1];
        gsap.set(newTitle, {
            y: direction === 'down' ? 50 : -50,
        });

        const newDescription = document.createElement('p');
        newDescription.textContent = slideDescriptions[slideNumber - 1];
        gsap.set(newDescription, {
            y: direction === 'down' ? 20 : -20,
        });

        const newCounter = document.createElement('p');
        newCounter.textContent = slideNumber;
        gsap.set(newCounter, {
            y: direction === 'down' ? 18 : -18,
        });

        return { newTitle, newDescription, newCounter };
    }

    function animateSlide(direction) {
        if (isAnimating || !scrollAllowed) return;

        isAnimating = true;
        scrollAllowed = false;
        const slider = document.querySelector('.slider');
        const currentSlideElement = slider.querySelector('.slide');
        const mainImageContainer = document.querySelector('.slide-main-img');
        const currentMainWrapper = document.querySelector('.slide-main-img-wrapper');
        const titleContainer = document.querySelector('.slide-title');
        const descriptionContainer = document.querySelector('.slide-description');
        const counterContainer = document.querySelector('.count');

        const currentTitle = titleContainer.querySelector("h1");
        const currentDescription = descriptionContainer.querySelector("p");
        const currentCounter = counterContainer.querySelector("p");

        if (direction === 'down') {
            if (currentSlideNum === totalSlides) {
                // If we're at the last slide and going down, stay on last slide
                isAnimating = false;
                setTimeout(() => {
                    scrollAllowed = true;
                    lastScrollTime = Date.now();
                }, 100);
                return;
            }
            currentSlideNum++;
        } else {
            if (currentSlideNum === 1) {
                // If we're at the first slide and going up, stay on first slide
                isAnimating = false;
                setTimeout(() => {
                    scrollAllowed = true;
                    lastScrollTime = Date.now();
                }, 100);
                return;
            }
            currentSlideNum--;
        }

        const newSlide = createSlide(currentSlideNum, direction);
        const newMainWrapper = createMainImageWrapper(currentSlideNum, direction);
        const { newTitle, newDescription, newCounter } = createTextElements(currentSlideNum, direction);

        slider.appendChild(newSlide);
        mainImageContainer.appendChild(newMainWrapper);
        titleContainer.appendChild(newTitle);
        descriptionContainer.appendChild(newDescription);
        counterContainer.appendChild(newCounter);

        gsap.set(newMainWrapper.querySelector('img'), {
            y: direction === 'down' ? "-50%" : "50%",
        });

        const tl = gsap.timeline({
            onComplete: () => {
                [
                    currentSlideElement,
                    currentMainWrapper,
                    currentTitle,
                    currentDescription,
                    currentCounter,
                ].forEach((el) => el?.remove());

                isAnimating = false;
                setTimeout(() => {
                    scrollAllowed = true;
                    lastScrollTime = Date.now();
                }, 100);
            },
        });

        tl.to(
            newSlide.querySelector(".slide-bg-img"),
            {
                clipPath:
                    direction === "down" ? "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)" : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 1.25,
                ease: CustomEase.create("", ".87,0,.13,1"),
            },
            0
        )
        .to(
            currentSlideElement.querySelector("img"),
            {
                scale: 1.5,
                duration: 1.25,
                ease: CustomEase.create("", ".87,0,.13,1"),
            },
            0
        )
        .to(
            newMainWrapper,
            {
                clipPath:
                    direction === "down" ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" : "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
                duration: 1.25,
                ease: CustomEase.create("", ".87,0,.13,1"),
            },
            0
        )
        .to(
            currentMainWrapper.querySelector("img"),
            {
                duration: 1.25,
                ease: CustomEase.create("", ".87,0,.13,1"),
            },
            0
        )
        .to(
            newMainWrapper.querySelector('img'),
            {
                y: "0%",
                duration: 1.25,
                ease: CustomEase.create("", ".87,0,.13,1"),
            },
            0
        )
        .to(
            currentTitle,
            {
                y: direction === "down" ? "-50" : "50",
                duration: 1.25,
                ease: CustomEase.create("", ".87,0,.13,1"),
            },
            0
        )
        .to(
            newTitle,
            {
                y: "0",
                duration: 1.25,
                ease: CustomEase.create("", ".87,0,.13,1"),
            },
            0
        )
        .to(
            currentDescription,
            {
                y: direction === "down" ? "-20" : "20",
                duration: 1.25,
                ease: CustomEase.create("", ".87,0,.13,1"),
            },
            0
        )
        .to(
            newDescription,
            {
                y: "0",
                duration: 1.25,
                ease: CustomEase.create("", ".87,0,.13,1"),
            },
            0
        )
        .to(
            currentCounter,
            {
                y: direction === "down" ? "-18" : "18",
                duration: 1.25,
                ease: CustomEase.create("", ".87,0,.13,1"),
            },
            0
        )
        .to(
            newCounter,
            {
                y: "0",
                duration: 1.25,
                ease: CustomEase.create("", ".87,0,.13,1"),
            },
            0
        );
    }

    function handleScroll(direction) {
        const now = Date.now();
        if (isAnimating || !scrollAllowed) return;
        if (now - lastScrollTime < 1000) return;
        lastScrollTime = now;

        // Always in slider section
        animateSlide(direction);
    }

    // Regular scroll event
    window.addEventListener('scroll', () => {
        // Always in slider section
    });

    window.addEventListener("wheel", (e) => {
        e.preventDefault();
        const direction = e.deltaY > 0 ? "down" : "up";
        handleScroll(direction);
    }, {
        passive: false,
    });

    let touchStartY = 0;
    let isTouchActive = false;

    window.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
        isTouchActive = true;
    }, {
        passive: false,
    });

    window.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if(!isTouchActive || isAnimating || !scrollAllowed) return;
        const touchCurrentY = e.touches[0].clientY;
        const difference = touchStartY - touchCurrentY;
        if (Math.abs(difference) > 10){
            isTouchActive = false;
            const direction = difference > 0 ? "down" : "up";
            handleScroll(direction);
        }
    },{
        passive: false,
    });

    window.addEventListener("touchend", () => {
        isTouchActive = false;
    });

    // Initialize the scroll position
});



