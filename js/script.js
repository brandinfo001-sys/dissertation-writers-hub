/* ================================================================
   DISSERTATION WRITERS HUB
   Main JavaScript

   FILE: js/script.js
   JS PART 1
   Mobile Navigation + Header Scroll Behaviour
================================================================ */

"use strict";


/* ================================================================
   1. EARLY JAVASCRIPT STATE CLASS
================================================================ */

/*
   The CSS reveal system uses .js-enabled to distinguish between
   normal no-JavaScript rendering and enhanced JavaScript states.
*/

document.documentElement.classList.add("js-enabled");



/* ================================================================
   2. DOM READY INITIALISATION
================================================================ */

document.addEventListener("DOMContentLoaded", () => {

    initHeaderScroll();
    initMobileNavigation();

});



/* ================================================================
   3. HEADER SCROLL BEHAVIOUR
================================================================ */

function initHeaderScroll() {

    const siteHeader = document.getElementById("site-header");

    if (!siteHeader) {
        return;
    }


    const SCROLL_THRESHOLD = 18;

    let ticking = false;


    const updateHeaderState = () => {

        const currentScrollPosition =
            window.scrollY ||
            document.documentElement.scrollTop ||
            0;


        if (currentScrollPosition > SCROLL_THRESHOLD) {

            siteHeader.classList.add("is-scrolled");

        } else {

            siteHeader.classList.remove("is-scrolled");

        }


        ticking = false;
    };


    const handleScroll = () => {

        if (!ticking) {

            window.requestAnimationFrame(updateHeaderState);

            ticking = true;
        }

    };


    /*
       Set the correct state immediately in case the page loads
       while already scrolled.
    */

    updateHeaderState();


    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive: true
        }
    );

}



/* ================================================================
   4. MOBILE NAVIGATION
================================================================ */

