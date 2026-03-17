// ===== BOOST — 業績目標 =====
import Store from '../../store.js';
import Router from '../../router.js';
import { h, appShell, statCard, badge, avatar, progressBar } from '../../components/ui.js';
import { barChart, progressRing } from '../../components/charts.js';

const SUB_TABS = [
  { id: 'overview', label: '📊 業績總覽' },
  { id: 'customers', label: '🏢 客戶管理' },
  { id: 'pipeline', label: '🔄 Pipeline' },
  { id: 'targets', label: '🎯 業績目標' },
];

export function render() {
  const user = Store.getUser();
  const { wrapper } = appShell({
    pillar: 'boost',
    subTabs: SUB_TABS,
    activeTab: 'targets', user,
    onTabClick: (id) => {
      if (id === 'overview') Router.navigate('/boost');
      else if (id === 'customers') Router.navigate('/boost/customers');
      else if (id === 'pipeline') Router.navigate('/boost/pipeline');
    },
    onPillarClick: (id) => Router.navigate(id === 'dashboard' ? '/dashboard' : `/${id}`),
  });
  return wrapper;
}

export function mount() {
  const content = document.querySelector('.content');
  if (!content) return;

  const targets = Store.get('targets');
  const users = Store.get('users');
  const teamTarget = targets.find(t => t.type === 'team');
  const individualTargets = targets.filter(t => t.type === 'individual');

  content.appendChild(h('div', { className: 'page-header' }, [
    h('h1', {}, '業績目標'),
    h('div', { className: 'page-desc' }, teamTarget ? `${teamTarget.period} 業績追蹤` : 'Q1 2026 業績追蹤'),
  ]));

  // Team overview
  if (teamTarget) {
    const teamCard = h('div', { className: 'card mb-6' });
    const rate = Math.round((teamTarget.achievement_rate || 0) * 100);

    teamCard.appendChild(h('div', { className: 'flex items-center justify-between mb-4' }, [
      h('h2', { className: 'h2' }, '團隊總目標'),
      badge(teamTarget.period, 'boost'),
    ]));

    const teamLayout = h('div', { className: 'target-team-layout' });

    // Progress Ring
    const ringContainer = h('div', { className: 'target-ring-container' });
    ringContainer.appendChild(progressRing(rate, { size: 160, color: rate >= 80 ? '#10B981' : rate >= 60 ? '#F59E0B' : '#EF4444' }));
    ringContainer.appendChild(h('div', { className: 'text-center mt-2' }, [
      h('div', { style: { fontSize: '1.5rem', fontWeight: '700', color: 'var(--xd-boost)' } }, `${rate}%`),
      h('div', { className: 'text-sm text-muted' }, '達成率'),
    ]));
    teamLayout.appendChild(ringContainer);

    // Stats
    const teamStats = h('div', { className: 'target-stats' });
    teamStats.appendChild(targetStat('目標', formatTWD(teamTarget.target_twd), 'var(--xd-gray-600)'));
    teamStats.appendChild(targetStat('實際', formatTWD(teamTarget.actual_twd), 'var(--xd-boost)'));
    teamStats.appendChild(targetStat('差距', formatTWD((teamTarget.target_twd || 0) - (teamTarget.actual_twd || 0)), 'var(--xd-danger)'));
    teamStats.appendChild(targetStat('剩餘天數', `${daysLeft()} 天`, 'var(--xd-info)'));
    teamLayout.appendChild(teamStats);

    teamCard.appendChild(teamLayout);
    if (teamTarget.notes) {
      teamCard.appendChild(h('div', { className: 'mt-4 p-3 text-sm', style: { background: 'var(--xd-gray-50)', borderRadius: 'var(--radius)', lineHeight: '1.6' } }, teamTarget.notes));
    }
    content.appendChild(teamCard);
  }

  // Individual targets
  const indCard = h('div', { className: 'card' });
  indCard.appendChild(h('h2', { className: 'h2 mb-4' }, '個人業績目標'));

  // Bar chart
  const indNames = individualTargets.map(t => {
    const u = users.find(u => u.id === t.user_id);
    return u?.name || u?.full_name || '?';
  });
  const indActual = individualTargets.map(t => (t.actual_twd || 0) / 1e6);
  const indTarget = individualTargets.map(t => (t.target_twd || 0) / 1e6);

  indCard.appendChild(h('div', { className: 'mb-6' }, [
    barChart(indActual, { labels: indNames, color: '#F59E0B', height: 180 }),
  ]));

  // Individual detail list
  individualTargets.forEach(t => {
    const u = users.find(u => u.id === t.user_id);
    const rate = Math.round((t.achievement_rate || 0) * 100);

    indCard.appendChild(h('div', { className: 'target-individual-item' }, [
      avatar(u?.name || u?.full_name || '?', rate >= 80 ? 'success' : 'accent', 'sm'),
      h('div', { className: 'target-ind-info' }, [
        h('div', { className: 'flex items-center gap-2' }, [
          h('span', { style: { fontWeight: '500' } }, u?.name || u?.full_name),
          badge(`${rate}%`, rate >= 80 ? 'success' : rate >= 60 ? 'warning' : 'danger'),
        ]),
        progressBar(rate, { height: 6, color: rate >= 80 ? 'var(--xd-success)' : rate >= 60 ? 'var(--xd-warning)' : 'var(--xd-danger)' }),
        h('div', { className: 'flex justify-between text-xs text-muted mt-1' }, [
          h('span', {}, `實際：${formatTWD(t.actual_twd)}`),
          h('span', {}, `目標：${formatTWD(t.target_twd)}`),
        ]),
        t.notes ? h('div', { className: 'text-xs mt-1', style: { color: 'var(--xd-gray-500)', lineHeight: '1.5' } }, t.notes) : null,
      ]),
    ]));
  });

  content.appendChild(indCard);
}

function targetStat(label, value, color) {
  return h('div', { className: 'target-stat' }, [
    h('div', { className: 'text-sm text-muted' }, label),
    h('div', { style: { fontSize: '1.25rem', fontWeight: '600', color } }, value),
  ]);
}

function formatTWD(n) {
  if (!n) return 'NT$0';
  if (n >= 1e6) return `NT$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `NT$${(n / 1e3).toFixed(0)}K`;
  return `NT$${n}`;
}

function daysLeft() {
  const endOfQ = new Date(2026, 2, 31); // March 31, 2026
  const today = new Date();
  return Math.max(0, Math.ceil((endOfQ - today) / (1000 * 60 * 60 * 24)));
}
