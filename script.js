document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis();
  gsap.registerPlugin(ScrollTrigger);
  lenis.on("Scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const cards = gsap.utils.toArray(".card");
  const rotations = [-12, 10, -5, 5, -5, -2];

  cards.forEach((card, index) => {
    gsap.set(card, {
      y: window.innerHeight,
      rotate: rotations[index],
    });
  });

  ScrollTrigger.create({
    trigger: ".sticky-cards",
    start: "top top",
    end: `+=${window.innerHeight * 8}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const totalCards = cards.length;
      const progressPerCard = 1 / totalCards;

      cards.forEach((card, index) => {
        const cardStart = index * progressPerCard;
        let cardProgress = (progress - cardStart) / progressPerCard;
        cardProgress = Math.min(Math.max(cardProgress, 0), 1);

        let yPos = window.innerHeight * (1 - cardProgress);
        let xPos = 0;

        if (cardProgress === 1 && index < totalCards - 1) {
          const remeainingProgress =
            (progress - (cardStart + progressPerCard)) /
            (1 - (cardStart + progressPerCard));

          if (remeainingProgress > 0) {
            const distanceMultiplier = 1 - index * 0.15;
            xPos =
              -window.innerWidth *
              0.3 *
              distanceMultiplier *
              remeainingProgress;
            yPos =
              -window.innerHeight *
              0.3 *
              distanceMultiplier *
              remeainingProgress;
          }
        }

        gsap.to(card, {
          y: yPos,
          x: xPos,
          duration: 0,
          ease: "none",
        });
      });
    },
  });
});
