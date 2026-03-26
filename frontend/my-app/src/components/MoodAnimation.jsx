import React, { useEffect, useRef } from "react";
import "./MoodAnimation.css";

const MoodAnimation = ({ mood = "neutral" }) => {
  const svgRef = useRef(null);
  const animRef = useRef(null);
  const particleRef = useRef(null);
  const elementsRef = useRef({});
  const tRef = useRef(0);

  const moods = {
    neutral: {
      headColor: "#F7C948",
      bodyColor: "#E8834A",
      hairColor: "#5C3A1E",
      mouth: "M88 96 Q100 96 112 96",
      bounce: 0,
      particles: null,
    },
    happy: {
      headColor: "#F7C948",
      bodyColor: "#E8834A",
      hairColor: "#5C3A1E",
      mouth: "M84 94 Q100 108 116 94",
      bounce: 8,
      particles: "stars",
    },
    sad: {
      headColor: "#A8C8E8",
      bodyColor: "#7B9BB8",
      hairColor: "#5C3A1E",
      mouth: "M84 102 Q100 92 116 102",
      bounce: 0,
      particles: null,
    },
    excited: {
      headColor: "#FF9F40",
      bodyColor: "#E84A7B",
      hairColor: "#5C3A1E",
      mouth: "M82 92 Q100 112 118 92",
      bounce: 14,
      particles: "confetti",
    },
    angry: {
      headColor: "#E85050",
      bodyColor: "#C03030",
      hairColor: "#3A1010",
      mouth: "M84 100 Q100 96 116 100",
      bounce: 0,
      particles: null,
    },
  };

  // Cache elements once
  useEffect(() => {
    if (!svgRef.current) return;

    const ids = [
      "mouthLine",
      "head",
      "body",
      "hair",
      "eyeL",
      "eyeR",
    ];

    const map = {};
    ids.forEach((id) => {
      map[id] = svgRef.current.getElementById(id);
    });

    elementsRef.current = map;
  }, []);

  // Particle system (optimized)
  const spawnParticles = (type, container) => {
    cancelAnimationFrame(particleRef.current);
    container.innerHTML = "";

    let particles = [];

    const loop = () => {
      if (Math.random() < 0.1) {
        const p = document.createElement("div");
        p.className = "ma-particle";
        p.style.left = `${Math.random() * 180}px`;
        p.style.top = `${Math.random() * 120}px`;

        p.style.background =
          type === "stars"
            ? "#FFD700"
            : ["#E84A7B", "#7EB3D8", "#63C922"][
                Math.floor(Math.random() * 3)
              ];

        container.appendChild(p);

        particles.push({
          el: p,
          y: parseFloat(p.style.top),
          vy: -2,
          opacity: 1,
        });
      }

      particles.forEach((p, i) => {
        p.vy += 0.15;
        p.y += p.vy;
        p.opacity -= 0.02;

        p.el.style.top = p.y + "px";
        p.el.style.opacity = p.opacity;

        if (p.opacity <= 0) {
          p.el.remove();
          particles.splice(i, 1);
        }
      });

      particleRef.current = requestAnimationFrame(loop);
    };

    loop();
  };

  useEffect(() => {
    const cfg = moods[mood] || moods.neutral;
    const el = elementsRef.current;

    if (!svgRef.current) return;

    // Apply mood styles
    if (el.head) el.head.style.fill = cfg.headColor;
    if (el.body) el.body.style.fill = cfg.bodyColor;
    if (el.hair) el.hair.style.fill = cfg.hairColor;
    if (el.mouthLine) el.mouthLine.setAttribute("d", cfg.mouth);

    // Lighting effect
    if (mood === "sad") {
      svgRef.current.style.filter = "brightness(0.8)";
    } else if (mood === "happy") {
      svgRef.current.style.filter = "brightness(1.1)";
    } else if (mood === "angry") {
      svgRef.current.style.filter = "contrast(1.2)";
    } else {
      svgRef.current.style.filter = "none";
    }

    // Particles
    const container =
      svgRef.current.parentElement?.querySelector(".ma-particles");

    if (container) {
      cancelAnimationFrame(particleRef.current);
      container.innerHTML = "";
      if (cfg.particles) spawnParticles(cfg.particles, container);
    }

    // Animation loop
    cancelAnimationFrame(animRef.current);
    tRef.current = 0;

    const loop = () => {
      tRef.current += 0.04;
      const t = tRef.current;

      // Breathing
      const breathe = Math.sin(t * 1.5) * 2;

      // Bounce
      const bounce = -Math.abs(Math.sin(t * 2)) * cfg.bounce;

      svgRef.current.style.transform = `translateY(${bounce}px) scale(${1 +
        breathe * 0.01})`;

      // Eye movement
      const eyeShift = Math.sin(t * 2) * 1.5;

      if (el.eyeL)
        el.eyeL.style.transform = `translateX(${eyeShift}px)`;
      if (el.eyeR)
        el.eyeR.style.transform = `translateX(${eyeShift}px)`;

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      cancelAnimationFrame(particleRef.current);
    };
  }, [mood]);

  return (
    <div className="ma-wrapper">
      <div className="ma-scene">
        <div className="ma-particles"></div>

        <svg
          ref={svgRef}
          className="ma-svg"
          viewBox="0 0 200 260"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle id="head" cx="100" cy="72" r="42" fill="#F7C948" />
          <rect id="body" x="72" y="130" width="56" height="62" rx="18" fill="#E8834A" />
          <path id="hair" d="M62 55 Q100 22 138 55Z" fill="#5C3A1E" />

          <ellipse id="eyeL" cx="84" cy="68" rx="9" ry="10" fill="white" />
          <ellipse id="eyeR" cx="116" cy="68" rx="9" ry="10" fill="white" />

          <path
            id="mouthLine"
            d="M88 96 Q100 96 112 96"
            fill="none"
            stroke="#333"
            strokeWidth="3"
          />
        </svg>
      </div>

      <span className={`ma-label ${mood}`}>{mood}</span>
    </div>
  );
};

export default MoodAnimation;