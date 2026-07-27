gsap.registerPlugin(ScrollTrigger, SplitText);

const Helper = {
    trigger(trigger, start = "top 70%", options = {}) {
        return {
            trigger,
            start,
            toggleActions: "play none none reverse",
            ...options
        };
    },

    splitTitle(selector, type = "chars", mask = "chars") {
        return this.elements(selector).flatMap(element => {
            return SplitText.create(element, {
                type: type,
                mask: mask
            })[type];
        });
    },

    counter(target) {
        const obj = { value: 0 };
        return gsap.to(obj, {
            value: Number(target.dataset.value),
            duration: 2,
            paused: true,
            onUpdate() {
                target.textContent =
                    Math.floor(obj.value).toLocaleString() + "+";
            }
        });
    },

    elements(selector) {
        return gsap.utils.toArray(selector);
    },

    checkElement(selector){
        if (!document.querySelector(selector)) return;
    },

    timeline(selector, start = "top 70%"){
        return gsap.timeline({
            scrollTrigger: Helper.trigger(selector, start)
        });
    }
};

const Animation = {
    init() {
        this.global.init();
        this.aboutUs.init();
        this.teams.init();
        this.plans.init();
    },

    global: {
        init(){
            this.revealSection();
            this.hero();
        },
        revealSection(selector = "section") {
            Helper.elements(selector).forEach((section, index, array) => {
                let start = (index == array.length - 1) ? "top 90%" : "top 70%";
                gsap.from(section, {
                    scrollTrigger: Helper.trigger(section, start),
                    opacity: 0,
                    y: 100,
                    duration: 1,
                    ease: "power3.out"
                });
            });
        },
        hero(){
            Helper.checkElement("#hero");
            const chars = Helper.splitTitle("#hero :is(p,span,a,h1,h2,h3)");
            const tl = Helper.timeline("#hero");

            tl.from(chars, {
                y: 100,
                autoAlpha: 0,
                stagger: 0.02,
                duration: 0.6
            });
        },
    },

    aboutUs: {
        init(){
            this.journey();
        },
        journey(){
            const journey = document.querySelector(".journey");
            if (!journey) return;
            const tl = gsap.timeline({
                scrollTrigger: Helper.trigger(journey, "top bottom", {
                    end: "-=100",
                    scrub: 1,
                    snap: {
                        snapTo: "labels",
                        duration: {
                            min: 0.2,
                            max: 3
                        },
                        delay: 0.2,
                        ease: "power1.inOut"
                    }
                })
            });
            tl.addLabel("start")
                .from(".left-box h2", {
                    scale: .3,
                    rotation: 45,
                    autoAlpha: 0
                })
                .addLabel("spin")
                .to(".left-box", {
                    rotation: 360
                });
        }
    },

    teams: {
        init(){
            this.counter();
            this.managers();
            this.featureCard();
        },
        counter(){
            const tl = Helper.timeline("#hero + section");
            document.querySelectorAll(".counter").forEach(counter => {
                tl.add(Helper.counter(counter).play(), "<");
            });
        },
        managers(){
            Helper.checkElement("#experts");
            const managers = Helper.elements("#experts .project-managers > div");
            const tl = Helper.timeline("#experts .project-managers");

            gsap.set(managers, {
                opacity: 0,
                xPercent: -100
            });

            tl.to(managers, {
                opacity: 1,
                xPercent: 0,
                duration: .8,
                stagger: .3,
                ease: "power3.out"
            });
        },
        featureCard(){
            Helper.checkElement("#feature-cards");
            const featureCards = Helper.elements("#feature-cards .feature-card");
            const tl = Helper.timeline("#feature-cards");

            gsap.set(featureCards, {
                opacity: 0,
                scale: 0
            });

            tl.to(featureCards, {
                opacity: 1,
                scale: 1,
                duration: .8,
                stagger: .5,
                ease: "power1.in"
            });
        }
    },

    plans: {
        init(){
            this.plans();
            this.pricing();
        },
        plans(){
            Helper.checkElement("#plans");
            const pricingTables = Helper.elements("#plans .col-6");
            const tl = Helper.timeline("#plans .col-6");

            gsap.set(pricingTables, {
                opacity: 0,
                scale: 0.8,
                transformPerspective: 800,
                transformStyle: "preserve-3d"
            });

            tl.to(pricingTables, {
                opacity: 1,
                scale: 1,
                duration: 1,
                stagger: .75,
                ease: "back.out(1.4)",
                onComplete: () => {
                    this.plansTilt(pricingTables);
                }
            });
        },
        pricing() {
            Helper.checkElement("#pricing");
            const pricingItems = Helper.elements("#pricing .row > div");
            const tl = Helper.timeline("#pricing .row > div");

            gsap.set(pricingItems, {
                opacity: 0,
                xPercent: -100,
            });

            tl.to(pricingItems, {
                opacity: 1,
                xPercent: 0,
                duration: 1,
                stagger: .75,
                ease: "power3.out",
            });
        },

        plansTilt(items) {
            items.forEach(item => {
                const rotateX = gsap.quickTo(item, "rotationX", {
                    duration: .5,
                    ease: "power3.out"
                });

                const rotateY = gsap.quickTo(item, "rotationY", {
                    duration: .5,
                    ease: "power3.out"
                });

                item.addEventListener("mousemove", (e) => {
                    const rect = item.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const moveX = (x / rect.width - .5) * 20;
                    const moveY = (y / rect.height - .5) * -20;

                    rotateY(moveX);
                    rotateX(moveY);
                });

                item.addEventListener("mouseleave", () => {
                    rotateX(0);
                    rotateY(0);
                });
            });
        }
    },

    gallery: {
        init(){
            this.gallery();
        }
    }
};

Animation.init();