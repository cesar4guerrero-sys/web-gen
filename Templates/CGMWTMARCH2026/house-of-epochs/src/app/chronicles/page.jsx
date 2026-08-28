"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { SplitText } from "gsap/SplitText";

import "./chronicles.css";

gsap.registerPlugin(Observer, SplitText);

const chronicles = [
  {
    subtitle: "The Fallen",
    title: "Arches of Vorn",
    image: "/images/img1.jpg",
    tags: ["Erosion", "Sandstone", "Ceremonial"],
    location: "Vorn Plateau, Eastern Reach",
    year: "c. 3100 BP",
  },
  {
    subtitle: "The Silent",
    title: "Monolith of Drenn",
    image: "/images/img2.jpg",
    tags: ["Megalithic", "Uncarved", "Solitary"],
    location: "Drenn Basin, Lower Steppes",
    year: "c. 4700 BP",
  },
  {
    subtitle: "The Suspended",
    title: "Orbs of Thessyn",
    image: "/images/img3.jpg",
    tags: ["Levitation", "Unknown Alloy", "Atmospheric"],
    location: "Thessyn Expanse, Central Veil",
    year: "c. 6200 BP",
  },
  {
    subtitle: "The Tethered Moon",
    title: "Fields of Aruun",
    image: "/images/img4.jpg",
    tags: ["Ring Structures", "Volcanic Stone", "Aligned"],
    location: "Aruun Valley, Northern Ridge",
    year: "c. 5400 BP",
  },
  {
    subtitle: "The Flooded",
    title: "Passage of Kael",
    image: "/images/img5.jpg",
    tags: ["Aqueduct", "Limestone", "Still Active"],
    location: "Kael Corridor, Western Channel",
    year: "c. 3800 BP",
  },
  {
    subtitle: "The Sunken",
    title: "Bridge of Othaan",
    image: "/images/img6.jpg",
    tags: ["Structural", "Canyon Span", "Collapsed"],
    location: "Othaan Gorge, Southern Rift",
    year: "c. 2900 BP",
  },
  {
    subtitle: "The Luminous",
    title: "Beacons of Solenne",
    image: "/images/img7.jpg",
    tags: ["Thermal", "Hovering Mass", "Uncharted"],
    location: "Solenne Flats, Upper Haze",
    year: "c. 7100 BP",
  },
  {
    subtitle: "The Hollow",
    title: "Rings of Pael",
    image: "/images/img8.jpg",
    tags: ["Torus Form", "Overgrown", "Resonant"],
    location: "Pael Steppe, Far Western Edge",
    year: "c. 4100 BP",
  },
  {
    subtitle: "The Severed",
    title: "Isles of Rhovaan",
    image: "/images/img9.jpg",
    tags: ["Floating Terrain", "Geothermal", "Unstable"],
    location: "Rhovaan Shelf, Volcanic South",
    year: "c. 5800 BP",
  },
  {
    subtitle: "The Carved",
    title: "Throat of Ishk",
    image: "/images/img10.jpg",
    tags: ["Subterranean", "Light Shaft", "Processional"],
    location: "Ishk Canyon, Deep Interior",
    year: "c. 4400 BP",
  },
];

function preloadImages(sources) {
  return Promise.all(
    sources.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        }),
    ),
  );
}

