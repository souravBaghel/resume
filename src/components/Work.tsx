import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      function getTranslateX() {
        const boxes = section!.querySelectorAll<HTMLElement>(".work-box");
        const container = section!.querySelector<HTMLElement>(".work-container");
        if (!boxes.length || !container) return 0;

        const rectLeft = container.getBoundingClientRect().left;
        const rect = boxes[0].getBoundingClientRect();
        const parentWidth =
          boxes[0].parentElement!.getBoundingClientRect().width;
        const padding = parseInt(window.getComputedStyle(boxes[0]).padding) / 2;

        return Math.max(
          0,
          rect.width * boxes.length - (rectLeft + parentWidth) + padding
        );
      }

      const media = gsap.matchMedia();

      media.add("(min-width: 1026px)", () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getTranslateX()}`,
            scrub: true,
            pin: section,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            id: "work",
          },
        });

        timeline.to(".work-flex", {
          x: () => -getTranslateX(),
          ease: "none",
        });

        return () => timeline.kill();
      });

      return () => {
        media.revert();
        ScrollTrigger.getById("work")?.kill();
      };
    },
    { scope: sectionRef }
  );
  return (
    <div className="work-section" id="work" ref={sectionRef}>
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {[...Array(6)].map((_value, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>Project Name</h4>
                    <p>Category</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>Javascript, TypeScript, React, Threejs</p>
              </div>
              <WorkImage image="/images/placeholder.webp" alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
