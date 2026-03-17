// ===== Dashboard Page =====
import Store from '../store.js';
import Router from '../router.js';
import { h, appShell, statCard, avatar, badge, progressBar } from '../components/ui.js';
import { lineChart, barChart, radarChart } from '../components/charts.js';

export function render() {
  const user = Store.getUser();
  const { wrapper, content } = appShell({
    pillar: null,
    subTabs: null,
    activeTab: null,
    user,
    onTabClick: () => {},
    onPillarClick: navigatePillar,
  });
  return wrapper;
}

export function mount() {
  const user = Store.getUser();
  const content = document.querySelector('.content');
  if (!content) return;

  if (user.role === 'manager' || user.role === 'admin') {
    renderManagerDashboard(content, user);
  } else if (user.role === 'trainer') {
    renderTrainerDashboard(content, user);
  } else {
    renderSalesDashboard(content, user);
  }
}

function renderManagerDashboard(el, user) {
  const opps = Store.get('opportunities');
  const targets = Store.get('targets');
  const enrollments = Store.get('enrollments');
  const plans = Store.get('coaching_plans');
  const notifications = Store.get('notifications');

  const activeOpps = opps.filter(o => o.stage && !o.stage.startsWith('closed'));
  const weightedAmt = activeOpps.reduce((s, o) => s + (o.amount_twd || 0) * (o.probability || 0) / 100, 0);
  const completedEnroll = enrollments.filter(e => e.status === 'completed').length;
  const totalEnroll = enrollments.length || 1;
  const activePlans = plans.filter(p => p.status === 'active');

  // Team target
  const teamTarget = targets.find(t => t.type === 'team' && t.period === '2026-Q1');
  const revenue = teamTarget?.actual_twd || 62000000;
  const revenueTarget = teamTarget?.target_twd || 80000000;
  const revPct = Math.round((revenue / revenueTarget) * 100);

  el.innerHTML = '';
  el.appendChild(h('div', { className: 'dashboard-welcome' }, [
    h('h1', {}, `早安，${(user.full_name || user.name)} 👋`),
    h('div', { className: 'welcome-sub' }, `芯達科技　│　${new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}`),
  ]));

  // Stats
  const stats = h('div', { className: 'stats-grid' }, [
    statCard({ label: '📈 本月營收', value: `NT$${(revenue / 1e6).toFixed(1)}M`, trend: 12, trendLabel: `${revPct}% 達成`, pillar: 'boost' }),
    statCard({ label: '🔄 活躍商機', value: `${activeOpps.length} 件`, trend: 3, trendLabel: `$${(weightedAmt / 1e6).toFixed(1)}M 加權`, pillar: 'boost' }),
    statCard({ label: '📚 學習完成率', value: `${Math.round(completedEnroll / totalEnroll * 100)}%`, trend: 15, trendLabel: '+15 pts', pillar: 'learn' }),
    statCard({ label: '🤝 陪跑進行', value: `${activePlans.length} 組`, trend: 0, trendLabel: '進行中', pillar: 'coach' }),
  ]);
  el.appendChild(stats);

  // Charts row
  const chartsRow = h('div', { className: 'charts-grid' }, [
    chartCard('營收趨勢', () => lineChart([38, 42, 45, 51, 55, 62], { labels: ['10月', '11月', '12月', '1月', '2月', '3月'], color: '#F59E0B' })),
    chartCard('Pipeline 分佈', () => {
      const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation'];
      const counts = stages.map(s => opps.filter(o => o.stage === s.toLowerCase()).length);
      return barChart(counts, { labels: stages, colors: ['#94A3B8', '#3B82F6', '#F59E0B', '#10B981'] });
    }),
  ]);
  el.appendChild(chartsRow);

  // Bottom row: Radar + Activity
  const bottomRow = h('div', { className: 'charts-grid' }, [
    chartCard('團隊技能雷達', () => radarChart([
      { data: [7, 6, 5, 6, 5, 7, 4, 6], color: '#3B82F6' },
      { data: [8, 7, 7, 7, 6, 8, 6, 7], color: '#10B981' },
    ], { labels: ['產品知識', '客戶開發', '需求挖掘', '方案提案', '談判技巧', '關係管理', '市場分析', '數位工具'] })),
    activityCard(notifications),
  ]);
  el.appendChild(bottomRow);
}

