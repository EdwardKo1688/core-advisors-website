/* ============================================
   Jaya 客服中心 DNA 智慧診斷 — 核心邏輯
   ============================================ */

// ── 問卷資料定義 ──
const SECTIONS = [
    {
        id: 'basic', title: '基本資料', desc: '請填寫您的基本資訊，以便生成個人化報告', count: '公司與聯絡資訊',
        type: 'form'
    },
    { id: 'strategy', title: '客服策略與治理', desc: '了解貴公司客服中心的策略定位與治理架構', count: 'Q1 – Q4', dimension: 0 },
    { id: 'people', title: '人員與組織', desc: '評估團隊結構、培訓機制與人力管理成熟度', count: 'Q5 – Q8', dimension: 1 },
    { id: 'process', title: '流程與品質', desc: '檢視工單管理、品質監控與關鍵指標追蹤能力', count: 'Q9 – Q12', dimension: 2 },
    { id: 'technology', title: '技術與平台', desc: '評估通訊系統、CTI 整合與系統架構現況', count: 'Q13 – Q17', dimension: 3 },
    { id: 'channel', title: '通路與客戶體驗', desc: '檢視客服通路覆蓋、整合程度與客戶體驗品質', count: 'Q18 – Q22', dimension: 4 },
    { id: 'data', title: '數據與 AI 應用', desc: '評估數據收集、分析能力與 AI 自動化應用程度', count: 'Q23 – Q26', dimension: 5 }
];

const DIMENSIONS = [
    { name: '客服策略與治理', icon: '🎯', key: 'strategy' },
    { name: '人員與組織', icon: '👥', key: 'people' },
    { name: '流程與品質', icon: '⚙️', key: 'process' },
    { name: '技術與平台', icon: '🖥️', key: 'technology' },
    { name: '通路與客戶體驗', icon: '📱', key: 'channel' },
    { name: '數據與 AI 應用', icon: '🤖', key: 'data' }
];

