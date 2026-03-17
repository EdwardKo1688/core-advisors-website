import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";

// ===== DATA =====
const ROLES = [
  { id: "sales", label: "業務人員", icon: "🎯", desc: "代理商/經銷商業務代表、KAM" },
  { id: "scm", label: "採購/供應鏈", icon: "🔗", desc: "採購、供應鏈管理、倉儲物流" },
  { id: "manager", label: "經營者/主管", icon: "👔", desc: "公司負責人、業務主管、營運主管" },
];

const SKILL_TREES = {
  sales: [
    { id: "product", name: "產品技術知識", desc: "代理產品規格、應用、競品比較" },
    { id: "spin", name: "SPIN 顧問式銷售", desc: "情境→問題→影響→需求確認的提問法" },
    { id: "challenger", name: "Challenger Sale", desc: "教育客戶、客製價值、掌握主導權" },
    { id: "meddic", name: "MEDDIC 商機管理", desc: "量化價值、決策者、痛點、Champion" },
    { id: "designin", name: "Design-in 管理", desc: "從方案推薦到量產的全週期管理" },
    { id: "negotiation", name: "商務談判", desc: "價格、帳期、交期的談判策略" },
    { id: "kam", name: "大客戶經營 KAM", desc: "策略客戶的深度經營與滲透" },
    { id: "pipeline", name: "Pipeline 管理", desc: "商機漏斗、預測、Win Rate 提升" },
  ],
  scm: [
    { id: "scor", name: "SCOR 模型", desc: "Plan-Source-Deliver-Return 完整框架" },
    { id: "sop", name: "S&OP 流程", desc: "銷售與營運計畫的月度循環" },
    { id: "forecast", name: "需求預測", desc: "統計預測、客戶 Forecast 管理、MAPE" },
    { id: "inventory", name: "庫存管理", desc: "安全庫存、ABC/XYZ 分析、DOI 控制" },
    { id: "supplier", name: "供應商管理", desc: "原廠評估、績效追蹤、多源策略" },
    { id: "lean", name: "精實供應鏈", desc: "消除浪費、縮短前置時間、看板管理" },
    { id: "resilience", name: "供應鏈韌性", desc: "風險識別、BCP、地緣政治應對" },
    { id: "digital", name: "數位供應鏈", desc: "AI 預測、RPA 自動化、IoT 追蹤" },
  ],
  manager: [
    { id: "strategy", name: "經營策略", desc: "代理權管理、產品組合、商業模式" },
    { id: "finance", name: "財務管理", desc: "毛利分析、CCC、應收帳款、匯率風險" },
    { id: "coaching", name: "教練技巧", desc: "GROW 模型、績效面談、困難對話" },
    { id: "team", name: "團隊建設", desc: "人才梯隊、培訓體系、激勵制度" },
    { id: "performance", name: "績效管理", desc: "BSC、OKR+KPI、業績漏斗管理" },
    { id: "market", name: "市場分析", desc: "產業趨勢、競爭分析、新領域評估" },
    { id: "digital_tx", name: "數位轉型", desc: "CRM 導入、數據驅動決策、自動化" },
    { id: "growth", name: "業績倍增", desc: "客戶數×客單價×頻率的系統拆解" },
  ],
};