function initMobileNavigation() {

    const siteHeader =
        document.getElementById("site-header");

    const menuToggle =
        document.querySelector(".mobile-menu-toggle");

    const mobileNavigation =
        document.getElementById("mobile-navigation");


    if (
        !siteHeader ||
        !menuToggle ||
        !mobileNavigation
    ) {
        return;
    }


    const mobileNavLinks =
        mobileNavigation.querySelectorAll(
            ".mobile-nav-link"
        );


    const mobileWhatsAppButton =
        mobileNavigation.querySelector(
            ".mobile-whatsapp-btn"
        );


    const MOBILE_BREAKPOINT = 1023;


    let isMenuOpen = false;

    let closeTimer = null;


    /* ------------------------------------------------------------
       OPEN MOBILE MENU
    ------------------------------------------------------------ */

    const openMobileMenu = () => {

        if (isMenuOpen) {
            return;
        }


        if (closeTimer) {

            window.clearTimeout(closeTimer);

            closeTimer = null;
        }


        isMenuOpen = true;


        /*
           Remove the HTML hidden attribute first so the CSS
           transition can run.
        */

        mobileNavigation.hidden = false;


        /*
           Force a browser layout frame before adding the open class.
           This ensures the CSS transition consistently animates.
        */

        window.requestAnimationFrame(() => {

            mobileNavigation.classList.add("is-open");

            menuToggle.classList.add("is-active");

            siteHeader.classList.add("menu-open");

        });


        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );


        menuToggle.setAttribute(
            "aria-label",
            "Close navigation menu"
        );


        document.body.classList.add(
            "no-scroll"
        );

    };



    /* ------------------------------------------------------------
       CLOSE MOBILE MENU
    ------------------------------------------------------------ */

    const closeMobileMenu = ({
        restoreFocus = false,
        immediate = false
    } = {}) => {

        if (!isMenuOpen && mobileNavigation.hidden) {
            return;
        }


        isMenuOpen = false;


        mobileNavigation.classList.remove(
            "is-open"
        );


        menuToggle.classList.remove(
            "is-active"
        );


        siteHeader.classList.remove(
            "menu-open"
        );


        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );


        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );


        document.body.classList.remove(
            "no-scroll"
        );


        if (closeTimer) {

            window.clearTimeout(closeTimer);

            closeTimer = null;
        }


        /*
           When closing normally, allow the CSS animation to finish
           before restoring the hidden attribute.

           When closing during a resize, hide immediately.
        */

        if (immediate) {

            mobileNavigation.hidden = true;

        } else {

            closeTimer = window.setTimeout(() => {

                if (!isMenuOpen) {

                    mobileNavigation.hidden = true;

                }

                closeTimer = null;

            }, 280);

        }


        if (restoreFocus) {

            menuToggle.focus({
                preventScroll: true
            });

        }

    };



    /* ------------------------------------------------------------
       TOGGLE MOBILE MENU
    ------------------------------------------------------------ */

    const toggleMobileMenu = () => {

        if (isMenuOpen) {

            closeMobileMenu({
                restoreFocus: false
            });

        } else {

            openMobileMenu();

        }

    };


    menuToggle.addEventListener(
        "click",
        toggleMobileMenu
    );



    /* ============================================================
       5. CLOSE MENU AFTER NAVIGATION LINK CLICK
    ============================================================ */

    mobileNavLinks.forEach((link) => {

        link.addEventListener("click", () => {

            closeMobileMenu({
                restoreFocus: false
            });

        });

    });


    if (mobileWhatsAppButton) {

        mobileWhatsAppButton.addEventListener(
            "click",
            () => {

                closeMobileMenu({
                    restoreFocus: false
                });

            }
        );

    }



    /* ============================================================
       6. ESCAPE KEY SUPPORT
    ============================================================ */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                isMenuOpen
            ) {

                closeMobileMenu({
                    restoreFocus: true
                });

            }

        }
    );



    /* ============================================================
       7. CLICK OUTSIDE TO CLOSE
    ============================================================ */

    document.addEventListener(
        "click",
        (event) => {

            if (!isMenuOpen) {
                return;
            }


            const clickedInsideHeader =
                siteHeader.contains(
                    event.target
                );


            if (!clickedInsideHeader) {

                closeMobileMenu({
                    restoreFocus: false
                });

            }

        }
    );



    /* ============================================================
       8. DESKTOP RESIZE RESET
    ============================================================ */

    let resizeTimer = null;


    const handleResize = () => {

        if (resizeTimer) {

            window.clearTimeout(
                resizeTimer
            );

        }


        resizeTimer =
            window.setTimeout(() => {

                if (
                    window.innerWidth >
                    MOBILE_BREAKPOINT
                ) {

                    closeMobileMenu({
                        restoreFocus: false,
                        immediate: true
                    });

                }


                resizeTimer = null;

            }, 120);

    };


    window.addEventListener(
        "resize",
        handleResize,
        {
            passive: true
        }
    );



    /* ============================================================
       9. KEYBOARD FOCUS CONTAINMENT
    ============================================================ */

    mobileNavigation.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !== "Tab" ||
                !isMenuOpen
            ) {
                return;
            }


            const focusableElements =
                mobileNavigation.querySelectorAll(
                    `
                    a[href],
                    button:not([disabled]),
                    [tabindex]:not([tabindex="-1"])
                    `
                );


            if (!focusableElements.length) {
                return;
            }


            const firstFocusable =
                focusableElements[0];


            const lastFocusable =
                focusableElements[
                    focusableElements.length - 1
                ];


            if (
                event.shiftKey &&
                document.activeElement ===
                firstFocusable
            ) {

                event.preventDefault();

                menuToggle.focus();

                return;
            }


            if (
                !event.shiftKey &&
                document.activeElement ===
                lastFocusable
            ) {

                /*
                   Return focus to the menu button instead of letting
                   keyboard focus move somewhere behind the menu.
                */

                event.preventDefault();

                menuToggle.focus();

            }

        }
    );



    /* ============================================================
       10. MENU BUTTON KEYBOARD BRIDGE
    ============================================================ */

    menuToggle.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Tab" &&
                !event.shiftKey &&
                isMenuOpen
            ) {

                const firstFocusable =
                    mobileNavigation.querySelector(
                        `
                        a[href],
                        button:not([disabled]),
                        [tabindex]:not([tabindex="-1"])
                        `
                    );


                if (firstFocusable) {

                    event.preventDefault();

                    firstFocusable.focus();

                }

            }

        }
    );

}



