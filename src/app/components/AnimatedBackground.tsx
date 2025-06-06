import { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  isAnalyzing: boolean;
  isComplete: boolean;
}

const AnimatedBackground = ({ isAnalyzing, isComplete }: AnimatedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transitionRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Helper function to interpolate between colors
  const interpolateColor = (startColor: number[], endColor: number[], progress: number) => {
    return startColor.map((start, i) => {
      const end = endColor[i];
      return start + (end - start) * progress;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      angle: number;
      angleSpeed: number;
      baseHue: number;
      originalX: number;
      originalY: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.originalX = this.x;
        this.originalY = this.y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.baseHue = Math.random() * 60 + 220;
        this.color = `hsla(${this.baseHue}, 80%, 60%, 0.8)`;
        this.angle = Math.random() * 360;
        this.angleSpeed = Math.random() * 2 - 1;
      }

      updateColor(time: number, transitionProgress: number) {
        if (isAnalyzing) {
          const pulseIntensity = Math.sin(time * 0.03) * 0.7 + 0.3;
          this.color = `hsla(0, 100%, ${60 * pulseIntensity}%, ${pulseIntensity})`;
        } else if (isComplete) {
          this.color = `rgba(100, 255, 100, ${0.6 + (transitionProgress * 0.4)})`;
        } else {
          this.color = `hsla(${this.baseHue}, 80%, 60%, 0.8)`;
        }
      }

      update(time: number, transitionProgress: number) {
        // Calculate distance from mouse
        const dx = this.x - mouseRef.current.x;
        const dy = this.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const mouseRadius = 150; // Radius of mouse influence

        if (distance < mouseRadius) {
          // Calculate repulsion force (stronger when closer)
          const force = (1 - distance / mouseRadius) * 0.5;
          const angle = Math.atan2(dy, dx);
          
          // Apply repulsion force
          this.speedX += Math.cos(angle) * force;
          this.speedY += Math.sin(angle) * force;
        }

        // Add slight attraction to original position
        const dxOriginal = this.originalX - this.x;
        const dyOriginal = this.originalY - this.y;
        this.speedX += dxOriginal * 0.001;
        this.speedY += dyOriginal * 0.001;

        // Apply speed limits
        const maxSpeed = 5;
        const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        if (speed > maxSpeed) {
          this.speedX = (this.speedX / speed) * maxSpeed;
          this.speedY = (this.speedY / speed) * maxSpeed;
        }

        // Add friction
        this.speedX *= 0.98;
        this.speedY *= 0.98;

        // Update position
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.angleSpeed;
        this.updateColor(time, transitionProgress);

        // Keep particles within bounds
        if (this.x > canvas.width) {
          this.x = canvas.width;
          this.speedX *= -0.5;
        }
        if (this.x < 0) {
          this.x = 0;
          this.speedX *= -0.5;
        }
        if (this.y > canvas.height) {
          this.y = canvas.height;
          this.speedY *= -0.5;
        }
        if (this.y < 0) {
          this.y = 0;
          this.speedY *= -0.5;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        
        ctx.beginPath();
        ctx.moveTo(-this.size, -this.size);
        ctx.lineTo(this.size, -this.size);
        ctx.lineTo(this.size, this.size);
        ctx.lineTo(-this.size, this.size);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.restore();
      }
    }

    const particles: Particle[] = [];
    const particleCount = 150;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let time = 0;
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update transition progress more slowly
      if (isComplete && transitionRef.current < 1) {
        transitionRef.current = Math.min(1, transitionRef.current + 0.008); // Slightly slower for smoother transition
      } else if (!isComplete && transitionRef.current > 0) {
        transitionRef.current = Math.max(0, transitionRef.current - 0.008);
      }

      // Draw gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );

      if (isAnalyzing) {
        const pulseIntensity = Math.sin(time * 0.03) * 0.7 + 0.3;
        gradient.addColorStop(0, `rgba(${180 * pulseIntensity}, 0, 0, 1)`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
      } else if (isComplete) {
        // Enhanced green background effect with more intensity
        const intensity = transitionRef.current;
        gradient.addColorStop(0, `rgba(50, ${180 * intensity}, 50, 1)`);
        gradient.addColorStop(0.2, `rgba(40, ${160 * intensity}, 40, 0.95)`);
        gradient.addColorStop(0.4, `rgba(30, ${140 * intensity}, 30, 0.9)`);
        gradient.addColorStop(0.6, `rgba(20, ${120 * intensity}, 20, 0.85)`);
        gradient.addColorStop(0.8, `rgba(10, ${100 * intensity}, 10, 0.8)`);
        gradient.addColorStop(1, `rgba(5, ${80 * intensity}, 5, 0.75)`);

        // Add an enhanced ambient glow with more intensity
        const ambientGradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width
        );
        ambientGradient.addColorStop(0, `rgba(100, 255, 100, ${0.25 * intensity})`);
        ambientGradient.addColorStop(0.3, `rgba(50, 255, 50, ${0.2 * intensity})`);
        ambientGradient.addColorStop(0.6, `rgba(0, 255, 0, ${0.15 * intensity})`);
        ambientGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = ambientGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add an extra glow layer
        const extraGlow = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        extraGlow.addColorStop(0, `rgba(0, 255, 0, ${0.15 * intensity})`);
        extraGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = extraGlow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        gradient.addColorStop(0, 'rgba(15, 23, 42, 1)');
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0.8)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update(time, transitionRef.current);
        particle.draw();
      });

      particles.forEach((particle1, i) => {
        particles.slice(i + 1).forEach(particle2 => {
          const dx = particle1.x - particle2.x;
          const dy = particle1.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            const opacity = 0.5 * (1 - distance / 150);
            const gradient = ctx.createLinearGradient(
              particle1.x,
              particle1.y,
              particle2.x,
              particle2.y
            );

            if (isAnalyzing) {
              const pulseIntensity = Math.sin(time * 0.03) * 0.7 + 0.3;
              gradient.addColorStop(0, `hsla(0, 100%, ${60 * pulseIntensity}%, ${opacity * pulseIntensity})`);
              gradient.addColorStop(1, `hsla(0, 100%, ${60 * pulseIntensity}%, ${opacity * pulseIntensity})`);
            } else if (isComplete) {
              // Brighter green connections with higher opacity
              const greenOpacity = opacity * transitionRef.current;
              gradient.addColorStop(0, `rgba(100, 255, 100, ${greenOpacity * 1.5})`);
              gradient.addColorStop(1, `rgba(50, 255, 50, ${greenOpacity * 1.5})`);
            } else {
              gradient.addColorStop(0, `hsla(240, 80%, 60%, ${opacity})`);
              gradient.addColorStop(1, `hsla(280, 80%, 60%, ${opacity})`);
            }

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2 * (1 - distance / 150);
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
          }
        });
      });

      time++;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isAnalyzing, isComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-20"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default AnimatedBackground; 