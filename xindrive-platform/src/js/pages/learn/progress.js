// ===== LEARN — 我的學習進度 =====
import Store from '../../store.js';
import Router from '../../router.js';
import { h, appShell, progressBar, badge } from '../../components/ui.js';
import { radarChart } from '../../components/charts.js';

export function render() {
  const user = Store.getUser();
  const { wrapper } = appShell({
    pillar: 'learn',
    subTabs: [
      { id: 'catalog', label: '📚 課程目錄' },
      { id: 'progress', label: '📊 我的學習' },
      ...(user.role !== 'sales' ? [{ id: 'manage', label: '⚙ 課程管理' }] : []),
    ],
    activeTab: 'progress', user,
    onTabClick: (id) => {
      if (id === 'catalog') Router.navigate('/learn');
      else if (id === 'manage') Router.navigate('/learn/manage');
    },
    onPillarClick: (id) => Router.navigate(id === 'dashboard' ? '/dashboard' : `/${id}`),
  });
  return wrapper;
}

export function mount() {
  const content = document.querySelector('.content');
  if (!content) return;
  const user = Store.getUser();
  const enrollments = Store.query('enrollments', e => e.user_id === user.id);
  const courses = Store.get('courses');

  content.appendChild(h('div', { className: 'page-header' }, [
    h('h1', {}, '我的學習進度'),
    h('div', { className: 'page-desc' }, `共選修 ${enrollments.length} 門課程`),
  ]));

  const grid = h('div', { className: 'progress-grid' });

  // Enrolled courses list
  const listCard = h('div', { className: 'card' });
  listCard.appendChild(h('h2', { className: 'h2 mb-4' }, '已選課程'));
  const list = h('div', { className: 'enrolled-list' });
  enrollments.forEach(enr => {
    const course = courses.find(c => c.id === enr.course_id);
    if (!course) return;
    const pct = enr.status === 'completed' ? 100 : calcPct(enr);
    list.appendChild(h('div', { className: 'enrolled-item', onClick: () => Router.navigate(`/learn/course/${course.id}`) }, [
      h('div', { className: 'course-info' }, [
        h('div', { className: 'course-name' }, course.title),
        h('div', { className: 'flex items-center gap-2 mt-2' }, [
          badge(course.category, 'learn'),
          badge(course.difficulty, 'gray'),
        ]),
        h('div', { className: 'mt-2' }, [progressBar(pct, 'learn')]),
      ]),
      h('div', { style: { fontWeight: '700', color: pct >= 100 ? 'var(--xd-success)' : 'var(--xd-learn)', minWidth: '50px', textAlign: 'right' } }, `${pct}%`),
    ]));
  });
  if (!enrollments.length) list.appendChild(h('div', { className: 'empty-state' }, [h('p', {}, '尚未選修任何課程')]));
  listCard.appendChild(list);
  grid.appendChild(listCard);

  // Skill radar
  const radarCard = h('div', { className: 'card' });
  radarCard.appendChild(h('h2', { className: 'h2 mb-4' }, '技能分佈'));
  const labels = ['產品知識', '客戶開發', '需求挖掘', '方案提案', '談判技巧', '關係管理', '市場分析', '數位工具'];
  const current = [6, 5, 4, 5, 4, 6, 3, 5];
  const target = [8, 8, 7, 8, 7, 8, 6, 7];
  radarCard.appendChild(radarChart([
    { data: current, color: '#3B82F6' },
    { data: target, color: '#E2E8F0' },
  ], { labels, maxVal: 10 }));
  radarCard.appendChild(h('div', { className: 'flex justify-center gap-6 mt-4 text-sm' }, [
    h('span', {}, [h('span', { style: { color: '#3B82F6', fontWeight: '600' } }, '● '), '目前程度']),
    h('span', {}, [h('span', { style: { color: '#E2E8F0', fontWeight: '600' } }, '● '), '目標']),
  ]));
  grid.appendChild(radarCard);

  content.appendChild(grid);
}

function calcPct(enrollment) {
  const lps = Store.query('lesson_progress', p => p.enrollment_id === enrollment.id);
  if (!lps.length) return 10;
  return Math.round(lps.filter(p => p.status === 'completed').length / lps.length * 100);
}
