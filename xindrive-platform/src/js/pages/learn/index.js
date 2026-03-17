// ===== LEARN — 課程目錄 =====
import Store from '../../store.js';
import Router from '../../router.js';
import { h, appShell, badge, progressBar } from '../../components/ui.js';

const SUB_TABS = [
  { id: 'catalog', label: '📚 課程目錄' },
  { id: 'progress', label: '📊 我的學習' },
  { id: 'manage', label: '⚙ 課程管理' },
];

export function render() {
  const user = Store.getUser();
  const tabs = user.role === 'sales' ? SUB_TABS.slice(0, 2) : SUB_TABS;
  const { wrapper, content } = appShell({
    pillar: 'learn', subTabs: tabs, activeTab: 'catalog', user,
    onTabClick: (id) => {
      if (id === 'progress') Router.navigate('/learn/progress');
      else if (id === 'manage') Router.navigate('/learn/manage');
    },
    onPillarClick: navigatePillar,
  });
  return wrapper;
}

export function mount() {
  const content = document.querySelector('.content');
  if (!content) return;
  const courses = Store.get('courses');
  const user = Store.getUser();
  const enrollments = Store.query('enrollments', e => e.user_id === user.id);

  // Filters
  const filters = h('div', { className: 'learn-filters' }, [
    h('select', { className: 'filter-select', id: 'filter-cat' }, [
      h('option', { value: '' }, '全部分類'),
      h('option', { value: 'sales' }, '銷售'),
      h('option', { value: 'procurement' }, '採購'),
      h('option', { value: 'supply_chain' }, '供應鏈'),
      h('option', { value: 'management' }, '經營管理'),
    ]),
    h('select', { className: 'filter-select', id: 'filter-diff' }, [
      h('option', { value: '' }, '全部難度'),
      h('option', { value: 'beginner' }, '初階'),
      h('option', { value: 'intermediate' }, '中階'),
      h('option', { value: 'advanced' }, '高階'),
    ]),
    h('input', { className: 'search-input', placeholder: '🔍 搜尋課程...', id: 'search-course' }),
  ]);
  content.appendChild(filters);

  // Grid
  const grid = h('div', { className: 'course-grid', id: 'course-grid' });
  content.appendChild(grid);

  function renderCourses() {
    const cat = document.getElementById('filter-cat').value;
    const diff = document.getElementById('filter-diff').value;
    const q = document.getElementById('search-course').value.toLowerCase();
    let filtered = courses.filter(c => c.status === 'published');
    if (cat) filtered = filtered.filter(c => c.category === cat);
    if (diff) filtered = filtered.filter(c => c.difficulty === diff);
    if (q) filtered = filtered.filter(c => c.title.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q));

    grid.innerHTML = '';
    filtered.forEach(course => {
      const enr = enrollments.find(e => e.course_id === course.id);
      const pct = enr ? (enr.status === 'completed' ? 100 : calcProgress(enr)) : null;
      grid.appendChild(courseCard(course, pct));
    });
    if (!filtered.length) grid.innerHTML = '<div class="empty-state"><p>沒有符合條件的課程</p></div>';
  }

  document.getElementById('filter-cat').addEventListener('change', renderCourses);
  document.getElementById('filter-diff').addEventListener('change', renderCourses);
  document.getElementById('search-course').addEventListener('input', renderCourses);
  renderCourses();
}

function courseCard(course, progress) {
  const diffMap = { beginner: '初階', intermediate: '中階', advanced: '高階' };
  const catMap = { sales: '銷售', procurement: '採購', supply_chain: '供應鏈', management: '管理' };
  const catEmoji = { sales: '📊', procurement: '📦', supply_chain: '🔗', management: '🏢' };

  const card = h('div', { className: 'course-card', onClick: () => Router.navigate(`/learn/course/${course.id}`) }, [
    h('div', { className: `card-thumb ${course.category}` }, catEmoji[course.category] || '📚'),
    h('div', { className: 'card-body' }, [
      h('div', { className: 'card-title' }, course.title),
      h('div', { className: 'card-meta' }, [
        badge(catMap[course.category] || course.category, 'learn'),
        badge(diffMap[course.difficulty] || course.difficulty, 'gray'),
        badge(`${course.estimated_hours || course.duration_hours || ''}h`, 'gray'),
      ]),
      h('div', { className: 'card-desc' }, course.description || ''),
      progress !== null ? h('div', { className: 'card-progress' }, [
        h('div', { className: 'flex items-center justify-between mb-2' }, [
          h('span', { className: 'text-sm text-muted' }, '學習進度'),
          h('span', { className: 'text-sm', style: { fontWeight: '600', color: 'var(--xd-learn)' } }, `${progress}%`),
        ]),
        progressBar(progress, 'learn'),
      ]) : null,
      h('div', { className: 'card-footer' }, [
        h('button', { className: `btn btn-sm ${progress !== null ? 'btn-learn' : 'btn-outline'}` },
          progress !== null ? (progress >= 100 ? '複習課程' : '繼續學習') : '開始學習'),
      ]),
    ].filter(Boolean)),
  ]);
  return card;
}

function calcProgress(enrollment) {
  const lessons = Store.query('lesson_progress', lp => lp.enrollment_id === enrollment.id);
  if (!lessons.length) return 10;
  const completed = lessons.filter(l => l.status === 'completed').length;
  return Math.round((completed / lessons.length) * 100);
}

function navigatePillar(id) {
  if (id === 'dashboard') Router.navigate('/dashboard');
  else if (id === 'learn') Router.navigate('/learn');
  else if (id === 'coach') Router.navigate('/coach');
  else if (id === 'boost') Router.navigate('/boost');
}
