import { useState, useEffect, useRef } from 'react';

// Auto-scrolling banner rail with manual swipe + dots indicator
export default function BannerCarousel({ banners, renderBanner, autoScrollMs = 5000, pauseAfterTouchMs = 8000 }) {
  const railRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const lastUserActionRef = useRef(0);
  const programmaticScrollRef = useRef(false);

  // Auto-advance every N seconds, pauses after manual touch
  useEffect(() => {
    if (!banners?.length) return;
    const interval = setInterval(() => {
      if (Date.now() - lastUserActionRef.current < pauseAfterTouchMs) return;
      setActiveIdx((idx) => (idx + 1) % banners.length);
    }, autoScrollMs);
    return () => clearInterval(interval);
  }, [banners?.length, autoScrollMs, pauseAfterTouchMs]);

  // Sync DOM scroll position when activeIdx changes (auto-advance)
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !rail.children[activeIdx]) return;
    // Skip if user is currently touching/scrolling (avoid fighting them)
    if (Date.now() - lastUserActionRef.current < 800) return;

    programmaticScrollRef.current = true;
    const target = rail.children[activeIdx];
    rail.scrollTo({
      left: target.offsetLeft - rail.offsetLeft,
      behavior: 'smooth',
    });
    setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 600);
  }, [activeIdx]);

  // Track manual scroll to update active dot
  const handleScroll = () => {
    if (programmaticScrollRef.current) return;
    lastUserActionRef.current = Date.now();
    const rail = railRef.current;
    if (!rail || !rail.children[0]) return;
    const childWidth = rail.children[0].offsetWidth + 10; // banner + gap
    const idx = Math.round(rail.scrollLeft / childWidth);
    setActiveIdx(Math.min(Math.max(idx, 0), banners.length - 1));
  };

  const markTouch = () => {
    lastUserActionRef.current = Date.now();
  };

  return (
    <>
      <div
        ref={railRef}
        className="banner-rail"
        onScroll={handleScroll}
        onTouchStart={markTouch}
        onPointerDown={markTouch}
      >
        {banners.map(renderBanner)}
      </div>
      <div className="banner-dots">
        {banners.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === activeIdx ? 'active' : ''}`}
            onClick={() => {
              lastUserActionRef.current = Date.now();
              setActiveIdx(idx);
            }}
            aria-label={`Go to banner ${idx + 1}`}
          />
        ))}
      </div>
    </>
  );
}
