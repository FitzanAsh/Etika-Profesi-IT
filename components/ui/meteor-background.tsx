'use client';

import { useEffect, useRef } from 'react';

export default function MeteorBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let animationFrameId: number;
        let particles: Particle[] = [];
        let cursorParticles: CursorSpark[] = [];
        let mouse = { x: -100, y: -100 };

        // Configuration
        const particleCount = 3; // Set to 3 meteors
        const speedMultiplier = 4;
        const trailHistorySize = 60;
        const curveStrength = 0.5;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        class Particle {
            index: number;
            x: number = 0;
            y: number = 0;
            vx: number = 0;
            vy: number = 0;
            speed: number = 0;
            size: number = 0;
            color: string = '';
            history: { x: number; y: number }[] = [];

            constructor(index: number) {
                this.index = index;
                this.reset();
                for (let i = 0; i < trailHistorySize; i++) {
                    this.history.push({ x: this.x, y: this.y });
                }
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * speedMultiplier * 2;
                this.vy = (Math.random() - 0.5) * speedMultiplier * 2;
                this.speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (this.speed < 2) this.speed = 3;
                this.size = this.index === 0 ? 4 : 2.5;
                const blueShades = ['#00ffff', '#00bfff', '#1e90ff'];
                this.color = blueShades[Math.floor(Math.random() * blueShades.length)];
            }

            update() {
                this.vx += (Math.random() - 0.5) * curveStrength;
                this.vy += (Math.random() - 0.5) * curveStrength;
                const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                this.vx = (this.vx / currentSpeed) * this.speed;
                this.vy = (this.vy / currentSpeed) * this.speed;
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) {
                    this.vx *= -1;
                    this.vy += (Math.random() - 0.5);
                }
                if (this.y < 0 || this.y > height) {
                    this.vy *= -1;
                    this.vx += (Math.random() - 0.5);
                }

                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > trailHistorySize) {
                    this.history.shift();
                }
            }

            draw() {
                if (this.history.length > 1) {
                    ctx!.beginPath();
                    ctx!.moveTo(this.history[0].x, this.history[0].y);
                    for (let i = 1; i < this.history.length - 1; i++) {
                        const p0 = this.history[i];
                        const p1 = this.history[i + 1];
                        const midX = (p0.x + p1.x) / 2;
                        const midY = (p0.y + p1.y) / 2;
                        ctx!.quadraticCurveTo(p0.x, p0.y, midX, midY);
                    }
                    const last = this.history[this.history.length - 1];
                    ctx!.lineTo(last.x, last.y);

                    const tail = this.history[0];
                    const head = this.history[this.history.length - 1];
                    const gradient = ctx!.createLinearGradient(tail.x, tail.y, head.x, head.y);
                    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
                    gradient.addColorStop(1, this.color);

                    ctx!.lineCap = 'round';
                    ctx!.lineWidth = this.size * 2;
                    ctx!.strokeStyle = gradient;
                    ctx!.shadowBlur = 20;
                    ctx!.shadowColor = this.color;
                    ctx!.stroke();
                }

                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fillStyle = "#ffffff";
                ctx!.shadowBlur = 25;
                ctx!.shadowColor = this.color;
                ctx!.fill();
                ctx!.shadowBlur = 0;
            }
        }

        class CursorSpark {
            x: number;
            y: number;
            size: number;
            life: number;
            decay: number;
            vx: number;
            vy: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 3 + 1;
                this.life = 1.0;
                this.decay = Math.random() * 0.03 + 0.02;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= this.decay;
            }

            draw() {
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fillStyle = `rgba(200, 255, 255, ${this.life})`;
                ctx!.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(i));
            }
        };

        const animate = () => {
            // Clear canvas completely for clean trails (no black fade on white bg)
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            for (let i = cursorParticles.length - 1; i >= 0; i--) {
                let p = cursorParticles[i];
                p.update();
                p.draw();
                if (p.life <= 0) {
                    cursorParticles.splice(i, 1);
                }
            }

            if (mouse.x > 0 && mouse.y > 0) {
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = "#fff";
                ctx.shadowBlur = 10;
                ctx.shadowColor = "#fff";
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            cursorParticles.push(new CursorSpark(mouse.x, mouse.y));
            cursorParticles.push(new CursorSpark(mouse.x, mouse.y));
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);

        resize();
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        />
    );
}