const QUESTIONS = [
    // S1: 策略與治理 (Q1-Q4)
    {
        id: 'q1', section: 1, scored: true, dimension: 0,
        text: '貴公司如何定位客服中心？',
        options: [
            { score: 1, text: '成本中心，盡量縮減預算與人力' },
            { score: 2, text: '必要支出，維持基本服務水準' },
            { score: 3, text: '重要部門，有明確 KPI 與預算' },
            { score: 4, text: '策略資產，驅動客戶留存與品牌忠誠' },
            { score: 5, text: '利潤中心，創造營收與品牌差異化價值' }
        ]
    },
    {
        id: 'q2', section: 1, scored: true, dimension: 0,
        text: '客服中心是否有明確的年度策略目標與預算？',
        options: [
            { score: 1, text: '無規劃，隨需調整' },
            { score: 2, text: '有基本預算但無明確策略目標' },
            { score: 3, text: '有年度目標與預算規劃' },
            { score: 4, text: '有 3 年路線圖與階段性里程碑' },
            { score: 5, text: '有策略藍圖且與企業整體目標連動' }
        ]
    },
    {
        id: 'q3', section: 1, scored: true, dimension: 0,
        text: '客服相關決策的最高層級為何？',
        options: [
            { score: 1, text: '基層主管自行決定' },
            { score: 2, text: '部門經理層級' },
            { score: 3, text: '副總 / 總監層級' },
            { score: 4, text: 'C-level 直接管理與參與' },
            { score: 5, text: '董事會定期檢視 CX 指標與策略' }
        ]
    },
    {
        id: 'q4', section: 1, scored: true, dimension: 0,
        text: '貴公司對 AI 客服的態度與規劃？',
        options: [
            { score: 1, text: '尚未考慮導入 AI' },
            { score: 2, text: '觀望中，還在了解階段' },
            { score: 3, text: '已開始評估具體方案' },
            { score: 4, text: '局部導入中（如 Chatbot 或語音分析）' },
            { score: 5, text: '全面佈局，已建立 AI 治理框架' }
        ]
    },
    // S2: 人員與組織 (Q5-Q8)
    {
        id: 'q5', section: 2, scored: false, dimension: 1,
        text: '客服團隊規模為何？',
        options: [
            { score: 1, text: '1 – 5 人' },
            { score: 2, text: '6 – 20 人' },
            { score: 3, text: '21 – 50 人' },
            { score: 4, text: '51 – 200 人' },
            { score: 5, text: '200 人以上' }
        ]
    },
    {
        id: 'q6', section: 2, scored: true, dimension: 1,
        text: '客服人員年流動率約為？',
        options: [
            { score: 1, text: '超過 50%' },
            { score: 2, text: '30% – 50%' },
            { score: 3, text: '20% – 30%' },
            { score: 4, text: '10% – 20%' },
            { score: 5, text: '低於 10%' }
        ]
    },
    {
        id: 'q7', section: 2, scored: true, dimension: 1,
        text: '新進客服人員培訓期多長？',
        options: [
            { score: 1, text: '無正式培訓流程' },
            { score: 2, text: '1 – 3 天簡單訓練' },
            { score: 3, text: '1 – 2 週含實務演練' },
            { score: 4, text: '3 – 4 週含模擬上線與考核' },
            { score: 5, text: '完整培訓 + 導師制度 + 持續學習計畫' }
        ]
    },
    {
        id: 'q8', section: 2, scored: true, dimension: 1,
        text: '是否有系統化排班與人力管理（WFM）？',
        options: [
            { score: 1, text: '手動排班，無系統輔助' },
            { score: 2, text: 'Excel 管理排班' },
            { score: 3, text: '基礎排班軟體' },
            { score: 4, text: 'WFM 系統 + 話務量預測模型' },
            { score: 5, text: 'AI 驅動即時人力調度與預測' }
        ]
    },
    // S3: 流程與品質 (Q9-Q12)
    {
        id: 'q9', section: 3, scored: true, dimension: 2,
        text: '工單 / 案件管理方式為何？',
        options: [
            { score: 1, text: '紙本或口頭追蹤' },
            { score: 2, text: 'Email / Excel 追蹤管理' },
            { score: 3, text: '基礎工單系統（開單→結案）' },
            { score: 4, text: '完整工單生命週期管理 + SLA 機制' },
            { score: 5, text: '智能派工 + 自動升級 + 預測分析' }
        ]
    },
    {
        id: 'q10', section: 3, scored: true, dimension: 2,
        text: '是否有標準作業流程（SOP）？',
        options: [
            { score: 1, text: '無 SOP，各自處理' },
            { score: 2, text: '部分有 SOP 但不統一' },
            { score: 3, text: '有統一 SOP 手冊與教材' },
            { score: 4, text: '數位化 SOP + 線上知識庫' },
            { score: 5, text: 'AI 輔助即時導引 + SOP 動態更新' }
        ]
    },
    {
        id: 'q11', section: 3, scored: true, dimension: 2,
        text: '品質監控方式為何？',
        options: [
            { score: 1, text: '無品質監控機制' },
            { score: 2, text: '主管偶爾側聽抽查' },
            { score: 3, text: '定期抽檢 + 評分表' },
            { score: 4, text: '系統化 QA + 全通話錄音分析' },
            { score: 5, text: 'AI 自動品質評分 + 即時提醒與輔導' }
        ]
    },
    {
        id: 'q12', section: 3, scored: true, dimension: 2,
        text: '是否追蹤關鍵客服指標（FCR / AHT / CSAT）？',
        options: [
            { score: 1, text: '不追蹤任何指標' },
            { score: 2, text: '手動統計，不定期檢視' },
            { score: 3, text: '系統產出基礎報表，定期檢視' },
            { score: 4, text: '即時儀表板 + 趨勢分析' },
            { score: 5, text: '預測式分析 + 自動異常告警' }
        ]
    },
    // S4: 技術與平台 (Q13-Q17)
    {
        id: 'q13', section: 4, scored: true, dimension: 3,
        text: '目前使用的電話系統類型？',
        options: [
            { score: 1, text: '傳統類比 PBX' },
            { score: 2, text: '數位 PBX' },
            { score: 3, text: 'IP-PBX（地端部署）' },
            { score: 4, text: '雲端 PBX / UCaaS' },
            { score: 5, text: '雲端 CCaaS 平台（如 Genesys Cloud）' }
        ]
    },
    {
        id: 'q14', section: 4, scored: true, dimension: 3,
        text: '電話系統使用年限？',
        options: [
            { score: 1, text: '超過 10 年' },
            { score: 2, text: '7 – 10 年' },
            { score: 3, text: '4 – 6 年' },
            { score: 4, text: '1 – 3 年' },
            { score: 5, text: '不到 1 年（最新世代）' }
        ]
    },
    {
        id: 'q15', section: 4, scored: true, dimension: 3,
        text: 'CTI（電腦電話整合）程度？',
        options: [
            { score: 1, text: '無 CTI 功能' },
            { score: 2, text: '基礎來電彈屏（螢幕彈出客戶資料）' },
            { score: 3, text: 'CRM 整合 + 客戶資料自動帶入' },
            { score: 4, text: '全通路 CTI + 智能路由分配' },
            { score: 5, text: 'AI 預測路由 + 情境感知 + 客戶旅程追蹤' }
        ]
    },
    {
        id: 'q16', section: 4, scored: true, dimension: 3,
        text: '系統整合程度（CRM / ERP / 工單）？',
        options: [
            { score: 1, text: '各系統完全獨立運作' },
            { score: 2, text: '部分手動資料同步' },
            { score: 3, text: 'API 基礎整合（單向或部分雙向）' },
            { score: 4, text: '深度雙向整合，資料即時同步' },
            { score: 5, text: '統一平台 + 即時數據流 + 事件驅動' }
        ]
    },
    {
        id: 'q17', section: 4, scored: false, dimension: 3,
        text: '系統部署架構偏好？',
        options: [
            { score: 1, text: '純地端（無上雲計畫）' },
            { score: 2, text: '地端為主，開始考慮雲端' },
            { score: 3, text: '混合雲（部分雲端部分地端）' },
            { score: 4, text: '雲端優先策略' },
            { score: 5, text: '100% 雲原生' }
        ]
    },
    // S5: 通路與客戶體驗 (Q18-Q22)
    {
        id: 'q18', section: 5, scored: true, dimension: 4,
        text: '目前提供哪些客服通路？',
        options: [
            { score: 1, text: '僅電話' },
            { score: 2, text: '電話 + Email' },
            { score: 3, text: '電話 + Email + 網頁客服或 LINE 其一' },
            { score: 4, text: '4 個以上通路（含社群媒體）' },
            { score: 5, text: '全通路（語音 + 數位 + 社群 + 自助服務）' }
        ]
    },
    {
        id: 'q19', section: 5, scored: true, dimension: 4,
        text: '各通路之間的整合程度？',
        options: [
            { score: 1, text: '完全獨立，各通路各自運作' },
            { score: 2, text: '各自獨立但共用客戶基本資料' },
            { score: 3, text: '部分通路可互轉（如電話轉文字）' },
            { score: 4, text: '統一佇列 + 跨通路互動歷史' },
            { score: 5, text: '無縫全通路 + 即時通路切換不中斷' }
        ]
    },
    {
        id: 'q20', section: 5, scored: true, dimension: 4,
        text: '是否提供客戶自助服務？',
        options: [
            { score: 1, text: '無任何自助服務' },
            { score: 2, text: '基礎 FAQ 網頁' },
            { score: 3, text: 'IVR 自助選單（語音）' },
            { score: 4, text: '線上知識庫 + 智能搜尋' },
            { score: 5, text: 'AI 自助服務 + 預測性主動服務' }
        ]
    },
    {
        id: 'q21', section: 5, scored: true, dimension: 4,
        text: '客戶需要重複說明問題的頻率？',
        options: [
            { score: 1, text: '每次都要重新說明' },
            { score: 2, text: '經常需要（> 60%）' },
            { score: 3, text: '偶爾需要（30% – 60%）' },
            { score: 4, text: '很少需要（< 30%）' },
            { score: 5, text: '幾乎不用（完整歷史自動帶入）' }
        ]
    },
    {
        id: 'q22', section: 5, scored: true, dimension: 4,
        text: '是否有客戶滿意度調查機制？',
        options: [
            { score: 1, text: '無任何調查機制' },
            { score: 2, text: '偶爾手動調查' },
            { score: 3, text: '通話後自動 IVR 滿意度調查' },
            { score: 4, text: '多通路 CSAT + NPS 調查' },
            { score: 5, text: '即時情感分析 + 閉環改善機制' }
        ]
    },
    // S6: 數據與 AI (Q23-Q26)
    {
        id: 'q23', section: 6, scored: true, dimension: 5,
        text: '客服數據的收集與儲存狀況？',
        options: [
            { score: 1, text: '幾乎無系統化紀錄' },
            { score: 2, text: '基礎通話紀錄與工單紀錄' },
            { score: 3, text: '結構化數據庫，定期備份' },
            { score: 4, text: '多源數據整合 + 數據湖架構' },
            { score: 5, text: '即時串流 + 完整客戶 360 視圖' }
        ]
    },
    {
        id: 'q24', section: 6, scored: true, dimension: 5,
        text: '數據分析應用程度？',
        options: [
            { score: 1, text: '不做數據分析' },
            { score: 2, text: '月度手動報表' },
            { score: 3, text: '系統化報表 + 基礎 BI 儀表板' },
            { score: 4, text: '進階分析 + 預測模型' },
            { score: 5, text: 'AI 驅動洞察 + 即時決策建議' }
        ]
    },
    {
        id: 'q25', section: 6, scored: true, dimension: 5,
        text: 'AI / 自動化目前的應用程度？',
        options: [
            { score: 1, text: '無任何 AI 或自動化' },
            { score: 2, text: '評估階段，尚未實施' },
            { score: 3, text: '基礎 Chatbot 或 IVR 自動化' },
            { score: 4, text: 'AI 路由 + 語音分析 + Agent Assist' },
            { score: 5, text: '全面 AI 編排（VoiceBot + ChatBot + 預測 + 自動化）' }
        ]
    },
    {
        id: 'q26', section: 6, scored: true, dimension: 5,
        text: '對 AI 與人力協作的看法？',
        options: [
            { score: 1, text: '不考慮用 AI 處理客服' },
            { score: 2, text: '擔心但持觀望態度' },
            { score: 3, text: '願意用 AI 處理簡單重複任務' },
            { score: 4, text: 'AI 與人協作，各司其職' },
            { score: 5, text: 'AI 優先處理，人力專注高價值互動' }
        ]
    }
];

