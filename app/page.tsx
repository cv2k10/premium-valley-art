"use client";
import { useEffect, useRef, useState } from "react";
import { Parallax, ParallaxLayer, type IParallax } from "@react-spring/parallax";
import { Switch } from "@/components/ui/switch";
const chapters = [0, 1.85, 3.12];
const instantConfig = { duration: 0 };
export default function Home() {
  const parallax = useRef<IParallax>(null);
  const [motion, setMotion] = useState(true);
  const experience = useRef<HTMLElement>(null);
  const activeChapter = useRef(-1);
  const progressBar = useRef<HTMLSpanElement>(null);
  // This motion-focused experience starts enabled; visitors can turn it off directly.
  const moving = motion;
  useEffect(() => {
    // React Spring owns this scroll container; window scroll does not fire here.
    const container = parallax.current?.container.current;
    if (!container) return;
    const update = () => {
      const position = container.scrollTop / (container.clientHeight || 1);
      const chapter = position < 1.4 ? 0 : position < 2.7 ? 1 : 2;
      // Updating scroll indicators must not re-render Parallax: its update effect
      // immediately resets every layer position on each parent render.
      if (activeChapter.current !== chapter) {
        activeChapter.current = chapter;
        experience.current?.querySelectorAll<HTMLElement>("[data-chapter]").forEach((element) => {
          const active = Number(element.dataset.chapter) === chapter;
          element.classList.toggle("active", active);
          if (active) element.setAttribute("aria-current", "step");
          else element.removeAttribute("aria-current");
        });
      }
      const progress = container.scrollTop / Math.max(1, container.scrollHeight - container.clientHeight);
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${progress})`;
    };
    update(); container.addEventListener("scroll", update, { passive: true });
    return () => container.removeEventListener("scroll", update);
  }, []);
  const goTo = (offset: number) => {
    const instance = parallax.current;
    if (!instance) return;
    instance.stop();
    // Only the scroll container eases; layers follow its actual position directly.
    instance.container.current?.scrollTo({
      top: offset * instance.space,
      behavior: moving ? "smooth" : "instant",
    });
  };
  return (
    <main ref={experience} className="experience">
      <header className="site-header">
        <button className="wordmark" onClick={() => goTo(0)} aria-label="Lunar Valley, return to the beginning"><span className="brand-symbol" aria-hidden="true">◒</span><span>LUNAR<span className="brand-light">VALLEY</span></span></button>
        <nav aria-label="Main navigation"><button data-chapter={0} className="nav-link active" onClick={() => goTo(0)}>The valley</button><button data-chapter={1} className="nav-link" onClick={() => goTo(1.85)}>The journey</button><button className="header-cta" onClick={() => goTo(3.12)}>Stay a while</button></nav>
      </header>
      <aside className="chapter-nav" aria-label="Scene navigation">{chapters.map((offset, i) => <button key={offset} onClick={() => goTo(offset)} aria-label={`Go to scene ${i + 1}`} data-chapter={i} aria-current={i === 0 ? "step" : undefined}><span className="chapter-number">0{i + 1}</span><span className="chapter-line" /></button>)}</aside>
      {/* The transformed scrolling wrapper must sit above the separate sticky sky stacking context. */}
      <Parallax ref={parallax} pages={4.15} innerStyle={{ zIndex: 1 }} className="parallax" aria-label="Moonlit valley, scroll to explore" tabIndex={0} config={instantConfig}>
        <ParallaxLayer sticky={{ start: 0, end: 4.15 }} className="sky-layer" aria-hidden="true"><div className="sky" /><div className="sky-glow" /></ParallaxLayer>
        <ParallaxLayer offset={0} speed={moving ? -0.92 : 0} factor={2.8} key={`moon-layer-${moving}`} className="art-layer moon-layer" aria-hidden="true"><img src="/images/moon.png" className="moon" alt="" draggable={false} fetchPriority="high" /></ParallaxLayer>
        <ParallaxLayer offset={0} speed={moving ? -0.45 : 0} factor={2.8} key={`far-cloud-layer-${moving}`} className="art-layer far-cloud-layer" aria-hidden="true"><img src="/images/clouds.png" className="clouds clouds-far" alt="" draggable={false} /></ParallaxLayer>
        <ParallaxLayer offset={0} speed={moving ? -0.68 : 0} factor={2.8} key={`ground-layer-${moving}`} className="art-layer ground-layer" aria-hidden="true"><img src="/images/valley.png" className="ground" alt="" draggable={false} fetchPriority="high" /></ParallaxLayer>
        <ParallaxLayer offset={0} speed={moving ? 0.4 : 0} key={`near-cloud-layer-${moving}`} className="art-layer near-cloud-layer" aria-hidden="true"><img src="/images/clouds.png" className="clouds clouds-near" alt="" draggable={false} /></ParallaxLayer>
        <ParallaxLayer offset={0} speed={moving ? 0.36 : 0} key={`hero-${moving}`} className="copy-layer"><section className="hero" aria-labelledby="hero-title"><div className="hero-copy"><p className="eyebrow">BEYOND THE EVERYDAY</p><h1 id="hero-title">Find your<br /><span>quiet wonder.</span></h1><p className="hero-description">A world beneath the moon.<br />A moment entirely your own.</p><button className="explore-button" onClick={() => goTo(1.85)}>Explore the valley</button></div><div className="hero-bottom"><span>A JOURNEY INTO STILLNESS</span><button className="scroll-cue" onClick={() => goTo(1.85)}><span className="scroll-track" aria-hidden="true"><i /></span>Scroll to discover</button><span className="hero-index">01 / 03</span></div></section></ParallaxLayer>
        <ParallaxLayer offset={1.6} speed={0} factor={2.55} className="depth-layer" aria-hidden="true"><div className="depth" /></ParallaxLayer>
        <ParallaxLayer offset={1.65} speed={moving ? -0.12 : 0} factor={1.65} key={`journey-art-${moving}`} className="art-layer journey-art-layer" aria-hidden="true"><div className="journey-art"><img src="/images/journey-path.png" className="journey-background" alt="" draggable={false} loading="lazy" /></div></ParallaxLayer>
        <ParallaxLayer offset={1.85} speed={0} className="copy-layer"><section className="journey" aria-labelledby="journey-title"><div className="section-marker"><span>02</span><span>THE DESCENT</span></div><div className="journey-copy"><p className="eyebrow">LET THE WORLD FALL AWAY</p><h2 id="journey-title">A little further.<br /><em>A little quieter.</em></h2><p>Between towering stone and open sky, the noise softens. Follow the light into the heart of the valley. There is nothing to hurry towards.</p><button className="text-button" onClick={() => goTo(3.12)}>Keep wandering <span className="small-star" aria-hidden="true">✦</span></button></div><div className="journey-note"><span className="fine-line" /><p>Above, a silver sky.<br />Below, a world still dreaming.</p></div></section></ParallaxLayer>
        <ParallaxLayer offset={2.85} speed={moving ? 0.3 : 0} factor={1.3} key={`ending-cloud-layer-${moving}`} className="art-layer ending-cloud-layer" aria-hidden="true"><img src="/images/clouds.png" className="clouds clouds-ending" alt="" draggable={false} /></ParallaxLayer>
        <ParallaxLayer offset={3.12} speed={0} className="copy-layer"><section className="ending" aria-labelledby="ending-title"><p className="eyebrow">YOU HAVE ARRIVED</p><h2 id="ending-title">Stay.<br /><em>Just a little longer.</em></h2><p>Some places ask for nothing.<br />Only that you take a breath, and look up.</p><button className="explore-button outline" onClick={() => goTo(0)}>Return to the moon</button><footer><span>LUNAR VALLEY</span><span>A moment of wonder.</span></footer></section></ParallaxLayer>
      </Parallax>
      <div className="motion-control"><label htmlFor="motion-switch">Motion</label><Switch id="motion-switch" size="sm" checked={moving} onCheckedChange={setMotion} aria-label="Enable parallax motion" /></div>
      <div className="page-progress" aria-hidden="true"><span ref={progressBar} style={{ transform: "scaleX(0)" }} /></div>
    </main>
  );
}