const SCENARIOS = {
  sales: [
    {
      id: 1, title: "客戶首次拜訪：SPIN 實戰",
      difficulty: "初級",
      situation: "你即將第一次拜訪一家年營收20億的 ODM 廠，他們主要做 IoT 智慧家電。目前他們的 MCU 供應商是競爭對手的代理商。你代理的原廠剛推出一顆功耗更低、價格有競爭力的 WiFi MCU。",
      task: "用 SPIN 提問法設計這次拜訪的對話策略",
      hints: ["先設計2-3個 Situation 問題了解客戶現狀", "用 Problem 問題挖掘目前供應商的不足", "用 Implication 放大痛點的商業影響", "用 Need-Payoff 引導客戶認識你的方案價值"],
      evaluation: ["是否涵蓋SPIN四類問題", "問題是否針對IoT/WiFi MCU場景", "是否避免過多Situation問題", "是否能自然導向你的產品優勢"]
    },
    {
      id: 2, title: "大客戶防守：競爭對手搶攻",
      difficulty: "中級",
      situation: "你的 Top 3 客戶（佔公司營收25%）最近被競爭對手密集拜訪。客戶的採購經理暗示對方價格更低。同時你注意到客戶的新產品設計已經進入驗證階段，但沒有通知你參與。",
      task: "制定一個完整的客戶防守策略",
      hints: ["用 MEDDIC 框架分析這個客戶的決策結構", "識別你的 Champion 是否還在支持你", "分析對手的真正優勢vs你的不可替代性", "設計多層次反擊方案（技術面+商務面+關係面）"],
      evaluation: ["是否使用了MEDDIC分析", "策略是否涵蓋短期防守+中期深化", "是否考慮了價格以外的差異化", "行動計畫是否具體可執行"]
    },
    {
      id: 3, title: "QBR 準備：向原廠做季度回顧",
      difficulty: "高級",
      situation: "你即將向原廠做 Q3 的 QBR。本季營收達成率只有85%，主要因為兩個大客戶的量產推遲了。但你的 Design-in pipeline 非常健康，有幾個大案子即將進入量產。同時你想跟原廠爭取更多 MDF 預算來辦技術研討會。",
      task: "準備一份完整的 QBR 簡報策略",
      hints: ["數據面：如何解釋85%達成率而不被扣分", "策略面：如何用pipeline數據展示未來潛力", "請求面：如何justify MDF預算需求", "用Challenger Sale思維：帶給原廠新的市場洞察"],
      evaluation: ["是否坦誠面對shortfall並有root cause分析", "是否展示了pipeline的量化價值", "MDF申請是否有ROI支撐", "是否有給原廠新的市場洞察"]
    },
  ],
  scm: [
    {
      id: 1, title: "S&OP 月會：供需失衡",
      difficulty: "初級",
      situation: "這個月的 S&OP 會議數據顯示：業務端預測下季需求成長30%，但三條主要產品線中有兩條的原廠交期從8週延長到14週。同時倉庫的呆滯庫存已達到總庫存的15%（目標<5%）。",
      task: "設計這次 S&OP 會議的議程和決策提案",
      hints: ["區分真正的需求成長vs業務灌水", "評估交期延長的影響和應對方案", "呆滯庫存的處理優先順序", "財務面的資金需求評估"],
      evaluation: ["是否有完整的五步驟S&OP流程", "供需差距是否有量化分析", "是否提出可行的決策選項", "是否考慮財務影響"]
    },
    {
      id: 2, title: "供應鏈危機：原廠停產通知",
      difficulty: "高級",
      situation: "你剛收到一家主力原廠的通知：因為晶圓廠產能調配，其中一顆年出貨量500萬顆的料號將在6個月後 EOL。這顆料號佔你公司營收8%，有15家客戶在用。",
      task: "制定完整的危機應對方案",
      hints: ["SCOR模型分析影響範圍", "客戶分級處理（哪些最緊急）", "替代料源策略（pin-to-pin/功能替代）", "庫存策略（Last-time buy計算）"],
      evaluation: ["是否有系統性的影響評估", "客戶溝通策略是否分級", "替代方案是否務實可行", "時間表是否合理"]
    },
  ],
  manager: [
    {
      id: 1, title: "業績倍增：營收從5億到10億的路徑",
      difficulty: "高級",
      situation: "你是一家年營收5億台幣的 IC 代理商老闆。公司代理3家原廠，主要客戶在消費電子領域。業務團隊10人，FAE 3人。毛利率7%，逐年下滑。你的目標是3年內營收翻倍到10億。",
      task: "設計一個3年的業績倍增策略與行動路線圖",
      hints: ["用營收=客戶數×客單價×頻率拆解", "分析現有增長瓶頸在哪", "評估需要什麼新能力（新代理線？新市場？新模式？）", "考慮組織和人才的配套"],
      evaluation: ["是否有量化的目標拆解", "策略是否多維度（產品/客戶/市場）", "是否考慮組織能力建設", "90天快速行動是否明確"]
    },
  ],
};

