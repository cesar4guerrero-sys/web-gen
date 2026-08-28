"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const SLIDE_WIDTH = 200;
const SLIDE_HEIGHT = 275;
const SLIDE_GAP = 100;
const SLIDE_COUNT = 9;
const ARC_DEPTH = 200;
const CENTER_LIFT = 100;
const SCROLL_LERP = 0.05;

const slideSources = Array.from(
  { length: SLIDE_COUNT },
  (_, i) => `/img${i + 1}.jpg`,
);

const slideTitles = [
  "Profile Study",
  "Pump Noir",
  "Compact Disc",
  "Iris Frame",
  "Open Compact",
  "Shelf Set",
  "Hand Held",
  "Clear Stack",
  "Foam Pump",
];

export default function Slider() {
  const sliderRef = useRef(null);
  const titleRef = useRef(null);
  const slidesRef = useRef([]);

  useEffect(() => {
    const sliderContainer = sliderRef.current;
    const titleDisplay = titleRef.current;
    const slideElements = slidesRef.current;

    if (!sliderContainer || !titleDisplay) return;

    const trackWidth = SLIDE_COUNT * SLIDE_GAP;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowCenterX = windowWidth / 2;
    let arcBaselineY = windowHeight * 0.4;

    function computeSlideTransform(slideIndex, scrollOffset) {
      let wrappedOffsetX =
        (((slideIndex * SLIDE_GAP - scrollOffset) % trackWidth) + trackWidth) %
        trackWidth;
      if (wrappedOffsetX > trackWidth / 2) wrappedOffsetX -= trackWidth;

      const slideCenterX = windowCenterX + wrappedOffsetX;
      const normalizedDist =
        (slideCenterX - windowCenterX) / (windowWidth * 0.5);
      const absDist = Math.min(Math.abs(normalizedDist), 1.3);

      const scaleFactor = Math.max(1 - absDist * 0.8, 0.25);
      const scaledWidth = SLIDE_WIDTH * scaleFactor;
      const scaledHeight = SLIDE_HEIGHT * scaleFactor;

      const clampedDist = Math.min(absDist, 1);
      const arcDropY = (1 - Math.cos(clampedDist * Math.PI)) * 0.5 * ARC_DEPTH;

      const centerLiftY = Math.max(1 - absDist * 2, 0) * CENTER_LIFT;

      return {
        x: slideCenterX - scaledWidth / 2,
        y: arcBaselineY - scaledHeight / 2 + arcDropY - centerLiftY,
        width: scaledWidth,
        height: scaledHeight,
        zIndex: Math.round((1 - absDist) * 100),
        distanceFromCenter: Math.abs(wrappedOffsetX),
      };
    }

    function layoutSlides(scrollOffset) {
      slideElements.forEach((slideEl, i) => {
        if (!slideEl) return;
        const { x, y, width, height, zIndex } = computeSlideTransform(
          i,
          scrollOffset,
        );
        gsap.set(slideEl, { x, y, width, height, zIndex });
      });
    }

    layoutSlides(0);

    let scrollTarget = 0;
    let scrollCurrent = 0;

    const onWheel = (e) => {
      e.preventDefault();
      scrollTarget += e.deltaY * 0.5;
    };

    let touchStartX = 0;

    const onTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      const touchCurrentX = e.touches[0].clientX;
      scrollTarget += (touchStartX - touchCurrentX) * 1.2;
      touchStartX = touchCurrentX;
    };

    sliderContainer.addEventListener("wheel", onWheel, { passive: false });
    sliderContainer.addEventListener("touchstart", onTouchStart);
    sliderContainer.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });

    let activeSlideIndex = -1;

    function syncActiveTitle(scrollOffset) {
      let closestIndex = 0;
      let closestDist = Infinity;

      slideElements.forEach((_, i) => {
        const { distanceFromCenter } = computeSlideTransform(i, scrollOffset);
        if (distanceFromCenter < closestDist) {
          closestDist = distanceFromCenter;
          closestIndex = i;
        }
      });

      if (closestIndex !== activeSlideIndex) {
        activeSlideIndex = closestIndex;
        titleDisplay.textContent = slideTitles[closestIndex];
      }
    }

    let rafId;

    function animate() {
      scrollCurrent += (scrollTarget - scrollCurrent) * SCROLL_LERP;

      layoutSlides(scrollCurrent);
      syncActiveTitle(scrollCurrent);

      rafId = requestAnimationFrame(animate);
    }

    animate();

    const onResize = () => {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      windowCenterX = windowWidth / 2;
      arcBaselineY = windowHeight * 0.4;
    };

    window.addEventListener("resize", onResize);

    return () => {
      sliderContainer.removeEventListener("wheel", onWheel);
      sliderContainer.removeEventListener("touchstart", onTouchStart);
      sliderContainer.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="slider" ref={sliderRef}>
      {slideSources.map((src, i) => (
        <div
          key={i}
          className="slide"
          ref={(el) => (slidesRef.current[i] = el)}
        >
          <img src={src} alt={slideTitles[i]} />
        </div>
      ))}
      <p id="slide-title" ref={titleRef}>
        {slideTitles[0]}
      </p>
    </section>
  );
}