/* ================================================================
   JS PART 2 CONTINUES BELOW

   Scroll Reveal / Intersection Animations
================================================================ */
/* ================================================================
   11. SCROLL REVEAL / INTERSECTION ANIMATIONS
================================================================ */

document.addEventListener("DOMContentLoaded", () => {

    initScrollReveal();

});



/* ================================================================
   12. INITIALISE SCROLL REVEAL
================================================================ */

function initScrollReveal() {

    const revealItems =
        document.querySelectorAll(
            ".reveal-item"
        );


    if (!revealItems.length) {
        return;
    }


    /*
       Respect the visitor's operating-system preference.
       If reduced motion is requested, reveal everything immediately.
    */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (prefersReducedMotion.matches) {

        revealAllItems(
            revealItems
        );

        return;
    }



    /*
       IntersectionObserver has broad modern-browser support.

       If unavailable for any reason, content must remain visible
       rather than becoming inaccessible.
    */

    if (!("IntersectionObserver" in window)) {

        revealAllItems(
            revealItems
        );

        return;
    }



    /* ============================================================
       13. HERO / ABOVE-THE-FOLD REVEALS
    ============================================================ */

    const heroRevealItems =
        document.querySelectorAll(
            ".hero-section .reveal-item"
        );


    /*
       Hero elements should appear promptly on initial page load
       rather than waiting for a scroll intersection event.
    */

    if (heroRevealItems.length) {

        revealHeroItems(
            heroRevealItems
        );

    }



    /* ============================================================
       14. STANDARD SCROLL REVEAL ITEMS
    ============================================================ */

    const standardRevealItems =
        Array.from(revealItems).filter(
            (item) =>
                !item.closest(".hero-section")
        );


    if (!standardRevealItems.length) {
        return;
    }



    const observerOptions = {

        root: null,

        /*
           Reveal shortly before an item reaches the middle
           of the viewport for a smoother premium feel.
        */

        rootMargin:
            "0px 0px -10% 0px",

        threshold: 0.12

    };



    const revealObserver =
        new IntersectionObserver(
            handleRevealEntries,
            observerOptions
        );



    standardRevealItems.forEach(
        (item, index) => {

            /*
               Give nearby sibling items a subtle stagger.

               The value is stored as a CSS custom property so the
               animation remains style-driven rather than creating
               separate JavaScript animations.
            */

            const delay =
                calculateRevealDelay(
                    item,
                    index
                );


            item.style.setProperty(
                "--reveal-delay",
                `${delay}ms`
            );


            revealObserver.observe(
                item
            );

        }
    );



    /* ============================================================
       15. INTERSECTION CALLBACK
    ============================================================ */

    function handleRevealEntries(
        entries,
        observer
    ) {

        entries.forEach(
            (entry) => {

                if (!entry.isIntersecting) {
                    return;
                }


                revealElement(
                    entry.target
                );


                /*
                   Reveal only once.

                   This avoids sections repeatedly animating whenever
                   users scroll up and down the page.
                */

                observer.unobserve(
                    entry.target
                );

            }
        );

    }



    /* ============================================================
       16. RESPOND TO MOTION-PREFERENCE CHANGES
    ============================================================ */

    const handleMotionPreferenceChange =
        (event) => {

            if (!event.matches) {
                return;
            }


            revealObserver.disconnect();


            revealAllItems(
                revealItems
            );

        };


    /*
       Modern API
    */

    if (
        typeof prefersReducedMotion.addEventListener ===
        "function"
    ) {

        prefersReducedMotion.addEventListener(
            "change",
            handleMotionPreferenceChange
        );

    /*
       Older Safari fallback
    */

    } else if (
        typeof prefersReducedMotion.addListener ===
        "function"
    ) {

        prefersReducedMotion.addListener(
            handleMotionPreferenceChange
        );

    }

}



/* ================================================================
   17. REVEAL INDIVIDUAL ELEMENT
================================================================ */