const KNOWLEDGE_CARDS = [
  { category: "CRM", title: "MEDDIC", subtitle: "B2B 銷售資格認定", content: "M=Metrics E=Economic Buyer D=Decision Criteria D=Decision Process I=Identify Pain C=Champion。幫助判斷商機品質，避免浪費資源在低品質商機上。", color: "blue" },
  { category: "CRM", title: "Challenger Sale", subtitle: "挑戰者銷售法", content: "三大行為：Teach（教育客戶新觀點）、Tailor（客製化價值主張）、Take Control（掌握銷售主導權）。研究顯示最頂尖的B2B業務都是Challenger型。", color: "blue" },
  { category: "CRM", title: "SPIN Selling", subtitle: "顧問式銷售提問法", content: "S=Situation（情境）P=Problem（問題）I=Implication（影響）N=Need-payoff（需求確認）。透過結構化提問引導客戶自己發現需求。", color: "blue" },
  { category: "CRM", title: "Pipeline Velocity", subtitle: "銷售漏斗速度", content: "公式：(商機數 × 平均金額 × Win Rate) / 平均銷售天數。四個槓桿：增加商機數、提高金額、提高Win Rate、縮短週期。", color: "blue" },
  { category: "CRM", title: "CLV 客戶終身價值", subtitle: "客戶生命週期管理", content: "客戶生命週期五階段：獲客→啟動→成長→成熟→防守/擴張。每階段有不同的KPI和關鍵動作。", color: "blue" },
  { category: "SCM", title: "SCOR 模型", subtitle: "供應鏈營運參考", content: "六大流程：Plan（計畫）→ Source（採購）→ Make（加工）→ Deliver（交付）→ Return（退回）→ Enable（支持）。全球最廣泛使用的SC框架。", color: "green" },
  { category: "SCM", title: "S&OP", subtitle: "銷售與營運計畫", content: "月度五步驟：數據準備→需求規劃→供給規劃→整合協調→高層決策。核心目的：確保「要的貨有備、不要的貨不囤」。", color: "green" },
  { category: "SCM", title: "CCC 現金轉換週期", subtitle: "營運資金管理", content: "CCC = DSO + DOI - DPO。IC通路優秀值<45天。縮短DSO（加速收款）、縮短DOI（降低庫存）、延長DPO（善用帳期）。", color: "green" },
  { category: "SCM", title: "MAPE 預測準確度", subtitle: "需求預測衡量", content: "MAPE = Σ|實際-預測|/實際 × 100%。<10%優秀，10-20%良好，>30%待改善。IC通路常見偏差原因：客戶forecast灌水、季節性忽略。", color: "green" },
  { category: "管理", title: "業績倍增公式", subtitle: "營收成長拆解", content: "營收 = 客戶數 × 客單價 × 購買頻率。每個變數提升20%，營收成長1.73倍。分別針對三個變數制定提升策略。", color: "purple" },
  { category: "管理", title: "GROW 教練模型", subtitle: "主管教練技巧", content: "G=Goal（目標）R=Reality（現狀）O=Options（方案）W=Will（行動意願）。80%時間聽和問，20%時間給建議。", color: "purple" },
  { category: "管理", title: "BSC 平衡計分卡", subtitle: "績效管理框架", content: "四個構面：財務（營收/毛利）、客戶（留存/新開發）、流程（Pipeline/Win Rate）、學習（培訓/拜訪）。避免只看財務指標。", color: "purple" },
];

