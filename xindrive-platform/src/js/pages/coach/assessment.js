// ===== COACH — 能力評估 =====
import Store from '../../store.js';
import Router from '../../router.js';
import { h, appShell, badge } from '../../components/ui.js';
import { radarChart } from '../../components/charts.js';

const SKILL_MAP = {
  metrics_quantification: '指標量化',
  economic_buyer_access: '經濟買家',
  decision_criteria_analysis: '決策標準',
  decision_process_mapping: '決策流程',
  pain_identification: '痛點識別',
  champion_development: 'Champion',
  presentation_skills: '簡報能力',
  negotiation: '談判技巧',
};
const SKILL_LABELS = Object.values(SKILL_MAP);

// Parse skills from demo data (JSON string of object) into array
function parseSkills(assessment) {
  if (!assessment?.skills) return null;
  let skills = assessment.skills;
  if (typeof skills === 'string') {
    try { skills = JSON.parse(skills); } catch { return null; }
  }
  if (Array.isArray(skills)) return skills;
  // Object format: { key: { score, max, note } }
  return Object.entries(skills).map(([key, val]) => ({
    skill: key, score: val.score || 0, max: val.max || 10, note: val.note || '',
  }));
}

export function render() {
  const user = Store.getUser();
  const { wrapper } = appShell({
    pillar: 'coach',
    subTabs: [
      { id: 'plans', label: '📋 陪跑計畫' },
      { id: 'ai', label: '🤖 AI 教練' },
      { id: 'assessment', label: '📈 能力評估' },
    ],
    activeTab: 'assessment', user,
    onTabClick: (id) => {
      if (id === 'plans') Router.navigate('/coach');
      else if (id === 'ai') Router.navigate('/coach/ai');
    },
    onPillarClick: (id) => Router.navigate(id === 'dashboard' ? '/dashboard' : `/${id}`),
  });
  return wrapper;
}

export function mount() {
  const content = document.querySelector('.content');
  if (!content) return;
  const user = Store.getUser();

  // Get assessments for current user (or first coachee for trainer)
  let targetUserId = user.id;
  let assessments = Store.query('skill_assessments', a => a.user_id === targetUserId)
    .sort((a, b) => new Date(b.assessed_at) - new Date(a.assessed_at));

  // If no assessments for current user, try to find any
  if (!assessments.length) {
    assessments = Store.get('skill_assessments').sort((a, b) => new Date(b.assessed_at) - new Date(a.assessed_at));
    if (assessments.length) targetUserId = assessments[0].user_id;
  }

  const targetUser = Store.find('users', targetUserId);

  content.appendChild(h('div', { className: 'page-header' }, [
    h('h1', {}, '能力評估'),
    h('div', { className: 'page-desc' }, targetUser ? `${targetUser.full_name || targetUser.name} 的技能評估` : ''),
  ]));

  const layout = h('div', { className: 'assessment-layout' });

  // Radar Chart
  const radarCard = h('div', { className: 'card' });
  const datasets = [];
  const latest = assessments[0];
  const prev = assessments[1];

  const latestSkills = parseSkills(latest);
  const prevSkills = parseSkills(prev);

  if (latestSkills) {
    datasets.push({ data: latestSkills.map(s => s.score), color: '#10B981' });
  }
  if (prevSkills) {
    datasets.push({ data: prevSkills.map(s => s.score), color: '#CBD5E1' });
  }
  // Target line
  const labels = latestSkills ? latestSkills.map(s => SKILL_MAP[s.skill] || s.skill) : SKILL_LABELS;
  datasets.push({ data: labels.map(() => 8), color: '#3B82F6' });

  radarCard.appendChild(h('div', { className: 'radar-container' }, [
    radarChart(datasets, { labels, maxVal: 10, size: 320 }),
  ]));
  radarCard.appendChild(h('div', { className: 'flex justify-center gap-6 mt-4 text-sm' }, [
    h('span', {}, [h('span', { style: { color: '#10B981', fontWeight: '600' } }, '● '), '目前']),
    prev ? h('span', {}, [h('span', { style: { color: '#CBD5E1', fontWeight: '600' } }, '● '), '3 個月前']) : null,
    h('span', {}, [h('span', { style: { color: '#3B82F6', fontWeight: '600' } }, '● '), '目標']),
  ].filter(Boolean)));
  layout.appendChild(radarCard);

  // Skill List
  const skillCard = h('div', { className: 'card' });
  skillCard.appendChild(h('h2', { className: 'h2 mb-4' }, '各維度評分'));
  if (latestSkills) {
    const list = h('div', { className: 'skill-list' });
    latestSkills.forEach((s, i) => {
      const prevScore = prevSkills?.[i]?.score || 0;
      const diff = s.score - prevScore;
      list.appendChild(h('div', { className: 'skill-item' }, [
        h('div', { className: 'skill-name' }, SKILL_MAP[s.skill] || s.skill),
        h('div', { className: 'skill-bar' }, [
          h('div', { className: 'skill-bar-fill', style: { width: `${s.score * 10}%` } }),
        ]),
        h('div', { className: 'skill-score' }, `${s.score}`),
        diff > 0 ? h('span', { style: { color: 'var(--xd-success)', fontSize: '.75rem', fontWeight: '600', marginLeft: '4px' } }, `+${diff}`) : null,
      ].filter(Boolean)));
    });
    skillCard.appendChild(list);
  }

  if (latest?.overall_score) {
    skillCard.appendChild(h('div', { className: 'mt-6 p-4', style: { background: 'var(--xd-coach-light)', borderRadius: 'var(--radius)' } }, [
      h('div', { className: 'flex justify-between items-center' }, [
        h('span', { style: { fontWeight: '600' } }, '綜合評分'),
        h('span', { style: { fontSize: '1.5rem', fontWeight: '700', color: 'var(--xd-coach)' } }, `${latest.overall_score}/${(latestSkills?.length || 8) * 10}`),
      ]),
    ]));
  }

  if (latest?.summary) {
    skillCard.appendChild(h('div', { className: 'mt-4' }, [
      h('h3', { className: 'h3 mb-2' }, '📚 評估摘要'),
      h('p', { className: 'text-sm', style: { lineHeight: '1.8' } }, latest.summary),
    ]));
  }

  layout.appendChild(skillCard);
  content.appendChild(layout);
}
