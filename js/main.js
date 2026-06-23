/* ============================================================
   RYOMA — interactions: scroll reveal, counters, form, filters
   Uses GSAP+ScrollTrigger if present; else IntersectionObserver.
   ============================================================ */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reduce) {
    reveals.forEach(el => el.classList.add("in"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("in"));
  }

  /* ---------- Number counters ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const dec = (el.dataset.dec ? parseInt(el.dataset.dec) : 0);
    const dur = 1600;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = dec ? val.toFixed(dec) : Math.round(val).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = dec ? target.toFixed(dec) : target.toLocaleString();
    }
    requestAnimationFrame(step);
  }
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    if (reduce) counters.forEach(el => { el.textContent = el.dataset.count; });
    else {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
      }, { threshold: 0.5 });
      counters.forEach(el => cio.observe(el));
    }
  }

  /* ---------- Hero parallax on neural group is in neural.js; here: subtle text ---------- */
  if (!reduce && window.gsap) {
    gsap.registerPlugin();
  }

  /* ---------- Insights filter ---------- */
  const filterBtns = document.querySelectorAll(".ins-filter button");
  const insCards = document.querySelectorAll(".ins-grid .ins-card");
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.cat;
        insCards.forEach(card => {
          const show = cat === "all" || card.dataset.cat === cat;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const card = form.closest(".form-card");
      form.style.display = "none";
      const ok = card.querySelector(".form-success");
      if (ok) ok.classList.add("show");
    });
    // prefill interest from query string (?interest=Executive)
    const params = new URLSearchParams(location.search);
    const interest = params.get("interest");
    if (interest) {
      const sel = form.querySelector("select[name=interest]");
      if (sel) Array.from(sel.options).forEach(o => { if (o.value.toLowerCase().includes(interest.toLowerCase())) sel.value = o.value; });
    }
  }
})();
