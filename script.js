/* ================================================================
   RAYAUTONOMY
   Main JavaScript
   Raymond Valentin - Technology Portfolio
   ================================================================ */

"use strict";


/* ================================================================
   01. DOM READY
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {

    initCurrentYear();
    initScrollReveal();
    initMobileNavigation();
    initActiveNavigation();
    initCursorGlow();
    initSmoothScrolling();
    initTerminal();
    initTopology();
    initProjectInteractions();

});


/* ================================================================
   02. CURRENT YEAR
   ================================================================ */

function initCurrentYear() {

    const yearElement =
        document.getElementById("currentYear");

    if (!yearElement) {
        return;
    }

    yearElement.textContent =
        new Date().getFullYear();

}


/* ================================================================
   03. SCROLL REVEAL
   Reveals sections when they enter the viewport.
   ================================================================ */

function initScrollReveal() {

    const revealElements =
        document.querySelectorAll(".reveal");

    if (!revealElements.length) {
        return;
    }


    /*
       Fallback for browsers without IntersectionObserver.
    */

    if (!("IntersectionObserver" in window)) {

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

        return;
    }


    const observer =
        new IntersectionObserver(

            (entries, revealObserver) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(
                        entry.target
                    );

                });

            },

            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -40px 0px"
            }

        );


    revealElements.forEach((element) => {

        observer.observe(element);

    });

}


/* ================================================================
   04. MOBILE NAVIGATION
   ================================================================ */

function initMobileNavigation() {

    const menuButton =
        document.getElementById(
            "mobileMenuButton"
        );

    const mobileNav =
        document.getElementById(
            "mobileNav"
        );


    if (!menuButton || !mobileNav) {
        return;
    }


    const menuLines =
        menuButton.querySelectorAll("span");


    function openMenu() {

        mobileNav.classList.add("open");

        document.body.classList.add(
            "menu-open"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );


        if (menuLines.length === 3) {

            menuLines[0].style.transform =
                "translateY(6px) rotate(45deg)";

            menuLines[1].style.opacity =
                "0";

            menuLines[2].style.transform =
                "translateY(-6px) rotate(-45deg)";

        }

    }


    function closeMenu() {

        mobileNav.classList.remove("open");

        document.body.classList.remove(
            "menu-open"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );


        if (menuLines.length === 3) {

            menuLines[0].style.transform =
                "";

            menuLines[1].style.opacity =
                "";

            menuLines[2].style.transform =
                "";

        }

    }


    function toggleMenu() {

        const isOpen =
            mobileNav.classList.contains(
                "open"
            );


        if (isOpen) {
            closeMenu();
        }
        else {
            openMenu();
        }

    }


    menuButton.addEventListener(
        "click",
        toggleMenu
    );


    /*
       Close navigation after selecting
       a mobile navigation link.
    */

    mobileNav
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                closeMenu
            );

        });


    /*
       Close menu with Escape key.
    */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {
                closeMenu();
            }

        }
    );


    /*
       Automatically reset mobile menu
       when returning to desktop width.
    */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 1000) {
                closeMenu();
            }

        }
    );

}


/* ================================================================
   05. ACTIVE NAVIGATION
   Highlights the current section while scrolling.
   ================================================================ */

function initActiveNavigation() {

    const navigationLinks =
        document.querySelectorAll(
            ".desktop-nav .nav-link"
        );


    if (!navigationLinks.length) {
        return;
    }


    const sections =
        Array.from(navigationLinks)

            .map((link) => {

                const target =
                    link.getAttribute("href");

                if (
                    !target ||
                    !target.startsWith("#")
                ) {
                    return null;
                }

                return document.querySelector(
                    target
                );

            })

            .filter(Boolean);


    if (!sections.length) {
        return;
    }


    function updateActiveNavigation() {

        const scrollPosition =
            window.scrollY + 180;

        let currentSection =
            sections[0];


        sections.forEach((section) => {

            if (
                section.offsetTop <=
                scrollPosition
            ) {

                currentSection =
                    section;

            }

        });


        navigationLinks.forEach(
            (link) => {

                link.classList.remove(
                    "active"
                );

                const target =
                    link.getAttribute(
                        "href"
                    );


                if (
                    target ===
                    `#${currentSection.id}`
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        {
            passive: true
        }
    );


    updateActiveNavigation();

}


/* ================================================================
   06. MOUSE-FOLLOWING AMBIENT GLOW
   ================================================================ */

function initCursorGlow() {

    const glow =
        document.getElementById(
            "cursorGlow"
        );


    if (!glow) {
        return;
    }


    /*
       Don't run mouse effects on touch-only
       devices or for reduced-motion users.
    */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    const finePointer =
        window.matchMedia(
            "(pointer: fine)"
        ).matches;


    if (
        reducedMotion ||
        !finePointer
    ) {

        glow.style.display =
            "none";

        return;
    }


    let currentX =
        window.innerWidth / 2;

    let currentY =
        window.innerHeight / 3;


    let targetX =
        currentX;

    let targetY =
        currentY;


    /*
       Track mouse target.
    */

    document.addEventListener(
        "mousemove",
        (event) => {

            targetX =
                event.clientX;

            targetY =
                event.clientY;

        },
        {
            passive: true
        }
    );


    /*
       Smooth interpolation prevents
       the glow from snapping directly
       to the cursor.
    */

    function animateGlow() {

        currentX +=
            (targetX - currentX) * 0.08;

        currentY +=
            (targetY - currentY) * 0.08;


        glow.style.left =
            `${currentX}px`;

        glow.style.top =
            `${currentY}px`;


        requestAnimationFrame(
            animateGlow
        );

    }


    animateGlow();

}


/* ================================================================
   07. SMOOTH INTERNAL NAVIGATION
   ================================================================ */

function initSmoothScrolling() {

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetID =
                    link.getAttribute(
                        "href"
                    );


                /*
                   href="#" should not cause
                   the page to jump to the top.
                */

                if (
                    !targetID ||
                    targetID === "#"
                ) {

                    event.preventDefault();

                    return;

                }


                const target =
                    document.querySelector(
                        targetID
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"

                });

            }
        );

    });

}


