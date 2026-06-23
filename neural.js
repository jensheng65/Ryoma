/* ============================================================
   RYOMA — 3D neural fiber network background (Three.js)
   Softly glowing silver-blue threads + drifting nodes.
   Graceful fallback to a 2D canvas if WebGL/Three is absent.
   ============================================================ */
(function () {
  const canvas = document.getElementById("neural-canvas");
  if (!canvas) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasThree = typeof THREE !== "undefined";

  /* ---------------- Three.js path ---------------- */
  function initThree() {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) { return initCanvas2D(); }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 26;

    const group = new THREE.Group();
    scene.add(group);

    // Build a brain-like ellipsoidal node cloud
    const COUNT = window.innerWidth < 760 ? 130 : 230;
    const nodes = [];
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // distribute on a slightly flattened sphere shell with jitter
      const u = Math.random(), v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const rad = 13 + Math.random() * 4.5;
      const x = rad * Math.sin(phi) * Math.cos(theta) * 1.35;
      const y = rad * Math.sin(phi) * Math.sin(theta) * 0.92;
      const z = rad * Math.cos(phi) * 1.0;
      nodes.push({
        base: new THREE.Vector3(x, y, z),
        spd: 0.2 + Math.random() * 0.6,
        ph: Math.random() * Math.PI * 2,
      });
      positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
    }

    // Points (glowing nodes)
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const sprite = makeGlowTexture();
    const ptMat = new THREE.PointsMaterial({
      size: 0.95, map: sprite, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, color: new THREE.Color(0x9cc4ec), opacity: 0.9,
    });
    const points = new THREE.Points(ptGeo, ptMat);
    group.add(points);

    // Lines connecting near neighbours (computed once on base positions)
    const linePos = [];
    const maxDist = 6.4;
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const a = nodes[i].base, b = nodes[j].base;
        if (a.distanceTo(b) < maxDist) {
          linePos.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    const lineArr = new Float32Array(linePos);
    lineGeo.setAttribute("position", new THREE.BufferAttribute(lineArr, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x6ea8e6), transparent: true, opacity: 0.16,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    // store index pairs to update line endpoints with node motion
    const pairs = [];
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        if (nodes[i].base.distanceTo(nodes[j].base) < maxDist) pairs.push([i, j]);
      }
    }

    let mx = 0, my = 0, tmx = 0, tmy = 0;
    window.addEventListener("mousemove", (e) => {
      tmx = (e.clientX / window.innerWidth - 0.5);
      tmy = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });

    function resize() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    canvas.classList.add("ready");

    const ptPos = ptGeo.attributes.position.array;
    const lnPos = lineGeo.attributes.position.array;
    const clock = new THREE.Clock();

    function animate() {
      const t = clock.getElapsedTime();

      // breathe node positions
      for (let i = 0; i < COUNT; i++) {
        const n = nodes[i];
        const off = Math.sin(t * n.spd + n.ph) * 0.5;
        ptPos[i * 3]     = n.base.x + Math.cos(n.ph + t * 0.3) * off;
        ptPos[i * 3 + 1] = n.base.y + Math.sin(n.ph + t * 0.25) * off;
        ptPos[i * 3 + 2] = n.base.z + off * 0.6;
      }
      ptGeo.attributes.position.needsUpdate = true;

      for (let k = 0; k < pairs.length; k++) {
        const [i, j] = pairs[k];
        lnPos[k * 6]     = ptPos[i * 3];
        lnPos[k * 6 + 1] = ptPos[i * 3 + 1];
        lnPos[k * 6 + 2] = ptPos[i * 3 + 2];
        lnPos[k * 6 + 3] = ptPos[j * 3];
        lnPos[k * 6 + 4] = ptPos[j * 3 + 1];
        lnPos[k * 6 + 5] = ptPos[j * 3 + 2];
      }
      lineGeo.attributes.position.needsUpdate = true;

      mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;
      group.rotation.y = t * 0.045 + mx * 0.5;
      group.rotation.x = Math.sin(t * 0.08) * 0.12 + my * 0.35;

      // pulse opacity
      lineMat.opacity = 0.13 + Math.sin(t * 0.8) * 0.04;

      renderer.render(scene, camera);
      if (!reduce) requestAnimationFrame(animate);
    }
    animate();
    if (reduce) renderer.render(scene, camera);
  }

  function makeGlowTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(180,210,245,1)");
    grad.addColorStop(0.25, "rgba(120,170,230,0.7)");
    grad.addColorStop(1, "rgba(80,130,200,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }

  /* ---------------- 2D fallback ---------------- */
  function initCanvas2D() {
    const ctx = canvas.getContext("2d");
    let w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const N = window.innerWidth < 760 ? 50 : 90;
    let pts = [];
    function setup() {
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      pts = Array.from({ length: N }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * dpr, vy: (Math.random() - 0.5) * 0.25 * dpr,
      }));
    }
    setup();
    window.addEventListener("resize", setup);
    canvas.classList.add("ready");
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      const md = 150 * dpr;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < md) {
            ctx.strokeStyle = `rgba(110,168,230,${0.14 * (1 - d / md)})`;
            ctx.lineWidth = 0.6 * dpr;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = "rgba(156,196,236,0.65)";
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.4 * dpr, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduce) requestAnimationFrame(draw);
    }
    draw();
  }

  if (hasThree) initThree(); else initCanvas2D();
})();
