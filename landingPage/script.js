// Libraries are loaded via CDN in the HTML file
import { projectsData } from "./projects.js";

// Major cities of India for the locations section
const indianCities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Ahmedabad",
    "Pune",
    "Jaipur",
    "Surat",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Bhopal"
];

// Expertise in AI and web development
const expertise = [
    "Agentic AI Development",
    "LLM Fine-tuning",
    "Prompt Engineering",
    "AI Agent Orchestration",
    "Full-Stack Development",
    "Frontend Architecture",
    "Responsive Design",
    "User Experience",
    "AI Integration",
    "Generative AI Solutions",
    "Retrieval Augmented Generation",
    "AI Tool Development"
];

// Technologies used
const technologies = [
    "React.js",
    "Node.js",
    "Python",
    "LangChain",
    "Vercel AI SDK",
    "OpenAI API",
    "Anthropic API",
    "MongoDB",
    "Vector Databases",
    "Next.js",
    "TailwindCSS",
    "TypeScript",
    "Docker",
    "GPT-4",
    "Claude 3"
];

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1")

// Detect device type and screen size
const isMobile = () => window.innerWidth <= 600;
const isTablet = () => window.innerWidth > 600 && window.innerWidth <= 900;
const isDesktop = () => window.innerWidth > 900;

// Update animations on resize
window.addEventListener('resize', () => {
    // Only update if we cross a breakpoint boundary
    const wasMobile = currentDevice === 'mobile';
    const wasTablet = currentDevice === 'tablet';
    const wasDesktop = currentDevice === 'desktop';
    
    updateCurrentDevice();
    
    const isMobileNow = currentDevice === 'mobile';
    const isTabletNow = currentDevice === 'tablet';
    const isDesktopNow = currentDevice === 'desktop';
    
    // If device type changed, we could adjust animations here if needed
    if ((wasMobile && !isMobileNow) || (wasTablet && !isTabletNow) || (wasDesktop && !isDesktopNow)) {
        // Could refresh animations if needed
    }
});

// Track current device type
let currentDevice = 'desktop';
function updateCurrentDevice() {
    if (isMobile()) {
        currentDevice = 'mobile';
    } else if (isTablet()) {
        currentDevice = 'tablet';
    } else {
        currentDevice = 'desktop';
    }
}

// Set initial device type
updateCurrentDevice();