const TEMPLATES = [
  { id: 1, name: "MEDDIC 商機評分卡", desc: "8 要素評分表，附 IC 通路填寫範例", category: "CRM", icon: "📋" },
  { id: 2, name: "SPIN 對話設計表", desc: "四類問題規劃模板，含場景練習", category: "CRM", icon: "💬" },
  { id: 3, name: "客戶策略計畫書", desc: "ABS 目標客戶 12 個月經營計畫", category: "CRM", icon: "🎯" },
  { id: 4, name: "QBR 簡報模板", desc: "原廠季度業務回顧完整架構", category: "CRM", icon: "📊" },
  { id: 5, name: "S&OP 月會議程表", desc: "五步驟會議流程與決策模板", category: "SCM", icon: "📅" },
  { id: 6, name: "庫存 ABC/XYZ 分析表", desc: "Excel 分析模板含公式", category: "SCM", icon: "📦" },
  { id: 7, name: "供應商評估計分卡", desc: "原廠五維度加權評估表", category: "SCM", icon: "✅" },
  { id: 8, name: "供應鏈風險矩陣", desc: "風險識別與應對策略模板", category: "SCM", icon: "⚠️" },
  { id: 9, name: "90 天行動計畫表", desc: "12 週目標拆解與追蹤表", category: "管理", icon: "🗓️" },
  { id: 10, name: "業務 BSC 計分卡", desc: "四構面 KPI 設定與追蹤", category: "管理", icon: "📈" },
  { id: 11, name: "培訓需求分析問卷", desc: "TNA 三層面診斷問卷", category: "管理", icon: "📝" },
  { id: 12, name: "Pipeline 追蹤表", desc: "六階段商機管理含加權算法", category: "CRM", icon: "🔄" },
];