function revealElement(element) {

    if (!element) {
        return;
    }


    /*
       Delay is assigned through --reveal-delay.

       CSS still controls the actual animation.
    */

    const revealDelay =
        element.style.getPropertyValue(
            "--reveal-delay"
        );


    if (revealDelay) {

        element.style.transitionDelay =
            revealDelay;

    }


    element.classList.add(
        "is-visible"
    );



    /*
       Clean inline transition-delay after the reveal finishes so
       hover or other future transitions are never delayed.
    */

    const clearDelay = () => {

        element.style.transitionDelay =
            "";

        element.removeEventListener(
            "transitionend",
            clearDelay
        );

    };


    element.addEventListener(
        "transitionend",
        clearDelay
    );


    /*
       Safety fallback in case transitionend is not fired.
    */

    window.setTimeout(
        clearDelay,
        1200
    );

}



/* ================================================================
   18. HERO REVEAL SEQUENCE
================================================================ */

function revealHeroItems(
    heroRevealItems
) {

    const heroItems =
        Array.from(
            heroRevealItems
        );


    heroItems.forEach(
        (item, index) => {

            /*
               Small stagger only.
               The goal is a refined entrance rather than a dramatic
               animation sequence.
            */

            const delay =
                Math.min(
                    index * 80,
                    320
                );


            window.setTimeout(
                () => {

                    revealElement(
                        item
                    );

                },
                delay
            );

        }
    );

}



/* ================================================================
   19. CALCULATE REVEAL DELAY
================================================================ */

function calculateRevealDelay(
    element,
    index
) {

    /*
       Cards in common grids receive a small repeating stagger.
       Long pages should never accumulate increasingly large delays.
    */

    const gridSelectors = [

        ".trust-grid",
        ".services-grid",
        ".why-choose-grid",
        ".academic-areas-grid",
        ".process-steps"

    ];


    const parentGrid =
        gridSelectors.find(
            (selector) =>
                element.parentElement &&
                element.parentElement.matches(
                    selector
                )
        );


    if (parentGrid) {

        const siblings =
            Array.from(
                element.parentElement.children
            );


        const itemIndex =
            siblings.indexOf(
                element
            );


        return (
            itemIndex % 4
        ) * 70;

    }



    /*
       Non-grid elements receive either no delay or a very small
       alternating delay.
    */

    return (
        index % 2
    ) * 45;

}



/* ================================================================
   20. REVEAL ALL ITEMS
================================================================ */

function revealAllItems(items) {

    Array.from(items).forEach(
        (item) => {

            item.classList.add(
                "is-visible"
            );


            item.style.transitionDelay =
                "";


            item.style.removeProperty(
                "--reveal-delay"
            );

        }
    );

}



/* ================================================================
   JS PART 3 CONTINUES BELOW

   FAQ Accordion + Interactive Elements
================================================================ */
/* ================================================================
   21. FAQ ACCORDION
================================================================ */

document.addEventListener("DOMContentLoaded", () => {

    initFaqAccordion();

});



/* ================================================================
   22. INITIALISE FAQ ACCORDION
================================================================ */

function initFaqAccordion() {

    const accordionContainers =
        document.querySelectorAll(
            "[data-accordion]"
        );


    if (!accordionContainers.length) {
        return;
    }


    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    accordionContainers.forEach(
        (accordion) => {

            initSingleAccordion(
                accordion,
                prefersReducedMotion
            );

        }
    );

}



/* ================================================================
   23. INITIALISE INDIVIDUAL ACCORDION
================================================================ */

function initSingleAccordion(
    accordion,
    prefersReducedMotion
) {

    const faqItems =
        accordion.querySelectorAll(
            ".faq-item"
        );


    if (!faqItems.length) {
        return;
    }



    faqItems.forEach(
        (item) => {

            const questionButton =
                item.querySelector(
                    ".faq-question"
                );


            const answer =
                item.querySelector(
                    ".faq-answer"
                );


            if (
                !questionButton ||
                !answer
            ) {
                return;
            }



            /* ----------------------------------------------------
               Ensure a consistent initial state
            ---------------------------------------------------- */

            const isInitiallyOpen =
                questionButton.getAttribute(
                    "aria-expanded"
                ) === "true";


            if (isInitiallyOpen) {

                item.classList.add(
                    "is-open"
                );

                answer.hidden = false;

            } else {

                item.classList.remove(
                    "is-open"
                );

                answer.hidden = true;

            }



            /* ----------------------------------------------------
               Click interaction
            ---------------------------------------------------- */

            questionButton.addEventListener(
                "click",
                () => {

                    toggleFaqItem(
                        item,
                        questionButton,
                        answer,
                        faqItems,
                        prefersReducedMotion
                    );

                }
            );

        }
    );

}