function ChroniclesTitleLink({ href, title }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      className={`chronicles-title-link${hovered ? " chronicles-title-link-hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h1>{title}</h1>
      <span className="chronicles-title-underline" />
    </Link>
  );
}

export default function ChroniclesPage() {
  const chroniclesPageRef = useRef(null);
  const chroniclesSlidesRef = useRef(null);
  const chroniclesCurrentRef = useRef(0);
  const chroniclesAnimatingRef = useRef(false);
  const chroniclesObserverRef = useRef(null);
  const chroniclesTimelineRef = useRef(null);
  const chroniclesSplitsRef = useRef([]);
  const chroniclesActiveFlickerSplits = useRef([]);

  useEffect(() => {
    const chroniclesSlidesEl = chroniclesSlidesRef.current;
    if (!chroniclesSlidesEl) return;

    const chroniclesSlides = [
      ...chroniclesSlidesEl.querySelectorAll(".chronicles-slide"),
    ];
    const chroniclesDecos = [
      ...chroniclesSlidesEl.querySelectorAll(".chronicles-deco"),
    ];
    const chroniclesTotal = chroniclesSlides.length;

    chroniclesSplitsRef.current = chroniclesSlides.map((slide) => {
      const chroniclesH1s = slide.querySelectorAll(
        ".chronicles-slide-title-block h1",
      );
      const chroniclesSplitInstances = [...chroniclesH1s].map((h1) =>
        SplitText.create(h1, {
          type: "words",
          wordsClass: "chronicles-word",
        }),
      );
      return chroniclesSplitInstances;
    });

    function chroniclesGetAllWords(slideIndex) {
      return chroniclesSplitsRef.current[slideIndex].flatMap(
        (split) => split.words,
      );
    }

    function chroniclesGetSlideExtras(slide) {
      const year = slide.querySelector(".chronicles-slide-year");
      const location = slide.querySelector(".chronicles-slide-footer > .mono");
      const counter = slide.querySelector(".chronicles-slide-counter");
      const tags = [...slide.querySelectorAll(".chronicles-slide-tag")];

      return {
        flickerTargets: [year, location, counter].filter(Boolean),
        tags,
      };
    }

    function chroniclesRevertActiveFlicker() {
      chroniclesActiveFlickerSplits.current.forEach((split) => split.revert());
      chroniclesActiveFlickerSplits.current = [];
    }

    function chroniclesAnimateSlideExtras(slide, tl, startLabel) {
      chroniclesRevertActiveFlicker();

      const { flickerTargets, tags } = chroniclesGetSlideExtras(slide);

      const flickerSplits = flickerTargets.map((el) =>
        SplitText.create(el, {
          type: "chars",
          charsClass: "chronicles-flicker-char",
        }),
      );

      chroniclesActiveFlickerSplits.current = flickerSplits;

      const allFlickerChars = flickerSplits.flatMap((split) => split.chars);

      gsap.set(allFlickerChars, { opacity: 0 });
      gsap.set(tags, { y: 50, opacity: 0 });

      tl.to(
        allFlickerChars,
        {
          duration: 0.05,
          opacity: 1,
          ease: "power2.inOut",
          stagger: {
            amount: 0.5,
            each: 0.1,
            from: "random",
          },
        },
        startLabel,
      ).to(
        tags,
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
        },
        `${startLabel}+=0.2`,
      );
    }

    function chroniclesResetAllSlides() {
      chroniclesSlides.forEach((slide, i) => {
        const chroniclesIsCurrent = i === chroniclesCurrentRef.current;
        gsap.set(slide, {
          scale: 1,
          rotation: 0,
          opacity: chroniclesIsCurrent ? 1 : 0,
          visibility: chroniclesIsCurrent ? "visible" : "hidden",
        });
        slide.classList.toggle("chronicles-slide-current", chroniclesIsCurrent);

        const chroniclesWords = chroniclesGetAllWords(i);
        gsap.set(chroniclesWords, {
          opacity: chroniclesIsCurrent ? 1 : 0,
          rotationX: chroniclesIsCurrent ? 0 : -90,
          transformOrigin: "50% 50% -50px",
        });
      });
      gsap.set(chroniclesDecos, { autoAlpha: 0, yPercent: 0 });
    }

    function chroniclesInit() {
      chroniclesResetAllSlides();

      const firstSlide = chroniclesSlides[0];
      const firstWords = chroniclesGetAllWords(0);

      gsap.set(firstWords, {
        opacity: 0,
        rotationX: -90,
        transformOrigin: "50% 50% -50px",
      });

      const introTl = gsap.timeline({ delay: 0.5 });

      introTl.to(firstWords, {
        rotationX: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
        stagger: {
          each: 0.035,
          from: "random",
        },
      });

      chroniclesAnimateSlideExtras(firstSlide, introTl, 0.5);

      introTl.add(() => {
        chroniclesRevertActiveFlicker();
      });

      function chroniclesNavigate(direction) {
        if (chroniclesAnimatingRef.current) return;
        chroniclesAnimatingRef.current = true;

        if (chroniclesTimelineRef.current) {
          chroniclesTimelineRef.current.kill();
          chroniclesTimelineRef.current = null;
        }

        const previous = chroniclesCurrentRef.current;
        chroniclesCurrentRef.current =
          direction === 1
            ? chroniclesCurrentRef.current < chroniclesTotal - 1
              ? chroniclesCurrentRef.current + 1
              : 0
            : chroniclesCurrentRef.current > 0
              ? chroniclesCurrentRef.current - 1
              : chroniclesTotal - 1;

        const currentSlide = chroniclesSlides[previous];
        const upcomingSlide = chroniclesSlides[chroniclesCurrentRef.current];
        const chroniclesUpcomingWords = chroniclesGetAllWords(
          chroniclesCurrentRef.current,
        );

        gsap.set(upcomingSlide, {
          opacity: 0,
          scale: 1,
          rotation: 0,
          visibility: "visible",
        });
        gsap.set(chroniclesUpcomingWords, {
          opacity: 0,
          rotationX: -90,
          transformOrigin: "50% 50% -50px",
        });

        const chroniclesTl = gsap.timeline({
          defaults: {
            duration: 0.8,
            ease: "power3.inOut",
          },
          onComplete: () => {
            chroniclesRevertActiveFlicker();
            chroniclesResetAllSlides();
            chroniclesTimelineRef.current = null;
            chroniclesAnimatingRef.current = false;
          },
        });

        chroniclesTimelineRef.current = chroniclesTl;

        chroniclesTl
          .addLabel("start", 0)
          .fromTo(
            chroniclesDecos,
            {
              yPercent: (pos) => (pos ? -100 : 100),
              autoAlpha: 1,
            },
            {
              yPercent: (pos) => (pos ? -50 : 50),
            },
            "start",
          )
          .to(
            currentSlide,
            {
              scale: 1.35,
              rotation: direction * 5,
            },
            "start",
          )
          .addLabel("middle", ">")
          .add(() => {
            currentSlide.classList.remove("chronicles-slide-current");
            gsap.set(currentSlide, { opacity: 0, visibility: "hidden" });
            upcomingSlide.classList.add("chronicles-slide-current");
            gsap.set(upcomingSlide, { opacity: 1, visibility: "visible" });
          }, "middle")
          .to(
            chroniclesDecos,
            {
              duration: 1.1,
              ease: "expo",
              yPercent: (pos) => (pos ? -100 : 100),
            },
            "middle",
          )
          .fromTo(
            upcomingSlide,
            {
              scale: 1.35,
              rotation: direction * 5,
            },
            {
              duration: 1.1,
              ease: "expo",
              scale: 1,
              rotation: 0,
            },
            "middle",
          )
          .to(
            chroniclesUpcomingWords,
            {
              rotationX: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power3.out",
              stagger: {
                each: 0.035,
                from: "random",
              },
            },
            "middle+=0.15",
          );

        chroniclesAnimateSlideExtras(
          upcomingSlide,
          chroniclesTl,
          "middle+=0.5",
        );
      }

      chroniclesObserverRef.current = Observer.create({
        type: "wheel,touch",
        onDown: () => chroniclesNavigate(-1),
        onUp: () => chroniclesNavigate(1),
        wheelSpeed: -1,
        tolerance: 10,
      });
    }

    preloadImages(chronicles.map((c) => c.image)).then(chroniclesInit);

    return () => {
      if (chroniclesTimelineRef.current) chroniclesTimelineRef.current.kill();
      if (chroniclesObserverRef.current) chroniclesObserverRef.current.kill();
      chroniclesSplitsRef.current.forEach((slideSplits) =>
        slideSplits.forEach((split) => split.revert()),
      );
      chroniclesRevertActiveFlicker();
    };
  }, []);

  const chroniclesTotal = String(chronicles.length).padStart(2, "0");

  return (
    <div className="chronicles-page" ref={chroniclesPageRef}>
      <div className="chronicles-slides" ref={chroniclesSlidesRef}>
        {chronicles.map((item, i) => (
          <div className="chronicles-slide" key={i}>
            <div
              className="chronicles-slide-img"
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className="chronicles-slide-content">
              <p className="mono chronicles-slide-year">{item.year}</p>
              <div className="chronicles-slide-title-block">
                <h1 className="subheader">{item.subtitle}</h1>
                <ChroniclesTitleLink href="/report" title={item.title} />
              </div>
              <div className="chronicles-slide-footer">
                <p className="mono sm">{item.location}</p>
                <div className="chronicles-slide-tags">
                  {item.tags.map((tag, j) => (
                    <span className="chronicles-slide-tag" key={j}>
                      <p className="mono sm">{tag}</p>
                    </span>
                  ))}
                </div>
                <p className="mono sm chronicles-slide-counter">
                  CHR {String(i + 1).padStart(2, "0")} / {chroniclesTotal}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="chronicles-deco"></div>
        <div className="chronicles-deco"></div>
      </div>
    </div>
  );
}