// ── 成熟度等級定義 ──
const MATURITY_LEVELS = [
    { level: 'L1', name: '基礎期 Reactive', min: 0, max: 30, color: '#a0522d',
      desc: '客服中心以被動回應為主，缺乏系統化管理。建議從建立基礎通訊與工單系統開始。' },
    { level: 'L2', name: '發展期 Emerging', min: 31, max: 50, color: '#e07c24',
      desc: '已有基礎架構，但通路分散、數據孤島。建議強化系統整合與流程標準化。' },
    { level: 'L3', name: '整合期 Defined', min: 51, max: 70, color: '#d4a843',
      desc: '多通路已建置但尚未全面整合，品質管理體系逐步成形。建議推進全通路整合與 AI 初步應用。' },
    { level: 'L4', name: '優化期 Managed', min: 71, max: 85, color: '#10b981',
      desc: '全通路運作順暢，數據驅動決策。建議深化 AI 應用與預測式服務能力。' },
    { level: 'L5', name: '領先期 Optimizing', min: 86, max: 100, color: '#3b82f6',
      desc: 'AI 驅動營運，持續創新。建議強化 AI 編排與客戶旅程個人化。' }
];

// ── 產品推薦規則 ──
const PRODUCTS = {
    innoCTI: { name: 'innoCTI', icon: '📞', desc: '客服通訊整合平台', link: 'solutions.html#innocti' },
    innoService: { name: 'innoService', icon: '📋', desc: '服務管理系統', link: 'solutions.html#innoservice' },
    innoSales: { name: 'innoSales', icon: '📈', desc: '外撥電銷平台', link: 'solutions.html#innosales' },
    innoChat: { name: 'innoChat', icon: '💬', desc: '文字客服系統', link: 'solutions.html#innochat' },
    genesys: { name: 'Genesys Cloud', icon: '☁️', desc: '雲端客服平台', link: 'solutions.html#genesys' }
};