/* ================================================================
   24. TOGGLE FAQ ITEM
================================================================ */

function toggleFaqItem(
    item,
    questionButton,
    answer,
    faqItems,
    prefersReducedMotion
) {

    const isCurrentlyOpen =
        questionButton.getAttribute(
            "aria-expanded"
        ) === "true";


    /*
       This homepage accordion uses one-open-at-a-time behaviour
       for a cleaner experience.
    */

    if (!isCurrentlyOpen) {

        faqItems.forEach(
            (otherItem) => {

                if (otherItem === item) {
                    return;
                }


                const otherButton =
                    otherItem.querySelector(
                        ".faq-question"
                    );


                const otherAnswer =
                    otherItem.querySelector(
                        ".faq-answer"
                    );


                if (
                    !otherButton ||
                    !otherAnswer
                ) {
                    return;
                }


                if (
                    otherButton.getAttribute(
                        "aria-expanded"
                    ) === "true"
                ) {

                    closeFaqItem(
                        otherItem,
                        otherButton,
                        otherAnswer,
                        prefersReducedMotion
                    );

                }

            }
        );

    }



    if (isCurrentlyOpen) {

        closeFaqItem(
            item,
            questionButton,
            answer,
            prefersReducedMotion
        );

    } else {

        openFaqItem(
            item,
            questionButton,
            answer,
            prefersReducedMotion
        );

    }

}



/* ================================================================
   25. OPEN FAQ ITEM
================================================================ */

function openFaqItem(
    item,
    questionButton,
    answer,
    prefersReducedMotion
) {

    questionButton.setAttribute(
        "aria-expanded",
        "true"
    );


    item.classList.add(
        "is-open"
    );


    /*
       Reduced motion: update instantly.
    */

    if (prefersReducedMotion.matches) {

        answer.hidden = false;

        answer.style.height = "";
        answer.style.opacity = "";

        return;
    }



    /*
       Make the answer measurable before animating.
    */

    answer.hidden = false;

    answer.style.height = "0px";
    answer.style.opacity = "0";
    answer.style.overflow = "hidden";



    window.requestAnimationFrame(
        () => {

            const targetHeight =
                answer.scrollHeight;


            answer.style.transition =
                "height 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease";


            answer.style.height =
                `${targetHeight}px`;


            answer.style.opacity =
                "1";

        }
    );



    const handleOpenComplete =
        (event) => {

            if (
                event.propertyName !==
                "height"
            ) {
                return;
            }


            answer.style.height =
                "auto";


            answer.style.overflow =
                "";


            answer.style.transition =
                "";


            answer.removeEventListener(
                "transitionend",
                handleOpenComplete
            );

        };


    answer.addEventListener(
        "transitionend",
        handleOpenComplete
    );

}



/* ================================================================
   26. CLOSE FAQ ITEM
================================================================ */

function closeFaqItem(
    item,
    questionButton,
    answer,
    prefersReducedMotion
) {

    questionButton.setAttribute(
        "aria-expanded",
        "false"
    );


    item.classList.remove(
        "is-open"
    );


    /*
       Reduced motion: close instantly.
    */

    if (prefersReducedMotion.matches) {

        answer.hidden = true;

        answer.style.height = "";
        answer.style.opacity = "";

        return;
    }



    /*
       If already hidden, nothing else is required.
    */

    if (answer.hidden) {
        return;
    }



    const currentHeight =
        answer.scrollHeight;


    answer.style.height =
        `${currentHeight}px`;


    answer.style.overflow =
        "hidden";


    answer.style.opacity =
        "1";


    /*
       Force the browser to register the starting height.
    */

    answer.offsetHeight;



    answer.style.transition =
        "height 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease";


    answer.style.height =
        "0px";


    answer.style.opacity =
        "0";



    const handleCloseComplete =
        (event) => {

            if (
                event.propertyName !==
                "height"
            ) {
                return;
            }


            answer.hidden = true;


            answer.style.height =
                "";


            answer.style.opacity =
                "";


            answer.style.overflow =
                "";


            answer.style.transition =
                "";


            answer.removeEventListener(
                "transitionend",
                handleCloseComplete
            );

        };


    answer.addEventListener(
        "transitionend",
        handleCloseComplete
    );

}