function renderSalesDashboard(el, user) {
  const enrollments = Store.query('enrollments', e => e.user_id === user.id);
  const courses = Store.get('courses');
  const plans = Store.query('coaching_plans', p => p.coachee_id === user.id);
  const myTarget = Store.query('targets', t => t.user_id === user.id && t.period === '2026-Q1' && t.type === 'individual')[0];
  const myOpps = Store.query('opportunities', o => o.owner_id === user.id && o.stage && !o.stage.startsWith('closed'));
  const notifications = Store.get('notifications');

  el.innerHTML = '';
  el.appendChild(h('div', { className: 'dashboard-welcome' }, [
    h('h1', {}, `嗨，${(user.full_name || user.name)} 👋`),
    h('div', { className: 'welcome-sub' }, '今天也要加油！'),
  ]));

  const grid = h('div', { className: 'grid grid-2 gap-6' });

  // My Learning
  const learnCard = h('div', { className: 'my-card card-pillar-learn' });
  learnCard.appendChild(h('h3', {}, [h('span', {}, '📚'), h('span', {}, '我的學習')]));
  enrollments.slice(0, 3).forEach(enr => {
    const course = courses.find(c => c.id === enr.course_id);
    if (!course) return;
    const pct = enr.status === 'completed' ? 100 : Math.round(Math.random() * 80 + 10);
    const item = h('div', { className: 'course-item' }, [
      h('div', { style: { flex: '1' } }, [
        h('div', { style: { fontWeight: '600', fontSize: '.85rem' } }, course.title),
        h('div', { className: 'mt-2' }, [progressBar(pct, 'learn')]),
      ]),
      h('div', { style: { fontWeight: '600', fontSize: '.85rem', color: 'var(--xd-learn)' } }, `${pct}%`),
    ]);
    learnCard.appendChild(item);
  });
  grid.appendChild(learnCard);

  // My Coaching
  const coachCard = h('div', { className: 'my-card card-pillar-coach' });
  coachCard.appendChild(h('h3', {}, [h('span', {}, '🤝'), h('span', {}, '我的陪跑')]));
  if (plans[0]) {
    const coach = Store.find('users', plans[0].coach_id);
    coachCard.appendChild(h('div', { className: 'course-item' }, [
      avatar((coach?.full_name || coach?.name) || '?', 'coach', 'sm'),
      h('div', { style: { flex: '1' } }, [
        h('div', { style: { fontWeight: '500', fontSize: '.85rem' } }, `教練：${(coach?.full_name || coach?.name)}`),
        h('div', { className: 'text-sm text-muted mt-2' }, `方法論：${plans[0].methodology}`),
      ]),
      badge(plans[0].status === 'active' ? '進行中' : '已完成', plans[0].status === 'active' ? 'coach' : 'gray'),
    ]));
  }
  grid.appendChild(coachCard);

  // My Performance
  const perfCard = h('div', { className: 'my-card card-pillar-boost' });
  perfCard.appendChild(h('h3', {}, [h('span', {}, '🎯'), h('span', {}, '我的業績')]));
  if (myTarget) {
    const pct = Math.round((myTarget.actual_twd / myTarget.target_twd) * 100);
    perfCard.appendChild(h('div', { style: { textAlign: 'center', padding: 'var(--sp-4) 0' } }, [
      h('div', { style: { fontSize: '2rem', fontWeight: '700', fontFamily: "'Inter', var(--font-sans)" } }, `${pct}%`),
      h('div', { className: 'text-sm text-muted' }, `NT$${(myTarget.actual_twd / 1e6).toFixed(1)}M / NT$${(myTarget.target_twd / 1e6).toFixed(1)}M`),
      h('div', { className: 'mt-2' }, [progressBar(pct, 'boost')]),
    ]));
  }
  perfCard.appendChild(h('div', { className: 'text-sm text-muted mt-4' }, `活躍商機：${myOpps.length} 件`));
  grid.appendChild(perfCard);

  // Activity
  grid.appendChild(activityCard(notifications.slice(0, 5)));
  el.appendChild(grid);
}

