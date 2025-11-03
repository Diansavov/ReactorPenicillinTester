import { useState, useEffect, useRef } from "react";
import "../styles/bad-trip.css";

class Particle {
  constructor(x, y, radius, color, ctx, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.ctx = ctx;
    this.dx = dx;
    this.dy = dy;
    this.opacity = 1;
    this.isFading = false;
    this.ox = x; // original X
    this.oy = y; // original Y
    this.angle = 0; // angle for jiggle animation
  }

  create() {
    this.ctx.beginPath();
    this.ctx.globalAlpha = this.opacity;
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
  move() {
    if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
      this.dx *= -1;
    }
    if (this.y + this.radius >= innerHeight || this.y - this.radius <= 0) {
      this.dy *= -1;
    }
    this.x += this.dx;
    this.y += this.dy;

    if (this.isFading) {
      this.opacity -= 0.01;
      if (this.opacity < 0) {
        this.opacity = 0;
      }
    }
  }
}
function createParticlesFromText(ctx, text, width, height) {
  const offCanvas = document.createElement("canvas");
  offCanvas.width = width;
  offCanvas.height = height;
  const offCtx = offCanvas.getContext("2d");

  offCtx.fillStyle = "white";
  offCtx.font = "bold 180px sans-serif";
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillText(text, width / 2, height / 2);

  const imageData = offCtx.getImageData(0, 0, width, height).data;
  const points = [];

  for (let y = 0; y < height; y += 6) {
    for (let x = 0; x < width; x += 6) {
      const index = (y * width + x) * 4;
      const alpha = imageData[index + 3];
      if (alpha > 128) points.push({ x, y });
    }
  }
  return points;
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function useBeginningTrip(
  canvasRef,
  animationRef,
  particlesRef,
  dimensions,
  setAnimationIndex
) {
  //ParticleProps
  const particleCount = 2500;
  const minRadius = 10;
  const maxRadius = 30;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");

    for (let i = 0; i < particleCount; i++) {
      let speedX = randomRange(-3, 3);
      let speedY = randomRange(-3, 3);
      while (speedX > -1 && speedX < 1) {
        speedX = randomRange(-3, 3);
      }
      while (speedY > -1 && speedY < 1) {
        speedY = randomRange(-3, 3);
      }

      const par = new Particle(
        randomRange(maxRadius * 2, innerWidth - maxRadius),
        randomRange(maxRadius * 2, innerHeight - maxRadius),
        randomRange(minRadius, maxRadius),
        "rgb(124, 214, 138)",
        ctx,
        speedX,
        speedY
      );
      particlesRef.current.push(par);
    }

    function animation() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = 0; i < particlesRef.current.length; i++) {
        const particle = particlesRef.current[i];
        particle.move();
        particle.create();
      }
      particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0);
      animationRef.current = requestAnimationFrame(animation);
    }
    animation();
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = particlesRef.current.filter((p) => !p.isFading);
      if (remaining.length === 0) {
        setAnimationIndex(1);
        clearInterval(interval);
        return;
      }

      let toFade = Math.min(500, particlesRef.current.length);
      if (particlesRef.current.length <= 1000) {
        toFade = Math.min(150, particlesRef.current.length);
      }
      for (let i = 0; i < toFade; i++) {
        const element = particlesRef.current[i];
        element.isFading = true;
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
}

function useTest(
  canvasRef,
  animationRef,
  dimensions,
  animationIndex,
  setElementToShow,
  scareTrigger,
  setAnimationIndex
) {
  useEffect(() => {
    if (animationIndex === 0) {
      return;
    }

    setTimeout(() => {
      //Show button after 5s
      setElementToShow(animationIndex);
    }, 3000);

    return () => {};
  }, [animationIndex]);

  useEffect(() => {
    setElementToShow(0);
    cancelAnimationFrame(animationRef.current);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    let scareText = "";
    if (scareTrigger === 1) {
      scareText = "YOU CAN'T";
      setAnimationIndex(2);
    } else if (scareTrigger === 2) {
      setAnimationIndex(0);
      scareText = "LOOK DOWN";
    } else if (scareTrigger === 3) {
      return;
    }

    // Create text particles
    const textPoints = createParticlesFromText(
      ctx,
      scareText,
      dimensions.width,
      dimensions.height
    );

    // Create particles at text positions
    const particles = textPoints.map((p) => {
      const particle = new Particle(
        p.x,
        p.y,
        4,
        "rgb(124, 214, 138)",
        ctx,
        (Math.random() - 0.5) * 0.5, // tiny jitter speed
        (Math.random() - 0.5) * 0.5
      );

      // Store original resting position (so they jiggle around it)
      particle.ox = p.x;
      particle.oy = p.y;
      particle.angle = Math.random() * Math.PI * 2;

      return particle;
    });

    // Trigger fade-out after 4 seconds (uses your existing fading behavior)
    setTimeout(() => {
      particles.forEach((p) => (p.isFading = true));
    }, 4000);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Loop backwards so removal doesn't break indexing
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // JIGGLE AROUND ORIGINAL POSITION
        p.angle += 0.03;
        p.x = p.ox + Math.cos(p.angle) * 6;
        p.y = p.oy + Math.sin(p.angle) * 6;

        // ✅ FADE OUT (same logic as move())
        if (p.isFading) {
          p.opacity -= 0.01;
          if (p.opacity <= 0) {
            particles.splice(i, 1); // remove invisible particle
            continue;
          }
        }

        p.create();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationRef.current);
  }, [scareTrigger]);
}

export default function BadTrip() {
  //CanvasProps
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const [dimensions, setDimensions] = useState({
    width: innerWidth,
    height: innerHeight,
  });
  const [animationIndex, setAnimationIndex] = useState(0);
  const [elementToShow, setElementToShow] = useState(0);
  const [scareTrigger, setScareTrigger] = useState(0);

  //Resizing
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //Animations
  /*
  useBeginningTrip(
    canvasRef,
    animationRef,
    particlesRef,
    dimensions,
    setAnimationIndex
  );
*/
  //Remove This
  useEffect(() => {
    setAnimationIndex(1);
    return () => {
      setAnimationIndex(null);
    };
  }, []);

  useTest(
    canvasRef,
    animationRef,
    dimensions,
    animationIndex,
    setElementToShow,
    scareTrigger,
    setAnimationIndex
  );

  return (
    <>
      <div className="canvas-container">
        <canvas
          style={{ display: "block" }}
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
        />
        {elementToShow == 1 && (
          <button
            className="overlayed fade-in"
            onClick={() => setScareTrigger(1)}
          >
            Wake up?
          </button>
        )}
        {elementToShow == 2 && (
          <button
            className="overlayed fade-in"
            onClick={() => setScareTrigger(2)}
          >
           Why?
          </button>
        )}
      </div>
    </>
  );
}