document.addEventListener("DOMContentLoaded", () => {
    const projectContainer = document.querySelector(".projects");
    const locationsContainer = document.querySelector(".locations");
    const gridImages = gsap.utils.toArray(".img")
    const heroImage = document.querySelector(".img.hero-img");
    const images = gridImages.filter((img) => img !== heroImage)

    const introCopy = new SplitType(".intro-copy h3", {
        types: "words",
        absolute: false,
    })

    const titleHeading = new SplitType(".title h1", {
        types: "words",
        absolute: false,
    })

    const allImagesSources = Array.from(
        { length: 35 },
        (_, i) => `img/${i + 1}.jpeg`
    );
    const getRandomImageSet = () => {
        const shuffled = [...allImagesSources].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, 9)
    }

    function initializeDynamicContent() {
        // Add expertise items
        expertise.forEach((item) => {
            const projectItem = document.createElement("div")
            projectItem.className = "project-item"

            const itemName = document.createElement("p")
            itemName.textContent = item

            const itemType = document.createElement("p")
            itemType.textContent = "Expertise"

            projectItem.appendChild(itemName)
            projectItem.appendChild(itemType)

            projectContainer.appendChild(projectItem)
        });
        
        // Add technology items
        technologies.forEach((tech) => {
            const projectItem = document.createElement("div")
            projectItem.className = "project-item"

            const techName = document.createElement("p")
            techName.textContent = tech

            const techType = document.createElement("p")
            techType.textContent = "Technology"

            projectItem.appendChild(techName)
            projectItem.appendChild(techType)

            projectContainer.appendChild(projectItem)
        });
        // Use Indian cities for the locations section
        indianCities.forEach((city) => {
            const locationItem = document.createElement("div")
            locationItem.className = "location-item"

            const locationName = document.createElement("p")
            locationName.textContent = city

            locationItem.appendChild(locationName)
            locationsContainer.appendChild(locationItem)
        });
    }
    function startImageRotation() {
        const totalCycles = 20

        for (let cycle = 0; cycle < totalCycles; cycle++) {
            const randomImages = getRandomImageSet()

            gsap.to({}, {
                duration: 0,
                delay: cycle * 0.15,
                onComplete: () => {
                    gridImages.forEach((img, index) => {
                        const imgElement = img.querySelector("img")

                        if (cycle == totalCycles - 1 && img == heroImage) {
                            imgElement.src = "img/5.jpeg";
                            gsap.set(".hero-img img", { scale: 1
                             });
                        } else {
                            imgElement.src = randomImages[index];
                        }
                    })
                }
            })
        }
    }

    function setupInitialStates() {
        gsap.set("nav", {
            y: "-125%",
        })
        gsap.set(introCopy.words, {
            y: "110%",
        })
        gsap.set(titleHeading.words, {
            y: "110%",
        })
        gsap.set(".hero-img", {
            opacity: 1,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        })
        gsap.set(images, {
            opacity: 1,
        })
        gsap.set(".banner-img", { 
            scale: 0,
            opacity: 1 
        })
    }
    function init() {
        initializeDynamicContent()
        setupInitialStates()
        createAnimationTimelines()
    }

    init();

    function createAnimationTimelines() {
        // Adjust timings based on device type
        const getResponsiveValue = (desktopVal, tabletVal, mobileVal) => {
            if (isMobile()) return mobileVal;
            if (isTablet()) return tabletVal;
            return desktopVal;
        };
        
        // Adjust delay for smaller screens (faster animations on mobile)
        const imageTimelineDelay = getResponsiveValue(3.5, 3.0, 2.5);
        
        const overlayTimeline = gsap.timeline();
        const imagesTimeline = gsap.timeline({delay: imageTimelineDelay});
        const textTimeline = gsap.timeline();

        overlayTimeline.to(".logo-line-1", {
            backgroundPosition: "0% 0%",
            color: "#fff",
            duration: 1,
            ease: "none",
            delay: 0.5,
            onComplete: () => {
                gsap.to(".logo-line-2", {
                    backgroundPosition: "0% 0%",
                    color: "#fff",
                    duration: 1,
                    ease: "none",
                }
            )}
        })

        overlayTimeline.to(
            [".projects-header", ".project-item"],
            {
                opacity: 1,
                duration: 0.15,
                stagger: 0.075,
            },
            "<"
        );

        overlayTimeline.to(".project-item", {
            color: "#fff",
            duration: 0.15,
            stagger: 0.075,
        },
            "<"
        );
        
        overlayTimeline.to(
            [".locations-header", ".location-item"],
            {
                opacity: 1,
                duration: 0.15,
                stagger: 0.075,
                color: "#fff"
            },
            "<"
        );

        overlayTimeline.to([".projects-header", ".project-item"], {
            opacity: 0,
            duration: 0.15,
            stagger: 0.075,
        })
        
        overlayTimeline.to([".locations-header", ".location-item"], {
            opacity: 0,
            duration: 0.15,
            stagger: 0.075,
        },
            "<"
        );

        overlayTimeline.to(".overlay", {
            opacity: 0,
            duration: 0.5,
            delay: 1.5,
        })

        imagesTimeline.to(".img", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1.2,
            stagger: 0.05,
            ease: "hop",
            onStart: () => {
                setTimeout(() => {
                    startImageRotation();
                    gsap.to(".loader", { opacity: 0, duration: 0.3 });
                }, 1000);
            },
        });

        imagesTimeline.to({}, {duration: 0.5})

        imagesTimeline.to(images, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1,
            stagger: 0.05,
            ease: "hop",
        });

        imagesTimeline.to(".hero-img", {
            y: -50,
            duration: 1,
            ease: "hop",
        }, "+=0.2");

        imagesTimeline.to(".hero-img", {
            scale: getResponsiveValue(3, 2.5, 2),
            clipPath: isMobile() ? "polygon(10% 10%, 90% 10%, 90% 90%, 10% 90%)" : "polygon(20% 10%, 80% 10%, 80% 90%, 20% 90%)",
            duration: getResponsiveValue(1.5, 1.3, 1),
            ease: "hop",
            onStart: () => {
                // Only show banner images on tablet and desktop
                if (!isMobile()) {
                    gsap.to(".banner-img", { scale: 1, delay: 0.5, duration: 0.5 });
                }
                gsap.to("nav", { y: "0%", duration: 1, ease: "hop", delay: 0.25 });
            }
        }, "+=0.1");

        imagesTimeline.to(".banner-img-1", {
            left: "42%",
            rotate: -15,
            duration: 1.5,
            delay: 0.5,
            ease: "hop",
        },
            "<"
        );

        imagesTimeline.to(".banner-img-2", {
            left: "58%",
            rotate: 15,
            duration: 1.5,
            delay: 0.5,
            ease: "hop",
        },
            "<"
        );

        // Adjust text animation timing based on device
        const textAnimDelay = getResponsiveValue(9.5, 8.5, 7.5);
        
        textTimeline.to(titleHeading.words, {
            y: "0%",
            duration: getResponsiveValue(1, 0.8, 0.6),
            stagger: getResponsiveValue(0.1, 0.08, 0.05),
            delay: textAnimDelay,
            ease: "power3.out"
        })

        textTimeline.to(introCopy.words, {
            y: "0%",
            duration: 1,
            stagger: 0.1,
            delay: 0.25,
            ease: "power3.out"
        }, "<")
    }
})

