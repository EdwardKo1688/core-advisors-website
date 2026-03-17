// ===== XinDrive UI Components =====

// --- DOM Helper ---
export function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'className') el.className = val;
    else if (key === 'innerHTML') el.innerHTML = val;
    else if (key === 'textContent') el.textContent = val;
    else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
    else if (key === 'style' && typeof val === 'object') Object.assign(el.style, val);
    else if (key === 'dataset') Object.assign(el.dataset, val);
    else el.setAttribute(key, val);
  }
  if (typeof children === 'string') el.textContent = children;
  else if (children instanceof HTMLElement) el.appendChild(children);
  else if (Array.isArray(children)) {
    for (const child of children) {
      if (!child) continue;
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else el.appendChild(child);
    }
  }
  return el;
}

// --- Icons (inline SVG) ---
const ICONS = {
  dashboard: '<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>',
  learn: '<path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>',
  coach: '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
  boost: '<path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>',
  customers: '<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>',
  pipeline: '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/><path d="M10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z"/>',
  target: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="2"/>',
  bell: '<path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>',
  menu: '<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>',
  close: '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
  check: '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>',
  chevronDown: '<path d="M7 10l5 5 5-5z"/>',
  chevronRight: '<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>',
  search: '<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>',
  add: '<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>',
  edit: '<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>',
  logout: '<path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>',
  ai: '<path d="M21 10.12h-6.78l2.74-2.82-2.2-2.2L8 11.86V6H4v16h4v-5.86l6.76 6.76 2.2-2.2-2.74-2.82H21z"/>',
  calendar: '<path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>',
  assessment: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
  person: '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',
  time: '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
  book: '<path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>',
};

export function icon(name, size = 24) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'currentColor');
  svg.innerHTML = ICONS[name] || ICONS.dashboard;
  return svg;
}

// --- Avatar ---
export function avatar(name, variant = 'navy', size = '') {
  const initial = name ? name.charAt(0) : '?';
  const cls = `avatar avatar-${variant}` + (size ? ` avatar-${size}` : '');
  return h('div', { className: cls }, initial);
}

// --- Badge ---
export function badge(text, variant = 'gray') {
  return h('span', { className: `badge badge-${variant}` }, text);
}

// --- Stat Card ---
export function statCard({ label, value, trend, trendLabel, pillar = '' }) {
  const trendClass = trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat';
  const trendSymbol = trend > 0 ? '▲' : trend < 0 ? '▼' : '—';
  return h('div', { className: `stat-card ${pillar}` }, [
    h('div', { className: 'stat-label' }, label),
    h('div', { className: 'stat-value' }, value),
    h('div', { className: `stat-trend ${trendClass}` }, `${trendSymbol} ${trendLabel || ''}`),
  ]);
}

// --- Progress Bar ---
export function progressBar(percent, variant = 'accent') {
  const outer = h('div', { className: 'progress' });
  const inner = h('div', { className: `progress-bar ${variant}`, style: { width: percent + '%' } });
  outer.appendChild(inner);
  return outer;
}

// --- Toast ---
let toastContainer = null;
export function toast(message, type = 'info') {
  if (!toastContainer) {
    toastContainer = h('div', { className: 'toast-container' });
    document.body.appendChild(toastContainer);
  }
  const t = h('div', { className: `toast ${type}` }, message);
  toastContainer.appendChild(t);
  setTimeout(() => { t.remove(); }, 3000);
}

// --- Empty State ---
export function emptyState(message) {
  return h('div', { className: 'empty-state' }, [
    h('p', {}, message),
  ]);
}

