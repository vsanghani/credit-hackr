import { useEffect, useRef } from 'react';
import './MeshBackground.css';

const MeshBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let dots = [];
        let mouse = { x: null, y: null, radius: 100 }; // Interaction radius

        // Configuration
        const spacing = 30; // Grid spacing
        const dotBaseSize = 1.5;
        const dotColor = '#cccccc'; // Subtle grey for dots

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initDots();
        };

        class Dot {
            constructor(x, y) {
                this.baseX = x;
                this.baseY = y;
                this.x = x;
                this.y = y;
                this.size = dotBaseSize;
                this.density = (Math.random() * 20) + 1; // Random interaction weight
            }

            update() {
                // Mouse Interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    const maxDistance = mouse.radius;
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;

                    // Helper for easing
                    const force = (maxDistance - distance) / maxDistance;

                    if (distance < mouse.radius) {
                        // Move away from cursor (repel)
                        const directionX = forceDirectionX * force * this.density;
                        const directionY = forceDirectionY * force * this.density;

                        this.x -= directionX; // Use -= to repel, += to attract
                        this.y -= directionY;
                    } else {
                        // Return to base position
                        if (this.x !== this.baseX) {
                            let dx = this.x - this.baseX;
                            this.x -= dx / 10; // Ease back
                        }
                        if (this.y !== this.baseY) {
                            let dy = this.y - this.baseY;
                            this.y -= dy / 10;
                        }
                    }
                } else {
                    // Reset if no mouse
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 10;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 10;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = dotColor; // Use fillStyle for solid dots
                ctx.closePath();
                ctx.fill();
            }
        }

        const initDots = () => {
            dots = [];
            for (let y = 0; y < height; y += spacing) {
                for (let x = 0; x < width; x += spacing) {
                    dots.push(new Dot(x, y));
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];
                dot.update();
                dot.draw();
            }
            requestAnimationFrame(animate);
        };

        // Event Listeners
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Init
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="mesh-background" />;
};

export default MeshBackground;
