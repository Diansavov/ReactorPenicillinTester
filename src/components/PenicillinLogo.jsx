// @ts-ignore
import penicillinBottle from "../assets/penicillin.svg";
import "../styles/penicillin-logo.css";
import { useState, useEffect, useRef } from "react";

export default function PenicillinLogo() {
  const canvasRef = useRef(null);
  const vinesRef = useRef([]);
  const [hovered, setHovered] = useState(false);

  // Vine config
  const vineCount = 35;
  const growthSpeed = 3;
  const globalMaxLength = 100;
  const vineWobbleFreq = 0.1;
  const vineWobbleAmp = 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const center = { x: width / 2, y: height / 2 };
    let frame = 0;
    let animId;

    // Initialize vines
    // @ts-ignore
    vinesRef.current = Array.from({ length: vineCount }, (_, i) => {
      const angle = (i / vineCount) * Math.PI * 2;
      return {
        baseAngle: angle,
        length: 0,
        // 🌿 each vine gets its own random target length (±25%)
        targetLength:
          globalMaxLength * (0.75 + Math.random() * 0.5), // between 75%–125%
        points: [center],
      };
    });

    function draw() {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Draw central logo
      ctx.beginPath();
      ctx.arc(center.x, center.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = "#222";
      ctx.fill();

      vinesRef.current.forEach((vine, i) => {
        const { baseAngle, targetLength } = vine;
        let { length, points } = vine;

        // Grow or retract
        if (hovered) {
          if (length < targetLength) {
            length += growthSpeed;
          }
        } else {
          if (length > 0) {
            length = Math.max(0, length - growthSpeed * 2);
            points.pop();
          }
        }

        // Generate vine points
        points = [];
        for (let d = 0; d < length; d += growthSpeed) {
          const wobble =
            Math.sin(frame * 0.05 + d * vineWobbleFreq + i * 2) *
            vineWobbleAmp;
          const angle = baseAngle + wobble / 200;
          const x = center.x + Math.cos(angle) * d;
          const y = center.y + Math.sin(angle) * d;
          points.push({ x, y });
        }

        // Draw vine path with varying thickness
        if (points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let j = 1; j < points.length; j++) {
            ctx.lineTo(points[j].x, points[j].y);
          }

          const baseWidth = 16;
          const tipWidth = 4;
          const progress = Math.min(length / targetLength, 1);
          ctx.lineWidth = tipWidth + (1 - progress) * (baseWidth - tipWidth);
          ctx.strokeStyle = "#2e8b57";
          ctx.shadowColor = "#2e8b57";
          ctx.shadowBlur = 8;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        vine.length = length;
        vine.points = points;
      });

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [hovered]);

  return (
    <div className="penicillin-container">
      <img
        src={penicillinBottle}
        className="logo penicillin"
        alt="Penicillin logo"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      <canvas ref={canvasRef} width={250} height={250} />
    </div>
  );
}
