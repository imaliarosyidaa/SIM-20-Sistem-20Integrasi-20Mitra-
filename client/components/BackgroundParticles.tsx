import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    alpha: number;
    da: number;
}

const BackgroundParticles: React.FC<{ count?: number; color?: string }> = ({ count = 80, color = '255,255,255' }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const particlesRef = useRef<Particle[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        // mouse interaction state
        let mouseX = -9999;
        let mouseY = -9999;
        let lastMove = 0;

        const resize = () => {
            width = canvas.clientWidth || window.innerWidth;
            height = canvas.clientHeight || window.innerHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            // Reset transform for correct scaling
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            initParticles();
        };

        const spawnParticle = (x: number, y: number, opts: Partial<Particle> = {}) => {
            const baseR = Math.random() * 2 + 0.8;
            const p: Particle = {
                x: x + (Math.random() - 0.5) * 12,
                y: y + (Math.random() - 0.5) * 12,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6 - 0.3,
                r: baseR + (Math.random() - 0.5) * 0.8,
                alpha: Math.random() * 0.6 + 0.4,
                da: (Math.random() * 0.02) + 0.004,
                ...opts,
            };
            particlesRef.current.push(p);
            // limit count for performance
            if (particlesRef.current.length > Math.max(140, count * 2)) {
                particlesRef.current.splice(0, particlesRef.current.length - Math.max(140, count));
            }
        };

        const initParticles = () => {
            particlesRef.current = [];
            const areaFactor = (width * height) / (1280 * 720);
            const target = Math.max(30, Math.min(180, Math.floor(count * areaFactor)));
            for (let i = 0; i < target; i++) {
                particlesRef.current.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    r: Math.random() * 2.5 + 0.7,
                    alpha: Math.random() * 0.7 + 0.25,
                    da: (Math.random() * 0.02) + 0.003,
                });
            }
        };

        const burstAt = (x: number, y: number, amount = 12) => {
            for (let i = 0; i < amount; i++) {
                spawnParticle(x, y, { vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.8) * 2, r: Math.random() * 3 + 0.8, alpha: Math.random() * 0.8 + 0.4 });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // additive blending for glow
            ctx.globalCompositeOperation = 'lighter';

            particlesRef.current.forEach((p, i) => {
                // movement
                p.x += p.vx;
                p.y += p.vy;

                // gentle upward drift
                p.vy -= 0.001;

                // random sway
                p.vx += (Math.random() - 0.5) * 0.02;

                // wrap-around
                if (p.x < -40) p.x = width + 40;
                if (p.x > width + 40) p.x = -40;
                if (p.y < -40) p.y = height + 40;
                if (p.y > height + 40) p.y = -40;

                // twinkle/flicker
                p.alpha += (Math.random() > 0.5 ? 1 : -1) * p.da;
                if (p.alpha < 0.05) p.alpha = 0.05;
                if (p.alpha > 1.2) p.alpha = 1.2;

                // mouse attraction: brighten and slightly move towards mouse when near
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120 && lastMove > Date.now() - 3000) {
                    const pull = (120 - dist) / 120;
                    p.x += (dx / dist) * pull * 0.6;
                    p.y += (dy / dist) * pull * 0.6;
                    p.alpha = Math.min(1.6, p.alpha + 0.6 * pull);
                }

                // draw core (bright)
                const coreR = Math.max(1, p.r);
                const grdCore = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, coreR * 1.6);
                grdCore.addColorStop(0, `rgba(${color}, ${Math.min(1, p.alpha)})`);
                grdCore.addColorStop(1, `rgba(${color}, 0)`);
                ctx.fillStyle = grdCore;
                ctx.beginPath();
                ctx.arc(p.x, p.y, coreR * 1.6, 0, Math.PI * 2);
                ctx.fill();

                // draw halo (soft)
                const haloR = coreR * 6;
                const grdHalo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
                grdHalo.addColorStop(0, `rgba(${color}, ${Math.max(0.08, p.alpha * 0.45)})`);
                grdHalo.addColorStop(1, `rgba(${color}, 0)`);
                ctx.fillStyle = grdHalo;
                ctx.beginPath();
                ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2);
                ctx.fill();

                // occasional gentle new sparkles
                if (Math.random() > 0.995) {
                    spawnParticle(p.x, p.y, { r: Math.random() * 2 + 0.8, vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.6) * 0.6, alpha: 0.9 });
                }
            });

            // reset blend mode for safety
            ctx.globalCompositeOperation = 'source-over';

            rafRef.current = requestAnimationFrame(draw);
        };

        const onMove = (e: MouseEvent | TouchEvent) => {
            const evt = e as MouseEvent;
            if (evt instanceof TouchEvent) {
                const t = (evt as TouchEvent).touches[0];
                if (t) {
                    mouseX = t.clientX;
                    mouseY = t.clientY;
                }
            } else {
                mouseX = (evt as MouseEvent).clientX;
                mouseY = (evt as MouseEvent).clientY;
            }
            lastMove = Date.now();
            // spawn subtle spark at cursor
            if (Math.random() > 0.5) {
                spawnParticle(mouseX, mouseY, { r: Math.random() * 2 + 0.6, vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.8) * 1.2, alpha: Math.random() * 0.8 + 0.5 });
            }
        };

        const onDown = (e: MouseEvent | TouchEvent) => {
            const evt = e as MouseEvent;
            let x = 0;
            let y = 0;
            if (evt instanceof TouchEvent) {
                const t = (evt as TouchEvent).touches[0];
                x = t ? t.clientX : window.innerWidth / 2;
                y = t ? t.clientY : window.innerHeight / 2;
            } else {
                x = (evt as MouseEvent).clientX;
                y = (evt as MouseEvent).clientY;
            }
            burstAt(x, y, 18);
        };

        // attach listeners
        resize();
        console.log('BackgroundParticles initialized (glow + interaction)');
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('pointerdown', onDown);
        rafRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('pointerdown', onDown);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [count, color]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-screen opacity-90"
            style={{ display: 'block' }}
        />
    );
};

export default BackgroundParticles;
