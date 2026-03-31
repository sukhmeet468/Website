class IndustrialGrid {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodes = []; this.connections = []; this.pulses = [];
    this.mouse = { x: -1000, y: -1000 };
    this.time = 0;
    this.dpr = window.devicePixelRatio || 1;
    this.resize(); this.init(); this.bindEvents(); this.animate();
  }
  resize() {
    const r = this.canvas.parentElement.getBoundingClientRect();
    this.w = r.width; this.h = r.height;
    this.canvas.width = this.w * this.dpr; this.canvas.height = this.h * this.dpr;
    this.canvas.style.width = this.w + 'px'; this.canvas.style.height = this.h + 'px';
    this.ctx.scale(this.dpr, this.dpr);
  }
  init() {
    this.nodes = []; this.connections = [];
    const sp = 68, cols = Math.ceil(this.w / sp) + 2, rows = Math.ceil(this.h / sp) + 2;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      if (Math.random() > 0.18) this.nodes.push({
        x: i * sp + (Math.random() - 0.5) * 20, y: j * sp + (Math.random() - 0.5) * 20,
        r: Math.random() * 2.2 + 1.2, pulse: Math.random() * Math.PI * 2,
        speed: 0.015 + Math.random() * 0.025, active: Math.random() > 0.45
      });
    }
    for (let i = 0; i < this.nodes.length; i++) for (let j = i + 1; j < this.nodes.length; j++) {
      const dx = this.nodes[i].x - this.nodes[j].x, dy = this.nodes[i].y - this.nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < sp * 1.65 && Math.random() > 0.3) this.connections.push({ a: i, b: j, dist });
    }
    for (let i = 0; i < 20; i++) this.spawnPulse();
  }
  spawnPulse() {
    if (!this.connections.length) return;
    const c = this.connections[Math.floor(Math.random() * this.connections.length)];
    this.pulses.push({ conn: c, t: 0, speed: 0.01 + Math.random() * 0.014, fwd: Math.random() > 0.5 });
  }
  bindEvents() {
    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { this.resize(); this.init(); }, 200); });
    this.canvas.addEventListener('mousemove', (e) => { const r = this.canvas.getBoundingClientRect(); this.mouse.x = e.clientX - r.left; this.mouse.y = e.clientY - r.top; });
    this.canvas.addEventListener('mouseleave', () => { this.mouse.x = -1000; this.mouse.y = -1000; });
  }
  animate() {
    this.time += 0.016;
    const c = this.ctx; c.clearRect(0, 0, this.w, this.h);
    for (const cn of this.connections) {
      const a = this.nodes[cn.a], b = this.nodes[cn.b];
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const dm = Math.sqrt((mx - this.mouse.x) ** 2 + (my - this.mouse.y) ** 2);
      const g = Math.max(0, 1 - dm / 200);

      // Base connection path (orthogonal style) for visual network grid
      c.beginPath();
      if (Math.abs(a.x - b.x) > Math.abs(a.y - b.y)) {
        c.moveTo(a.x, a.y); c.lineTo(b.x, a.y); c.lineTo(b.x, b.y);
      } else {
        c.moveTo(a.x, a.y); c.lineTo(a.x, b.y); c.lineTo(b.x, b.y);
      }
      c.strokeStyle = `rgba(230,0,0,${0.16 + g * 0.24})`;
      c.lineWidth = 1 + g * 1.2;
      c.stroke();

      // Animated power-flow along connection
      const t0 = (this.time * 0.24 + cn.dist * 0.004) % 1;
      const span = 0.18;
      const t1 = (t0 + span) % 1;
      const drawSegment = (u, v) => {
        const x0 = a.x + (b.x - a.x) * u;
        const y0 = a.y + (b.y - a.y) * u;
        const x1 = a.x + (b.x - a.x) * v;
        const y1 = a.y + (b.y - a.y) * v;
        c.beginPath();
        c.moveTo(x0, y0);
        c.lineTo(x1, y1);
        const intensity = 0.24 + g * 0.5 + 0.22 * Math.sin(this.time * 6 + cn.dist * 0.12);
        c.strokeStyle = `rgba(255,110,80,${Math.min(0.8, intensity)})`;
        c.lineWidth = 2.2 + g * 2.2;
        c.stroke();
      };
      if (t0 < t1) drawSegment(t0, t1);
      else { drawSegment(t0, 1); drawSegment(0, t1); }
    }
    for (const n of this.nodes) {
      n.pulse += n.speed;
      const dm = Math.sqrt((n.x - this.mouse.x) ** 2 + (n.y - this.mouse.y) ** 2);
      const g = Math.max(0, 1 - dm / 180);
      const al = n.active ? 0.42 + Math.sin(n.pulse) * 0.22 + g * 0.42 : 0.14 + g * 0.24;
      c.beginPath(); c.arc(n.x, n.y, n.r + g * 2, 0, Math.PI * 2);
      c.fillStyle = `rgba(230,0,0,${al})`; c.fill();
      if (n.active || g > 0.25) { c.beginPath(); c.arc(n.x, n.y, n.r + 5 + g * 5, 0, Math.PI * 2); c.fillStyle = `rgba(230,0,0,${al * 0.22})`; c.fill(); }
    }
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const p = this.pulses[i]; p.t += p.speed;
      if (p.t > 1) { this.pulses.splice(i, 1); if (Math.random() > 0.3) this.spawnPulse(); continue; }
      const a = this.nodes[p.conn.a], b = this.nodes[p.conn.b];
      const t = p.fwd ? p.t : 1 - p.t;
      const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
      c.beginPath(); c.arc(x, y, 3.8, 0, Math.PI * 2); c.fillStyle = `rgba(255,30,30,${0.95 - p.t * 0.45})`; c.fill();
      c.beginPath(); c.arc(x, y, 10, 0, Math.PI * 2); c.fillStyle = `rgba(255,40,40,${0.22 - p.t * 0.12})`; c.fill();
    }
    if (Math.random() > 0.84) this.spawnPulse();
    requestAnimationFrame(() => this.animate());
  }
}
document.addEventListener('DOMContentLoaded', () => { const c = document.getElementById('heroCanvas'); if (c) new IndustrialGrid(c); });
