// ===== Navbar Component =====
function loadNavbar(activePage) {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  nav.innerHTML = `
    <div class="navbar-inner">
      <a href="index.html" class="navbar-brand">
        <span class="brand-icon">🚛</span>
        <span>富昇智慧物流</span>
      </a>
      <nav class="navbar-menu" id="navMenu">
        <a href="index.html" class="navbar-link${activePage==='home'?' active':''}">首頁</a>
        <a href="services.html" class="navbar-link${activePage==='services'?' active':''}">服務方案</a>
        <a href="cases.html" class="navbar-link${activePage==='cases'?' active':''}">客戶案例</a>
        <a href="shipper.html" class="navbar-link${activePage==='shipper'?' active':''}">貨主入口</a>
        <a href="fleet.html" class="navbar-link${activePage==='fleet'?' active':''}">車隊入口</a>
        <a href="inquiry.html" class="btn btn-primary btn-sm navbar-cta">立即詢價</a>
      </nav>
      <button class="navbar-toggle" id="navToggle" aria-label="選單">☰</button>
    </div>`;
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
      toggle.textContent = menu.classList.contains('open') ? '✕' : '☰';
    });
    menu.querySelectorAll('.navbar-link').forEach(link => {
      link.addEventListener('click', () => { menu.classList.remove('open'); toggle.textContent = '☰'; });
    });
  }
}

// ===== Footer Component =====
function loadFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <h3>🚛 富昇智慧物流平台</h3>
          <p>整合 S90 小件、中大型配送、專車棧板與第三地出貨的智慧物流平台，為您打造高效、透明、可靠的配送體驗。</p>
        </div>
        <div class="footer-col">
          <h4>服務方案</h4>
          <a href="service-s90.html">S90 小件配送</a>
          <a href="service-truck.html">中大型配送</a>
          <a href="service-special.html">專車棧板</a>
          <a href="service-3pl.html">第三地出貨</a>
        </div>
        <div class="footer-col">
          <h4>平台入口</h4>
          <a href="shipper.html">貨主入口</a>
          <a href="fleet.html">車隊入口</a>
          <a href="admin.html">營運管理</a>
          <a href="inquiry.html">線上詢價</a>
        </div>
        <div class="footer-col">
          <h4>聯繫我們</h4>
          <a href="mailto:service@fusheng-logistics.com">service@fusheng-logistics.com</a>
          <a href="tel:+886-2-XXXX-XXXX">02-XXXX-XXXX</a>
          <a href="inquiry.html">線上諮詢</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 富昇智慧物流平台. All Rights Reserved.</span>
        <span>Powered by FuSheng Logistics Technology</span>
      </div>
    </div>`;
}

// ===== Scroll Animation (Intersection Observer) =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in, .fade-in-left').forEach(el => observer.observe(el));
}

// ===== Counter Animation =====
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
        const duration = 2000;
        const start = performance.now();
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = (target * eased).toFixed(decimals);
          el.textContent = prefix + current + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => observer.observe(c));
}

// ===== Navbar Scroll Effect =====
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 60 ? 'rgba(15,23,42,.98)' : 'rgba(15,23,42,.95)';
    navbar.style.boxShadow = window.scrollY > 60 ? '0 4px 12px rgba(0,0,0,.15)' : 'none';
  });
}

// ===== Tab Switching =====
function initTabs(container) {
  const wrap = container || document;
  const buttons = wrap.querySelectorAll('.tab-btn');
  const contents = wrap.querySelectorAll('.tab-content');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const panel = wrap.querySelector(`#${target}`);
      if (panel) panel.classList.add('active');
    });
  });
}

// ===== Init All =====
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page || 'home';
  loadNavbar(page);
  loadFooter();
  initScrollAnimations();
  animateCounters();
  initNavbarScroll();
  initTabs(document);
});
