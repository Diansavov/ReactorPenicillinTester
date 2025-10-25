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

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function randomInt(max) {
  return Math.floor(Math.random() * max);
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
  //ParticleProps
  const particleCount = 2500;
  const minRadius = 10;
  const maxRadius = 30;

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        'rgb(124, 214, 138',
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

  return (
    <>
      <div>
        <canvas
          style={{ display: "block" }}
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>
    </>
  );
}
