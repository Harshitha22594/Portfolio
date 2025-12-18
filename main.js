// Smooth scroll and nav active state (moved from port.html)
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

const nav = document.getElementById("top-nav");
const navLinks = document.querySelectorAll(".nav-link");

function updateNavOnScroll() {
  if (window.scrollY > 50) {
    nav.classList.remove("bg-transparent", "py-6");
    nav.classList.add(
      "bg-[#050505]/80",
      "backdrop-blur-xl",
      "border-b",
      "border-white/5",
      "py-4",
      "shadow-lg",
      "shadow-purple-500/10"
    );
  } else {
    nav.classList.add("bg-transparent", "py-6");
    nav.classList.remove(
      "bg-[#050505]/80",
      "backdrop-blur-xl",
      "border-b",
      "border-white/5",
      "py-4",
      "shadow-lg",
      "shadow-purple-500/10"
    );
  }

  const sections = [
    "home",
    "about",
    "experience",
    "projects",
    "skills",
    "contact",
  ];
  let current = null;
  sections.forEach((sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top >= -100 && rect.top <= 300) {
      current = sectionId;
    }
  });

  navLinks.forEach((btn) => {
    const sec = btn.getAttribute("data-section");
    if (sec === current) {
      btn.classList.remove(
        "text-slate-400",
        "hover:text-white",
        "hover:bg-white/5"
      );
      btn.classList.add(
        "text-white",
        "bg-white/10",
        "shadow-[0_0_15px_rgba(255,255,255,0.1)]"
      );
    } else {
      btn.classList.add(
        "text-slate-400",
        "hover:text-white",
        "hover:bg-white/5"
      );
      btn.classList.remove(
        "text-white",
        "bg-white/10",
        "shadow-[0_0_15px_rgba(255,255,255,0.1)]"
      );
    }
  });
}

window.addEventListener("scroll", updateNavOnScroll);
updateNavOnScroll();

// Typewriter effect (moved from port.html)
const roles = ["Software Developer", "Product Enthusiast", "Data Analyst"];
let textIndex = 0;
let displayText = "";
let isDeleting = false;
const typewriterEl = document.getElementById("typewriter");

function typewriterTick() {
  const currentRole = roles[textIndex];
  if (isDeleting) {
    displayText = displayText.slice(0, -1);
    if (displayText.length === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % roles.length;
    }
  } else {
    displayText = currentRole.slice(0, displayText.length + 1);
    if (displayText.length === currentRole.length) {
      setTimeout(() => {
        isDeleting = true;
      }, 2000);
    }
  }
  typewriterEl.textContent = " " + displayText;
  setTimeout(typewriterTick, isDeleting ? 50 : 150);
}
typewriterTick();

// Techy data-network background (moved from port.html)
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const NODE_COUNT = 110;
  const CONNECTION_DISTANCE = 180;
  const HUB_EVERY = 10; // every Nth node is a "hub"

  const nodes = [];
  const mouse = { x: width / 2, y: height / 2, active: false };

  class Node {
    constructor(index) {
      this.index = index;
      this.isHub = index % HUB_EVERY === 0;
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      const speed = this.isHub ? 0.25 : 0.5;
      this.vx = (Math.random() - 0.5) * speed;
      this.vy = (Math.random() - 0.5) * speed;
      this.baseSize = this.isHub ? 3.2 : 1.6;
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.color = this.isHub
        ? "rgba(168, 85, 247," // purple
        : "rgba(56, 189, 248,"; // cyan
    }

    update(time) {
      this.x += this.vx;
      this.y += this.vy;

      // gentle wrap-around so the network feels continuous
      if (this.x < -50) this.x = width + 50;
      if (this.x > width + 50) this.x = -50;
      if (this.y < -50) this.y = height + 50;
      if (this.y > height + 50) this.y = -50;

      // subtle breathing/pulse
      const pulse = Math.sin(time * 0.002 + this.pulseOffset) * 0.6;
      this.size = this.baseSize + pulse;
    }

    draw(time) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distToMouse = Math.sqrt(dx * dx + dy * dy) || 1;
      const mouseFactor =
        mouse.active && distToMouse < 200 ? 1.2 - distToMouse / 200 : 0;

      const alphaBase = this.isHub ? 0.85 : 0.6;
      const alpha = Math.min(1, alphaBase + mouseFactor * 0.7);

      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.8, this.size), 0, Math.PI * 2);
      ctx.fillStyle = this.color + alpha + ")";
      ctx.shadowBlur = this.isHub ? 18 : 10;
      ctx.shadowColor = this.isHub
        ? "rgba(168,85,247,0.8)"
        : "rgba(56,189,248,0.7)";
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push(new Node(i));
  }

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY + window.scrollY;
    mouse.active = true;
  });

  window.addEventListener("mouseleave", () => {
    mouse.active = false;
  });

  function drawBackgroundGrid(time) {
    // soft diagonal tech grid
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = "rgba(15,23,42,0.9)";
    ctx.lineWidth = 1;
    const spacing = 70;
    const offset = ((time * 0.02) % spacing) - spacing;

    for (let x = -width; x < width * 2; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x + offset, 0);
      ctx.lineTo(x + offset + height, height);
      ctx.stroke();
    }

    for (let x = width * 2; x > -width; x -= spacing) {
      ctx.beginPath();
      ctx.moveTo(x - offset, 0);
      ctx.lineTo(x - offset - height, height);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawConnections(time) {
    ctx.save();
    for (let i = 0; i < NODE_COUNT; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > CONNECTION_DISTANCE) continue;

        const baseAlpha = a.isHub || b.isHub ? 0.6 : 0.35;
        let alpha = baseAlpha * (1 - dist / CONNECTION_DISTANCE);

        // amplify connections near the mouse
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const mdx = mouse.x - midX;
        const mdy = mouse.y - midY;
        const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
        if (mouse.active && mouseDist < 220) {
          alpha += (1 - mouseDist / 220) * 0.5;
        }

        alpha = Math.min(1, alpha);
        if (alpha < 0.05) continue;

        // small "data pulse" moving along some edges
        const pulsePhase =
          ((time * 0.002 + (i + j)) % 1) * (a.isHub || b.isHub ? 1.3 : 1);

        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, `rgba(56,189,248,${alpha * 0.9})`); // cyan
        grad.addColorStop(1, `rgba(168,85,247,${alpha * 0.9})`); // purple

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = (a.isHub || b.isHub ? 1.6 : 1) + alpha * 0.7;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        // draw moving "packet"
        if (alpha > 0.25) {
          const px = a.x + (b.x - a.x) * pulsePhase;
          const py = a.y + (b.y - a.y) * pulsePhase;
          ctx.beginPath();
          ctx.arc(px, py, 1.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(248,250,252,${alpha})`;
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  function loop(time) {
    ctx.clearRect(0, 0, width, height);

    // subtle radial glow behind content
    const gradient = ctx.createRadialGradient(
      width * 0.5,
      height * 0.3,
      0,
      width * 0.5,
      height * 0.3,
      width * 0.8
    );
    gradient.addColorStop(0, "rgba(15,23,42,0.9)");
    gradient.addColorStop(0.4, "rgba(15,23,42,0.95)");
    gradient.addColorStop(1, "rgba(3,7,18,1)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawBackgroundGrid(time);

    nodes.forEach((n) => n.update(time));
    drawConnections(time);
    nodes.forEach((n) => n.draw(time));

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
})();

// Simple tilt effect
document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  });
});