// ── Assessment Engine ──
let currentSection = 0;
const answers = {};

function initAssessment() {
    renderSections();
    updateNavigation();
    updateProgress();
    bindNavClicks();
    bindActions();
}

function renderSections() {
    const main = document.querySelector('.assess-main');
    if (!main) return;

    SECTIONS.forEach((sec, idx) => {
        const div = document.createElement('div');
        div.className = `assess-section${idx === 0 ? ' active' : ''}`;
        div.dataset.section = idx;

        let html = `<h2 class="assess-section-title">${sec.title}</h2>`;
        html += `<p class="assess-section-desc">${sec.desc}</p>`;

        if (sec.type === 'form') {
            html += renderBasicForm();
        } else {
            const sectionQs = QUESTIONS.filter(q => q.section === idx);
            sectionQs.forEach((q, qi) => {
                html += renderQuestion(q, qi);
            });
        }
        div.innerHTML = html;
        main.appendChild(div);
    });

    // Bind radio clicks
    main.querySelectorAll('.radio-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const qid = opt.dataset.question;
            const score = parseInt(opt.dataset.score);
            opt.closest('.radio-options').querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            opt.querySelector('input').checked = true;
            answers[qid] = score;
            updateProgress();
            updateNavigation();
        });
    });
}

function renderBasicForm() {
    return `
    <div class="assess-form-grid">
        <div class="assess-form-group">
            <label>公司名稱 <span class="required">*</span></label>
            <input type="text" name="company" required placeholder="請輸入公司名稱">
        </div>
        <div class="assess-form-group">
            <label>姓名 <span class="required">*</span></label>
            <input type="text" name="name" required placeholder="請輸入姓名">
        </div>
        <div class="assess-form-group">
            <label>職稱</label>
            <input type="text" name="jobTitle" placeholder="如：客服主管、IT 經理">
        </div>
        <div class="assess-form-group">
            <label>Email <span class="required">*</span></label>
            <input type="email" name="email" required placeholder="用於接收診斷報告">
        </div>
        <div class="assess-form-group">
            <label>產業別 <span class="required">*</span></label>
            <select name="industry" required>
                <option value="">請選擇</option>
                <option value="金融">金融</option>
                <option value="電信">電信</option>
                <option value="零售">零售</option>
                <option value="製造">製造</option>
                <option value="政府">政府</option>
                <option value="醫療">醫療</option>
                <option value="服務業">服務業</option>
                <option value="其他">其他</option>
            </select>
        </div>
        <div class="assess-form-group">
            <label>客服團隊規模 <span class="required">*</span></label>
            <select name="teamSize" required>
                <option value="">請選擇</option>
                <option value="1-5">1 – 5 人</option>
                <option value="6-20">6 – 20 人</option>
                <option value="21-50">21 – 50 人</option>
                <option value="51-200">51 – 200 人</option>
                <option value="200+">200 人以上</option>
            </select>
        </div>
    </div>`;
}

