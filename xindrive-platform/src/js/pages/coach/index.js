// ===== COACH — 陪跑中心 =====
import Store from '../../store.js';
import Router from '../../router.js';
import { h, appShell, avatar, badge } from '../../components/ui.js';

export function render() {
  const user = Store.getUser();
  const { wrapper } = appShell({
    pillar: 'coach',
    subTabs: [
      { id: 'plans', label: '📋 陪跑計畫' },
      { id: 'ai', label: '🤖 AI 教練' },
      { id: 'assessment', label: '📈 能力評估' },
    ],
    activeTab: 'plans', user,
    onTabClick: (id) => {
      if (id === 'ai') Router.navigate('/coach/ai');
      else if (id === 'assessment') Router.navigate('/coach/assessment');
    },
    onPillarClick: (id) => Router.navigate(id === 'dashboard' ? '/dashboard' : `/${id}`),
  });
  return wrapper;
}

export function mount() {
  const content = document.querySelector('.content');
  if (!content) return;
  const user = Store.getUser();
  let plans = Store.get('coaching_plans');

  // Filter by role
  if (user.role === 'sales') plans = plans.filter(p => p.coachee_id === user.id);
  else if (user.role === 'trainer') plans = plans.filter(p => p.coach_id === user.id || p.coachee_id === user.id);

  content.appendChild(h('div', { className: 'page-header' }, [
    h('h1', {}, '陪跑計畫'),
    h('div', { className: 'page-desc' }, `共 ${plans.length} 個計畫`),
  ]));

  const grid = h('div', { className: 'plan-grid' });
  plans.forEach(plan => {
    const coach = Store.find('users', plan.coach_id);
    const coachee = Store.find('users', plan.coachee_id);
    const sessions = Store.query('coaching_sessions', s => s.plan_id === plan.id);
    const completed = sessions.filter(s => s.status === 'completed').length;
    const nextSession = sessions.find(s => s.status === 'scheduled');

    const card = h('div', { className: 'plan-card', onClick: () => {
      if (sessions.length) Router.navigate(`/coach/session/${sessions[0].id}`);
    }}, [
      h('div', { className: 'plan-header' }, [
        h('div', { className: 'plan-title' }, plan.title),
        badge(plan.methodology, 'coach'),
      ]),
      h('div', { className: 'plan-pair' }, [
        avatar((coach?.full_name || coach?.name) || '?', 'coach', 'sm'),
        h('span', { className: 'pair-arrow' }, '→'),
        avatar((coachee?.full_name || coachee?.name) || '?', 'accent', 'sm'),
        h('div', {}, [
          h('div', { className: 'text-sm', style: { fontWeight: '500' } }, `${(coach?.full_name || coach?.name)} → ${(coachee?.full_name || coachee?.name)}`),
        ]),
      ]),
      h('div', { className: 'plan-meta' }, [
        h('span', {}, `✓ ${completed} 次 Session`),
        h('span', {}, `│`),
        badge(plan.status === 'active' ? '進行中' : plan.status === 'completed' ? '已完成' : '暫停',
          plan.status === 'active' ? 'success' : 'gray'),
      ]),
      nextSession ? h('div', { className: 'plan-next' }, [
        h('span', {}, '📅'),
        h('span', {}, `下一次 Session：${formatDate(nextSession.scheduled_at)}`),
      ]) : null,
    ].filter(Boolean));
    grid.appendChild(card);
  });

  if (!plans.length) grid.appendChild(h('div', { className: 'empty-state' }, [h('p', {}, '目前沒有進行中的陪跑計畫')]));
  content.appendChild(grid);
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', weekday: 'short' });
}
