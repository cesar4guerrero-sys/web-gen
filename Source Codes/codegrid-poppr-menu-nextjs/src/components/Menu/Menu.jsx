"use client";
import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import "./Menu.css";

gsap.registerPlugin(SplitText);

const primaryLinks = [
  { label: "work", path: "/work" },
  { label: "services", path: "/services" },
  { label: "about", path: "/about" },
  { label: "insights", path: "/insights" },
  { label: "careers", path: "/careers" },
  { label: "contact", path: "/contact" },
];

export default function Menu() {
  const containerRef = useRef(null);
  const navToggleMenuRef = useRef(null);
  const navToggleCloseRef = useRef(null);
  const menuRef = useRef(null);
  const menuBgRef = useRef(null);
  const menuBgSvgRef = useRef(null);
  const menuLogoRef = useRef(null);
  const menuLinksRef = useRef([]);
  const menuInfoItemsRef = useRef([]);

  const isOpenRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const splitsRef = useRef([]);
  const svgPathStates = useRef({});

  useGSAP(
    () => {
      const menuBgSvg = menuBgSvgRef.current;
      const menuBg = menuBgRef.current;

      const svgWidth = menuBgSvg.viewBox.baseVal.width;
      const svgHeight = menuBgSvg.viewBox.baseVal.height;
      const svgCenterX = svgWidth / 2;

      svgPathStates.current = {
        OPEN_HIDDEN: `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,0 L${svgWidth},0 Z`,
        OPEN_BULGE: `M${svgWidth},345 Q${svgCenterX},620 0,345 L0,0 L${svgWidth},0 Z`,
        OPEN_FULL: `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,0 L${svgWidth},0 Z`,
        CLOSE_START: `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,${svgHeight} L${svgWidth},${svgHeight} Z`,
        CLOSE_BULGE: `M${svgWidth},350 Q${svgCenterX},130 0,350 L0,${svgHeight} L${svgWidth},${svgHeight} Z`,
        CLOSE_HIDDEN: `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,${svgHeight} L${svgWidth},${svgHeight} Z`,
      };

      gsap.set(menuBg, { attr: { d: svgPathStates.current.OPEN_HIDDEN } });

      splitsRef.current = [];
      menuLinksRef.current.forEach((link) => {
        const split = new SplitText(link, {
          type: "chars",
          charsClass: "char",
        });
        splitsRef.current.push(split);
        gsap.set(split.chars, { opacity: 0, x: "750%" });
      });

      gsap.set(menuInfoItemsRef.current, { opacity: 0, y: 100 });
    },
    { scope: containerRef },
  );

  const openMenu = () => {
    const { OPEN_BULGE, OPEN_FULL } = svgPathStates.current;

    menuRef.current.classList.add("is-open");

    gsap.to(navToggleMenuRef.current, {
      duration: 0.25,
      opacity: 0,
      ease: "none",
    });
    gsap.to(navToggleCloseRef.current, {
      duration: 0.25,
      opacity: 1,
      ease: "none",
      delay: 0.25,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    tl.to(menuBgRef.current, {
      duration: 0.5,
      attr: { d: OPEN_BULGE },
      ease: "power4.in",
    }).to(menuBgRef.current, {
      duration: 0.5,
      attr: { d: OPEN_FULL },
      ease: "power4.out",
    });

    tl.to(
      menuLogoRef.current,
      { duration: 0.1, opacity: 1, ease: "none" },
      "-=0.75",
    );

    tl.to(
      menuInfoItemsRef.current,
      {
        duration: 0.75,
        opacity: 1,
        y: 0,
        ease: "power3.out",
        stagger: 0.075,
      },
      "-=0.35",
    );

    const menuLinksChars = splitsRef.current.flatMap((s) => s.chars);

    tl.to(
      menuLinksChars,
      {
        duration: 1.5,
        x: "0%",
        ease: "elastic.out(1, 0.25)",
        stagger: 0.01,
      },
      0.45,
    );

    tl.to(
      menuLinksChars,
      {
        duration: 0.75,
        opacity: 1,
        ease: "power2.out",
        stagger: 0.01,
      },
      0.45,
    );
  };

  const closeMenu = () => {
    const { OPEN_HIDDEN, CLOSE_START, CLOSE_BULGE, CLOSE_HIDDEN } =
      svgPathStates.current;

    gsap.set(menuBgRef.current, { attr: { d: CLOSE_START } });

    gsap.to(navToggleCloseRef.current, {
      duration: 0.3,
      opacity: 0,
      ease: "none",
    });
    gsap.to(navToggleMenuRef.current, {
      duration: 0.3,
      opacity: 1,
      ease: "none",
      delay: 0.25,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        menuRef.current.classList.remove("is-open");
        gsap.set(menuBgRef.current, { attr: { d: OPEN_HIDDEN } });
        splitsRef.current.forEach((split) => {
          gsap.set(split.chars, { opacity: 0, x: "750%" });
        });
        menuLinksRef.current.forEach((link) => gsap.set(link, { opacity: 1 }));
        gsap.set(menuInfoItemsRef.current, { opacity: 0, y: 100 });
        isAnimatingRef.current = false;
      },
    });

    tl.to(menuLogoRef.current, { duration: 0.3, opacity: 0 })
      .to(menuLinksRef.current, { duration: 0.3, opacity: 0 }, "<")
      .to(menuInfoItemsRef.current, { duration: 0.3, opacity: 0 }, "<");

    tl.to(
      menuBgRef.current,
      {
        duration: 0.5,
        attr: { d: CLOSE_BULGE },
        ease: "power3.in",
      },
      "<",
    ).to(menuBgRef.current, {
      duration: 0.5,
      attr: { d: CLOSE_HIDDEN },
      ease: "power3.out",
    });
  };

  const handleToggle = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    isOpenRef.current = !isOpenRef.current;
    isOpenRef.current ? openMenu() : closeMenu();
  };

  const setInfoRef = (index) => (el) => {
    if (el) menuInfoItemsRef.current[index] = el;
  };

  const setLinkRef = (index) => (el) => {
    if (el) menuLinksRef.current[index] = el;
  };

  return (
    <div className="nav" ref={containerRef}>
      <div className="nav-logo">
        <Link href="/">
          <img src="/nav-logo.svg" alt="" />
        </Link>
      </div>

      <div className="nav-toggle" onClick={handleToggle}>
        <p className="nav-toggle-menu" ref={navToggleMenuRef}>
          Menu
        </p>
        <p className="nav-toggle-close" ref={navToggleCloseRef}>
          Close
        </p>
      </div>

      <div className="menu" ref={menuRef}>
        <svg
          className="menu-bg-svg"
          ref={menuBgSvgRef}
          viewBox="0 0 1131 861"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id="menu-path"
            ref={menuBgRef}
            fill="#f0eeee"
            d="M1131,0 Q565.5,0 0,0 L0,0 L1131,0 Z"
          />
        </svg>

        <div className="menu-logo" ref={menuLogoRef}>
          <Link href="/">
            <img src="/menu-logo.svg" alt="" />
          </Link>
        </div>

        <div className="menu-col menu-col-info">
          <p ref={setInfoRef(0)}>Get in touch</p>
          <h3 ref={setInfoRef(1)}>studio@clikd.co</h3>
          <h3 ref={setInfoRef(2)}>+1 (437) 982 4412</h3>
          <br />
          <h6 ref={setInfoRef(3)}>42 Mercer Street</h6>
          <h6 ref={setInfoRef(4)}>Toronto, ON M5V</h6>
        </div>

        <div className="menu-col menu-col-links">
          {primaryLinks.map(({ label, path }, i) => (
            <Link key={label} href={path} ref={setLinkRef(i)}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