function renderQuestion(q, idx) {
    let optionsHtml = q.options.map(o => `
        <label class="radio-option" data-question="${q.id}" data-score="${o.score}">
            <input type="radio" name="${q.id}" value="${o.score}">
            <span class="radio-dot"></span>
            <span class="radio-text">
                <span class="radio-desc">${o.text}</span>
            </span>
        </label>
    `).join('');

    const qNum = QUESTIONS.indexOf(q) + 1;
    return `
    <div class="question-card">
        <div class="question-label"><span class="q-num">${qNum}</span>${q.text}</div>
        <div class="radio-options">${optionsHtml}</div>
    </div>`;
}

function goToSection(idx) {
    if (idx < 0 || idx >= SECTIONS.length) return;
    if (idx > currentSection && !validateCurrentSection()) return;

    document.querySelectorAll('.assess-section').forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`.assess-section[data-section="${idx}"]`);
    if (target) {
        target.classList.add('active');
        currentSection = idx;
        updateNavigation();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Mobile progress update
        const mText = document.getElementById('mobileProgressText');
        const mFill = document.getElementById('mobileProgressFill');
        if (mText) mText.textContent = SECTIONS[idx].title;
        if (mFill) mFill.style.width = `${(idx / (SECTIONS.length - 1)) * 100}%`;
    }
}

function validateCurrentSection() {
    if (currentSection === 0) {
        const required = document.querySelectorAll('.assess-section.active [required]');
        let valid = true;
        required.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'var(--danger)';
                valid = false;
            } else {
                input.style.borderColor = '';
            }
        });
        if (!valid) return false;
    }
    return true;
}

function updateNavigation() {
    document.querySelectorAll('.assess-nav-item').forEach((item, idx) => {
        item.classList.remove('active', 'completed');
        if (idx === currentSection) {
            item.classList.add('active');
        } else if (idx < currentSection || isSectionComplete(idx)) {
            item.classList.add('completed');
        }
    });
}

function isSectionComplete(sectionIdx) {
    if (sectionIdx === 0) return true; // Basic info assumed complete if we passed it
    const sectionQs = QUESTIONS.filter(q => q.section === sectionIdx);
    return sectionQs.every(q => answers[q.id] !== undefined);
}

function updateProgress() {
    const totalQ = QUESTIONS.length;
    const answered = Object.keys(answers).length;
    const pct = Math.round((answered / totalQ) * 100);

    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = `${answered} / ${totalQ} 題`;
}

function bindNavClicks() {
    document.querySelectorAll('.assess-nav-item').forEach((item, idx) => {
        item.addEventListener('click', () => goToSection(idx));
    });
}

