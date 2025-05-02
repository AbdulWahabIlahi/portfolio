document.addEventListener("DOMContentLoaded", () => {
    const lenis = new Lenis()
    lenis.on("scroll", ScrollTrigger.update)
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Allow content to be properly visible below navbar
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);

    const highlightWords = [
        "Raspberry Pi", "Pi 4", "Kali Linux", "Debugging", "kernel panics",
        "AI/ML", "backend", "Python", "JavaScript", "RAG system",
        "video-to-product", "custom AI model", "API", "journal", "voice/text/image",
        "mood patterns", "chatbots", "LangChain", "AI Agents",
        "Express.js", "RAG", "Puppeteer", "MCP servers", "A2A protocols",
        "multimodal AI", "backends", "AI ethics", "Linux distro",
        "functional", "scrape", "train", "server", "protocol", "image recognition", "pattern recognition"
    ];


    const text = new SplitType(".sticky p", { types: "words" })
    const words = [...text.words]

    // Debug: Log all words to console
    console.log("All split words:", words.map(w => w.textContent));

    const { Engine, Runner, World, Bodies, Body, Events } = Matter;
    const engine = Engine.create({
        gravity: { x: 0, y: 0 },
    });
    const runner = Runner.create();
    Runner.run(engine, runner);

    const floor = Bodies.rectangle(
        window.innerHeight + 5,
        window.innerWidth / 2,
        window.innerWidth,
        20,
        { isStatic: true }
    )

    World.add(engine.world, floor)

    const shuffleWords = [...words]

    for (let i = shuffleWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffleWords[i], shuffleWords[j]] = [shuffleWords[j], shuffleWords[i]];
    }

    const wordsToHighlight = words.filter((word) =>
        highlightWords.some((highlight) =>
            word.textContent.toLowerCase().includes(highlight.toLowerCase())
        )
    )

    // Debug: Log matched words
    console.log("Found highlight words:", wordsToHighlight.map(w => w.textContent));
    console.log("Number of highlight words found:", wordsToHighlight.length);

    let physicsEnabled = false
    let lastProgress = 0
    const charElements = []
    const charBodies = []

    wordsToHighlight.forEach((word) => {
        const chars = word.textContent.split("")
        const wordRect = word.getBoundingClientRect()
        const stickyRect = document.querySelector(".sticky").getBoundingClientRect()

        word.style.opacity = 1

        chars.forEach((char, charIndex) => {
            const charSpan = document.createElement("span")
            charSpan.className = "char";
            charSpan.textContent = char;
            charSpan.style.position = "absolute"
            document.querySelector(".sticky").appendChild(charSpan)

            const charWidth = word.offsetWidth / chars.length
            const x = wordRect.left - stickyRect.left + charIndex * charWidth
            const y = wordRect.top - stickyRect.top

            charSpan.style.left = `${x}px`;
            charSpan.style.top = `${y}px`;
            charSpan.style.color = getComputedStyle(word).color
            charElements.push(charSpan)

            const body = Bodies.rectangle(
                x + charWidth / 2,
                y + charSpan.offsetHeight / 2,
                charWidth,
                charSpan.offsetHeight,
                {
                    restitution: 0.75,
                    friction: 0.5,
                    frictionAir: 0.0175,
                    isStatic: true,
                }
            )

            World.add(engine.world, body)
            charBodies.push({
                body,
                element: charSpan,
                initialX: x,
                initialY: y,
            })
        })
    })

    function resetAnimation() {
        engine.world.gravity.y = 0

        charBodies.forEach(({ body, element, initialX, initialY }) => {
            Body.setStatic(body, true)
            Body.setPosition(body, {
                x: initialX + element.offsetWidth / 2,
                y: initialY + element.offsetHeight / 2,
            })

            Body.setAngle(body, 0)
            Body.setVelocity(body, { x: 0, y: 0 })
            Body.setAngularVelocity(body, 0)

            element.style.opacity = 0
            element.style.transform = "none"
        })

        words.forEach((word) => {
            gsap.to(word, {
                opacity: 1,
                duration: 0.5,
                ease: "power2.in",
            })
        })
    }

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".sticky",
            start: "top top+=80px",
            end: `+=${window.innerHeight * 2}px`,
            pin: true,
            scrub: true,
            onUpdate: (self) => {
                const isScrollingDown = self.progress > lastProgress
                lastProgress = self.progress

                if (self.progress >= 0.6 && !physicsEnabled && isScrollingDown) {
                    physicsEnabled = true
                    engine.world.gravity.y = 1

                    wordsToHighlight.forEach((word) => {
                        word.style.opacity = 0
                    })

                    charBodies.forEach(({ body, element }) => {
                        element.style.opacity = 1
                        element.style.color = "#FFFFFF"
                        Body.setStatic(body, false)
                        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.25)
                        Body.setVelocity(body, {
                            x: (Math.random() - 0.5) * 5,
                            y: -Math.random() * 5,
                        })
                    })

                    gsap.to(
                        words.filter(
                            (word) =>
                                !highlightWords.some((hw) => word.textContent.includes(hw))
                        ),
                        {
                            opacity: 0,
                            duration: 0.5,
                            ease: "power2.out",
                        }
                    )
                } else if (self.progress <= 0.6 && physicsEnabled && !isScrollingDown) {
                    physicsEnabled = false
                    resetAnimation()
                }
            },
        },
    })

    const phase1 = gsap.timeline();
    shuffleWords.forEach((word) => {
        phase1.to(
            word,
            {
                color: "#EB4330",
                duration: 0.1,
                ease: "power2.inOut",
            },
            Math.random() * 0.9
        )
    })

    const phase2 = gsap.timeline()
    const shuffledHighlights = [...wordsToHighlight]
    for (let i = shuffledHighlights.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledHighlights[i], shuffledHighlights[j]] = [shuffledHighlights[j], shuffledHighlights[i]];
    }

    shuffledHighlights.forEach((word) => {
        phase2.to(
            word,
            {
                color: "#FFFFFF",
                duration: 0.1,
                ease: "power2.inOut",
            },
            Math.random() * 0.9
        )
    })

    tl.add(phase1, 0).add(phase2, 1).to({}, { duration: 2 })

    Events.on(engine, "afterUpdate", () => {
        charBodies.forEach(({ body, element, initialX, initialY }) => {
            if (physicsEnabled) {
                const deltaX = body.position.x - (initialX + element.offsetWidth / 2)
                const deltaY = body.position.y - (initialY + element.offsetHeight / 2)
                element.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${body.angle}rad)`;
            }
        })
    })
})