// --- App Shell (TopBar + SubNav + Content) ---
export function appShell({ pillar, subTabs, activeTab, user, onTabClick, onPillarClick }) {
  const topbar = h('div', { className: 'topbar' }, [
    h('div', { className: 'topbar-left' }, [
      // Hamburger (mobile)
      h('div', { className: 'hamburger show-mobile', onClick: () => toggleDrawer(true) }, [icon('menu')]),
      // Logo
      h('div', { className: 'topbar-logo', onClick: () => onPillarClick('dashboard') }, [
        h('span', { innerHTML: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#0F2744"/><path d="M8 8l4 8 4-8" stroke="#00B4D8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>` }),
        h('span', {}, '芯智驅'),
      ]),
      // Main Nav
      h('nav', { className: 'main-nav hide-mobile' }, [
        navTab('總覽', 'dashboard', pillar, onPillarClick),
        navTab('驅・知', 'learn', pillar, onPillarClick, 'learn'),
        navTab('驅・伴', 'coach', pillar, onPillarClick, 'coach'),
        navTab('驅・效', 'boost', pillar, onPillarClick, 'boost'),
      ]),
    ]),
    h('div', { className: 'topbar-right hide-mobile' }, [
      notificationBtn(),
      userMenu(user, onPillarClick),
    ]),
  ]);

  const subnav = subTabs ? h('div', { className: `subnav ${pillar || ''}` },
    subTabs.map(tab =>
      h('div', {
        className: `sub-tab ${tab.id === activeTab ? 'active' : ''}`,
        onClick: () => onTabClick(tab.id),
      }, tab.label)
    )
  ) : null;

  const content = h('div', { className: 'content fade-in' });

  const wrapper = h('div', {}, [topbar, subnav, content].filter(Boolean));

  // Mobile drawer
  wrapper.appendChild(mobileDrawer(pillar, user, onPillarClick));

  return { wrapper, content };
}

function navTab(label, id, activePillar, onClick, dotColor) {
  const isActive = (id === 'dashboard' && !activePillar) || activePillar === id;
  const tab = h('div', {
    className: `nav-tab ${isActive ? 'active' : ''}`,
    dataset: { pillar: id },
    onClick: () => onClick(id),
  }, [
    dotColor ? h('span', { className: `pillar-dot ${dotColor}` }) : null,
    h('span', {}, label),
  ].filter(Boolean));
  return tab;
}

function notificationBtn() {
  const btn = h('div', { className: 'notification-btn', id: 'notif-btn' }, [icon('bell', 20)]);
  const badgeEl = h('span', { className: 'notification-badge', id: 'notif-badge' }, '3');
  btn.appendChild(badgeEl);
  return btn;
}

function userMenu(user, onPillarClick) {
  const menu = h('div', { className: 'user-menu', id: 'user-menu-btn' }, [
    avatar(user?.full_name || '?', 'accent', 'sm'),
    h('div', {}, [
      h('div', { className: 'user-name' }, user?.full_name || ''),
      h('div', { className: 'user-role' }, user?.role_display || ''),
    ]),
  ]);
  return menu;
}

function mobileDrawer(pillar, user, onPillarClick) {
  const overlay = h('div', { className: 'mobile-drawer-overlay', id: 'drawer-overlay', onClick: () => toggleDrawer(false) });
  const drawer = h('div', { className: 'mobile-drawer', id: 'mobile-drawer' }, [
    h('div', { className: 'drawer-header' }, [
      h('h2', {}, '芯智驅'),
      h('div', { className: 'drawer-close', onClick: () => toggleDrawer(false) }, [icon('close', 20)]),
    ]),
    h('div', { className: 'drawer-nav' }, [
      drawerItem('總覽', 'dashboard', () => { onPillarClick('dashboard'); toggleDrawer(false); }),
      h('div', { className: 'drawer-section' }, '驅・知 LEARN'),
      drawerItem('課程目錄', '/learn', () => { onPillarClick('learn'); toggleDrawer(false); }),
      drawerItem('我的學習', '/learn/progress', () => { window.location.hash = '#/learn/progress'; toggleDrawer(false); }),
      h('div', { className: 'drawer-section' }, '驅・伴 COACH'),
      drawerItem('AI 教練', '/coach/ai', () => { window.location.hash = '#/coach/ai'; toggleDrawer(false); }),
      drawerItem('陪跑計畫', '/coach', () => { onPillarClick('coach'); toggleDrawer(false); }),
      h('div', { className: 'drawer-section' }, '驅・效 BOOST'),
      drawerItem('客戶管理', '/boost/customers', () => { window.location.hash = '#/boost/customers'; toggleDrawer(false); }),
      drawerItem('Pipeline', '/boost/pipeline', () => { window.location.hash = '#/boost/pipeline'; toggleDrawer(false); }),
    ]),
  ]);
  const frag = h('div', {}, [overlay, drawer]);
  return frag;
}

function drawerItem(label, path, onClick) {
  return h('div', { className: 'drawer-item', onClick }, label);
}

function toggleDrawer(open) {
  document.getElementById('mobile-drawer')?.classList.toggle('open', open);
  document.getElementById('drawer-overlay')?.classList.toggle('open', open);
}
