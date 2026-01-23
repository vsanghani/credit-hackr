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

        // Configuration
        const spacing = 15; // Grid spacing
        const dotBaseSize = 1.5;
        const dotColor = '#4685ff'; // Using primary color

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initDots();
            draw(); // Draw immediately after resize
        };

        class Dot {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = dotBaseSize;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = dotColor;
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

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < dots.length; i++) {
                dots[i].draw();
            }
            // No requestAnimationFrame needed for static background
        };

        // Event Listeners
        window.addEventListener('resize', resize);

        // Init
        resize();

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="mesh-background" />;
};

export default MeshBackground;