// ===== COMPONENTS =====
const Nav = ({ active, setActive, role }) => {
  const items = [
    { id: "home", label: "首頁", icon: "🏠" },
    { id: "assess", label: "能力診斷", icon: "📊" },
    { id: "learn", label: "學習路徑", icon: "📚" },
    { id: "practice", label: "案例練習", icon: "🎮" },
    { id: "knowledge", label: "知識卡片", icon: "💡" },
    { id: "templates", label: "範本下載", icon: "📥" },
    { id: "dashboard", label: "儀表板", icon: "📈" },
  ];
  return (
    <div className="flex overflow-x-auto border-b border-gray-200 bg-white sticky top-0 z-10">
      {items.map((it) => (
        <button key={it.id} onClick={() => setActive(it.id)}
          className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${active === it.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
          <span>{it.icon}</span>{it.label}
        </button>
      ))}
    </div>
  );
};

const RoleSelector = ({ role, setRole, setPage }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    <div className="max-w-2xl w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">IC 通路培訓顧問助手</h1>
        <p className="text-gray-600">世界級 CRM / SCM / 業績倍增方法論 — 互動學習平台</p>
      </div>
      <p className="text-center text-gray-700 mb-6 font-medium">請選擇你的角色，開始個人化學習旅程</p>
      <div className="grid gap-4">
        {ROLES.map((r) => (
          <button key={r.id} onClick={() => { setRole(r.id); setPage("home"); }}
            className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left ${role === r.id ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 bg-white hover:border-blue-300 hover:shadow"}`}>
            <span className="text-4xl">{r.icon}</span>
            <div>
              <div className="font-bold text-lg text-gray-900">{r.label}</div>
              <div className="text-sm text-gray-500">{r.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const HomePage = ({ role, setPage, scores }) => {
  const r = ROLES.find((x) => x.id === role);
  const skills = SKILL_TREES[role] || [];
  const avgScore = scores && Object.keys(scores).length > 0
    ? (Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length).toFixed(1)
    : null;
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{r?.icon}</span>
          <h2 className="text-2xl font-bold">{r?.label} 學習中心</h2>
        </div>
        <p className="text-blue-100 mb-6">{r?.desc}</p>
        {avgScore ? (
          <div className="bg-white/20 rounded-lg px-4 py-2 inline-block">
            <span className="text-sm text-blue-100">綜合能力評分：</span>
            <span className="text-2xl font-bold ml-2">{avgScore}</span>
            <span className="text-blue-200">/5</span>
          </div>
        ) : (
          <button onClick={() => setPage("assess")} className="bg-white text-blue-600 font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-50 transition">
            開始能力診斷 →
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: "📊", label: "能力診斷", page: "assess", color: "bg-blue-50 text-blue-700" },
          { icon: "📚", label: "學習路徑", page: "learn", color: "bg-green-50 text-green-700" },
          { icon: "🎮", label: "案例練習", page: "practice", color: "bg-orange-50 text-orange-700" },
          { icon: "💡", label: "知識卡片", page: "knowledge", color: "bg-purple-50 text-purple-700" },
        ].map((it) => (
          <button key={it.page} onClick={() => setPage(it.page)}
            className={`${it.color} p-4 rounded-xl text-center hover:shadow-md transition`}>
            <div className="text-2xl mb-1">{it.icon}</div>
            <div className="font-medium text-sm">{it.label}</div>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-bold text-gray-900 mb-4">技能樹 — {skills.length} 項核心能力</h3>
        <div className="grid gap-3">
          {skills.map((s) => {
            const sc = scores?.[s.id];
            return (
              <div key={s.id} className="flex items-center gap-3">
                <div className="w-32 text-sm font-medium text-gray-700 truncate">{s.name}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(sc || 0) * 20}%`, backgroundColor: sc >= 4 ? "#22c55e" : sc >= 3 ? "#eab308" : sc ? "#ef4444" : "#d1d5db" }} />
                </div>
                <div className="w-10 text-right text-sm font-semibold text-gray-600">{sc ? `${sc}/5` : "—"}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AssessmentPage = ({ role, scores, setScores }) => {
  const skills = SKILL_TREES[role] || [];
  const [current, setCurrent] = useState(0);
  const [tempScores, setTempScores] = useState({ ...scores });
  const [done, setDone] = useState(false);

  const handleScore = (skillId, score) => {
    setTempScores((p) => ({ ...p, [skillId]: score }));
  };

  const finish = () => { setScores(tempScores); setDone(true); };

  if (done) {
    const radarData = skills.map((s) => ({ skill: s.name.slice(0, 6), score: tempScores[s.id] || 0, fullMark: 5 }));
    const gaps = skills.filter((s) => (tempScores[s.id] || 0) < 3).sort((a, b) => (tempScores[a.id] || 0) - (tempScores[b.id] || 0));
    const avg = (Object.values(tempScores).reduce((a, b) => a + b, 0) / skills.length).toFixed(1);
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">能力診斷報告</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border p-6">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-blue-600">{avg}</div>
              <div className="text-gray-500 text-sm mt-1">綜合能力評分（滿分5）</div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid /><PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Radar dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-bold text-gray-900 mb-3">優先發展建議</h3>
            {gaps.length === 0 ? <p className="text-green-600 font-medium">所有能力都達到良好水準，可聚焦精進到卓越！</p> : (
              <div className="space-y-3">
                {gaps.slice(0, 4).map((s, i) => (
                  <div key={s.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">Gap {i + 1}</span>
                    <div>
                      <div className="font-medium text-gray-900">{s.name}<span className="text-red-500 text-sm ml-2">({tempScores[s.id] || 0}/5)</span></div>
                      <div className="text-sm text-gray-500">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800">建議學習路徑</div>
              <div className="text-sm text-blue-600 mt-1">
                {avg < 2.5 ? "從基礎課程開始，建議先完成所有初級案例練習" :
                  avg < 3.5 ? "能力基礎紮實，建議聚焦弱項突破+中級案例練習" :
                    avg < 4.5 ? "表現優秀！建議挑戰高級案例+擔任內部講師分享" :
                      "頂尖水準！建議擔任教練角色，協助團隊共同成長"}
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => setDone(false)} className="text-blue-600 hover:underline text-sm">← 重新評估</button>
      </div>
    );
  }

  const skill = skills[current];
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">能力自我診斷</h2>
        <span className="text-sm text-gray-500">{current + 1} / {skills.length}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${((current + 1) / skills.length) * 100}%` }} />
      </div>
      <div className="bg-white rounded-xl border p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{skill.name}</h3>
        <p className="text-gray-500 mb-8">{skill.desc}</p>
        <p className="text-sm text-gray-600 mb-4">你目前在這項能力的掌握程度？</p>
        <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => handleScore(skill.id, n)}
              className={`w-14 h-14 rounded-xl text-lg font-bold transition-all ${tempScores[skill.id] === n ? "bg-blue-600 text-white scale-110 shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 px-2 mb-8">
          <span>完全不了解</span><span>初步認識</span><span>能獨立操作</span><span>熟練應用</span><span>可以教人</span>
        </div>
        <div className="flex gap-3 justify-center">
          {current > 0 && <button onClick={() => setCurrent((c) => c - 1)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">上一題</button>}
          {current < skills.length - 1
            ? <button onClick={() => setCurrent((c) => c + 1)} disabled={!tempScores[skill.id]}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40">下一題</button>
            : <button onClick={finish} disabled={!tempScores[skill.id]}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40">完成診斷</button>
          }
        </div>
      </div>
    </div>
  );
};

const LearningPath = ({ role, scores }) => {
  const skills = SKILL_TREES[role] || [];
  const sorted = [...skills].sort((a, b) => (scores[a.id] || 0) - (scores[b.id] || 0));
  const levelLabel = (sc) => sc >= 4 ? "精通" : sc >= 3 ? "進階" : sc >= 2 ? "基礎" : "入門";
  const levelColor = (sc) => sc >= 4 ? "bg-green-100 text-green-700" : sc >= 3 ? "bg-blue-100 text-blue-700" : sc >= 2 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
  const courses = {
    sales: { low: "SPIN Selling 實戰版（2天）", mid: "Challenger Sale 工作坊（1天）", high: "MEDDIC 認證培訓（2天）" },
    scm: { low: "S&OP 實務工作坊（1天）", mid: "庫存管理優化（半天）", high: "數位供應鏈轉型策略（1天）" },
    manager: { low: "數據驅動業務管理（1天）", mid: "業務主管教練技巧（2天）", high: "策略性客戶規劃工作坊（1天）" },
  };
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">個人學習路徑</h2>
      <p className="text-gray-500 mb-6">根據你的能力診斷結果，為你規劃最佳學習順序</p>
      {Object.keys(scores).length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-yellow-800 font-medium">請先完成「能力診斷」，才能產出個人化學習路徑</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((s, i) => {
            const sc = scores[s.id] || 0;
            const c = courses[role];
            const rec = sc < 2 ? c?.low : sc < 3.5 ? c?.mid : c?.high;
            return (
              <div key={s.id} className="bg-white rounded-xl border p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full">{i + 1}</span>
                    <span className="font-bold text-gray-900">{s.name}</span>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColor(sc)}`}>{levelLabel(sc)} ({sc}/5)</span>
                </div>
                <p className="text-sm text-gray-500 ml-10 mb-2">{s.desc}</p>
                {sc < 4 && <div className="ml-10 mt-2 text-sm"><span className="text-blue-600 font-medium">推薦課程：</span>{rec}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const PracticePage = ({ role }) => {
  const scenarios = SCENARIOS[role] || [];
  const [selected, setSelected] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [answer, setAnswer] = useState("");

  if (selected !== null) {
    const sc = scenarios[selected];
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <button onClick={() => { setSelected(null); setShowHints(false); setAnswer(""); }} className="text-blue-600 hover:underline text-sm mb-4 inline-block">← 返回案例列表</button>
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
            <span className={`text-xs font-bold px-2 py-1 rounded ${sc.difficulty === "初級" ? "bg-green-200 text-green-800" : sc.difficulty === "中級" ? "bg-yellow-200 text-yellow-800" : "bg-red-200 text-red-800"}`}>{sc.difficulty}</span>
            <h3 className="text-xl font-bold text-white mt-2">{sc.title}</h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">情境描述</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg text-sm leading-relaxed">{sc.situation}</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">你的任務</h4>
              <p className="text-blue-700 bg-blue-50 p-4 rounded-lg font-medium">{sc.task}</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">你的回答</h4>
              <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={8}
                className="w-full border rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
                placeholder="在這裡寫下你的策略方案..." />
            </div>
            <button onClick={() => setShowHints(!showHints)}
              className="text-orange-600 font-medium text-sm hover:underline">
              {showHints ? "隱藏提示與評估標準" : "需要提示？點這裡 →"}
            </button>
            {showHints && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-bold text-yellow-800 mb-2">思考提示</h5>
                  <ul className="space-y-1.5">{sc.hints.map((h, i) => <li key={i} className="text-sm text-yellow-700 flex gap-2"><span>💡</span>{h}</li>)}</ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-bold text-green-800 mb-2">評估標準</h5>
                  <ul className="space-y-1.5">{sc.evaluation.map((e, i) => <li key={i} className="text-sm text-green-700 flex gap-2"><span>✅</span>{e}</li>)}</ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">案例模擬練習</h2>
      <p className="text-gray-500 mb-6">選擇一個情境，練習你的策略思維與方法論應用</p>
      {scenarios.length === 0 ? <p className="text-gray-400">此角色的案例正在開發中...</p> : (
        <div className="grid gap-4">
          {scenarios.map((sc, i) => (
            <button key={sc.id} onClick={() => setSelected(i)}
              className="bg-white rounded-xl border p-5 text-left hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">{sc.title}</h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.difficulty === "初級" ? "bg-green-100 text-green-700" : sc.difficulty === "中級" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{sc.difficulty}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{sc.situation}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const KnowledgePage = () => {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const cats = ["all", "CRM", "SCM", "管理"];
  const colors = { blue: "border-blue-200 bg-blue-50", green: "border-green-200 bg-green-50", purple: "border-purple-200 bg-purple-50" };
  const badgeColors = { blue: "bg-blue-100 text-blue-700", green: "bg-green-100 text-green-700", purple: "bg-purple-100 text-purple-700" };
  const filtered = filter === "all" ? KNOWLEDGE_CARDS : KNOWLEDGE_CARDS.filter((c) => c.category === filter);
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">知識卡片庫</h2>
      <p className="text-gray-500 mb-4">世界級 CRM / SCM / 管理方法論速查</p>
      <div className="flex gap-2 mb-6">
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === c ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {c === "all" ? "全部" : c}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((card, i) => (
          <div key={i} onClick={() => setExpanded(expanded === i ? null : i)}
            className={`rounded-xl border-2 p-5 cursor-pointer transition-all hover:shadow-md ${colors[card.color]}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${badgeColors[card.color]}`}>{card.category}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{card.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{card.subtitle}</p>
            {expanded === i && <p className="text-sm text-gray-700 mt-3 pt-3 border-t border-gray-200 leading-relaxed">{card.content}</p>}
            <span className="text-xs text-gray-400 mt-2 block">{expanded === i ? "點擊收合" : "點擊展開"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TemplatesPage = () => {
  const [filter, setFilter] = useState("all");
  const cats = ["all", "CRM", "SCM", "管理"];
  const filtered = filter === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.category === filter);
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">範本與模板下載</h2>
      <p className="text-gray-500 mb-4">即學即用的實戰工具，可直接應用到工作中</p>
      <div className="flex gap-2 mb-6">
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === c ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {c === "all" ? "全部" : c}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border p-5 flex items-start gap-4 hover:shadow-md transition">
            <span className="text-3xl">{t.icon}</span>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{t.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{t.desc}</p>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{t.category}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-200 text-center">
        <p className="text-blue-800 font-medium">需要客製化的範本或特定格式？</p>
        <p className="text-sm text-blue-600 mt-1">直接在 Claude 對話中告訴我：「幫我製作 MEDDIC 評分卡的 Excel 範本」，我會立即為你產出！</p>
      </div>
    </div>
  );
};

const DashboardPage = ({ role, scores }) => {
  const skills = SKILL_TREES[role] || [];
  const hasScores = Object.keys(scores).length > 0;
  const avg = hasScores ? (Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length) : 0;
  const strong = skills.filter((s) => (scores[s.id] || 0) >= 4).length;
  const weak = skills.filter((s) => (scores[s.id] || 0) < 3 && scores[s.id]).length;

  const barData = skills.map((s) => ({
    name: s.name.length > 8 ? s.name.slice(0, 8) + ".." : s.name,
    分數: scores[s.id] || 0,
    目標: 4,
  }));

  const summaryCards = [
    { label: "綜合評分", value: hasScores ? avg.toFixed(1) : "—", unit: "/5", color: "text-blue-600" },
    { label: "優勢能力", value: strong, unit: "項", color: "text-green-600" },
    { label: "待加強", value: weak, unit: "項", color: "text-red-600" },
    { label: "完成度", value: hasScores ? Math.round((Object.keys(scores).length / skills.length) * 100) : 0, unit: "%", color: "text-purple-600" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">學習儀表板</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((c, i) => (
          <div key={i} className="bg-white rounded-xl border p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">{c.label}</div>
            <div className={`text-3xl font-bold ${c.color}`}>{c.value}<span className="text-sm font-normal text-gray-400 ml-1">{c.unit}</span></div>
          </div>
        ))}
      </div>
      {hasScores && (
        <div className="bg-white rounded-xl border p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4">能力 vs 目標對比</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="分數" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="目標" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 p-6">
        <h3 className="font-bold text-indigo-900 mb-3">AI 教練互動建議</h3>
        <p className="text-sm text-indigo-700 mb-4">你可以隨時在 Claude 對話中跟 AI 教練互動，例如：</p>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            "「我想練習用 SPIN 拜訪一個車用電子客戶」",
            "「幫我分析這個客戶的 MEDDIC 評分」",
            "「我的庫存週轉天數是65天，怎麼改善？」",
            "「幫我設計一個業務團隊的季度培訓計畫」",
            "「我想練習跟原廠做 QBR 簡報」",
            "「客戶要求降價5%，怎麼談判？」",
          ].map((q, i) => (
            <div key={i} className="bg-white/70 rounded-lg p-3 text-sm text-indigo-800 font-medium">{q}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===== MAIN APP =====
export default function App() {
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("home");
  const [scores, setScores] = useState({});

  if (!role) return <RoleSelector role={role} setRole={setRole} setPage={setPage} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">IC</span>
          <span className="text-sm font-medium text-gray-700">通路培訓顧問助手</span>
        </div>
        <button onClick={() => { setRole(null); setPage("home"); setScores({}); }}
          className="text-sm text-gray-500 hover:text-gray-700">切換角色</button>
      </div>
      <Nav active={page} setActive={setPage} role={role} />
      {page === "home" && <HomePage role={role} setPage={setPage} scores={scores} />}
      {page === "assess" && <AssessmentPage role={role} scores={scores} setScores={setScores} />}
      {page === "learn" && <LearningPath role={role} scores={scores} />}
      {page === "practice" && <PracticePage role={role} />}
      {page === "knowledge" && <KnowledgePage />}
      {page === "templates" && <TemplatesPage />}
      {page === "dashboard" && <DashboardPage role={role} scores={scores} />}
    </div>
  );
}
