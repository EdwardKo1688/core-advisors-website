// ===== Login Page =====
import Store from '../store.js';
import Router from '../router.js';
import { h, toast } from '../components/ui.js';

const DEMO_ROLES = [
  { emoji: '👔', name: '林總監', title: 'Manager', email: 'lin@sinda.com' },
  { emoji: '👨‍💼', name: '陳業務', title: 'Sales', email: 'chen@sinda.com' },
  { emoji: '👩‍🏫', name: '張教練', title: 'Trainer', email: 'chang@sinda.com' },
];

export function render() {
  return `<div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-brand">
          <div class="brand-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M8 8l4 8 4-8" stroke="#00B4D8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1>芯智驅 XinDrive AI</h1>
          <div class="brand-sub">IC 產業 AI 驅動管理平台</div>
        </div>
        <div id="login-error" class="login-error hidden"></div>
        <div class="form-group">
          <label>電子郵件</label>
          <input class="form-input" type="email" id="login-email" placeholder="you@company.com">
        </div>
        <div class="form-group">
          <label>密碼</label>
          <input class="form-input" type="password" id="login-password" placeholder="輸入密碼">
        </div>
        <button class="btn btn-primary btn-full btn-lg" id="login-btn">登入</button>
        <div class="login-divider">或選擇 Demo 角色</div>
        <div class="demo-roles" id="demo-roles"></div>
      </div>
      <div class="login-footer">
        <div class="login-pillars">
          <span class="login-pillar"><span class="dot learn"></span> 驅・知</span>
          <span class="login-pillar"><span class="dot coach"></span> 驅・伴</span>
          <span class="login-pillar"><span class="dot boost"></span> 驅・效</span>
        </div>
        <div class="motto">不忘初心，AI倍增</div>
      </div>
    </div>
  </div>`;
}

export function mount() {
  // Demo role buttons
  const rolesEl = document.getElementById('demo-roles');
  DEMO_ROLES.forEach(role => {
    const btn = h('div', { className: 'demo-role-btn', onClick: () => loginAs(role.email) }, [
      h('div', { className: 'role-avatar' }, role.emoji),
      h('div', { className: 'role-name' }, role.name),
      h('div', { className: 'role-title' }, role.title),
    ]);
    rolesEl.appendChild(btn);
  });

  // Login button
  document.getElementById('login-btn').addEventListener('click', handleLogin);
  document.getElementById('login-password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
}

function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email) return showError('請輸入電子郵件');
  loginAs(email);
}

function loginAs(email) {
  const user = Store.query('users', u => u.email === email)[0];
  if (!user) {
    showError('找不到此帳號，請使用 Demo 角色登入');
    return;
  }
  const role = Store.query('roles', r => r.name === user.role)[0];
  Store.setUser({
    ...user,
    full_name: user.full_name || user.name,
    role_display: role?.display_name || user.role,
  });
  toast(`歡迎回來，${user.full_name || user.name}`, 'success');
  Router.navigate('/dashboard');
}

function showError(msg) {
  const el = document.getElementById('login-error');
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3000);
}
