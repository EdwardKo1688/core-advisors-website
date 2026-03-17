// ===== BOOST — 業績總覽 =====
import Store from '../../store.js';
import Router from '../../router.js';
import { h, appShell, statCard, badge, avatar } from '../../components/ui.js';
import { lineChart, barChart } from '../../components/charts.js';

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
    activeTab: 'overview', user,
    onTabClick: (id) => {
      if (id === 'customers') Router.navigate('/boost/customers');
      else if (id === 'pipeline') Router.navigate('/boost/pipeline');
      else if (id === 'targets') Router.navigate('/boost/targets');
    },
    onPillarClick: (id) => Router.navigate(id === 'dashboard' ? '/dashboard' : `/${id}`),
  });
  return wrapper;
}

export function mount() {
  const content = document.querySelector('.content');
  if (!content) return;
  const user = Store.getUser();
  const opps = Store.get('opportunities');
  const targets = Store.get('targets');
  const customers = Store.get('customers');

  // KPI Stats
  const pipeline = opps.filter(o => !o.stage?.startsWith('closed'));
  const pipelineTotal = pipeline.reduce((s, o) => s + (o.amount_twd || 0), 0);
  const wonThisQ = opps.filter(o => o.stage === 'closed_won');
  const wonTotal = wonThisQ.reduce((s, o) => s + (o.amount_twd || 0), 0);
  const weighted = pipeline.reduce((s, o) => s + (o.amount_twd || 0) * (o.probability || 0) / 100, 0);
  const winRate = opps.length
    ? Math.round(wonThisQ.length / opps.filter(o => o.stage?.startsWith('closed')).length * 100) || 0
    : 0;

  content.appendChild(h('div', { className: 'page-header' }, [
    h('h1', {}, '業績總覽'),
    h('div', { className: 'page-desc' }, 'BOOST · 驅效 — 業績管理中心'),
  ]));

  const statsGrid = h('div', { className: 'stats-grid' });
  statsGrid.appendChild(statCard({ label: 'Pipeline 總額', value: formatTWD(pipelineTotal), icon: '📈', color: 'var(--xd-boost)' }));
  statsGrid.appendChild(statCard({ label: '加權預測', value: formatTWD(weighted), icon: '🎯', color: 'var(--xd-info)' }));
  statsGrid.appendChild(statCard({ label: '本季成交', value: formatTWD(wonTotal), icon: '🏆', color: 'var(--xd-success)' }));
  statsGrid.appendChild(statCard({ label: '勝率', value: `${winRate}%`, icon: '📊', color: 'var(--xd-coach)' }));
  content.appendChild(statsGrid);

  // Charts row
  const chartsRow = h('div', { className: 'charts-grid' });

  // Pipeline by stage
  const stages = ['lead', 'qualified', 'proposal', 'negotiation'];
  const stageLabels = ['線索', '確認', '提案', '談判'];
  const stageData = stages.map(s => opps.filter(o => o.stage === s).reduce((sum, o) => sum + (o.amount_twd || 0), 0) / 1e6);
  const stageCard = h('div', { className: 'card' }, [
    h('h2', { className: 'h2 mb-4' }, '各階段 Pipeline（百萬）'),
    barChart(stageData, { labels: stageLabels, color: '#F59E0B', height: 200 }),
  ]);
  chartsRow.appendChild(stageCard);

  // Monthly revenue trend (mock)
  const monthData = [3.2, 4.1, 3.8, 5.2, 4.5, wonTotal / 1e6];
  const monthLabels = ['10月', '11月', '12月', '1月', '2月', '3月'];
  const trendCard = h('div', { className: 'card' }, [
    h('h2', { className: 'h2 mb-4' }, '月營收趨勢（百萬）'),
    lineChart(monthData, { labels: monthLabels, color: '#F59E0B', height: 200 }),
  ]);
  chartsRow.appendChild(trendCard);
  content.appendChild(chartsRow);

  // Leaderboard & Hot Deals
  const bottomRow = h('div', { className: 'charts-grid' });

  // Leaderboard
  const leaderCard = h('div', { className: 'card' });
  leaderCard.appendChild(h('h2', { className: 'h2 mb-4' }, '🏆 業績排行榜'));
  const salesUsers = Store.get('users').filter(u => ['sales', 'manager'].includes(u.role));
  const leaderData = salesUsers.map(u => {
    const t = targets.find(t => t.user_id === u.id);
    return { user: u, actual: t?.actual_twd || 0, target: t?.target_twd || 1, rate: t?.achievement_rate || 0 };
  }).sort((a, b) => b.actual - a.actual);

  const leaderList = h('div', { className: 'leaderboard' });
  leaderData.forEach((item, i) => {
    leaderList.appendChild(h('div', { className: 'leader-item' }, [
      h('div', { className: 'leader-rank' }, `${i + 1}`),
      avatar(item.user.name || item.user.full_name || '?', i === 0 ? 'boost' : 'gray', 'sm'),
      h('div', { className: 'leader-info' }, [
        h('div', { style: { fontWeight: '500' } }, item.user.name || item.user.full_name),
        h('div', { className: 'text-sm text-muted' }, `${formatTWD(item.actual)} / ${formatTWD(item.target)}`),
      ]),
      h('div', { className: 'leader-rate' }, [
        badge(`${Math.round(item.rate * 100)}%`, item.rate >= 0.8 ? 'success' : item.rate >= 0.6 ? 'warning' : 'danger'),
      ]),
    ]));
  });
  leaderCard.appendChild(leaderList);
  bottomRow.appendChild(leaderCard);

  // Hot Deals
  const hotCard = h('div', { className: 'card' });
  hotCard.appendChild(h('h2', { className: 'h2 mb-4' }, '🔥 重點案件'));
  const hotDeals = opps
    .filter(o => !o.stage?.startsWith('closed') && (o.amount_twd || 0) >= 1000000)
    .sort((a, b) => (b.amount_twd || 0) - (a.amount_twd || 0))
    .slice(0, 5);

  hotDeals.forEach(deal => {
    const customer = Store.find('customers', deal.customer_id);
    hotCard.appendChild(h('div', { className: 'hot-deal-item', onClick: () => Router.navigate('/boost/pipeline') }, [
      h('div', { className: 'hot-deal-info' }, [
        h('div', { style: { fontWeight: '500' } }, deal.name),
        h('div', { className: 'text-sm text-muted' }, customer?.name || ''),
      ]),
      h('div', { style: { textAlign: 'right' } }, [
        h('div', { style: { fontWeight: '600', color: 'var(--xd-boost)' } }, formatTWD(deal.amount_twd)),
        badge(stageLabel(deal.stage), stageColor(deal.stage)),
      ]),
    ]));
  });
  bottomRow.appendChild(hotCard);
  content.appendChild(bottomRow);
}

function formatTWD(n) {
  if (!n) return 'NT$0';
  if (n >= 1e6) return `NT$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `NT$${(n / 1e3).toFixed(0)}K`;
  return `NT$${n}`;
}

function stageLabel(s) {
  const map = { lead: '線索', qualified: '確認', proposal: '提案', negotiation: '談判' };
  return map[s] || s;
}

function stageColor(s) {
  const map = { lead: 'gray', qualified: 'info', proposal: 'warning', negotiation: 'success' };
  return map[s] || 'gray';
}
