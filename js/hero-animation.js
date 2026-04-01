/* ═══════════════════════════════════════════════════════════════
   INDUS AUTOMATION — Hero Canvas Animations
   Subtle floating industry icons (panels, gears, bolts, chips, gauges)
   with faint circuit-like connections. Very low opacity so hero
   images and text remain fully readable.
   ═══════════════════════════════════════════════════════════════ */

class HeroAmbientAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodes = [];
    this.connections = [];
    this.dpr = window.devicePixelRatio || 1;
    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', this.resize);
    if (!this.reducedMotion.matches) this.animate();
    else this.draw(0);
  }

  resize() {
    const b = this.canvas.parentElement.getBoundingClientRect();
    this.width = b.width;
    this.height = b.height;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.buildNodes();
    this.buildConnections();
  }

  buildNodes() {
    const spacing = Math.max(90, Math.round(this.width / 14));
    const cols = Math.ceil(this.width / spacing) + 1;
    const rows = Math.ceil(this.height / spacing) + 1;
    this.nodes = [];
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        if (Math.random() > 0.38) continue;
        this.nodes.push({
          x: x * spacing + (Math.random() - 0.5) * 30,
          y: y * spacing + (Math.random() - 0.5) * 30,
          icon: Math.floor(Math.random() * 5),
          scale: 0.7 + Math.random() * 0.5,
          alpha: 0.18 + Math.random() * 0.14,
          drift: 0.15 + Math.random() * 0.25,
          offset: Math.random() * Math.PI * 2,
          travel: 1.5 + Math.random() * 3.2,
          tilt: Math.random() * Math.PI * 2,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.06
        });
      }
    }
  }

  buildConnections() {
    this.connections = [];
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        if (Math.random() > 0.06) continue;
        const dx = this.nodes[j].x - this.nodes[i].x;
        const dy = this.nodes[j].y - this.nodes[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < 220) {
          this.connections.push({
            a: this.nodes[i], b: this.nodes[j],
            speed: 0.14 + Math.random() * 0.18,
            offset: Math.random() * Math.PI * 2
          });
        }
      }
    }
  }

  /* ── Icon drawers ── */

  // Control panel box with wiring lines and indicator light
  drawPanel(ctx, x, y, s, a) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const lw = 1 / s;
    ctx.fillStyle = `rgba(120, 18, 18, ${a * 0.5})`;
    ctx.beginPath(); ctx.roundRect(-14, -17, 28, 34, 2); ctx.fill();
    ctx.strokeStyle = `rgba(255,170,150,${a})`;
    ctx.lineWidth = lw;
    // Cabinet outline
    ctx.beginPath(); ctx.roundRect(-14, -17, 28, 34, 2); ctx.stroke();
    // Internal shelves
    ctx.beginPath();
    ctx.moveTo(-14, -6); ctx.lineTo(14, -6);
    ctx.moveTo(-14, 5); ctx.lineTo(14, 5);
    ctx.strokeStyle = `rgba(255,170,150,${a * 0.5})`; ctx.stroke();
    // Wiring lines
    ctx.strokeStyle = `rgba(255,150,130,${a * 0.4})`; ctx.lineWidth = lw * 0.7;
    ctx.beginPath();
    ctx.moveTo(-8, -13); ctx.lineTo(-8, -6);
    ctx.moveTo(-3, -13); ctx.lineTo(-3, -6);
    ctx.moveTo(2, -13); ctx.lineTo(2, -6);
    ctx.moveTo(7, -13); ctx.lineTo(7, -6);
    ctx.stroke();
    // Indicator light
    ctx.fillStyle = `rgba(255,100,80,${a * 0.8})`;
    ctx.beginPath(); ctx.arc(8, 10, 2, 0, Math.PI * 2); ctx.fill();
    // Status bar
    ctx.fillStyle = `rgba(255,170,150,${a * 0.35})`;
    ctx.fillRect(-10, 8, 12, 2.5);
    ctx.restore();
  }

  // Gear/cog
  drawGear(ctx, x, y, s, a) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = `rgba(255,170,150,${a})`; ctx.lineWidth = 1 / s;
    const teeth = 8, outer = 14, inner = 10;
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2;
      const a2 = ((i + 0.25) / teeth) * Math.PI * 2;
      const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
      const a4 = ((i + 0.75) / teeth) * Math.PI * 2;
      if (i === 0) ctx.moveTo(Math.cos(a1) * inner, Math.sin(a1) * inner);
      ctx.lineTo(Math.cos(a2) * outer, Math.sin(a2) * outer);
      ctx.lineTo(Math.cos(a3) * outer, Math.sin(a3) * outer);
      ctx.lineTo(Math.cos(a4) * inner, Math.sin(a4) * inner);
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(138, 20, 20, ${a * 0.2})`;
    ctx.fill();
    ctx.stroke();
    // Center hole
    ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.stroke();
    // Center dot
    ctx.fillStyle = `rgba(255,130,110,${a * 0.6})`;
    ctx.beginPath(); ctx.arc(0, 0, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // Lightning bolt
  drawBolt(ctx, x, y, s, a) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = `rgba(255,150,120,${a})`; ctx.lineWidth = 1.2 / s;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(3, -16); ctx.lineTo(-5, -1); ctx.lineTo(1, -1);
    ctx.lineTo(-3, 16); ctx.lineTo(7, 1); ctx.lineTo(1, 1);
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 118, 92, ${a * 0.32})`;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // PLC / microchip
  drawChip(ctx, x, y, s, a) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = `rgba(255,170,150,${a})`; ctx.lineWidth = 1 / s;
    // Body
    ctx.fillStyle = `rgba(126, 18, 18, ${a * 0.24})`;
    ctx.fillRect(-9, -9, 18, 18);
    ctx.strokeRect(-9, -9, 18, 18);
    // Inner die
    ctx.fillStyle = `rgba(255,160,140,${a * 0.34})`;
    ctx.fillRect(-5, -5, 10, 10);
    // Pins (3 per side)
    ctx.strokeStyle = `rgba(255,150,130,${a * 0.6})`; ctx.lineWidth = 0.8 / s;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath(); ctx.moveTo(i * 5, -9); ctx.lineTo(i * 5, -15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(i * 5, 9); ctx.lineTo(i * 5, 15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-9, i * 5); ctx.lineTo(-15, i * 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(9, i * 5); ctx.lineTo(15, i * 5); ctx.stroke();
    }
    ctx.restore();
  }

  // Pressure gauge
  drawGauge(ctx, x, y, s, a) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = `rgba(255,170,150,${a})`; ctx.lineWidth = 1 / s;
    // Outer ring
    ctx.fillStyle = `rgba(122, 16, 16, ${a * 0.18})`;
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.stroke();
    // Scale arc
    ctx.strokeStyle = `rgba(255,150,130,${a * 0.5})`;
    ctx.beginPath(); ctx.arc(0, 0, 10, Math.PI * 0.75, Math.PI * 2.25); ctx.stroke();
    // Tick marks
    for (let i = 0; i < 5; i++) {
      const ang = Math.PI * 0.75 + (i / 4) * Math.PI * 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ang) * 8, Math.sin(ang) * 8);
      ctx.lineTo(Math.cos(ang) * 10, Math.sin(ang) * 10);
      ctx.stroke();
    }
    // Needle
    ctx.strokeStyle = `rgba(255,120,90,${a * 0.7})`; ctx.lineWidth = 1.2 / s;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(6, -6); ctx.stroke();
    // Center pivot
    ctx.fillStyle = `rgba(255,120,90,${a * 0.5})`;
    ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  drawIcon(ctx, node, x, y, time) {
    const breathe = (Math.sin(time * node.drift + node.offset) + 1) / 2;
    const a = node.alpha + breathe * 0.11;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(node.rotation + time * node.rotSpeed);
    ctx.translate(-x, -y);
    switch (node.icon) {
      case 0: this.drawPanel(ctx, x, y, node.scale, a); break;
      case 1: this.drawGear(ctx, x, y, node.scale, a); break;
      case 2: this.drawBolt(ctx, x, y, node.scale, a); break;
      case 3: this.drawChip(ctx, x, y, node.scale, a); break;
      case 4: this.drawGauge(ctx, x, y, node.scale, a); break;
    }
    ctx.restore();
  }

  draw(time) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Faint connection lines only — no glowing dots
    for (const c of this.connections) {
      const ax = c.a.x + Math.cos(time * c.a.drift + c.a.offset) * c.a.travel;
      const ay = c.a.y + Math.sin(time * c.a.drift * 0.8 + c.a.tilt) * c.a.travel * 0.7;
      const bx = c.b.x + Math.cos(time * c.b.drift + c.b.offset) * c.b.travel;
      const by = c.b.y + Math.sin(time * c.b.drift * 0.8 + c.b.tilt) * c.b.travel * 0.7;

      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
      ctx.strokeStyle = `rgba(255,118,92,${0.2})`;
      ctx.lineWidth = 1.3; ctx.stroke();

      const pulse = ((time * c.speed + c.offset) % 1 + 1) % 1;
      const px = ax + (bx - ax) * pulse;
      const py = ay + (by - ay) * pulse;
      ctx.beginPath();
      ctx.arc(px, py, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 186, 166, 0.88)';
      ctx.fill();
    }

    // Icons
    for (const node of this.nodes) {
      const dx = Math.cos(time * node.drift + node.offset) * node.travel;
      const dy = Math.sin(time * node.drift * 0.8 + node.tilt) * node.travel * 0.7;
      this.drawIcon(ctx, node, node.x + dx, node.y + dy, time);
    }
  }

  animate(ts = 0) {
    this.draw(ts * 0.001);
    this.frame = requestAnimationFrame(this.animate);
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
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', this.resize);
    if (!this.reducedMotion.matches) this.animate();
    else this.draw(0);
  }

  resize() {
    const b = this.container.getBoundingClientRect();
    this.width = b.width; this.height = b.height;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.points = this.cards.map(c => {
      const r = c.getBoundingClientRect();
      return { x: r.left - b.left + 23, y: r.top - b.top + 23 };
    });
  }

  getSegments() {
    if (this.points.length < 4) return [];
    const [tl, tr, bl, br] = this.points;
    return [
      { from: tl, to: tr, offset: 0, speed: 1.2 },
      { from: tl, to: bl, offset: 1.0, speed: 1.4 },
      { from: tr, to: br, offset: 2.0, speed: 1.1 },
      { from: bl, to: br, offset: 3.0, speed: 1.3 },
      { from: tl, to: br, offset: 4.0, speed: 0.9 }
    ];
  }

  // Tiny panel icon for stat network
  drawMiniPanel(ctx, x, y, s, a) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = `rgba(140, 26, 26, ${a * 0.35})`;
    ctx.beginPath(); ctx.roundRect(-8, -9, 16, 18, 2); ctx.fill();
    ctx.strokeStyle = `rgba(255,170,155,${a})`;
    ctx.lineWidth = 1 / s; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.roundRect(-8, -9, 16, 18, 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-8, -3); ctx.lineTo(8, -3);
    ctx.strokeStyle = `rgba(255,170,155,${a * 0.4})`; ctx.stroke();
    ctx.fillStyle = `rgba(255,160,140,${a * 0.4})`;
    ctx.fillRect(-5, -7, 10, 2);
    ctx.fillStyle = `rgba(255,110,90,${a * 0.5})`;
    ctx.beginPath(); ctx.arc(4, 3, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  draw(time) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Faint connection lines
    this.getSegments().forEach(seg => {
      ctx.beginPath();
      ctx.moveTo(seg.from.x, seg.from.y);
      ctx.lineTo(seg.to.x, seg.to.y);
      ctx.strokeStyle = 'rgba(255,118,92,0.18)';
      ctx.lineWidth = 1.35; ctx.stroke();

      // Single traveling icon per line
      const t = ((time * seg.speed * 0.22 + seg.offset) % 1 + 1) % 1;
      const tx = seg.from.x + (seg.to.x - seg.from.x) * t;
      const ty = seg.from.y + (seg.to.y - seg.from.y) * t;
      this.drawMiniPanel(ctx, tx, ty, 0.82, 0.56);
    });

    this.points.forEach((point, index) => {
      const shimmer = (Math.sin(time * 2.2 + index * 0.9) + 1) / 2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8 + shimmer * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 96, 72, ${0.14 + shimmer * 0.08})`;
      ctx.fill();
      this.drawMiniPanel(ctx, point.x, point.y, 0.92, 0.62 + shimmer * 0.14);
    });
  }

  animate(ts = 0) {
    this.draw(ts * 0.001);
    this.frame = requestAnimationFrame(this.animate);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const h = document.getElementById('heroCanvas');
  if (h) new HeroAmbientAnimation(h);
  const s = document.getElementById('heroStatsCanvas');
  if (s) new HeroStatsNetwork(s);
});