function renderTrainerDashboard(el, user) {
  const plans = Store.query('coaching_plans', p => p.coach_id === user.id);
  const courses = Store.query('courses', c => c.instructor_id === user.id);
  const notifications = Store.get('notifications');

  el.innerHTML = '';
  el.appendChild(h('div', { className: 'dashboard-welcome' }, [
    h('h1', {}, `早安，${(user.full_name || user.name)} 👋`),
    h('div', { className: 'welcome-sub' }, `正在陪跑 ${plans.filter(p => p.status === 'active').length} 位學員`),
  ]));

  const grid = h('div', { className: 'grid grid-2 gap-6' });

  // My Coachees
  const coachCard = h('div', { className: 'my-card card-pillar-coach' });
  coachCard.appendChild(h('h3', {}, [h('span', {}, '🤝'), h('span', {}, '我的學員')]));
  plans.forEach(plan => {
    const coachee = Store.find('users', plan.coachee_id);
    coachCard.appendChild(h('div', { className: 'course-item' }, [
      avatar((coachee?.full_name || coachee?.name) || '?', 'coach', 'sm'),
      h('div', { style: { flex: '1' } }, [
        h('div', { style: { fontWeight: '500', fontSize: '.85rem' } }, (coachee?.full_name || coachee?.name)),
        h('div', { className: 'text-sm text-muted' }, plan.title),
      ]),
      badge(plan.methodology, 'coach'),
    ]));
  });
  grid.appendChild(coachCard);

  // My Courses
  const learnCard = h('div', { className: 'my-card card-pillar-learn' });
  learnCard.appendChild(h('h3', {}, [h('span', {}, '📚'), h('span', {}, '我管理的課程')]));
  const allCourses = Store.get('courses');
  allCourses.slice(0, 4).forEach(course => {
    learnCard.appendChild(h('div', { className: 'course-item' }, [
      h('div', { style: { flex: '1' } }, [
        h('div', { style: { fontWeight: '500', fontSize: '.85rem' } }, course.title),
        h('div', { className: 'text-sm text-muted' }, `${course.category} │ ${course.difficulty}`),
      ]),
      badge(course.status === 'published' ? '已發佈' : '草稿', course.status === 'published' ? 'success' : 'gray'),
    ]));
  });
  grid.appendChild(learnCard);

  grid.appendChild(activityCard(notifications.slice(0, 5)));
  el.appendChild(grid);
}

// --- Helpers ---
function chartCard(title, renderFn) {
  const card = h('div', { className: 'chart-card' }, [
    h('h3', {}, title),
    h('div', { className: 'chart-area' }),
  ]);
  setTimeout(() => {
    const area = card.querySelector('.chart-area');
    if (area) area.appendChild(renderFn());
  }, 50);
  return card;
}

function activityCard(notifications) {
  const card = h('div', { className: 'my-card' });
  card.appendChild(h('h3', {}, '📋 最近動態'));
  const timeline = h('div', { className: 'timeline' });
  (notifications || []).slice(0, 6).forEach(n => {
    const dotClass = n.type?.includes('learn') ? 'learn' : n.type?.includes('coach') ? 'coach' : n.type?.includes('boost') ? 'boost' : '';
    timeline.appendChild(h('div', { className: 'timeline-item' }, [
      h('div', { className: `timeline-dot ${dotClass}` }),
      h('div', {}, [
        h('div', { className: 'timeline-text' }, n.message || n.title),
        h('div', { className: 'timeline-time' }, formatTime(n.created_at)),
      ]),
    ]));
  });
  card.appendChild(timeline);
  return card;
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diff = (now - d) / 1000 / 60;
  if (diff < 60) return `${Math.round(diff)} 分鐘前`;
  if (diff < 1440) return `${Math.round(diff / 60)} 小時前`;
  return `${Math.round(diff / 1440)} 天前`;
}

function navigatePillar(id) {
  if (id === 'dashboard') Router.navigate('/dashboard');
  else if (id === 'learn') Router.navigate('/learn');
  else if (id === 'coach') Router.navigate('/coach');
  else if (id === 'boost') Router.navigate('/boost');
}
