// ===== XinDrive Modal & Drawer =====
import { h, icon } from './ui.js';

// --- Modal ---
export function showModal({ title, body, footer, wide = false }) {
  closeModal();
  const overlay = h('div', { className: 'modal-overlay', id: 'xd-modal', onClick: (e) => {
    if (e.target === overlay) closeModal();
  }});
  const box = h('div', { className: 'modal-box', style: wide ? { maxWidth: '720px' } : {} }, [
    h('div', { className: 'modal-header' }, [
      h('h2', {}, title),
      h('div', { className: 'modal-close', onClick: closeModal }, [icon('close', 20)]),
    ]),
    h('div', { className: 'modal-body' }, body instanceof HTMLElement ? [body] : body),
    footer ? h('div', { className: 'modal-footer' }, footer) : null,
  ].filter(Boolean));
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  document.addEventListener('keydown', modalEsc);
}

export function closeModal() {
  document.getElementById('xd-modal')?.remove();
  document.removeEventListener('keydown', modalEsc);
}

function modalEsc(e) { if (e.key === 'Escape') closeModal(); }

// --- Confirm Dialog ---
export function confirm(message) {
  return new Promise(resolve => {
    const body = h('p', { style: { fontSize: '.95rem', lineHeight: '1.6' } }, message);
    const footer = [
      h('button', { className: 'btn btn-outline', onClick: () => { closeModal(); resolve(false); } }, '取消'),
      h('button', { className: 'btn btn-primary', onClick: () => { closeModal(); resolve(true); } }, '確認'),
    ];
    showModal({ title: '確認操作', body, footer });
  });
}

// --- Drawer (Right Panel) ---
export function showDrawer({ title, body }) {
  closeDrawer();
  const overlay = h('div', { className: 'drawer-overlay', id: 'xd-drawer-overlay', onClick: closeDrawer });
  const panel = h('div', { className: 'drawer-panel', id: 'xd-drawer' }, [
    h('div', { className: 'drawer-panel-header' }, [
      h('h2', { className: 'h2' }, title),
      h('div', { className: 'modal-close', onClick: closeDrawer }, [icon('close', 20)]),
    ]),
    h('div', { className: 'drawer-panel-body' }, body instanceof HTMLElement ? [body] : body),
  ]);
  document.body.appendChild(overlay);
  document.body.appendChild(panel);
  document.addEventListener('keydown', drawerEsc);
}

export function closeDrawer() {
  document.getElementById('xd-drawer-overlay')?.remove();
  document.getElementById('xd-drawer')?.remove();
  document.removeEventListener('keydown', drawerEsc);
}

function drawerEsc(e) { if (e.key === 'Escape') closeDrawer(); }
