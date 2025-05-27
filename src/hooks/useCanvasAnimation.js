import { useEffect } from "react";

export default function useCanvasAnimation(selectedTheme, selectedEmoji) {
  useEffect(() => {
    console.log("selectedTheme", selectedTheme);
    console.log("selectedEmoji", selectedEmoji);
    const canvas = document.getElementById("canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const emojis = selectedTheme === "emoji" ? [selectedEmoji] : [];
    console.log("emojis", emojis);
    const particles = emojis.length > 0 ? new Array(30).fill(0).map(() => ({
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speedY: (Math.random() - 0.5) * 1, // движение вверх и вниз
      speedX: (Math.random() - 0.5) * 1, // движение влево и вправо
      angle: Math.random() * Math.PI * 2, // начальный угол наклона
      rotationSpeed: (Math.random() - 0.5) * 0.02, // скорость вращения
      size: 20 + Math.random() * 40,
    })) : [];

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (emojis.length === 0) {
        // Если нет эмодзи, очищаем canvas и не запускаем анимацию
        return;
      }

      for (let p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += p.rotationSpeed;

        if (p.x < 0 || p.x > window.innerWidth) p.speedX *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.speedY *= -1;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.font = `${p.size}px serif`;
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [selectedTheme, selectedEmoji]);
}