import { useEffect, useRef } from 'react';

const StarfieldBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const ctx = context;
    const cvs = canvas;

    // Configuration
    const STAR_COLOR = '#fff';
    const STAR_SIZE = 3;
    const STAR_MIN_SCALE = 0.2;
    const OVERFLOW_THRESHOLD = 50;
    const STAR_COUNT = (window.innerWidth + window.innerHeight) / 8;

    let scale = 1;
    let width: number;
    let height: number;

    interface Star {
      x: number;
      y: number;
      z: number;
    }

    let stars: Star[] = [];

    let pointerX: number | null = null;
    let pointerY: number | null = null;

    let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };

    let touchInput = false;

    // Generate stars
    function generate() {
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: 0,
          y: 0,
          z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
        });
      }
    }

    // Place star randomly
    function placeStar(star: Star) {
      star.x = Math.random() * width;
      star.y = Math.random() * height;
    }

    // Recycle stars that go off screen
    function recycleStar(star: Star) {
      let direction = 'z';

      let vx = Math.abs(velocity.x);
      let vy = Math.abs(velocity.y);

      if (vx > 1 || vy > 1) {
        let axis;

        if (vx > vy) {
          axis = Math.random() < vx / (vx + vy) ? 'h' : 'v';
        } else {
          axis = Math.random() < vy / (vx + vy) ? 'v' : 'h';
        }

        if (axis === 'h') {
          direction = velocity.x > 0 ? 'l' : 'r';
        } else {
          direction = velocity.y > 0 ? 't' : 'b';
        }
      }

      star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

      if (direction === 'z') {
        star.z = 0.1;
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      } else if (direction === 'l') {
        star.x = -OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
      } else if (direction === 'r') {
        star.x = width + OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
      } else if (direction === 't') {
        star.x = width * Math.random();
        star.y = -OVERFLOW_THRESHOLD;
      } else if (direction === 'b') {
        star.x = width * Math.random();
        star.y = height + OVERFLOW_THRESHOLD;
      }
    }

    // Resize canvas
    function resize() {
      scale = window.devicePixelRatio || 1;

      width = window.innerWidth * scale;
      height = window.innerHeight * scale;

      cvs.width = width;
      cvs.height = height;

      stars.forEach(placeStar);
    }

    // Update star positions
    function update() {
      velocity.tx *= 0.96;
      velocity.ty *= 0.96;

      velocity.x += (velocity.tx - velocity.x) * 0.8;
      velocity.y += (velocity.ty - velocity.y) * 0.8;

      stars.forEach((star) => {
        star.x += velocity.x * star.z;
        star.y += velocity.y * star.z;

        star.x += (star.x - width / 2) * velocity.z * star.z;
        star.y += (star.y - height / 2) * velocity.z * star.z;
        star.z += velocity.z;

        // Recycle when out of bounds
        if (
          star.x < -OVERFLOW_THRESHOLD ||
          star.x > width + OVERFLOW_THRESHOLD ||
          star.y < -OVERFLOW_THRESHOLD ||
          star.y > height + OVERFLOW_THRESHOLD
        ) {
          recycleStar(star);
        }
      });
    }

    // Render stars
    function render() {
        stars.forEach((star) => {
            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.lineWidth = STAR_SIZE * star.z * scale;
            ctx.globalAlpha = 0.5 + 0.5 * Math.random();
            ctx.strokeStyle = STAR_COLOR;

            ctx.beginPath();
            ctx.moveTo(star.x, star.y);

            let tailX = velocity.x * 2;
            let tailY = velocity.y * 2;

            if (Math.abs(tailX) < 0.1) tailX = 0.5;
            if (Math.abs(tailY) < 0.1) tailY = 0.5;

            ctx.lineTo(star.x + tailX, star.y + tailY);

            ctx.stroke();
        });
    }

    // Animation loop
    function step() {
        ctx.clearRect(0, 0, width, height);
        update();
        render();
        requestAnimationFrame(step);
    }

    // Move pointer handler
    function movePointer(x: number, y: number) {
      if (typeof pointerX === 'number' && typeof pointerY === 'number') {
        let ox = x - pointerX;
        let oy = y - pointerY;

        velocity.tx = velocity.tx + (ox / 8) * scale * (touchInput ? 1 : -1);
        velocity.ty = velocity.ty + (oy / 8) * scale * (touchInput ? 1 : -1);
      }

      pointerX = x;
      pointerY = y;
    }

    // Event handlers
    function onMouseMove(event: MouseEvent) {
      touchInput = false;
      movePointer(event.clientX, event.clientY);
    }

    function onTouchMove(event: TouchEvent) {
      touchInput = true;
      movePointer(event.touches[0].clientX, event.touches[0].clientY);
      event.preventDefault();
    }

    function onMouseLeave() {
      pointerX = null;
      pointerY = null;
    }

    // Initialize
    generate();
    resize();
    step();

    // Add event listeners
    window.addEventListener('resize', resize);
    cvs.addEventListener('mousemove', onMouseMove);
    cvs.addEventListener('touchmove', onTouchMove);
    cvs.addEventListener('touchend', onMouseLeave);
    document.addEventListener('mouseleave', onMouseLeave);

    // Cleanup
    return () => {
        window.removeEventListener('resize', resize);
        cvs.removeEventListener('mousemove', onMouseMove);
        cvs.removeEventListener('touchmove', onTouchMove);
        cvs.removeEventListener('touchend', onMouseLeave);
        document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
        }}
    />
    );

};

export default StarfieldBackground;