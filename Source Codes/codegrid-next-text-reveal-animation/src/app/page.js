"use client";

import "lenis/dist/lenis.css";
import { ReactLenis } from "lenis/react";
import AnimatedHeader from "@/components/AnimatedHeader/AnimatedHeader";

export default function Home() {
  return (
    <>
      <ReactLenis root />

      <section className="one">
        <AnimatedHeader>
          <h1>Lorem ipsum dolor sit</h1>
        </AnimatedHeader>
      </section>

      <section className="two">
        <AnimatedHeader animateOnScroll>
          <h1>Lorem ipsum dolor sit, amet consectetur adipisicing</h1>
        </AnimatedHeader>
      </section>

      <section className="three">
        <AnimatedHeader scrub>
          <h1>Lorem ipsum dolor sit amet</h1>
        </AnimatedHeader>
      </section>
    </>
  );
}