function bindActions() {
    const prevBtn = document.getElementById('btnPrev');
    const nextBtn = document.getElementById('btnNext');
    const submitBtn = document.getElementById('btnSubmit');

    if (prevBtn) prevBtn.addEventListener('click', () => goToSection(currentSection - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSection(currentSection + 1));
    if (submitBtn) submitBtn.addEventListener('click', submitAssessment);
}

function submitAssessment() {
    // Validate all sections answered
    const unanswered = QUESTIONS.filter(q => answers[q.id] === undefined);
    if (unanswered.length > 0) {
        alert(`尚有 ${unanswered.length} 題未作答，請完成所有問題。`);
        const firstUnanswered = unanswered[0];
        goToSection(firstUnanswered.section);
        return;
    }

    // Collect basic info
    const basicInfo = {};
    document.querySelectorAll('.assess-section[data-section="0"] input, .assess-section[data-section="0"] select').forEach(el => {
        basicInfo[el.name] = el.value;
    });

    // Store in sessionStorage
    const data = {
        basicInfo,
        answers,
        timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('jaya_diagnosis', JSON.stringify(data));

    // Navigate to report
    window.location.href = 'report.html';
}

// ── Scoring Engine ──
function calculateScores(answersData) {
    const dimScores = {};
    DIMENSIONS.forEach((dim, i) => {
        const dimQs = QUESTIONS.filter(q => q.dimension === i && q.scored);
        if (dimQs.length === 0) { dimScores[dim.key] = 0; return; }
        const sum = dimQs.reduce((acc, q) => acc + (answersData[q.id] || 0), 0);
        dimScores[dim.key] = Math.round((sum / dimQs.length) * 20);
    });

    const values = Object.values(dimScores);
    const totalScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

    return { dimScores, totalScore };
}

function getMaturityLevel(score) {
    return MATURITY_LEVELS.find(l => score >= l.min && score <= l.max) || MATURITY_LEVELS[0];
}

// ── Recommendation Engine ──
function getRecommendations(dimScores, totalScore, basicInfo) {
    const level = getMaturityLevel(totalScore);
    const teamSize = basicInfo.teamSize || '6-20';
    const isLargeTeam = ['51-200', '200+'].includes(teamSize);
    const deployPref = answers['q17'] || 3;

    // Find weakest dimensions
    const sorted = Object.entries(dimScores).sort((a, b) => a[1] - b[1]);
    const weakest = sorted[0][0];
    const secondWeakest = sorted[1][0];

    const recs = [];
    const roadmap = [];

    if (totalScore <= 30) {
        recs.push({ ...PRODUCTS.innoCTI, reason: '建立企業級通訊基礎架構', priority: '首要' });
        recs.push({ ...PRODUCTS.innoService, reason: '導入工單生命週期管理', priority: '次要' });
        if (isLargeTeam) recs.push({ ...PRODUCTS.innoChat, reason: '分流電話量，提升服務效率', priority: '中期' });
        roadmap.push({ phase: 'Phase 1', time: '1-3 個月', title: '通訊基礎建設', products: ['innoCTI'] });
        roadmap.push({ phase: 'Phase 2', time: '3-6 個月', title: '流程管理上線', products: ['innoService'] });
        roadmap.push({ phase: 'Phase 3', time: '6-12 個月', title: '文字客服擴展', products: ['innoChat'] });
    } else if (totalScore <= 50) {
        if (weakest === 'channel' || weakest === 'data') {
            recs.push({ ...PRODUCTS.innoChat, reason: '擴展數位通路，降低電話依賴', priority: '首要' });
            recs.push({ ...PRODUCTS.innoCTI, reason: '升級通訊核心', priority: '次要' });
        } else {
            recs.push({ ...PRODUCTS.innoCTI, reason: '升級通訊核心架構', priority: '首要' });
            recs.push({ ...PRODUCTS.innoService, reason: '標準化服務流程', priority: '次要' });
        }
        if (deployPref >= 4) recs.push({ ...PRODUCTS.genesys, tier: 'CX1 Essential', reason: '雲端化起步方案', priority: '中期' });
        roadmap.push({ phase: 'Phase 1', time: '1-3 個月', title: '核心系統升級', products: [recs[0].name] });
        roadmap.push({ phase: 'Phase 2', time: '3-6 個月', title: '流程與通路整合', products: [recs[1].name] });
        roadmap.push({ phase: 'Phase 3', time: '6-12 個月', title: '雲端遷移評估', products: ['Genesys Cloud'] });
    } else if (totalScore <= 70) {
        recs.push({ ...PRODUCTS.genesys, tier: 'CX2 Professional', reason: '全通路整合，統一管理所有客服互動', priority: '首要' });
        if (weakest === 'process') recs.push({ ...PRODUCTS.innoService, reason: '強化工單管理與品質體系', priority: '輔助' });
        if (weakest === 'channel') recs.push({ ...PRODUCTS.innoChat, reason: '補強文字客服通路', priority: '輔助' });
        roadmap.push({ phase: 'Phase 1', time: '1-2 個月', title: '需求評估與規劃', products: ['顧問諮詢'] });
        roadmap.push({ phase: 'Phase 2', time: '2-6 個月', title: '平台導入與整合', products: ['Genesys CX2'] });
        roadmap.push({ phase: 'Phase 3', time: '6-12 個月', title: 'AI 功能啟用', products: ['AI + WFM'] });
    } else if (totalScore <= 85) {
        recs.push({ ...PRODUCTS.genesys, tier: 'CX3 Digital Premium', reason: '進階 WEM + AI 分析，全面優化營運效率', priority: '首要' });
        roadmap.push({ phase: 'Phase 1', time: '1 個月', title: '現況盤點與差距分析', products: ['顧問諮詢'] });
        roadmap.push({ phase: 'Phase 2', time: '2-4 個月', title: '平台升級與 AI 部署', products: ['Genesys CX3'] });
        roadmap.push({ phase: 'Phase 3', time: '4-8 個月', title: '預測式服務上線', products: ['AI 編排'] });
    } else {
        recs.push({ ...PRODUCTS.genesys, tier: 'CX3 Ultimate', reason: '旗艦全通路 + 完整 WEM + AI 編排', priority: '持續優化' });
        roadmap.push({ phase: 'Phase 1', time: '持續', title: 'AI 編排深化', products: ['Genesys CX3 Ultimate'] });
        roadmap.push({ phase: 'Phase 2', time: '持續', title: '預測式主動服務', products: ['AI Orchestration'] });
        roadmap.push({ phase: 'Phase 3', time: '持續', title: '客戶旅程個人化', products: ['Journey Analytics'] });
    }

    return { recommendations: recs, roadmap };
}

// ── AI Analysis Text Generator ──
function generateAnalysis(dimScores, totalScore, basicInfo) {
    const level = getMaturityLevel(totalScore);
    const sorted = Object.entries(dimScores).sort((a, b) => b[1] - a[1]);
    const strongest = DIMENSIONS.find(d => d.key === sorted[0][0]);
    const weakest = DIMENSIONS.find(d => d.key === sorted[sorted.length - 1][0]);
    const industry = basicInfo.industry || '企業';

    let text = `根據本次診斷結果，貴公司客服中心整體成熟度為 ${totalScore} 分，處於「${level.name}」階段。`;

    text += `\n\n在六大維度中，「${strongest.name}」表現最為突出（${dimScores[strongest.key]} 分），顯示貴公司在此領域已建立良好基礎。`;
    text += `而「${weakest.name}」為目前最大改善機會點（${dimScores[weakest.key]} 分），建議優先投入資源強化。`;

    if (dimScores.technology < 50) {
        text += `\n\n值得關注的是，技術平台維度偏低，可能存在系統老化或整合不足的問題。`;
        text += `建議評估現有通訊架構是否滿足未來 3-5 年的發展需求。`;
    }

    if (dimScores.data < 50) {
        text += `\n\n在 AI 時代，數據與 AI 應用能力是客服競爭力的關鍵。`;
        text += `建議從數據基礎建設做起，逐步導入 AI 自動化工具。`;
    }

    if (dimScores.channel < 50) {
        text += `\n\n現代客戶期望多通路無縫體驗。建議擴展數位客服通路，`;
        text += `並整合至統一平台，避免通路孤島造成的客戶體驗斷裂。`;
    }

    text += `\n\n以${industry}產業的特性，我們建議採取漸進式升級策略，優先解決最關鍵的瓶頸，再逐步擴展至全面數位轉型。`;

    return text;
}

// ── ROI Estimation ──
function estimateROI(dimScores, totalScore, basicInfo) {
    const teamSize = basicInfo.teamSize || '6-20';
    const techGap = 100 - dimScores.technology;
    const processGap = 100 - dimScores.process;

    let efficiencyUp, costDown, csatUp, payback;

    if (totalScore <= 40) {
        efficiencyUp = '30-50%'; costDown = '25-40%'; csatUp = '20-35%'; payback = '6-12 個月';
    } else if (totalScore <= 60) {
        efficiencyUp = '20-35%'; costDown = '15-30%'; csatUp = '15-25%'; payback = '8-14 個月';
    } else if (totalScore <= 80) {
        efficiencyUp = '10-20%'; costDown = '10-20%'; csatUp = '10-15%'; payback = '10-18 個月';
    } else {
        efficiencyUp = '5-10%'; costDown = '5-10%'; csatUp = '5-10%'; payback = '12-24 個月';
    }

    return [
        { value: efficiencyUp, label: '預估效率提升' },
        { value: costDown, label: '預估成本降低' },
        { value: csatUp, label: '預估 CSAT 提升' },
        { value: payback, label: '預估投資回收期' }
    ];
}

// ── Report Renderer ──
function initReport() {
    const raw = sessionStorage.getItem('jaya_diagnosis');
    if (!raw) {
        document.querySelector('.report-wrapper').innerHTML = `
            <div style="text-align:center; padding:100px 20px;">
                <h2>尚無診斷資料</h2>
                <p style="color:var(--text-muted); margin:16px 0 32px;">請先完成客服中心 DNA 診斷問卷</p>
                <a href="assessment.html" class="btn btn-primary">開始診斷</a>
            </div>`;
        return;
    }

    const data = JSON.parse(raw);
    const { dimScores, totalScore } = calculateScores(data.answers);
    const level = getMaturityLevel(totalScore);
    const { recommendations, roadmap } = getRecommendations(dimScores, totalScore, data.basicInfo);
    const analysis = generateAnalysis(dimScores, totalScore, data.basicInfo);
    const roi = estimateROI(dimScores, totalScore, data.basicInfo);

    // Header
    document.getElementById('reportCompany').textContent = data.basicInfo.company || '—';
    document.getElementById('reportName').textContent = data.basicInfo.name || '—';
    document.getElementById('reportTitle').textContent = data.basicInfo.jobTitle || '—';
    document.getElementById('reportIndustry').textContent = data.basicInfo.industry || '—';
    document.getElementById('reportDate').textContent = new Date(data.timestamp).toLocaleDateString('zh-TW');

    // Score circle
    const scoreNum = document.getElementById('scoreNumber');
    const scoreRing = document.getElementById('scoreRing');
    if (scoreNum) scoreNum.textContent = totalScore;
    if (scoreRing) {
        const circumference = 2 * Math.PI * 80;
        scoreRing.style.strokeDasharray = circumference;
        scoreRing.style.strokeDashoffset = circumference;
        setTimeout(() => {
            scoreRing.style.strokeDashoffset = circumference * (1 - totalScore / 100);
        }, 300);
    }

    // Maturity level
    const levelEl = document.getElementById('maturityLevel');
    const descEl = document.getElementById('maturityDesc');
    if (levelEl) { levelEl.textContent = level.name; levelEl.className = `maturity-level level-${level.level}`; }
    if (descEl) descEl.textContent = level.desc;

    // Radar chart
    renderRadarChart(dimScores);

    // Dimension cards
    const dimGrid = document.getElementById('dimensionGrid');
    if (dimGrid) {
        const avg = totalScore;
        dimGrid.innerHTML = DIMENSIONS.map((dim, i) => {
            const score = dimScores[dim.key];
            const tag = score >= avg + 10 ? 'strong' : score <= avg - 10 ? 'weak' : 'average';
            const tagText = tag === 'strong' ? '強項' : tag === 'weak' ? '待強化' : '中等';
            return `
            <div class="dimension-card">
                <div class="dim-icon">${dim.icon}</div>
                <div class="dim-name">${dim.name}</div>
                <div class="dim-score" style="color:${tag === 'strong' ? 'var(--success)' : tag === 'weak' ? 'var(--danger)' : 'var(--accent)'}">${score}</div>
                <span class="dim-tag ${tag}">${tagText}</span>
            </div>`;
        }).join('');
    }

    // AI Analysis
    const analysisBox = document.getElementById('aiAnalysis');
    if (analysisBox) analysisBox.textContent = analysis;

    // Priority improvements
    const priorityList = document.getElementById('priorityList');
    if (priorityList) {
        const sorted = Object.entries(dimScores).sort((a, b) => a[1] - b[1]);
        priorityList.innerHTML = sorted.slice(0, 3).map((entry, i) => {
            const dim = DIMENSIONS.find(d => d.key === entry[0]);
            const tips = getPriorityTip(entry[0], entry[1]);
            return `
            <div class="priority-item">
                <div class="priority-num">${i + 1}</div>
                <div class="priority-text">
                    <h4>${dim.icon} ${dim.name}（${entry[1]} 分）</h4>
                    <p>${tips}</p>
                </div>
            </div>`;
        }).join('');
    }

    // Recommendations
    const recGrid = document.getElementById('recommendGrid');
    if (recGrid) {
        recGrid.innerHTML = recommendations.map((rec, i) => `
            <div class="recommend-card${i === 0 ? ' primary-rec' : ''}">
                <div class="rec-icon">${rec.icon}</div>
                <div class="rec-name">${rec.name}</div>
                ${rec.tier ? `<div class="rec-tier">${rec.tier}</div>` : ''}
                <div class="rec-reason">${rec.reason}</div>
                <a href="${rec.link}" class="btn btn-ghost">了解詳情</a>
            </div>
        `).join('');
    }

    // ROI
    const roiGrid = document.getElementById('roiGrid');
    if (roiGrid) {
        roiGrid.innerHTML = roi.map(r => `
            <div class="roi-card">
                <div class="roi-value">${r.value}</div>
                <div class="roi-label">${r.label}</div>
            </div>
        `).join('');
    }

    // Roadmap
    const roadmapEl = document.getElementById('roadmap');
    if (roadmapEl) {
        roadmapEl.innerHTML = roadmap.map(r => `
            <div class="roadmap-phase">
                <div class="phase-label">${r.phase}</div>
                <div class="roadmap-dot"></div>
                <div class="phase-title">${r.title}</div>
                <div class="phase-time">${r.time}</div>
                <div class="phase-products">
                    ${r.products.map(p => `<span class="badge badge-outline">${p}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    // Copy button
    const copyBtn = document.querySelector('.report-copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                copyBtn.textContent = '已複製！';
                setTimeout(() => copyBtn.textContent = '複製報告連結', 2000);
            });
        });
    }
}

