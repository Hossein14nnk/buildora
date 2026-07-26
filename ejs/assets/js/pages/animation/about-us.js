function init(){
    gsap.registerPlugin(ScrollTrigger);

    // gsap.to(".hero", {
    //     scrollTrigger: ".hero", // start animation when ".box" enters the viewport
    //     x: 500,
    // });
    
    // gsap.to(".about", {
    //     scrollTrigger: ".about", // start animation when ".box" enters the viewport
    //     x: 500,
    // });

    // gsap.to(".journey", {
    //     scrollTrigger: ".journey", // start animation when ".box" enters the viewport
    //     x: 500,
    // });

    let journey = gsap.timeline({
        // yes, we can add it to an entire timeline!
        scrollTrigger: {
            trigger: ".journey",
            // pin: true, // pin the trigger element while active
            start: "top bottom", // when the top of the trigger hits the top of the viewport
            end: "-=100", // end after scrolling 500px beyond the start
            scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
            snap: {
                snapTo: "labels", // snap to the closest label in the timeline
                duration: { min: 0.2, max: 3 }, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
                delay: 0.2, // wait 0.2 seconds from the last scroll event before doing the snapping
                ease: "power1.inOut", // the ease of the snap animation ("power3" by default)
            },
        },
    });

    // add animations and labels to the timeline
    journey.addLabel("start").from(".left-box h2", { scale: 0.3, rotation: 45, autoAlpha: 0 })
        .addLabel("test1").from(".left-box spin", {  })
        .addLabel("spin").to(".left-box", { rotation: 360 })
        .addLabel("end");
}

export function aboutUsAnimation(){
    init();
}