/* ================================================================
   27. FAQ KEYBOARD NAVIGATION
================================================================ */

document.addEventListener(
    "keydown",
    (event) => {

        const currentButton =
            event.target.closest(
                ".faq-question"
            );


        if (!currentButton) {
            return;
        }


        const accordion =
            currentButton.closest(
                "[data-accordion]"
            );


        if (!accordion) {
            return;
        }


        const buttons =
            Array.from(
                accordion.querySelectorAll(
                    ".faq-question"
                )
            );


        const currentIndex =
            buttons.indexOf(
                currentButton
            );


        if (currentIndex === -1) {
            return;
        }



        let nextIndex = null;



        /* --------------------------------------------------------
           Arrow Down
        -------------------------------------------------------- */

        if (event.key === "ArrowDown") {

            event.preventDefault();

            nextIndex =
                (
                    currentIndex + 1
                ) % buttons.length;

        }



        /* --------------------------------------------------------
           Arrow Up
        -------------------------------------------------------- */

        if (event.key === "ArrowUp") {

            event.preventDefault();

            nextIndex =
                (
                    currentIndex - 1 +
                    buttons.length
                ) % buttons.length;

        }



        /* --------------------------------------------------------
           Home
        -------------------------------------------------------- */

        if (event.key === "Home") {

            event.preventDefault();

            nextIndex = 0;

        }



        /* --------------------------------------------------------
           End
        -------------------------------------------------------- */

        if (event.key === "End") {

            event.preventDefault();

            nextIndex =
                buttons.length - 1;

        }



        if (nextIndex !== null) {

            buttons[nextIndex].focus();

        }

    }
);



/* ================================================================
   28. MOTION PREFERENCE CHANGE SAFETY
================================================================ */

const faqMotionPreference =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


const handleFaqMotionChange =
    (event) => {

        if (!event.matches) {
            return;
        }


        const faqAnswers =
            document.querySelectorAll(
                ".faq-answer"
            );


        faqAnswers.forEach(
            (answer) => {

                answer.style.transition =
                    "";


                answer.style.height =
                    "";


                answer.style.opacity =
                    "";


                answer.style.overflow =
                    "";

            }
        );

    };


if (
    typeof faqMotionPreference.addEventListener ===
    "function"
) {

    faqMotionPreference.addEventListener(
        "change",
        handleFaqMotionChange
    );

} else if (
    typeof faqMotionPreference.addListener ===
    "function"
) {

    faqMotionPreference.addListener(
        handleFaqMotionChange
    );

}



/* ================================================================
   JS PART 4 CONTINUES BELOW

   Other Required Interactions
   + Current Year
   + Safe Final Initialisation
================================================================ */
/* ================================================================
   29. FINAL GLOBAL INITIALISATION
================================================================ */

document.addEventListener("DOMContentLoaded", () => {

    safeInit(
        "Current year",
        initCurrentYear
    );


    safeInit(
        "Floating WhatsApp",
        initFloatingWhatsApp
    );


    safeInit(
        "External link safety",
        initExternalLinkSafety
    );


    safeInit(
        "Page restore cleanup",
        initPageRestoreCleanup
    );

});



/* ================================================================
   30. SAFE INITIALISATION WRAPPER
================================================================ */

/*
   Each optional enhancement is initialised independently.

   If one feature encounters an unexpected error, it will not prevent
   the remaining website interactions from working.
*/

function safeInit(
    featureName,
    initialiser
) {

    if (
        typeof initialiser !==
        "function"
    ) {
        return;
    }


    try {

        initialiser();

    } catch (error) {

        /*
           Development-friendly error reporting.

           This does not interrupt the visitor's experience.
        */

        console.error(
            `[Dissertation Writers Hub] ${featureName} could not initialise:`,
            error
        );

    }

}



/* ================================================================
   31. DYNAMIC COPYRIGHT YEAR
================================================================ */

