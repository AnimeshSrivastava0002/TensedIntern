import React, { useEffect, useRef } from 'react';
import './HeroTitle.css';

const HeroTitle = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Dynamic canvas sizing
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.6;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const animate = () => {
      time += 0.01;
      
      // Clear canvas
      ctx.fillStyle = 'rgba(10, 10, 30, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw animated particles
      for (let i = 0; i < 50; i++) {
        const x = (Math.sin(time + i) * canvas.width / 2) + canvas.width / 2;
        const y = (Math.cos(time + i * 0.5) * canvas.height / 3) + canvas.height / 2;
        const size = Math.abs(Math.sin(time + i * 0.1)) * 3;
        
        ctx.fillStyle = `rgba(100, 200, 255, ${0.5 + Math.sin(time + i) * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw connecting lines
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 40; i += 5) {
        const x1 = (Math.sin(time + i) * canvas.width / 2) + canvas.width / 2;
        const y1 = (Math.cos(time + i * 0.5) * canvas.height / 3) + canvas.height / 2;
        const x2 = (Math.sin(time + i + 5) * canvas.width / 2) + canvas.width / 2;
        const y2 = (Math.cos((time + i + 5) * 0.5) * canvas.height / 3) + canvas.height / 2;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.6;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="hero-title-container" ref={containerRef}>
      <canvas ref={canvasRef} className="hero-canvas"></canvas>
      
      <div className="hero-content">
        <h1 className="hero-main-title">
          <span className="title-word">Tensed</span>
          <span className="title-word">Intern</span>
        </h1>
        
        <p className="hero-subtitle">
          Track your journey. Land your dream job.
        </p>
        
        <div className="hero-features">
          <div className="feature">
            <span className="feature-icon">📊</span>
            <span>Track Applications</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔔</span>
            <span>Live Job Updates</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <span>Get Insights</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroTitle;
