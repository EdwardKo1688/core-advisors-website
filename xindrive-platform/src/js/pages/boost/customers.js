// ===== BOOST — 客戶管理 =====
import Store from '../../store.js';
import Router from '../../router.js';
import { h, appShell, badge, avatar } from '../../components/ui.js';
import { dataTable } from '../../components/table.js';
import { showDrawer, closeDrawer } from '../../components/modal.js';

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
    activeTab: 'customers', user,
    onTabClick: (id) => {
      if (id === 'overview') Router.navigate('/boost');
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

  const customers = Store.get('customers');
  const users = Store.get('users');

  content.appendChild(h('div', { className: 'page-header' }, [
    h('h1', {}, '客戶管理'),
    h('div', { className: 'page-desc' }, `共 ${customers.length} 家客戶`),
  ]));

  // Filters
  const toolbar = h('div', { className: 'customer-toolbar' });
  const search = h('input', {
    className: 'form-input', placeholder: '搜尋客戶名稱...', type: 'search',
    onInput: () => refresh(),
  });
  const segFilter = h('select', { className: 'form-select', onChange: () => refresh() }, [
    h('option', { value: '' }, '所有層級'),
    h('option', { value: 'tier1' }, 'Tier 1'),
    h('option', { value: 'tier2' }, 'Tier 2'),
    h('option', { value: 'tier3' }, 'Tier 3'),
  ]);
  toolbar.appendChild(search);
  toolbar.appendChild(segFilter);
  content.appendChild(toolbar);

  const tableContainer = h('div');
  content.appendChild(tableContainer);

  function getFiltered() {
    let filtered = customers;
    const q = search.value.trim().toLowerCase();
    if (q) filtered = filtered.filter(c => c.name.toLowerCase().includes(q));
    const seg = segFilter.value;
    if (seg) filtered = filtered.filter(c => c.segment === seg);
    return filtered;
  }

  function refresh() {
    const filtered = getFiltered();
    tableContainer.innerHTML = '';

    const columns = [
      {
        label: '客戶名稱', key: 'name', width: '25%',
        render: (row) => h('div', { className: 'flex items-center gap-2' }, [
          avatar(row.name, 'boost', 'sm'),
          h('span', { style: { fontWeight: '500' } }, row.name),
        ]),
      },
      {
        label: '層級', key: 'segment',
        render: (row) => badge(row.segment?.toUpperCase() || '', segmentColor(row.segment)),
      },
      { label: '產業', key: 'industry' },
      {
        label: '年營收', key: 'annual_revenue_twd',
        value: (row) => row.annual_revenue_twd || 0,
        render: (row) => formatTWD(row.annual_revenue_twd),
      },
      {
        label: '負責人', key: 'owner_id',
        render: (row) => {
          const owner = users.find(u => u.id === row.owner_id);
          return owner?.name || owner?.full_name || '-';
        },
      },
      {
        label: '狀態', key: 'status',
        render: (row) => badge(row.status === 'active' ? '活躍' : '停用', row.status === 'active' ? 'success' : 'gray'),
      },
    ];

    const table = dataTable(columns, filtered, {
      onRowClick: (row) => showCustomerDetail(row),
    });
    tableContainer.appendChild(table);
  }

  refresh();
}

function showCustomerDetail(customer) {
  const contacts = Store.query('contacts', c => c.customer_id === customer.id);
  const opps = Store.query('opportunities', o => o.customer_id === customer.id);

  const body = h('div', {}, [
    // Info section
    h('div', { className: 'mb-6' }, [
      h('h3', { className: 'h3 mb-2' }, '基本資訊'),
      infoRow('產業', customer.industry),
      infoRow('層級', customer.segment?.toUpperCase()),
      infoRow('區域', customer.region),
      infoRow('年營收', formatTWD(customer.annual_revenue_twd)),
      customer.notes ? h('div', { className: 'mt-3 p-3', style: { background: 'var(--xd-gray-50)', borderRadius: 'var(--radius)', fontSize: '.9rem', lineHeight: '1.6' } }, customer.notes) : null,
    ].filter(Boolean)),

    // Contacts
    contacts.length ? h('div', { className: 'mb-6' }, [
      h('h3', { className: 'h3 mb-2' }, `聯絡人 (${contacts.length})`),
      ...contacts.map(c => h('div', { className: 'contact-item' }, [
        h('div', { style: { fontWeight: '500' } }, c.name),
        h('div', { className: 'text-sm text-muted' }, `${c.title || ''} · ${c.role || ''}`),
        c.email ? h('div', { className: 'text-sm' }, c.email) : null,
      ].filter(Boolean))),
    ]) : null,

    // Opportunities
    opps.length ? h('div', {}, [
      h('h3', { className: 'h3 mb-2' }, `商機 (${opps.length})`),
      ...opps.map(o => h('div', { className: 'opp-item' }, [
        h('div', { style: { fontWeight: '500' } }, o.name),
        h('div', { className: 'flex items-center gap-2' }, [
          h('span', { className: 'text-sm' }, formatTWD(o.amount_twd)),
          badge(stageLabel(o.stage), stageColor(o.stage)),
        ]),
      ])),
    ]) : null,
  ].filter(Boolean));

  showDrawer({ title: customer.name, body });
}

function infoRow(label, value) {
  return h('div', { className: 'flex justify-between py-1 text-sm' }, [
    h('span', { className: 'text-muted' }, label),
    h('span', { style: { fontWeight: '500' } }, value || '-'),
  ]);
}

function formatTWD(n) {
  if (!n) return 'NT$0';
  if (n >= 1e6) return `NT$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `NT$${(n / 1e3).toFixed(0)}K`;
  return `NT$${n}`;
}

function segmentColor(s) {
  return s === 'tier1' ? 'boost' : s === 'tier2' ? 'info' : 'gray';
}

function stageLabel(s) {
  const map = { lead: '線索', qualified: '確認', proposal: '提案', negotiation: '談判', closed_won: '成交', closed_lost: '失標' };
  return map[s] || s;
}

function stageColor(s) {
  const map = { lead: 'gray', qualified: 'info', proposal: 'warning', negotiation: 'success', closed_won: 'success', closed_lost: 'danger' };
  return map[s] || 'gray';
}
