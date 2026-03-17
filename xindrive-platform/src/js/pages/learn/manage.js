// ===== LEARN — 課程管理 =====
import Store from '../../store.js';
import Router from '../../router.js';
import { h, appShell, badge, toast } from '../../components/ui.js';
import { dataTable } from '../../components/table.js';
import { showModal, closeModal } from '../../components/modal.js';

export function render() {
  const user = Store.getUser();
  const { wrapper } = appShell({
    pillar: 'learn',
    subTabs: [
      { id: 'catalog', label: '📚 課程目錄' },
      { id: 'progress', label: '📊 我的學習' },
      { id: 'manage', label: '⚙ 課程管理' },
    ],
    activeTab: 'manage', user,
    onTabClick: (id) => {
      if (id === 'catalog') Router.navigate('/learn');
      else if (id === 'progress') Router.navigate('/learn/progress');
    },
    onPillarClick: (id) => Router.navigate(id === 'dashboard' ? '/dashboard' : `/${id}`),
  });
  return wrapper;
}

export function mount() {
  const content = document.querySelector('.content');
  if (!content) return;

  content.appendChild(h('div', { className: 'page-header flex justify-between items-center' }, [
    h('div', {}, [
      h('h1', {}, '課程管理'),
      h('div', { className: 'page-desc' }, '管理所有課程內容'),
    ]),
    h('button', { className: 'btn btn-learn', onClick: () => openCourseModal() }, '+ 新增課程'),
  ]));

  const courses = Store.get('courses');
  const table = dataTable([
    { key: 'title', label: '課程名稱', render: (r) => h('span', { style: { fontWeight: '600' } }, r.title) },
    { key: 'category', label: '分類', render: (r) => badge(r.category, 'learn') },
    { key: 'difficulty', label: '難度', render: (r) => badge(r.difficulty, 'gray') },
    { key: 'duration_hours', label: '時數', render: (r) => h('span', {}, `${r.duration_hours}h`) },
    { key: 'status', label: '狀態', render: (r) => badge(r.status === 'published' ? '已發佈' : '草稿', r.status === 'published' ? 'success' : 'warning') },
  ], courses, { onRowClick: (r) => openCourseModal(r) });

  content.appendChild(table);
}

function openCourseModal(course) {
  const isEdit = !!course;
  const form = h('div', {}, [
    formGroup('課程名稱', h('input', { className: 'form-input', id: 'c-title', value: course?.title || '' })),
    h('div', { className: 'grid grid-2 gap-4' }, [
      formGroup('分類', selectEl('c-cat', [['sales', '銷售'], ['procurement', '採購'], ['supply_chain', '供應鏈'], ['management', '管理']], course?.category)),
      formGroup('難度', selectEl('c-diff', [['beginner', '初階'], ['intermediate', '中階'], ['advanced', '高階']], course?.difficulty)),
    ]),
    formGroup('預估時數', h('input', { className: 'form-input', type: 'number', id: 'c-hours', value: course?.duration_hours || '' })),
    formGroup('描述', h('textarea', { className: 'form-input', id: 'c-desc', rows: '3', textContent: course?.description || '' })),
  ]);
  const footer = [
    h('button', { className: 'btn btn-outline', onClick: closeModal }, '取消'),
    h('button', { className: 'btn btn-learn', onClick: () => saveCourse(course) }, isEdit ? '更新' : '建立'),
  ];
  showModal({ title: isEdit ? '編輯課程' : '新增課程', body: form, footer });
}

function saveCourse(existing) {
  const data = {
    title: document.getElementById('c-title').value,
    category: document.getElementById('c-cat').value,
    difficulty: document.getElementById('c-diff').value,
    duration_hours: parseFloat(document.getElementById('c-hours').value) || 0,
    description: document.getElementById('c-desc').value,
    status: existing?.status || 'draft',
  };
  if (existing) Store.update('courses', existing.id, data);
  else Store.add('courses', data);
  closeModal();
  toast(existing ? '課程已更新' : '課程已建立', 'success');
  Router.navigate('/learn/manage');
}

function formGroup(label, input) {
  return h('div', { className: 'form-group' }, [h('label', {}, label), input]);
}

function selectEl(id, options, selected) {
  const sel = h('select', { className: 'form-input', id });
  options.forEach(([val, label]) => {
    const opt = h('option', { value: val }, label);
    if (val === selected) opt.selected = true;
    sel.appendChild(opt);
  });
  return sel;
}
