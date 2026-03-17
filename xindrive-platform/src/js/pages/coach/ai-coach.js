// ===== COACH — AI 教練對話 =====
import Store from '../../store.js';
import Router from '../../router.js';
import { h, appShell, avatar, badge } from '../../components/ui.js';

const DEMO_CHAT = [
  { role: 'ai', text: '歡迎來到 MEDDIC 實戰練習！今天我們來練習 M（Metrics）的部分。\n\n假設你正在拜訪德州儀器的採購經理王先生，他問你：「你們的方案可以幫我們省多少成本？」\n\n你會怎麼回答？' },
  { role: 'user', text: '王經理，根據我們過去服務類似規模客戶的經驗，導入我們的供應鏈優化方案後，平均可以降低 15-20% 的庫存成本，同時縮短交期約 30%。' },
  { role: 'ai', text: '不錯的開場！你提到了具體的百分比，這是好的。\n\n但在 MEDDIC 的 Metrics 框架中，我們需要更進一步：\n\n1. **量化為金額**：15-20% 庫存成本對 TI 來說具體是多少錢？\n2. **連結商業影響**：成本降低如何影響他們的利潤率？\n3. **建立 Timeline**：多長時間可以看到效果？\n\n試試看用這三個維度重新組織你的回答？' },
  { role: 'user', text: '王經理，根據貴司目前的庫存規模約 NT$5 億，我們的方案平均可為同規模客戶降低 15-20% 庫存持有成本，等於每年節省約 NT$7,500 萬至 1 億。同時縮短交期 30%，這將直接提升貴司的資金周轉率。通常導入後 3 個月開始見效，6 個月可達到完整效益。' },
  { role: 'ai', text: '太棒了！🎯 這個回答有明顯進步：\n\n✅ **量化為金額**：NT$7,500 萬至 1 億，客戶立刻有感\n✅ **連結商業影響**：提到資金周轉率\n✅ **建立 Timeline**：3 個月見效，6 個月完整效益\n\n**進階建議**：下次可以加入「同業案例」讓數字更有說服力。例如：「我們上個季度幫 XX 通路商達成了類似的結果。」\n\n要繼續練習下一個環節（E — Economic Buyer）嗎？' },
];

export function render() {
  const user = Store.getUser();
  const { wrapper } = appShell({
    pillar: 'coach',
    subTabs: [
      { id: 'plans', label: '📋 陪跑計畫' },
      { id: 'ai', label: '🤖 AI 教練' },
      { id: 'assessment', label: '📈 能力評估' },
    ],
    activeTab: 'ai', user,
    onTabClick: (id) => {
      if (id === 'plans') Router.navigate('/coach');
      else if (id === 'assessment') Router.navigate('/coach/assessment');
    },
    onPillarClick: (id) => Router.navigate(id === 'dashboard' ? '/dashboard' : `/${id}`),
  });
  return wrapper;
}

export function mount() {
  const content = document.querySelector('.content');
  if (!content) return;
  content.style.padding = '0';
  content.style.maxWidth = 'none';

  const container = h('div', { className: 'chat-container' });

  // Header
  container.appendChild(h('div', { className: 'chat-header' }, [
    avatar('AI', 'coach', 'sm'),
    h('div', { style: { fontWeight: '600' } }, 'AI 教練'),
    h('div', { className: 'chat-info' }, [
      h('span', {}, '方法論：MEDDIC'),
      h('span', {}, '場景：客戶拜訪模擬'),
      badge('Session #4', 'coach'),
    ]),
  ]));

  // Messages
  const messages = h('div', { className: 'chat-messages', id: 'chat-messages' });
  DEMO_CHAT.forEach(msg => messages.appendChild(chatBubble(msg)));
  container.appendChild(messages);

  // Input
  const input = h('input', {
    className: 'form-input', placeholder: '輸入你的回答...',
    id: 'chat-input',
  });
  container.appendChild(h('div', { className: 'chat-input-area' }, [
    input,
    h('button', { className: 'btn btn-coach', id: 'chat-send', onClick: sendMessage }, '送出'),
  ]));
  content.appendChild(container);

  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
  setTimeout(() => messages.scrollTop = messages.scrollHeight, 100);
}

function chatBubble(msg) {
  const isAI = msg.role === 'ai';
  return h('div', { className: `chat-bubble ${msg.role}` }, [
    h('div', { className: 'bubble-avatar' }, [
      avatar(isAI ? '🤖' : '👤', isAI ? 'coach' : 'accent', 'sm'),
    ]),
    h('div', { className: 'bubble-content', innerHTML: formatText(msg.text) }),
  ]);
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  const messages = document.getElementById('chat-messages');
  messages.appendChild(chatBubble({ role: 'user', text }));
  input.value = '';

  setTimeout(() => {
    messages.appendChild(chatBubble({
      role: 'ai',
      text: '很好的回答！讓我分析一下你的表現...\n\n（Demo 模式：正式版將接入 AI Agent 提供即時回饋）\n\n你可以繼續練習，或切換到其他場景。',
    }));
    messages.scrollTop = messages.scrollHeight;
  }, 800);
  messages.scrollTop = messages.scrollHeight;
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/✅/g, '<span style="color:var(--xd-success)">✅</span>')
    .replace(/🎯/g, '🎯')
    .replace(/\n/g, '<br>');
}