function initCurrentYear() {

    const yearElement =
        document.getElementById(
            "current-year"
        );


    if (!yearElement) {
        return;
    }


    const currentYear =
        new Date().getFullYear();


    yearElement.textContent =
        String(currentYear);

}



/* ================================================================
   32. FLOATING WHATSAPP CTA
================================================================ */

function initFloatingWhatsApp() {

    const floatingWhatsApp =
        document.querySelector(
            ".floating-whatsapp"
        );


    if (!floatingWhatsApp) {
        return;
    }


    const finalCta =
        document.querySelector(
            ".final-cta-section"
        );


    const footer =
        document.querySelector(
            ".site-footer"
        );


    /*
       The floating CTA is useful while browsing the page, but becomes
       visually repetitive once the visitor reaches sections that
       already contain strong WhatsApp/contact actions.

       JavaScript therefore adds a subtle visibility state.
    */

    if (
        !("IntersectionObserver" in window) ||
        (!finalCta && !footer)
    ) {
        return;
    }


    const hiddenBySections =
        new Set();


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        const section =
                            entry.target;


                        if (entry.isIntersecting) {

                            hiddenBySections.add(
                                section
                            );

                        } else {

                            hiddenBySections.delete(
                                section
                            );

                        }

                    }
                );


                updateFloatingWhatsAppState();

            },
            {
                root: null,
                threshold: 0.12
            }
        );



    const updateFloatingWhatsAppState =
        () => {

            const shouldHide =
                hiddenBySections.size > 0;


            floatingWhatsApp.classList.toggle(
                "is-hidden",
                shouldHide
            );


            floatingWhatsApp.setAttribute(
                "aria-hidden",
                shouldHide
                    ? "true"
                    : "false"
            );


            floatingWhatsApp.tabIndex =
                shouldHide
                    ? -1
                    : 0;

        };


    if (finalCta) {

        observer.observe(
            finalCta
        );

    }


    if (footer) {

        observer.observe(
            footer
        );

    }

}



/* ================================================================
   33. EXTERNAL LINK SAFETY
================================================================ */

function initExternalLinkSafety() {

    const externalLinks =
        document.querySelectorAll(
            'a[target="_blank"]'
        );


    if (!externalLinks.length) {
        return;
    }


    externalLinks.forEach(
        (link) => {

            const existingRel =
                (
                    link.getAttribute(
                        "rel"
                    ) || ""
                )
                    .split(/\s+/)
                    .filter(Boolean);


            const requiredRelValues = [
                "noopener",
                "noreferrer"
            ];


            requiredRelValues.forEach(
                (value) => {

                    if (
                        !existingRel.includes(
                            value
                        )
                    ) {

                        existingRel.push(
                            value
                        );

                    }

                }
            );


            link.setAttribute(
                "rel",
                existingRel.join(" ")
            );

        }
    );

}



/* ================================================================
   34. PAGE RESTORE CLEANUP
================================================================ */

function initPageRestoreCleanup() {

    /*
       Some browsers restore pages from the back-forward cache.

       If a visitor leaves while the mobile navigation is open,
       this cleanup prevents the page from returning with a locked
       body or stale menu state.
    */

    window.addEventListener(
        "pageshow",
        () => {

            const menuToggle =
                document.querySelector(
                    ".mobile-menu-toggle"
                );


            const mobileNavigation =
                document.getElementById(
                    "mobile-navigation"
                );


            const siteHeader =
                document.getElementById(
                    "site-header"
                );


            document.body.classList.remove(
                "no-scroll"
            );


            if (menuToggle) {

                menuToggle.classList.remove(
                    "is-active"
                );


                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );


                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

            }


            if (mobileNavigation) {

                mobileNavigation.classList.remove(
                    "is-open"
                );


                mobileNavigation.hidden =
                    true;

            }


            if (siteHeader) {

                siteHeader.classList.remove(
                    "menu-open"
                );

            }

        }
    );

}



/* ================================================================
   35. FLOATING WHATSAPP CSS COMPANION NOTE

   The .is-hidden state is added by JavaScript.

   Add the small CSS block shown after this JavaScript code to
   css/style.css.
================================================================ */



/* ================================================================
   END OF js/script.js

   Dissertation Writers Hub
   Homepage JavaScript Complete
================================================================ */
