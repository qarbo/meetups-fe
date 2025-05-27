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
      speedY: 0.3 + Math.random() * 0.7,
      speedX: (Math.random() - 0.5) * 0.5,
      size: 20 + Math.random() * 20,
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

        if (p.y > window.innerHeight) {
          p.y = -50;
          p.x = Math.random() * window.innerWidth;
        }

        ctx.font = `${p.size}px serif`;
        ctx.fillText(p.emoji, p.x, p.y);
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