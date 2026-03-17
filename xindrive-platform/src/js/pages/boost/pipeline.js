// ===== BOOST — Pipeline Kanban =====
import Store from '../../store.js';
import Router from '../../router.js';
import { h, appShell, badge } from '../../components/ui.js';
import { kanban } from '../../components/kanban.js';
import { showDrawer } from '../../components/modal.js';

const SUB_TABS = [
  { id: 'overview', label: '📊 業績總覽' },
  { id: 'customers', label: '🏢 客戶管理' },
  { id: 'pipeline', label: '🔄 Pipeline' },
  { id: 'targets', label: '🎯 業績目標' },
];

const STAGES = [
  { id: 'lead', title: '線索', className: 'stage-lead' },
  { id: 'qualified', title: '確認', className: 'stage-qualified' },
  { id: 'proposal', title: '提案', className: 'stage-proposal' },
  { id: 'negotiation', title: '談判', className: 'stage-negotiation' },
];

export function render() {
  const user = Store.getUser();
  const { wrapper } = appShell({
    pillar: 'boost',
    subTabs: SUB_TABS,
    activeTab: 'pipeline', user,
    onTabClick: (id) => {
      if (id === 'overview') Router.navigate('/boost');
      else if (id === 'customers') Router.navigate('/boost/customers');
      else if (id === 'targets') Router.navigate('/boost/targets');
    },
    onPillarClick: (id) => Router.navigate(id === 'dashboard' ? '/dashboard' : `/${id}`),
  });
  return wrapper;
}

export function mount() {
  const content = document.querySelector('.content');
  if (!content) return;
  content.style.maxWidth = 'none';

  content.appendChild(h('div', { className: 'page-header' }, [
    h('h1', {}, 'Pipeline 管理'),
    h('div', { className: 'page-desc' }, '拖拽卡片以更新商機階段'),
  ]));

  const opps = Store.get('opportunities');
  const customers = Store.get('customers');

  function buildColumns() {
    return STAGES.map(stage => ({
      id: stage.id,
      title: stage.title,
      className: stage.className,
      cards: opps
        .filter(o => o.stage === stage.id)
        .map(o => {
          const cust = customers.find(c => c.id === o.customer_id);
          return {
            id: o.id,
            title: o.name,
            customer: cust?.name || '',
            amount: o.amount_twd || 0,
            probability: o.probability || 0,
            expected_close: formatDate(o.expected_close),
          };
        }),
    }));
  }

  const board = kanban(buildColumns(), {
    onCardClick: (card) => showDealDetail(card.id),
    onCardMove: (cardId, newStage) => {
      const opp = opps.find(o => o.id === cardId);
      if (opp) {
        opp.stage = newStage;
        // Update probability based on stage
        const probMap = { lead: 10, qualified: 30, proposal: 50, negotiation: 70 };
        opp.probability = probMap[newStage] || opp.probability;
        Store.set('opportunities', opps);
        board.refresh(buildColumns());
      }
    },
  });

  content.appendChild(board);

  // Summary
  const summary = h('div', { className: 'pipeline-summary mt-6' });
  const totalPipeline = opps.filter(o => !o.stage?.startsWith('closed')).reduce((s, o) => s + (o.amount_twd || 0), 0);
  const weighted = opps.filter(o => !o.stage?.startsWith('closed')).reduce((s, o) => s + (o.amount_twd || 0) * (o.probability || 0) / 100, 0);

  summary.appendChild(h('div', { className: 'flex gap-6 justify-center text-sm' }, [
    h('span', {}, [`Pipeline 總額：`, h('strong', { style: { color: 'var(--xd-boost)' } }, formatTWD(totalPipeline))]),
    h('span', {}, [`加權預測：`, h('strong', { style: { color: 'var(--xd-info)' } }, formatTWD(weighted))]),
    h('span', {}, [`商機數：`, h('strong', {}, `${opps.filter(o => !o.stage?.startsWith('closed')).length}`)]),
  ]));
  content.appendChild(summary);
}

function showDealDetail(oppId) {
  const opp = Store.find('opportunities', oppId);
  if (!opp) return;
  const customer = Store.find('customers', opp.customer_id);
  const owner = Store.find('users', opp.owner_id);
  const activities = Store.query('opportunity_activities', a => a.opportunity_id === oppId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const body = h('div', {}, [
    h('div', { className: 'mb-4' }, [
      infoRow('客戶', customer?.name),
      infoRow('負責人', owner?.name || owner?.full_name),
      infoRow('金額', formatTWD(opp.amount_twd)),
      infoRow('機率', `${opp.probability}%`),
      infoRow('預計結案', formatDate(opp.expected_close)),
    ]),
    opp.description ? h('div', { className: 'mb-4 p-3', style: { background: 'var(--xd-gray-50)', borderRadius: 'var(--radius)', fontSize: '.9rem', lineHeight: '1.6' } }, opp.description) : null,
    opp.notes ? h('div', { className: 'mb-4 text-sm', style: { color: 'var(--xd-gray-600)', lineHeight: '1.6' } }, opp.notes) : null,

    activities.length ? h('div', {}, [
      h('h3', { className: 'h3 mb-2' }, '活動記錄'),
      ...activities.map(a => {
        const actUser = Store.find('users', a.user_id);
        return h('div', { className: 'activity-item' }, [
          h('div', { className: 'activity-icon' }, typeIcon(a.type)),
          h('div', {}, [
            h('div', { className: 'text-sm' }, a.content),
            h('div', { className: 'text-xs text-muted' }, `${actUser?.name || actUser?.full_name || ''} · ${formatDate(a.created_at)}`),
          ]),
        ]);
      }),
    ]) : null,
  ].filter(Boolean));

  showDrawer({ title: opp.name, body });
}

function infoRow(label, value) {
  return h('div', { className: 'flex justify-between py-1 text-sm' }, [
    h('span', { className: 'text-muted' }, label),
    h('span', { style: { fontWeight: '500' } }, value || '-'),
  ]);
}

function typeIcon(type) {
  const map = { meeting: '🤝', email: '📧', call: '📞', note: '📝' };
  return map[type] || '📌';
}

function formatTWD(n) {
  if (!n) return 'NT$0';
  if (n >= 1e6) return `NT$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `NT$${(n / 1e3).toFixed(0)}K`;
  return `NT$${n}`;
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('zh-TW', { year: 'numeric', month: 'short', day: 'numeric' });
}
