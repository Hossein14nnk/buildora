gsap.registerPlugin(ScrollTrigger, SplitText);

const Helper = {
    trigger(trigger, start = "top 70%", options = {}) {
        return {
            trigger,
            start,
            // toggleActions: "play none none reverse",
            toggleActions: "play none none none",
            ...options
        };
    },

    splitTitle(selector, type = "chars", mask = "chars") {
        return this.elements(selector).map(element => {
            const split = SplitText.create(element, {
                type,
                mask
            });

            split.element = element;

            return split;
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

    checkElement(selector) {
        return !!document.querySelector(selector);
    },

    timeline(trigger, start = "top 70%"){
        return gsap.timeline({
            scrollTrigger: Helper.trigger(trigger, start)
        });
    }
};

const Global = {
    pages: {
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
        hero(selector = "#hero"){
            if (!Helper.checkElement(selector)) return;

            let textType = "chars";
            Helper.splitTitle(`${selector} :is(p,span,a,h1,h2,h3)`, textType, textType).forEach(split => {
                const tl = Helper.timeline(split.element);

                tl.from(split[textType], {
                    y: 100,
                    autoAlpha: 0,
                    stagger: 0.02,
                    duration: 0.6,
                    ease: "power3.out"
                });
            });
        },
    },
    components: {
        tilt(items) {
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
        },
    }
}

const Animation = {
    init() {
        this.stBlog.init();
        this.aboutUs.init();
        this.teams.init();
        this.plans.init();
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
            if (!Helper.checkElement(".counter")) return;

            const tl = Helper.timeline("#hero + section");
            document.querySelectorAll(".counter").forEach(counter => {
                tl.add(Helper.counter(counter).play(), "<");
            });
        },
        managers(){
            if (!Helper.checkElement("#experts")) return;
            const managers = Helper.elements("#experts .project-managers > div:has(.card)");
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
            if (!Helper.checkElement("#feature-cards")) return;
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
            Global.pages.hero();
            this.plans();
            this.pricing();
        },
        plans(){
            if (!Helper.checkElement("#plans")) return;
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
                    Global.components.tilt(pricingTables);
                }
            });
        },
        pricing() {
            if (!Helper.checkElement("#pricing")) return;
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
        }
    },

    // gallery: {
    //     init(){
    //         this.gallery();
    //     }
    // },

    stBlog: {
        init(){
            Global.pages.hero("#st-blog-hero");
            this.descriptionBlog();
            this.hr();
        },
        hr(){
            if (!Helper.checkElement(".border-bottom.border-primary.border-3")) return;
            Helper.elements(".border-bottom.border-primary.border-3").forEach(hr => {
                const tl = Helper.timeline(hr);
                
                gsap.set(hr, {
                    opacity: 0,
                    scaleX: 0,
                    transformOrigin: "left center"
                });

                tl.to(hr, {
                    opacity: 1,
                    scaleX: 1,
                    duration: 1.2,
                    ease: "power3.out"
                });
            });
        },
        descriptionBlog(){
            if (!Helper.checkElement("#descriotion-blog")) return;

            const animateCardBody = (selector) => {
                const cards = Helper.elements(selector);
                
                cards.forEach(card => {
                    const tl = Helper.timeline(card, "top 60%");

                    gsap.set(card, {
                        opacity: 0,
                        x: 100,
                    });

                    tl.to(card, {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        ease: "back.out(1.4)",
                    });
                });
            };

            const animateEmail = (selector) => {
                const cards = Helper.elements(selector);
                const tl = Helper.timeline(cards);
    
                gsap.set(cards, {
                    opacity: 0,
                    x: 100,
                });
    
                tl.to(cards, {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "back.out(1.4)",
                });
            };

            const animateImageBlog = (selector) => {
                const image = Helper.elements(selector);
                const tl = Helper.timeline(image);

                gsap.set(image, {
                    opacity: 0,
                    x: -100,
                });

                tl.to(image, {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "back.out(1.4)",
                });
            };

            const animateTexts = (selector) => {
                let textType = "lines";
                Helper.splitTitle(`${selector} :is(p,span,a,h1,h2,h3)`, textType, textType).forEach(split => {
                    const tl = Helper.timeline(split.element, "top 80%");

                    tl.from(split[textType], {
                        y: 100,
                        autoAlpha: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power3.out"
                    });
                });
            };

            animateCardBody(".card-body");
            animateEmail("#subscribeCard");
            animateImageBlog(".image-blog");
            animateTexts(".image-blog ~ div");
        }
    },
};

Animation.init();