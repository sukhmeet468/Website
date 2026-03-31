class HeroAmbientAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodes = [];
    this.dpr = window.devicePixelRatio || 1;
    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    this.handleReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', this.resize);
    if (!this.handleReducedMotion.matches) {
      this.animate();
    } else {
      this.draw(0);
    }
  }

  resize() {
    const bounds = this.canvas.parentElement.getBoundingClientRect();
    this.width = bounds.width;
    this.height = bounds.height;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.buildNodes();
  }

  buildNodes() {
    const spacing = Math.max(52, Math.round(this.width / 26));
    const cols = Math.ceil(this.width / spacing) + 1;
    const rows = Math.ceil(this.height / spacing) + 1;
    this.nodes = [];

    for (let x = 0; x < cols; x += 1) {
      for (let y = 0; y < rows; y += 1) {
        if (Math.random() > 0.82) {
          continue;
        }

        this.nodes.push({
          x: x * spacing + (Math.random() - 0.5) * 16,
          y: y * spacing + (Math.random() - 0.5) * 16,
          radius: 1 + Math.random() * 1.8,
          alpha: 0.12 + Math.random() * 0.2,
          drift: 0.2 + Math.random() * 0.4,
          offset: Math.random() * Math.PI * 2
        });
      }
    }
  }

  draw(time) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    for (const node of this.nodes) {
      const shimmer = (Math.sin(time * node.drift + node.offset) + 1) / 2;
      const radius = node.radius + shimmer * 0.9;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 105, 105, ${node.alpha + shimmer * 0.1})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius * 3.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 0, 0, ${0.025 + shimmer * 0.03})`;
      ctx.fill();
    }
  }

  animate(timestamp = 0) {
    const time = timestamp * 0.001;
    this.draw(time);
    this.frame = window.requestAnimationFrame(this.animate);
  }
}

class HeroStatsNetwork {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.container = canvas.parentElement;
    this.cards = Array.from(this.container.querySelectorAll('.hero-stat'));
    this.dpr = window.devicePixelRatio || 1;
    this.points = [];
    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    this.handleReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', this.resize);
    if (!this.handleReducedMotion.matches) {
      this.animate();
    } else {
      this.draw(0);
    }
  }

  resize() {
    const bounds = this.container.getBoundingClientRect();
    this.width = bounds.width;
    this.height = bounds.height;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.points = this.cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return {
        x: rect.left - bounds.left + 23,
        y: rect.top - bounds.top + 23
      };
    });
  }

  getSegments() {
    if (this.points.length < 4) {
      return [];
    }

    const [topLeft, topRight, bottomLeft, bottomRight] = this.points;
    return [
      { from: topLeft, to: topRight, offset: 0 },
      { from: topLeft, to: bottomLeft, offset: 0.9 },
      { from: topRight, to: bottomRight, offset: 1.8 },
      { from: bottomLeft, to: bottomRight, offset: 2.7 },
      { from: topLeft, to: bottomRight, offset: 3.6 }
    ];
  }

  draw(time) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const segments = this.getSegments();
    segments.forEach((segment) => {
      ctx.beginPath();
      ctx.moveTo(segment.from.x, segment.from.y);
      ctx.lineTo(segment.to.x, segment.to.y);
      ctx.strokeStyle = 'rgba(255, 110, 110, 0.35)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      const pulse = (Math.sin(time * 1.8 + segment.offset) + 1) / 2;
      const x = segment.from.x + (segment.to.x - segment.from.x) * pulse;
      const y = segment.from.y + (segment.to.y - segment.from.y) * pulse;
      const glow = 0.2 + ((Math.sin(time * 3 + segment.offset) + 1) / 2) * 0.35;

      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 130, 130, ${0.7 + glow * 0.2})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 0, 0, ${glow * 0.4})`;
      ctx.fill();
    });

    this.points.forEach((point, index) => {
      const shimmer = (Math.sin(time * 2.4 + index * 0.85) + 1) / 2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6 + shimmer * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 120, 120, ${0.68 + shimmer * 0.2})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(point.x, point.y, 18 + shimmer * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 0, 0, ${0.1 + shimmer * 0.08})`;
      ctx.fill();
    });
  }

  animate(timestamp = 0) {
    const time = timestamp * 0.001;
    this.draw(time);
    this.frame = window.requestAnimationFrame(this.animate);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    new HeroAmbientAnimation(heroCanvas);
  }

  const heroStatsCanvas = document.getElementById('heroStatsCanvas');
  if (heroStatsCanvas) {
    new HeroStatsNetwork(heroStatsCanvas);
  }
});