/* ================================================================
   08. TERMINAL ENHANCEMENTS
   Adds subtle activity without pretending
   that the site is a real SOC console.
   ================================================================ */

function initTerminal() {

    const terminal =
        document.querySelector(
            ".terminal-window"
        );


    if (!terminal) {
        return;
    }


    const status =
        terminal.querySelector(
            ".terminal-status"
        );


    if (!status) {
        return;
    }


    const statuses = [

        "SECURE",

        "ONLINE",

        "READY"

    ];


    let statusIndex =
        0;


    setInterval(() => {

        statusIndex =
            (statusIndex + 1) %
            statuses.length;

        status.textContent =
            statuses[statusIndex];

    }, 5000);

}


/* ================================================================
   09. TOPOLOGY INTERACTION
   ================================================================ */

function initTopology() {

    const topology =
        document.querySelector(
            ".topology"
        );


    if (!topology) {
        return;
    }


    const nodes =
        topology.querySelectorAll(
            ".topology-node"
        );


    if (!nodes.length) {
        return;
    }


    nodes.forEach((node) => {

        node.addEventListener(
            "mouseenter",
            () => {

                nodes.forEach(
                    (otherNode) => {

                        if (
                            otherNode !== node
                        ) {

                            otherNode.style.opacity =
                                "0.48";

                        }

                    }
                );


                node.style.zIndex =
                    "20";

            }
        );


        node.addEventListener(
            "mouseleave",
            () => {

                nodes.forEach(
                    (otherNode) => {

                        otherNode.style.opacity =
                            "";

                    }
                );


                node.style.zIndex =
                    "";

            }
        );

    });

}


/* ================================================================
   10. PROJECT INTERACTIONS
   ================================================================ */

function initProjectInteractions() {

    const projects =
        document.querySelectorAll(
            ".project-row"
        );


    if (!projects.length) {
        return;
    }


    projects.forEach((project) => {

        /*
           The current project links use "#"
           because their dedicated project
           pages have not been created yet.

           This prevents accidental jumping
           while still allowing the project
           rows to behave visually as cards.
        */

        project.addEventListener(
            "click",
            (event) => {

                const destination =
                    project.getAttribute(
                        "href"
                    );


                if (
                    destination === "#"
                ) {

                    event.preventDefault();

                }

            }
        );

    });

}


/* ================================================================
   11. SUBTLE PANEL POINTER EFFECT
   Gives desktop panels a slight reactive
   highlight without excessive animation.
   ================================================================ */

const interactivePanels =
    document.querySelectorAll(
        ".dashboard-panel, " +
        ".technology-card, " +
        ".credential-panel, " +
        ".status-card"
    );


const reducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


const finePointer =
    window.matchMedia(
        "(pointer: fine)"
    ).matches;


if (
    !reducedMotion &&
    finePointer
) {

    interactivePanels.forEach(
        (panel) => {

            panel.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        panel.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    const percentX =
                        x /
                        rect.width;


                    const percentY =
                        y /
                        rect.height;


                    /*
                       Extremely small tilt:
                       enough to feel interactive,
                       not enough to look like a
                       gaming website.
                    */

                    const rotateY =
                        (percentX - 0.5) * 1.2;


                    const rotateX =
                        (0.5 - percentY) * 1.2;


                    panel.style.transform =
                        `perspective(900px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-2px)`;

                }
            );


            panel.addEventListener(
                "mouseleave",
                () => {

                    panel.style.transform =
                        "";

                }
            );

        }
    );

}


/* ================================================================
   12. PAGE VISIBILITY
   Stops unnecessary terminal updates when
   the browser tab is hidden.
   ================================================================ */

document.addEventListener(
    "visibilitychange",
    () => {

        /*
           Reserved for future portfolio
           visualizations or live components.

           Keeping this listener here makes
           future additions easier without
           restructuring the main script.
        */

        if (document.hidden) {

            document.documentElement
                .setAttribute(
                    "data-page-visible",
                    "false"
                );

        }
        else {

            document.documentElement
                .setAttribute(
                    "data-page-visible",
                    "true"
                );

        }

    }
);


/* ================================================================
   13. INITIAL SYSTEM STATE
   ================================================================ */

document.documentElement.setAttribute(
    "data-page-visible",
    "true"
);
