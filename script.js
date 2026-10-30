
// ==============================
// 1. INITIALISATION
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-link");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    // ==============================
    // 2. MENU MOBILE
    // ==============================

    function closeMenu() {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    }

    menuToggle.addEventListener("click", () => {
        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        navLinks.classList.toggle("open", !isOpen);

        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Ouvrir le menu" : "Fermer le menu"
        );
    });

    navItems.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });


    // ==============================
    // 3. TEXTE ANIMÉ
    // ==============================

    const typedText = document.getElementById("typed-text");

    const words = [
        "l'innovation.",
        "l'analyse.",
        "l'amélioration continue.",
        "les technologies."
    ];

    if (reduceMotion) {
        typedText.textContent = words[0];
    } else {
        let wordIndex = 0;
        let charIndex = words[0].length;
        let deleting = true;

        function typeEffect() {
            const currentWord = words[wordIndex];

            charIndex += deleting ? -1 : 1;
            typedText.textContent = currentWord.slice(0, charIndex);

            let delay = deleting ? 45 : 85;

            if (!deleting && charIndex === currentWord.length) {
                deleting = true;
                delay = 1400;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 350;
            }

            window.setTimeout(typeEffect, delay);
        }

        window.setTimeout(typeEffect, 1200);
    }


    // ==============================
    // 4. APPARITION AU SCROLL
    // ==============================

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && !reduceMotion) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }


    // ==============================
    // 5. BARRE DE PROGRESSION
    // ==============================

    const progressBar = document.querySelector(".scroll-progress");
    let ticking = false;

    function updateProgress() {
        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        progressBar.style.width = `${Math.min(progress, 100)}%`;
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }, { passive: true });

    updateProgress();


    // ==============================
    // 6. SECTION ACTIVE
    // ==============================

    const sections = document.querySelectorAll("main section[id]");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        navItems.forEach((link) => {
                            const isActive =
                                link.getAttribute("href") ===
                                `#${entry.target.id}`;

                            link.classList.toggle("active", isActive);

                            if (isActive) {
                                link.setAttribute("aria-current", "location");
                            } else {
                                link.removeAttribute("aria-current");
                            }
                        });
                    }
                });
            },
            {
                rootMargin: "-30% 0px -60% 0px"
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }


    // ==============================
    // 7. COPIER LE LIEN LINKEDIN
    // ==============================

    const copyButton = document.getElementById("copy-link");
    const copyStatus = document.getElementById("copy-status");

    const linkedinURL =
        "https://www.linkedin.com/in/safae-el-medyouny-556522250/";

    copyButton.addEventListener("click", async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(linkedinURL);
            } else {
                const temporaryInput = document.createElement("textarea");

                temporaryInput.value = linkedinURL;
                temporaryInput.setAttribute("readonly", "");
                temporaryInput.style.position = "fixed";
                temporaryInput.style.opacity = "0";

                document.body.appendChild(temporaryInput);
                temporaryInput.select();

                const copied = document.execCommand("copy");
                temporaryInput.remove();

                if (!copied) {
                    throw new Error("Copie indisponible");
                }
            }

            copyStatus.textContent = "Lien LinkedIn copié avec succès !";
        } catch (error) {
            copyStatus.textContent =
                "Copie impossible. Utilise le lien LinkedIn ci-dessus.";
        }
    });


    // ==============================
    // 8. ANNÉE AUTOMATIQUE
    // ==============================

    document.getElementById("year").textContent =
        new Date().getFullYear();

});