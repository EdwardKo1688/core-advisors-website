// ===== LEARN — 課程詳情/學習介面 =====
import Store from '../../store.js';
import Router from '../../router.js';
import { h, appShell, badge, progressBar, icon, toast } from '../../components/ui.js';

let currentLesson = 0;

export function render(params) {
  const user = Store.getUser();
  const { wrapper } = appShell({
    pillar: 'learn', subTabs: null, activeTab: null, user,
    onTabClick: () => {},
    onPillarClick: (id) => {
      if (id === 'dashboard') Router.navigate('/dashboard');
      else if (id === 'learn') Router.navigate('/learn');
      else if (id === 'coach') Router.navigate('/coach');
      else if (id === 'boost') Router.navigate('/boost');
    },
  });
  return wrapper;
}

export function mount(params) {
  const content = document.querySelector('.content');
  if (!content) return;
  const course = Store.find('courses', params.id);
  if (!course) { content.innerHTML = '<div class="empty-state"><p>找不到課程</p></div>'; return; }

  const modules = Store.query('course_modules', m => m.course_id === course.id).sort((a, b) => a.sort_order - b.sort_order);
  const allLessons = [];
  modules.forEach(mod => {
    const lessons = Store.query('module_lessons', l => l.module_id === mod.id).sort((a, b) => a.sort_order - b.sort_order);
    lessons.forEach(l => allLessons.push({ ...l, moduleName: mod.title }));
  });

  content.style.padding = '0';
  content.style.maxWidth = 'none';

  // Top progress bar
  const user = Store.getUser();
  const enrollment = Store.query('enrollments', e => e.course_id === course.id && e.user_id === user.id)[0];
  const progressPct = enrollment ? calcProgress(enrollment, allLessons) : 0;

  const header = h('div', { style: { padding: 'var(--sp-4) var(--sp-6)', borderBottom: '1px solid var(--xd-border)', background: 'var(--xd-surface)' } }, [
    h('div', { className: 'flex items-center justify-between mb-2' }, [
      h('div', { className: 'flex items-center gap-3' }, [
        h('button', { className: 'btn btn-ghost btn-sm', onClick: () => Router.navigate('/learn') }, '← 返回'),
        h('h2', { className: 'h2' }, course.title),
      ]),
      h('span', { className: 'text-sm', style: { fontWeight: '600', color: 'var(--xd-learn)' } }, `${progressPct}% 完成`),
    ]),
    progressBar(progressPct, 'learn'),
  ]);
  content.appendChild(header);

  const layout = h('div', { className: 'course-layout' });

  // Sidebar
  const sidebar = h('div', { className: 'course-sidebar' });
  modules.forEach((mod, mi) => {
    const lessons = Store.query('module_lessons', l => l.module_id === mod.id).sort((a, b) => a.sort_order - b.sort_order);
    const group = h('div', { className: 'module-group' });
    const title = h('div', { className: 'module-title', onClick: () => {
      const list = group.querySelector('.lesson-list');
      list.style.display = list.style.display === 'none' ? 'block' : 'none';
    }}, [
      h('span', {}, `${mi + 1}. ${mod.title}`),
      h('span', { className: 'text-xs text-muted' }, `${lessons.length} 堂`),
    ]);
    const list = h('div', { className: 'lesson-list' });
    lessons.forEach((lesson, li) => {
      const globalIdx = allLessons.findIndex(l => l.id === lesson.id);
      const lp = enrollment ? Store.query('lesson_progress', p => p.enrollment_id === enrollment.id && p.lesson_id === lesson.id)[0] : null;
      const isCompleted = lp?.status === 'completed';
      const item = h('div', {
        className: `lesson-item ${globalIdx === currentLesson ? 'active' : ''} ${isCompleted ? 'completed' : ''}`,
        dataset: { idx: globalIdx },
        onClick: () => { currentLesson = globalIdx; renderLesson(allLessons[globalIdx], contentArea, sidebar, enrollment); },
      }, [
        h('span', { className: 'lesson-check', innerHTML: isCompleted ? '✓' : `${globalIdx + 1}` }),
        h('span', {}, lesson.title),
      ]);
      list.appendChild(item);
    });
    group.appendChild(title);
    group.appendChild(list);
    sidebar.appendChild(group);
  });
  layout.appendChild(sidebar);

  const contentArea = h('div', { className: 'course-content' });
  layout.appendChild(contentArea);
  content.appendChild(layout);

  // Nav
  const nav = h('div', { className: 'course-nav' }, [
    h('button', { className: 'btn btn-outline btn-sm', id: 'prev-lesson', onClick: () => {
      if (currentLesson > 0) { currentLesson--; renderLesson(allLessons[currentLesson], contentArea, sidebar, enrollment); }
    }}, '← 上一堂'),
    h('button', { className: 'btn btn-learn btn-sm', id: 'complete-lesson', onClick: () => {
      markComplete(enrollment, allLessons[currentLesson]);
      if (currentLesson < allLessons.length - 1) { currentLesson++; renderLesson(allLessons[currentLesson], contentArea, sidebar, enrollment); }
    }}, '完成並繼續 →'),
  ]);
  content.appendChild(nav);

  if (allLessons.length) renderLesson(allLessons[0], contentArea, sidebar, enrollment);
}

function renderLesson(lesson, area, sidebar, enrollment) {
  area.innerHTML = '';
  area.appendChild(h('div', { className: 'lesson-title' }, lesson.title));
  const body = h('div', { className: 'lesson-body' });

  const contentData = lesson.content || {};
  if (contentData.text) {
    contentData.text.split('\n').forEach(p => {
      if (p.trim()) body.appendChild(h('p', {}, p));
    });
  } else {
    body.appendChild(h('p', {}, `這是「${lesson.title}」的課程內容。`));
    body.appendChild(h('p', {}, `類型：${lesson.content_type || 'text'}　預估時間：${lesson.duration_minutes || 15} 分鐘`));
    body.appendChild(h('p', { className: 'text-muted' }, '（正式版本將包含完整教材內容）'));
  }
  area.appendChild(body);

  // Update sidebar active state
  sidebar.querySelectorAll('.lesson-item').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.idx) === currentLesson);
  });
}

function markComplete(enrollment, lesson) {
  if (!enrollment || !lesson) return;
  const lp = Store.query('lesson_progress', p => p.enrollment_id === enrollment.id && p.lesson_id === lesson.id)[0];
  if (lp) {
    Store.update('lesson_progress', lp.id, { status: 'completed', completed_at: new Date().toISOString() });
  }
  toast('已完成此課堂 ✓', 'success');
}

function calcProgress(enrollment, allLessons) {
  const progress = Store.query('lesson_progress', p => p.enrollment_id === enrollment.id);
  const completed = progress.filter(p => p.status === 'completed').length;
  return allLessons.length ? Math.round((completed / allLessons.length) * 100) : 0;
}