function getPriorityTip(dimKey, score) {
    const tips = {
        strategy: '建議提升客服中心的策略定位，將其從成本中心轉變為價值驅動的策略資產。制定明確的年度目標與預算。',
        people: '建議建立系統化培訓機制，降低人員流動率。導入 WFM 工具優化排班效率。',
        process: '建議導入工單管理系統，建立標準化 SOP，並建置品質監控與 KPI 追蹤機制。',
        technology: '建議評估現有通訊系統升級方案，提升 CTI 整合程度，考慮雲端遷移降低維運成本。',
        channel: '建議擴展數位客服通路（文字、社群），並建立全通路整合架構，提供無縫客戶體驗。',
        data: '建議從數據基礎建設做起，建立客服數據分析能力，逐步導入 AI 自動化應用。'
    };
    return tips[dimKey] || '';
}

function renderRadarChart(dimScores) {
    const canvas = document.getElementById('radarChart');
    if (!canvas || typeof Chart === 'undefined') return;

    new Chart(canvas, {
        type: 'radar',
        data: {
            labels: DIMENSIONS.map(d => d.name),
            datasets: [{
                label: '您的分數',
                data: DIMENSIONS.map(d => dimScores[d.key]),
                borderColor: '#e2b857',
                backgroundColor: 'rgba(226, 184, 87, 0.15)',
                borderWidth: 2,
                pointBackgroundColor: '#e2b857',
                pointBorderColor: '#fff',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { stepSize: 20, font: { size: 11 }, backdropColor: 'transparent' },
                    grid: { color: 'rgba(0,0,0,0.08)' },
                    pointLabels: { font: { size: 13, family: "'Noto Sans TC', sans-serif" }, color: '#2d2d2d' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// ── Init on page load ──
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.assess-wrapper')) initAssessment();
    if (document.querySelector('.report-wrapper')) initReport();
});
