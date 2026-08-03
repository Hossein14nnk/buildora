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
        let unit = target.dataset.unit ?? "+";
        return gsap.to(obj, {
            value: parseFloat(target.dataset.value),
            duration: 2,
            paused: true,
            onUpdate() {
                target.textContent =
                    Math.floor(obj.value).toLocaleString() + unit;
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
    },
    animateTexts(selector, start = "top 80%", textType = "lines", textTags = "p,span,a,h1,h2,h3", options){
        this.splitTitle(`${selector} :is(${textTags})`, textType, textType).forEach(split => {
            const tl = this.timeline(split.element, start);

            tl.from(split[textType], options ?? {
                y: 100,
                autoAlpha: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            });
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
        hero(selector = "#hero", start = "top 70%", textTags = "p,span,a,h1,h2,h3"){
            if (!Helper.checkElement(selector)) return;

            let textType = "chars";
            Helper.splitTitle(`${selector} :is(${textTags})`, textType, textType).forEach(split => {
                const tl = Helper.timeline(split.element, start);

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
        counter(selector){
            if (!Helper.checkElement(".counter")) return;

            const tl = Helper.timeline(selector);
            document.querySelectorAll(".counter").forEach(counter => {
                tl.add(Helper.counter(counter).play(), "<");
            });
        },
    }
}

const Animation = {
    init() {
        Global.pages.revealSection();
        this.reviews.init();
        this.stProject.init();
        this.stService.init();
        this.stBlog.init();
        this.aboutUs.init();
        this.teams.init();
        this.plans.init();
        this.register.init();
        this.weblogs.init();
        this.galley.init();
        this.homeOne.init();
        this.homeTwo.init();
        this.contactUs.init();
        this.arServices.init();
        this.arProject.init();
    },
    aboutUs: {
        init(){
            this.journey();
            this.about();
            this.servicesOverview();
            this.managers();
        },
        about(){
            if (!Helper.checkElement("#about-us section.about")) return;

            const images = Helper.elements("#about-us section.about div:has(.img-fluid)");
            const tlImage = Helper.timeline("#about-us section.about div:has(.img-fluid)");

            gsap.set(images, {
                opacity: 0,
                x: -100
            });

            tlImage.to(images, {
                opacity: 1,
                x: 0,
                duration: .8,
                stagger: .3,
                ease: "none"
            });

            Helper.animateTexts("#about-us section.about");
        },
        journey(){
            if (!Helper.checkElement("#about-us section.journey")) return;

            Helper.animateTexts("#about-us section.journey");
        },
        servicesOverview(){
            if (!Helper.checkElement("#about-us section.journey")) return;

            const projects = Helper.elements("#about-us section.introduction .wrapper div:has(.services-overview)");
            const tlProjects = Helper.timeline("#about-us section.introduction .wrapper div:has(.services-overview)");

            gsap.set(projects, {
                opacity: 0,
                x: -100
            });

            tlProjects.to(projects, {
                opacity: 1,
                x: 0,
                duration: .8,
                stagger: .3,
                ease: "none"
            });

            Helper.animateTexts("#about-us section.journey");
        },
        managers(){
            if (!Helper.checkElement("#about-us section.team")) return;
            const managers = Helper.elements("section.team div:has(.team-card)");
            const tl = Helper.timeline("section.team div:has(.team-card)");

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

            Helper.animateTexts("#about-us section.team");
        },
    },
    teams: {
        init(){
            Global.components.counter("#hero + section");
            this.managers();
            this.featureCard();
        },
        managers(){
            if (!Helper.checkElement("#experts")) return;
            const managers = Helper.elements("#experts .project-managers > div:has(.card-team)");
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
                        scaleX: 0,
                    });

                    tl.to(card, {
                        opacity: 1,
                        scaleX: 1,
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

            animateCardBody(".card-body");
            animateEmail("#subscribeCard");
            animateImageBlog(".image-blog");
            Helpers.animateTexts(".image-blog ~ div");
        }
    },
    stService: {
        init(){
            Global.pages.hero(".hero");
            this.descriptionBlog();
            this.offer();
            this.process();
            this.feature();
        },
        descriptionBlog(){
            if (!Helper.checkElement("main#st-services .overview")) return;

            const animateCardBody = (selector) => {
                const cards = Helper.elements(selector);
                
                cards.forEach(card => {
                    const tl = Helper.timeline(card, "top 60%");

                    gsap.set(card, {
                        opacity: 0,
                        scaleX: 0,
                    });

                    tl.to(card, {
                        opacity: 1,
                        scaleX: 1,
                        duration: 1,
                        ease: "back.out(1.4)",
                    });
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

            animateCardBody("#bannerCTA");
            animateCardBody(".card-body");
            animateCardBody(".need-help-card");
            animateCardBody("div:has(.project-banner)");
            animateImageBlog(".img-fluid");
            Helper.animateTexts(".img-fluid ~ ");
        },
        offer(){
            if (!Helper.checkElement("section.offer")) return;

            Helper.animateTexts("section.offer");
        },
        process(){
            if (!Helper.checkElement("section.process")) return;

            const cycleCards = Helper.elements(".cycle-card");
            const tl = Helper.timeline(cycleCards);
            gsap.set(cycleCards, {
                opacity: 0,
                xPercent: -100
            });
            
            tl.to(cycleCards, {
                opacity: 1,
                xPercent: 0,
                duration: 0.8,
                stagger: 0.4,
                ease: "power1.in",
            });

            Helper.animateTexts("section.process", "top 80%", "lines", "p,span,a,h1,h2,h3",{x: 100, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: "power3.out"});
        },
        feature(){
            if (!Helper.checkElement("section.feature .second-feature-card")) return;

            const secondFeatureCard = Helper.elements("section.feature .second-feature-card", "top 90%");
            const tl = Helper.timeline(secondFeatureCard);

            gsap.set(secondFeatureCard, {
                opacity: 0,
                y: -100
            });

            tl.to(secondFeatureCard, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power1.in"
            });
        }
    },
    stProject: {
        init(){
            Global.pages.hero(".hero");
            this.descriptionBlog();
            this.offer();
            this.process();
        },
        descriptionBlog(){
            if (!Helper.checkElement("main#stProject .overview")) return;

            const animateCardBody = (selector, start = "top 70%") => {
                const cards = Helper.elements(selector);
                
                cards.forEach(card => {
                    const tl = Helper.timeline(card);

                    gsap.set(card, {
                        opacity: 0,
                        scaleX: 0,
                    });

                    tl.to(card, {
                        opacity: 1,
                        scaleX: 1,
                        duration: 1,
                        ease: "back.out(1.4)",
                    });
                });
            };

            const animateImageBlog = (selector, start = "top 70%") => {
                const image = Helper.elements(selector);
                const tl = Helper.timeline(image, start);

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

            animateCardBody("aside div:has(.project-overview)", "top 60%");
            animateCardBody("aside div:has(#bannerCTA)", "top 60%");
            animateCardBody(".card-body", "top 60%");
            animateCardBody("div:has(.project-banner)", "top 60%");
            animateCardBody("div:has(.process-timeline)", "top 60%");
            Helper.animateTexts(".process-timeline");
            animateImageBlog(".img-fluid", "top 60%");
            Helper.animateTexts(".img-fluid ~ ");
        },
        offer(){
            if (!Helper.checkElement("section.offer")) return;

            Helper.animateTexts("section.offer");
        },
        process(){
            if (!Helper.checkElement("section.process")) return;

            const galleryImages = Helper.elements(".project-gallery .img-fluid");
            const tl = Helper.timeline(galleryImages);
            gsap.set(galleryImages, {
                opacity: 0,
                scale: 0.5,
            });
            
            tl.to(galleryImages, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.4,
                ease: "none",
            });

            Helper.animateTexts("section.process", "top 80%", "lines", "p,span,a,h1,h2,h3",{x: 100, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: "power3.out"});
        }
    },
    reviews: {
        init(){
            this.wrapperItems();
            this.reviews();
            this.projectCta();
        },
        wrapperItems(){
            if (!Helper.checkElement("#Reviews .wrapper-items")) return;
            const items = Helper.elements(".wrapper-items .col-6");
            const tl = Helper.timeline(".wrapper-items .col-6");

            items.forEach(item => {
                item.classList.remove("transition-300")
            });

            gsap.set(items, {
                opacity: 0,
                scale: 0.8,
            });

            tl.to(items, {
                opacity: 1,
                scale: 1,
                duration: 1,
                stagger: .75,
                ease: "back.out(1.4)",
                onComplete: () => {
                    items.forEach(item => {
                        item.classList.add("transition-300")
                    });
                }
            });
        },
        reviews(){
            if (!Helper.checkElement("#Reviews .reviews")) return;
            const items = Helper.elements(".reviews div:has(.card-review)");
            const tl = Helper.timeline(".reviews div:has(.card-review)");

            items.forEach(item => {
                item.classList.remove("transition-150")
            });

            gsap.set(items, {
                opacity: 0,
                scaleX: 0,
            });

            tl.to(items, {
                opacity: 1,
                scaleX: 1,
                duration: 1,
                stagger: .75,
                ease: "back.out(1.4)",
                onComplete: () => {
                    items.forEach(item => {
                        item.classList.add("transition-150");
                    });
                }
            });

            Helper.animateTexts("section.reviews");
        },
        projectCta(){
            Helper.animateTexts("section.project-cta", "top 80%", "chars");
        }
    },
    register: {
        init(){
            this.register();
        },
        register(){
            if (!Helper.checkElement("#register section.register")) return;
            const form = Helper.elements(".register div:has(> .card)");
            const tlCard = Helper.timeline(".reviews div:has(> .card)");

            gsap.set(form, {
                opacity: 0,
                xPercent: -100
            });

            tlCard.to(form, {
                opacity: 1,
                xPercent: 0,
                duration: 0.8,
                ease: "power1.in"
            });

            const features = Helper.elements(".register aside:has(> .account-features)");
            const tlFeatures = Helper.timeline(".reviews aside:has(> .account-features)");

            gsap.set(features, {
                opacity: 0,
                xPercent: 100
            });

            tlFeatures.to(features, {
                opacity: 1,
                xPercent: 0,
                duration: 0.8,
                ease: "power1.in"
            });
        }
    },
    weblogs: {
        init(){
            Global.pages.hero("#weblogs #blog-hero");
            this.containerFluid();
        },
        containerFluid(){
            if (!Helper.checkElement(".container-fluid")) return;

            const animateCardBody = (selector, start = "top 70%") => {
                const cards = Helper.elements(selector);
                
                cards.forEach(card => {
                    const tl = Helper.timeline(card);

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

                Helper.animateTexts(selector, "top 90%")
            };

            const animatePost = (selector) => {
                const cards = Helper.elements(selector);

                cards.forEach(card => {
                    const tl = Helper.timeline(card, "top 60%");

                    gsap.set(card, {
                        opacity: 0,
                        x: -100,
                    });

                    tl.to(card, {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        ease: "back.out(1.4)",
                    });

                    Helper.animateTexts(selector, "top 70%", "lines", "p,a,h1,h2,h3");
                });
            };
            animateCardBody(".container-fluid .card-body");
            animateCardBody(".container-fluid #subscribeCard");
            animatePost(".wrapper .news-box");
        }
    },
    homeOne: {
        init(){
            Global.pages.hero("#main-hero", "top bottom");
            Global.components.counter(".container-fluid");
            this.hero();
            this.containerFluid();
            this.ourTeam();
            this.testimonials();
            this.coreServicesCard();
        },
        hero(){
            const cardPlay = Helper.elements("#main-hero .card-play");
            const tl = Helper.timeline(cardPlay);

            gsap.set(cardPlay, {
                opacity: 0,
                x: 100,
            });
            tl.to(cardPlay, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power1.in"
            });
        },
        containerFluid(){
            if (!Helper.checkElement("#home-one .container-fluid")) return;

            const card = Helper.elements(".container-fluid .mission-card");
            const tl = Helper.timeline(card);

            gsap.set(card, {
                opacity: 0,
                x: 100
            });

            tl.to(card, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power1.in"
            });
        },
        ourTeam(){
            if (!Helper.checkElement(".container-fluid .team-card")) return;
            const managers = Helper.elements(".container-fluid div:has( > .team-card)");
            const tl = Helper.timeline(".container-fluid div:has( > .team-card)");

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
        testimonials(){
            if (!Helper.checkElement("#testimonials")) return;
            const managers = Helper.elements("#testimonials .comment");
            const tl = Helper.timeline("#testimonials .comment");

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
        coreServicesCard(){
            if (!Helper.checkElement("section.container-fluid .core-services-card")) return;
            const card = Helper.elements(".container-fluid .core-services-card");
            const tl = Helper.timeline(".container-fluid .core-services-card");

            gsap.set(card, {
                opacity: 0,
                xPercent: 100
            });

            tl.to(card, {
                opacity: 1,
                xPercent: 0,
                duration: .8,
                stagger: .3,
                ease: "power3.out"
            });
        }
    },
    homeTwo: {
        init(){
            this.comments();
            this.weDo();
            this.projects();
        },
        comments(){
            if (!Helper.checkElement(".comments")) return;
            const comment = Helper.elements(".comments .comment");
            const tl = Helper.timeline(".comments .comment");

            gsap.set(comment, {
                opacity: 0,
                xPercent: 100
            });

            tl.to(comment, {
                opacity: 1,
                xPercent: 0,
                duration: .8,
                stagger: .3,
                ease: "power3.out"
            });
        },
        weDo(){
            if (!Helper.checkElement("section.we-do")) return;
            const card = Helper.elements(".we-do .core-services-card");
            const tl = Helper.timeline(".we-do .core-services-card");

            gsap.set(card, {
                opacity: 0,
                xPercent: 100
            });

            tl.to(card, {
                opacity: 1,
                xPercent: 0,
                duration: .8,
                stagger: .3,
                ease: "power3.out"
            });
        },
        projects(){
            if (!Helper.checkElement("section.projects")) return;
            const card = Helper.elements(".projects .secondary-project-card2");
            const tl = Helper.timeline(".projects .secondary-project-card2");

            gsap.set(card, {
                opacity: 0,
                xPercent: 100
            });

            tl.to(card, {
                opacity: 1,
                xPercent: 0,
                duration: .8,
                stagger: .3,
                ease: "power3.out"
            });
        }
    },
    galley: {
        init(){
            this.galleryImages();
        },
        galleryImages(){
            if (!Helper.checkElement("#gallery .gallery")) return;

            const galleryImages = Helper.elements(".gallery div:has(img)");
            const tl = Helper.timeline(galleryImages, "top 90%");
            gsap.set(galleryImages, {
                opacity: 0,
                scale: 0.5,
            });
            
            tl.to(galleryImages, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.4,
                ease: "none",
            });
        }
    },
    contactUs:{
        init(){
            Global.pages.hero("#contact-us #contact-hero");
            this.sendMessage();
        },
        sendMessage(){
            if (!Helper.checkElement("#contact-us section.conainer-flouds:has(form)")) return;

            const inputs = Helper.elements(".conainer-flouds form input");
            const tlInput = Helper.timeline(".conainer-flouds form input");
            const select = Helper.elements(".conainer-flouds form select");
            const tlSelect = Helper.timeline(".conainer-flouds form select");
            const textarea = Helper.elements(".conainer-flouds form textarea");
            const tlTextarea = Helper.timeline(".conainer-flouds form textarea");
            const info = Helper.elements(".conainer-flouds .contact-details > div");
            const tlInfo = Helper.timeline(".conainer-flouds .contact-details > div");

            gsap.set(inputs, {
                opacity: 0,
                scale: 0
            });

            tlInput.to(inputs, {
                opacity: 1,
                scale: 1,
                duration: .8,
                stagger: .3,
                ease: "power3.out"
            });

            gsap.set(select, {
                opacity: 0,
                scale: 0
            });

            gsap.set(textarea, {
                opacity: 0,
                scale: 0
            });

            gsap.set(info, {
                opacity: 0,
                y: 100
            });

            tlSelect.to(select, {
                opacity: 1,
                scale: 1,
                duration: .8,
                stagger: .3,
                ease: "power3.out"
            });

            tlTextarea.to(textarea, {
                opacity: 1,
                scale: 1,
                duration: .8,
                stagger: .3,
                ease: "power3.out"
            });

            tlInfo.to(info, {
                opacity: 1,
                y: 0,
                duration: .8,
                stagger: .3,
                ease: "power3.out"
            });
        }
    },
    arServices: {
        init(){
            Global.pages.hero("#ar-services #servicesHero");
            this.services();
        },
        services(){
            if (!Helper.checkElement("#ar-services .services-section")) return;

            const cards = Helper.elements("#ar-services .services-section .services-card");
            const tlCard = Helper.timeline("#ar-services .services-section .services-card");

            gsap.set(cards, {
                opacity: 0,
                scaleX: 0
            });

            tlCard.to(cards, {
                opacity: 1,
                scaleX: 1,
                duration: .8,
                stagger: .3,
                ease: "none"
            });

            Helper.animateTexts("#ar-services section", "top 80%", "lines", "p,a,h1,h2,h3");
        }
    },
    arProject: {
        init(){
            Global.pages.hero();
            this.projects();
            this.featureCard();
        },
        projects(){
            if (!Helper.checkElement("#ar-project section.container-fluid .wrapper .project-card")) return;

            const cards = Helper.elements("#ar-project section.container-fluid .wrapper .project-card");
            const tlCard = Helper.timeline("#ar-project section.container-fluid .wrapper .project-card");

            gsap.set(cards, {
                opacity: 0,
                scale: 0
            });

            tlCard.to(cards, {
                opacity: 1,
                scale: 1,
                duration: .8,
                stagger: .3,
                ease: "none"
            });

            Helper.animateTexts("#ar-services section", "top 80%", "lines", "p,a,h1,h2,h3");
        },
        featureCard(){
            if (!Helper.checkElement("#ar-project #secondFeatureCard .second-feature-card")) return;

            // const secondFeatureCard = Helper.elements("#secondFeatureCard .second-feature-card", "top 90%");
            // const tl = Helper.timeline(secondFeatureCard);

            // gsap.set(secondFeatureCard, {
            //     opacity: 0,
            //     scale: 0
            // });

            // tl.to(secondFeatureCard, {
            //     opacity: 1,
            //     scale: 1,
            //     duration: 0.8,
            //     ease: "none"
            // });

            Helper.animateTexts(".container:has(#secondFeatureCard)", "top 80%", "lines", "p,a,h1,h2,h3");
        },
    }
};

Animation.init();