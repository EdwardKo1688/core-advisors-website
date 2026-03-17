// ===== COACH — Session 管理 =====
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
      if (id === 'plans') Router.navigate('/coach');
      else if (id === 'ai') Router.navigate('/coach/ai');
      else if (id === 'assessment') Router.navigate('/coach/assessment');
    },
    onPillarClick: (id) => Router.navigate(id === 'dashboard' ? '/dashboard' : `/${id}`),
  });
  return wrapper;
}

export function mount(params) {
  const content = document.querySelector('.content');
  if (!content) return;
  const session = Store.find('coaching_sessions', params.id);

  // Show all sessions for the plan
  const allSessions = session
    ? Store.query('coaching_sessions', s => s.plan_id === session.plan_id).sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at))
    : Store.get('coaching_sessions').sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at));

  const plan = session ? Store.find('coaching_plans', session.plan_id) : null;

  content.appendChild(h('div', { className: 'page-header' }, [
    h('div', { className: 'flex items-center gap-3' }, [
      h('button', { className: 'btn btn-ghost btn-sm', onClick: () => Router.navigate('/coach') }, '← 返回'),
      h('div', {}, [
        h('h1', {}, plan ? `Session 紀錄：${plan.title}` : 'Session 紀錄'),
        h('div', { className: 'page-desc' }, `共 ${allSessions.length} 次 Session`),
      ]),
    ]),
  ]));

  const list = h('div', { className: 'session-list' });
  allSessions.forEach((s, i) => {
    const num = allSessions.length - i;
    list.appendChild(h('div', { className: 'session-item', onClick: () => showSessionDetail(s, content) }, [
      h('div', { className: 'session-num' }, `#${num}`),
      h('div', { className: 'session-info' }, [
        h('div', { className: 'session-title' }, s.title || s.topic || `Session #${num}`),
        h('div', { className: 'session-meta' }, [
          formatDate(s.scheduled_at),
          s.duration_minutes ? ` · ${s.duration_minutes} 分鐘` : '',
          ` · ${s.session_type || '1on1'}`,
        ].join('')),
      ]),
      badge(s.status === 'completed' ? '已完成' : s.status === 'scheduled' ? '待進行' : '已取消',
        s.status === 'completed' ? 'success' : s.status === 'scheduled' ? 'info' : 'gray'),
    ]));
  });
  content.appendChild(list);
}

function showSessionDetail(session, container) {
  const existing = container.querySelector('.session-detail');
  if (existing) existing.remove();

  const detail = h('div', { className: 'session-detail card mt-6 fade-in' });
  detail.appendChild(h('h2', { className: 'h2 mb-4' }, session.title || session.topic || 'Session 詳情'));

  if (session.notes) {
    detail.appendChild(h('div', { className: 'mb-4' }, [
      h('h3', { className: 'h3 mb-2' }, '📝 會議筆記'),
      h('div', { style: { fontSize: '.9rem', lineHeight: '1.8', color: 'var(--xd-gray-700)' }, innerHTML: session.notes.replace(/\n/g, '<br>') }),
    ]));
  }

  let items = session.action_items || [];
  if (typeof items === 'string') {
    try { items = JSON.parse(items); } catch { items = []; }
  }
  // Normalize: could be array of strings or array of {done, text}
  const normalizedItems = items.map(item =>
    typeof item === 'string' ? { text: item, done: false } : item
  );
  if (normalizedItems.length) {
    detail.appendChild(h('div', { className: 'mb-4' }, [
      h('h3', { className: 'h3 mb-2' }, '✅ 行動項目'),
      h('div', { className: 'action-items' },
        normalizedItems.map(item => h('div', { className: 'action-item' }, [
          h('div', { className: `check ${item.done ? 'done' : ''}`, innerHTML: item.done ? '✓' : '' }),
          h('span', { style: item.done ? { textDecoration: 'line-through', color: 'var(--xd-muted)' } : {} }, item.text),
        ]))
      ),
    ]));
  }

  if (session.feedback) {
    const fb = session.feedback;
    detail.appendChild(h('div', {}, [
      h('h3', { className: 'h3 mb-2' }, '💬 回饋'),
      fb.strengths ? h('p', { className: 'text-sm mb-2' }, [h('strong', {}, '優勢：'), ` ${fb.strengths}`]) : null,
      fb.improvements ? h('p', { className: 'text-sm' }, [h('strong', {}, '待改善：'), ` ${fb.improvements}`]) : null,
    ].filter(Boolean)));
  }

  container.appendChild(detail);
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('zh-TW', { year: 'numeric', month: 'short', day: 'numeric' });
}
