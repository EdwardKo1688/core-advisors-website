/* =============================================
   Blue Sheet AI — 顧問式商機策略診斷 MVP
   核心顧問有限公司
   ============================================= */

'use strict';

/* ─── UUID Generator ─── */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

/* ─── DataStore Abstraction Layer ─── */
const DataStore = {
    KEY: 'bluesheet_data',
    save(data) {
        data.metadata = data.metadata || {};
        data.metadata.version = '1.0';
        if (!data.metadata.createdAt) data.metadata.createdAt = new Date().toISOString();
        try { localStorage.setItem(this.KEY, JSON.stringify(data)); } catch(e) { console.warn('DataStore save failed:', e); }
    },
    load() {
        try { const d = localStorage.getItem(this.KEY); return d ? JSON.parse(d) : null; } catch(e) { return null; }
    },
    clear() {
        try { localStorage.removeItem(this.KEY); } catch(e) {}
    },
    list() {
        const d = this.load();
        return d ? [d] : [];
    }
};

/* ─── SCORING_CONFIG — 集中權重管理（暫定值，可依顧問實測調整）─── */
const SCORING_CONFIG = {
    // 健康度三大維度權重（合計 1.0）
    healthDimensions: {
        roleCoverage: 0.30,
        riskAssessment: 0.40,
        dataCompleteness: 0.30
    },
    // 8 風險維度個別權重（合計 1.0）
    riskWeights: {
        competition: 0.15,
        budget: 0.15,
        timeline: 0.10,
        internalSupport: 0.10,
        economicBuyerAccess: 0.15,
        coachStrength: 0.15,
        decisionMapCompleteness: 0.10,
        technicalPreferenceRisk: 0.10
    },
    // 情境特定權重覆寫
    scenarioOverrides: {
        'new-opportunity': null, // 使用預設
        'key-deal-review': null,
        'rescue': { healthDimensions: { roleCoverage: 0.30, riskAssessment: 0.50, dataCompleteness: 0.20 } },
        'competitive-replace': { healthDimensions: { roleCoverage: 0.25, riskAssessment: 0.45, dataCompleteness: 0.30 } },
        'design-in': { healthDimensions: { roleCoverage: 0.35, riskAssessment: 0.35, dataCompleteness: 0.30 } }
    },
    // 紅旗觸發閾值
    redFlagThresholds: {
        highRisk: 4,
        criticalRisk: 5,
        opponentRatio: 0.5,
        blockerInfluence: 4
    }
};

/* ─── Risk Dimensions Config ─── */
const RISK_DIMENSIONS = [
    { key: 'competition', label: '競爭威脅', low: '無競爭', high: '強勁對手已卡位', desc: '是否有明確競品在角逐同一案件' },
    { key: 'budget', label: '預算風險', low: '預算已核准', high: '無預算或預算不明', desc: '客戶是否有明確的預算分配' },
    { key: 'timeline', label: '時程壓力', low: '時間充裕', high: '極度緊迫', desc: '案件的時程是否在我方控制範圍內' },
    { key: 'internalSupport', label: '客戶內部支持氣候', low: '組織性支持', high: '組織性抵制', desc: '客戶組織整體對此案的態度氛圍', tooltip: '此為組織整體氣候判斷，與個別角色立場（stance）不同' },
    { key: 'economicBuyerAccess', label: '經濟買家接觸度', low: '已深度接觸且支持', high: '完全無法接觸', desc: '是否已找到並接觸到最終決策者' },
    { key: 'coachStrength', label: '教練強度', low: '有力教練且主動協助', high: '無教練', desc: '是否有內部人士願意為我方指路' },
    { key: 'decisionMapCompleteness', label: '決策地圖完整度', low: '完整掌握所有角色', high: '幾乎一片空白', desc: '對客戶決策流程與角色的掌握程度' },
    { key: 'technicalPreferenceRisk', label: '技術偏好風險', low: '完全符合客戶偏好', high: '客戶偏好競品技術', desc: '技術規格或架構是否匹配客戶期望' }
];

/* ─── Scenario Names ─── */
const SCENARIO_NAMES = {
    'new-opportunity': '新商機評估',
    'key-deal-review': '重點案件盤點',
    'rescue': '落後案件搶救',
    'competitive-replace': '競品替代策略',
    'design-in': 'Design-in / Design-win 追蹤'
};

/* ─── Default Data Model ─── */
function createDefaultData() {
    return {
        apiVersion: '1.0',
        source: 'frontend-mvp',
        scenario: '',
        opportunity: { name: '', customerName: '', value: '', currency: 'TWD', stage: '', timeline: '', industry: '', dealType: '', currentSituation: '', desiredOutcome: '' },
        stakeholders: [],
        risks: { competition: 3, budget: 3, timeline: 3, internalSupport: 3, economicBuyerAccess: 3, coachStrength: 3, decisionMapCompleteness: 3, technicalPreferenceRisk: 3 },
        result: { healthScore: 0, healthLabel: '', executiveSummary: '', dimensions: {}, redFlags: [], actions: [], consultantInsights: [] },
        metadata: { createdAt: new Date().toISOString(), completedAt: '', version: '1.0' }
    };
}

function createDefaultStakeholder() {
    return {
        id: generateUUID(),
        name: '', title: '', department: '',
        buyerType: '', roleFlag: 'none',
        stance: 'unknown', contactStatus: 'no-contact',
        influence: 3, relationshipStrength: 3,
        winResult: '', notes: ''
    };
}

/* ─── Consultant Semantic Templates ─── */
const TEMPLATES = {
    executiveSummary: {
        '良好': {
            default: '這個商機目前整體狀態健康。您已掌握多數關鍵角色，風險維度也在可控範圍內。建議持續鞏固現有優勢，並關注尚未完全到位的環節，確保案件穩步推進至成交。',
            'rescue': '雖然這是一個搶救案件，但根據您的盤點，基本面仍然穩健。關鍵角色覆蓋度和風險控管都在合理範圍。建議把握這個基礎，聚焦在最需要補強的 1-2 個環節快速推進。'
        },
        '需關注': {
            default: '這個案件有一定的基礎，但存在幾個需要關注的盲點。如果不及時處理，可能會在關鍵決策階段遭遇阻力。建議優先處理下方紅旗所指出的風險，並儘快補齊缺失的角色覆蓋。',
            'rescue': '落後案件的搶救窗口有限。目前的盤點顯示案件還有挽回的空間，但需要立即行動。以下紅旗指出了最需要優先處理的環節——建議在本週內啟動回應策略。'
        },
        '高風險': {
            default: '這個案件目前處於高風險狀態。根據您的盤點，在角色覆蓋、風險控管等多個維度存在明顯缺口。如果不立即調整策略，案件可能在我方不知情的狀況下流失。建議優先處理三大紅旗，並考慮是否需要專業顧問協助制定補救計畫。',
            'competitive-replace': '競品替代是高難度的銷售類型。目前的盤點顯示我方在多個關鍵維度處於劣勢——客戶對競品的技術偏好、我方的角色覆蓋不足、以及內部支持度不夠，都是需要正面應對的挑戰。'
        },
        '危急': {
            default: '這個案件正處於危急狀態。多個重大風險同時存在，且關鍵角色覆蓋嚴重不足。在這種情境下，自行處理可能錯過最佳補救時機。強烈建議與專業顧問進行一對一策略盤點，制定針對性的搶救方案。'
        }
    },
    redFlagInsights: {
        'no-economic-buyer': { title: '未識別經濟買家', insight: '經濟買家是最終拍板的人。如果我方無法確認誰擁有預算決策權，所有的技術優勢和方案設計都可能因為一個看不見的決策而白費。', response: '盤點客戶組織架構，透過教練或既有關係確認預算決策鏈。' },
        'no-economic-buyer-access': { title: '無法接觸經濟買家', insight: '已知經濟買家但尚未建立有效溝通，意味著我方對最終決策的影響力極為有限。', response: '透過教練安排高層會面，或調整切入策略以接觸決策圈。' },
        'no-coach': { title: '缺少教練角色', insight: '教練是我方在客戶內部的「眼睛和耳朵」。沒有教練，我方對客戶內部動態幾乎是盲的。', response: '盤點客戶組織中與我方有良好互動的人，評估誰有意願且有能力在內部為我方說話。' },
        'weak-coach': { title: '教練強度不足', insight: '雖然有教練，但其影響力或意願不足以在關鍵時刻為我方發揮作用。', response: '評估是否需要培養第二位教練，或加強現有教練的支持力度。' },
        'opponent-dominance': { title: '反對方力量過大', insight: '當反對者人數超過支持者，案件推進將面臨強大的組織阻力。', response: '識別反對者的核心顧慮，制定個別化的轉化策略。' },
        'high-influence-blocker': { title: '存在高影響力阻擋者', insight: '高影響力的阻擋者可以單獨否決整個案件。如果不正面處理，其他所有努力都可能白費。', response: '分析此人的「贏的結果」，找到能讓他從反對轉為中立的切入點。' },
        'budget-unclear': { title: '預算未確認', insight: '沒有預算就沒有案件。客戶可能只是在蒐集資訊而非真正要採購。', response: '直接向客戶確認預算狀態，評估案件的真實採購意圖。' },
        'timeline-critical': { title: '時程極度緊迫', insight: '極度緊迫的時程壓力下，任何延遲或意外都可能導致案件失敗。', response: '建立明確的里程碑時間表，與客戶達成共識。' },
        'no-supporters': { title: '無明確支持者', insight: '案件中沒有任何角色明確表態支持，意味著我方缺乏推進案件的內部動力。', response: '重新評估每位角色的立場，尋找可能轉化為支持者的中立方。' },
        'competition-strong': { title: '競爭對手優勢明顯', insight: '強勁的競爭對手意味著我方需要建立清晰的差異化價值主張。', response: '分析競品弱點，強化我方獨特價值定位。' },
        'decision-map-blank': { title: '決策地圖幾乎空白', insight: '對客戶決策流程一無所知，等於在黑暗中前進。', response: '立即啟動客戶組織研究，透過教練或公開資訊建立決策地圖。' },
        'tech-preference-risk': { title: '技術偏好不利', insight: '客戶偏好競品的技術架構，我方需要額外的努力來改變技術評估結果。', response: '安排技術深度交流（POC / Demo），用實際成果改變客戶認知。' }
    },
    actionTemplates: {
        'no-economic-buyer': { action: '識別並確認經濟決策者', purpose: '掌握預算決策鏈是推進案件的第一步', timeline: '本週內' },
        'no-economic-buyer-access': { action: '建立經濟買家溝通管道', purpose: '確保我方能直接影響最終決策', timeline: '兩週內' },
        'no-coach': { action: '識別並發展內部教練', purpose: '取得客戶內部動態的即時情報', timeline: '兩週內' },
        'weak-coach': { action: '強化教練關係或發展備援教練', purpose: '確保在關鍵決策時刻有人為我方發聲', timeline: '一個月內' },
        'opponent-dominance': { action: '制定反對者轉化策略', purpose: '降低組織阻力，為案件推進創造空間', timeline: '兩週內' },
        'high-influence-blocker': { action: '分析阻擋者的「贏的結果」並制定回應', purpose: '將高影響力阻擋者從反對轉為至少中立', timeline: '本週內' },
        'budget-unclear': { action: '確認客戶預算狀態與採購意圖', purpose: '避免在無預算的案件上投入過多資源', timeline: '本週內' },
        'timeline-critical': { action: '建立里程碑時間表並與客戶共識', purpose: '在緊迫時程下確保每個關鍵節點不延誤', timeline: '本週內' },
        'no-supporters': { action: '從中立者中發展支持者', purpose: '建立案件推進的內部動力', timeline: '兩週內' },
        'competition-strong': { action: '建立差異化價值主張', purpose: '在競爭中凸顯我方獨特價值', timeline: '一個月內' },
        'decision-map-blank': { action: '啟動客戶決策地圖研究', purpose: '掌握決策流程才能有效配置資源', timeline: '本週內' },
        'tech-preference-risk': { action: '安排技術深度交流（POC / Demo）', purpose: '用實際成果改變客戶的技術偏好認知', timeline: '一個月內' }
    },
    ctaText: {
        '良好': '想要進一步驗證策略、或為團隊建立系統化的商機管理流程？我們的顧問團隊可以提供更深入的策略檢視。',
        '需關注': '我們的顧問團隊擅長協助 B2B 團隊突破商機瓶頸。一次 30 分鐘的深度診斷，就可能改變案件的走向。',
        '高風險': '您的案件存在多個需要立即處理的風險。與專業顧問進行一次策略盤點，可以幫助您制定更有效的補救計畫。',
        '危急': '您的案件正處於關鍵時刻。建議盡快與顧問進行一對一策略盤點，把握最佳補救窗口。每一天的延遲都可能縮小挽回空間。'
    }
};

/* ═══════════════════════════════════════════════
   APP STATE & INITIALIZATION
   ═══════════════════════════════════════════════ */

let appState = createDefaultData();
let currentStep = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Try restore from DataStore
    const saved = DataStore.load();
    if (saved && saved.scenario) {
        appState = saved;
        // Determine which step to restore
        if (saved.result && saved.result.healthScore > 0) {
            currentStep = 4;
        } else if (saved.risks && Object.values(saved.risks).some(v => v !== 3)) {
            currentStep = 3;
        } else if (saved.stakeholders && saved.stakeholders.length > 0) {
            currentStep = 2;
        } else if (saved.opportunity && saved.opportunity.name) {
            currentStep = 1;
        } else {
            currentStep = 0;
        }
    }

    initScenarioCards();
    initNavButtons();
    initStakeholderUI();
    initRiskUI();
    initResultUI();
    goToStep(currentStep);
});

/* ─── Step Navigation ─── */
function goToStep(step) {
    currentStep = step;
    document.querySelectorAll('.bs-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('step' + step);
    if (target) target.classList.add('active');

    // Update progress bar
    document.querySelectorAll('.bs-step').forEach((el, i) => {
        el.classList.remove('active', 'completed');
        if (i < step) el.classList.add('completed');
        if (i === step) el.classList.add('active');
    });
    const fill = document.getElementById('bsProgressFill');
    if (fill) fill.style.width = (step / 4 * 100) + '%';

    // Restore data on step entry
    if (step === 0) restoreStep0();
    if (step === 1) restoreStep1();
    if (step === 2) restoreStep2();
    if (step === 3) restoreStep3();
    if (step === 4) runAnalysis();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initNavButtons() {
    // Prev buttons
    document.querySelectorAll('.bs-btn-prev').forEach(btn => {
        btn.addEventListener('click', function() {
            saveCurrentStep();
            goToStep(parseInt(this.dataset.prev));
        });
    });

    // Step 0 next
    document.getElementById('step0Next').addEventListener('click', function() {
        if (!appState.scenario) {
            document.getElementById('step0Validation').style.display = 'block';
            return;
        }
        document.getElementById('step0Validation').style.display = 'none';
        saveCurrentStep();
        goToStep(1);
    });

    // Step 1 next
    document.getElementById('step1Next').addEventListener('click', function() {
        if (validateStep1()) { saveCurrentStep(); goToStep(2); }
    });

    // Step 2 next
    document.getElementById('step2Next').addEventListener('click', function() {
        if (validateStep2()) { saveCurrentStep(); goToStep(3); }
    });

    // Step 3 next
    document.getElementById('step3Next').addEventListener('click', function() {
        saveCurrentStep();
        goToStep(4);
    });
}

function saveCurrentStep() {
    if (currentStep === 0) collectStep0();
    if (currentStep === 1) collectStep1();
    if (currentStep === 2) collectStep2();
    if (currentStep === 3) collectStep3();
    DataStore.save(appState);
}

/* ─── Step 0: Scenario Selection ─── */
function initScenarioCards() {
    document.querySelectorAll('.bs-scenario-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.bs-scenario-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            appState.scenario = this.dataset.scenario;
            document.getElementById('step0Validation').style.display = 'none';
        });
    });
}

function collectStep0() {
    const sel = document.querySelector('.bs-scenario-card.selected');
    if (sel) appState.scenario = sel.dataset.scenario;
}

function restoreStep0() {
    document.querySelectorAll('.bs-scenario-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.scenario === appState.scenario);
    });
}

/* ─── Step 1: Opportunity Profile ─── */
function collectStep1() {
    appState.opportunity.name = document.getElementById('oppName').value.trim();
    appState.opportunity.customerName = document.getElementById('oppCustomer').value.trim();
    appState.opportunity.value = document.getElementById('oppValue').value;
    appState.opportunity.stage = document.getElementById('oppStage').value;
    appState.opportunity.timeline = document.getElementById('oppTimeline').value;
    appState.opportunity.industry = document.getElementById('oppIndustry').value;
    appState.opportunity.currentSituation = document.getElementById('oppSituation').value.trim();
    appState.opportunity.desiredOutcome = document.getElementById('oppOutcome').value.trim();
}

function restoreStep1() {
    const o = appState.opportunity;
    document.getElementById('oppName').value = o.name || '';
    document.getElementById('oppCustomer').value = o.customerName || '';
    document.getElementById('oppValue').value = o.value || '';
    document.getElementById('oppStage').value = o.stage || '';
    document.getElementById('oppTimeline').value = o.timeline || '';
    document.getElementById('oppIndustry').value = o.industry || '';
    document.getElementById('oppSituation').value = o.currentSituation || '';
    document.getElementById('oppOutcome').value = o.desiredOutcome || '';
}

function validateStep1() {
    const fields = [
        { id: 'oppName', label: '商機名稱' },
        { id: 'oppCustomer', label: '客戶名稱' },
        { id: 'oppStage', label: '商機階段' }
    ];
    let valid = true;
    const msgs = [];
    fields.forEach(f => {
        const el = document.getElementById(f.id);
        if (!el.value.trim()) { el.classList.add('error'); valid = false; msgs.push(f.label + '為必填'); }
        else el.classList.remove('error');
    });
    const v = document.getElementById('step1Validation');
    v.textContent = msgs.join('、');
    v.style.display = valid ? 'none' : 'block';
    return valid;
}

/* ─── Step 2: Stakeholder Mapping ─── */
function initStakeholderUI() {
    document.getElementById('addStakeholder').addEventListener('click', function() {
        const s = createDefaultStakeholder();
        appState.stakeholders.push(s);
        renderStakeholderCard(s);
    });
}

function renderStakeholderCard(s) {
    const list = document.getElementById('stakeholderList');
    const card = document.createElement('div');
    card.className = 'bs-stakeholder-card';
    card.dataset.id = s.id;
    card.innerHTML = `
        <div class="bs-card-header">
            <span class="bs-card-title">決策角色 #${appState.stakeholders.findIndex(x => x.id === s.id) + 1}</span>
            <button class="bs-stakeholder-delete" data-id="${s.id}">&times;</button>
        </div>
        <div class="bs-stakeholder-grid">
            <div class="bs-field"><label>姓名 <span class="required">*</span></label><input type="text" data-f="name" value="${s.name}" placeholder="角色姓名"></div>
            <div class="bs-field"><label>職稱</label><input type="text" data-f="title" value="${s.title}" placeholder="例：CTO、採購主管"></div>
            <div class="bs-field"><label>部門</label><input type="text" data-f="department" value="${s.department}" placeholder="例：資訊部"></div>
            <div class="bs-field"><label>角色類型 <span class="required">*</span></label>
                <select data-f="buyerType">
                    <option value="">請選擇</option>
                    <option value="economic" ${s.buyerType === 'economic' ? 'selected' : ''}>經濟買家</option>
                    <option value="technical" ${s.buyerType === 'technical' ? 'selected' : ''}>技術買家</option>
                    <option value="user" ${s.buyerType === 'user' ? 'selected' : ''}>使用者</option>
                    <option value="coach" ${s.buyerType === 'coach' ? 'selected' : ''}>教練</option>
                </select>
            </div>
            <div class="bs-field"><label>立場 <span class="required">*</span></label>
                <div class="bs-stance-group">
                    <label class="bs-stance-option"><input type="radio" name="stance_${s.id}" value="support" ${s.stance === 'support' ? 'checked' : ''}> 支持</label>
                    <label class="bs-stance-option"><input type="radio" name="stance_${s.id}" value="neutral" ${s.stance === 'neutral' ? 'checked' : ''}> 中立</label>
                    <label class="bs-stance-option"><input type="radio" name="stance_${s.id}" value="oppose" ${s.stance === 'oppose' ? 'checked' : ''}> 反對</label>
                    <label class="bs-stance-option"><input type="radio" name="stance_${s.id}" value="unknown" ${s.stance === 'unknown' ? 'checked' : ''}> 未知</label>
                </div>
            </div>
            <div class="bs-field"><label>接觸狀態 <span class="required">*</span></label>
                <select data-f="contactStatus">
                    <option value="no-contact" ${s.contactStatus === 'no-contact' ? 'selected' : ''}>未接觸</option>
                    <option value="initial" ${s.contactStatus === 'initial' ? 'selected' : ''}>初步接觸</option>
                    <option value="developing" ${s.contactStatus === 'developing' ? 'selected' : ''}>發展中</option>
                    <option value="established" ${s.contactStatus === 'established' ? 'selected' : ''}>已建立</option>
                    <option value="deep-trust" ${s.contactStatus === 'deep-trust' ? 'selected' : ''}>深度信任</option>
                </select>
            </div>
            <div class="bs-field"><label>影響力</label>
                <div class="bs-slider-container">
                    <input type="range" min="1" max="5" value="${s.influence}" data-f="influence">
                    <div class="bs-slider-labels"><span>1 低</span><span class="bs-slider-value">${s.influence}</span><span>5 高</span></div>
                </div>
            </div>
            <div class="bs-field"><label>關係強度</label>
                <div class="bs-slider-container">
                    <input type="range" min="1" max="5" value="${s.relationshipStrength}" data-f="relationshipStrength">
                    <div class="bs-slider-labels"><span>1 陌生</span><span class="bs-slider-value">${s.relationshipStrength}</span><span>5 盟友</span></div>
                </div>
            </div>
            <div class="bs-field full-width"><label>贏的結果</label><input type="text" data-f="winResult" value="${s.winResult}" placeholder="例：升遷機會、部門 KPI 達標、降低個人風險"></div>
            <div class="bs-field full-width"><label>備註</label><textarea data-f="notes" rows="2" placeholder="關鍵情報或觀察">${s.notes}</textarea></div>
        </div>
        <button class="bs-advanced-toggle" onclick="this.nextElementSibling.classList.toggle('show')">▸ 進階：角色標記</button>
        <div class="bs-advanced-content">
            <div class="bs-field"><label>角色標記（roleFlag）</label>
                <select data-f="roleFlag">
                    <option value="none" ${s.roleFlag === 'none' ? 'selected' : ''}>無</option>
                    <option value="blocker" ${s.roleFlag === 'blocker' ? 'selected' : ''}>阻擋者</option>
                    <option value="sponsor" ${s.roleFlag === 'sponsor' ? 'selected' : ''}>贊助者</option>
                    <option value="gatekeeper" ${s.roleFlag === 'gatekeeper' ? 'selected' : ''}>守門人</option>
                    <option value="neutral" ${s.roleFlag === 'neutral' ? 'selected' : ''}>中性</option>
                </select>
            </div>
        </div>
    `;

    // Slider value display
    card.querySelectorAll('input[type="range"]').forEach(r => {
        r.addEventListener('input', function() {
            this.closest('.bs-slider-container').querySelector('.bs-slider-value').textContent = this.value;
        });
    });

    // Delete
    card.querySelector('.bs-stakeholder-delete').addEventListener('click', function() {
        const id = this.dataset.id;
        appState.stakeholders = appState.stakeholders.filter(x => x.id !== id);
        card.remove();
        // Renumber
        document.querySelectorAll('.bs-stakeholder-card .bs-card-title').forEach((t, i) => {
            t.textContent = '決策角色 #' + (i + 1);
        });
    });

    list.appendChild(card);
}

function collectStep2() {
    document.querySelectorAll('.bs-stakeholder-card').forEach(card => {
        const id = card.dataset.id;
        const s = appState.stakeholders.find(x => x.id === id);
        if (!s) return;
        s.name = card.querySelector('[data-f="name"]').value.trim();
        s.title = card.querySelector('[data-f="title"]').value.trim();
        s.department = card.querySelector('[data-f="department"]').value.trim();
        s.buyerType = card.querySelector('[data-f="buyerType"]').value;
        s.contactStatus = card.querySelector('[data-f="contactStatus"]').value;
        s.influence = parseInt(card.querySelector('[data-f="influence"]').value);
        s.relationshipStrength = parseInt(card.querySelector('[data-f="relationshipStrength"]').value);
        s.winResult = card.querySelector('[data-f="winResult"]').value.trim();
        s.notes = card.querySelector('[data-f="notes"]').value.trim();
        s.roleFlag = card.querySelector('[data-f="roleFlag"]').value;
        const stanceEl = card.querySelector('input[name="stance_' + id + '"]:checked');
        if (stanceEl) s.stance = stanceEl.value;
    });
}

function restoreStep2() {
    const list = document.getElementById('stakeholderList');
    list.innerHTML = '';
    appState.stakeholders.forEach(s => renderStakeholderCard(s));
}

function validateStep2() {
    collectStep2();
    const valid = appState.stakeholders.some(s => s.name && s.buyerType);
    document.getElementById('step2Validation').style.display = valid ? 'none' : 'block';
    return valid;
}

/* ─── Step 3: Risk Assessment ─── */
function initRiskUI() {
    const grid = document.getElementById('riskGrid');
    if (!grid) return;
    RISK_DIMENSIONS.forEach(dim => {
        const item = document.createElement('div');
        item.className = 'bs-risk-item';
        item.innerHTML = `
            <h4>${dim.label}</h4>
            <p class="bs-risk-desc">${dim.desc}</p>
            ${dim.tooltip ? '<p class="bs-risk-tooltip">' + dim.tooltip + '</p>' : ''}
            <div class="bs-slider-container">
                <input type="range" min="1" max="5" value="${appState.risks[dim.key]}" data-risk="${dim.key}">
                <div class="bs-slider-labels"><span>${dim.low}</span><span class="bs-slider-value">${appState.risks[dim.key]}</span><span>${dim.high}</span></div>
            </div>
        `;
        item.querySelector('input[type="range"]').addEventListener('input', function() {
            this.closest('.bs-slider-container').querySelector('.bs-slider-value').textContent = this.value;
        });
        grid.appendChild(item);
    });
}

function collectStep3() {
    document.querySelectorAll('[data-risk]').forEach(el => {
        appState.risks[el.dataset.risk] = parseInt(el.value);
    });
}

function restoreStep3() {
    document.querySelectorAll('[data-risk]').forEach(el => {
        const val = appState.risks[el.dataset.risk] || 3;
        el.value = val;
        el.closest('.bs-slider-container').querySelector('.bs-slider-value').textContent = val;
    });
}

/* ═══════════════════════════════════════════════
   ANALYSIS ENGINE
   ═══════════════════════════════════════════════ */

function runAnalysis() {
    collectStep3();

    const weights = getEffectiveWeights();
    const roleCoverageScore = calcRoleCoverage();
    const riskScore = calcRiskScore();
    const dataScore = calcDataCompleteness();

    const healthScore = Math.round(
        roleCoverageScore * weights.healthDimensions.roleCoverage +
        riskScore * weights.healthDimensions.riskAssessment +
        dataScore * weights.healthDimensions.dataCompleteness
    );

    const healthLabel = classifyHealth(healthScore);
    const redFlags = detectRedFlags();
    const actions = generateActions(redFlags);
    const summary = generateExecutiveSummary(healthLabel);

    appState.result = {
        healthScore,
        healthLabel,
        executiveSummary: summary,
        dimensions: calcDimensionScores(),
        redFlags,
        actions,
        consultantInsights: []
    };
    appState.metadata.completedAt = new Date().toISOString();
    DataStore.save(appState);

    renderResult();
}

function getEffectiveWeights() {
    const override = SCORING_CONFIG.scenarioOverrides[appState.scenario];
    if (override && override.healthDimensions) {
        return { ...SCORING_CONFIG, healthDimensions: override.healthDimensions };
    }
    return SCORING_CONFIG;
}

function calcRoleCoverage() {
    const requiredTypes = ['economic', 'technical', 'user', 'coach'];
    const covered = requiredTypes.filter(t => appState.stakeholders.some(s => s.buyerType === t));
    let score = (covered.length / requiredTypes.length) * 70; // Base: 70% for coverage

    // Bonus for supporters
    const supporters = appState.stakeholders.filter(s => s.stance === 'support').length;
    const total = appState.stakeholders.length || 1;
    score += (supporters / total) * 20;

    // Penalty for no economic buyer or coach
    if (!covered.includes('economic')) score *= 0.5;
    if (!covered.includes('coach')) score *= 0.7;

    // Penalty for blockers
    const blockers = appState.stakeholders.filter(s => s.roleFlag === 'blocker' && s.influence >= SCORING_CONFIG.redFlagThresholds.blockerInfluence);
    if (blockers.length > 0) score *= 0.85;

    return Math.min(100, Math.max(0, Math.round(score + 10))); // +10 base for any data
}

function calcRiskScore() {
    const weights = SCORING_CONFIG.riskWeights;
    let weighted = 0;
    Object.keys(weights).forEach(key => {
        const riskVal = appState.risks[key] || 3;
        const normalized = ((5 - riskVal) / 4) * 100; // 1→100, 5→0
        weighted += normalized * weights[key];
    });
    return Math.round(weighted);
}

function calcDataCompleteness() {
    let filled = 0;
    let total = 0;

    // Opportunity fields
    const oFields = ['name', 'customerName', 'stage'];
    oFields.forEach(f => { total++; if (appState.opportunity[f]) filled++; });

    // Optional fields bonus
    ['value', 'timeline', 'industry', 'currentSituation', 'desiredOutcome'].forEach(f => {
        total++; if (appState.opportunity[f]) filled++;
    });

    // Stakeholder completeness
    appState.stakeholders.forEach(s => {
        total += 3;
        if (s.name) filled++;
        if (s.buyerType) filled++;
        if (s.winResult) filled++;
    });

    return total > 0 ? Math.round((filled / total) * 100) : 0;
}

function calcDimensionScores() {
    const scores = {};
    Object.keys(SCORING_CONFIG.riskWeights).forEach(key => {
        scores[key] = Math.round(((5 - (appState.risks[key] || 3)) / 4) * 100);
    });
    return scores;
}

function classifyHealth(score) {
    if (score >= 80) return '良好';
    if (score >= 60) return '需關注';
    if (score >= 40) return '高風險';
    return '危急';
}

function detectRedFlags() {
    const flags = [];
    const T = SCORING_CONFIG.redFlagThresholds;
    const s = appState.stakeholders;
    const r = appState.risks;

    // Role-based flags
    if (!s.some(x => x.buyerType === 'economic')) flags.push({ id: 'no-economic-buyer', severity: 'critical' });
    else if (s.filter(x => x.buyerType === 'economic').every(x => x.contactStatus === 'no-contact' || x.contactStatus === 'initial'))
        flags.push({ id: 'no-economic-buyer-access', severity: 'critical' });

    if (!s.some(x => x.buyerType === 'coach')) flags.push({ id: 'no-coach', severity: 'high' });
    if (r.coachStrength >= T.highRisk) flags.push({ id: 'weak-coach', severity: 'high' });

    // Stance flags
    const supporters = s.filter(x => x.stance === 'support').length;
    const opponents = s.filter(x => x.stance === 'oppose').length;
    if (s.length > 0 && opponents > supporters) flags.push({ id: 'opponent-dominance', severity: 'high' });
    if (supporters === 0 && s.length > 0) flags.push({ id: 'no-supporters', severity: 'high' });

    // Blocker flag
    if (s.some(x => x.roleFlag === 'blocker' && x.influence >= T.blockerInfluence)) flags.push({ id: 'high-influence-blocker', severity: 'critical' });

    // Risk dimension flags
    if (r.budget >= T.highRisk) flags.push({ id: 'budget-unclear', severity: 'high' });
    if (r.timeline >= T.criticalRisk) flags.push({ id: 'timeline-critical', severity: 'high' });
    if (r.competition >= T.highRisk) flags.push({ id: 'competition-strong', severity: 'medium' });
    if (r.decisionMapCompleteness >= T.highRisk) flags.push({ id: 'decision-map-blank', severity: 'high' });
    if (r.technicalPreferenceRisk >= T.highRisk) flags.push({ id: 'tech-preference-risk', severity: 'medium' });

    // Sort by severity
    const order = { critical: 0, high: 1, medium: 2 };
    flags.sort((a, b) => order[a.severity] - order[b.severity]);

    // Enrich with template data
    return flags.map(f => ({
        ...f,
        ...(TEMPLATES.redFlagInsights[f.id] || { title: f.id, insight: '', response: '' })
    }));
}

function generateActions(redFlags) {
    const actions = [];
    redFlags.slice(0, 5).forEach((flag, i) => {
        const tmpl = TEMPLATES.actionTemplates[flag.id];
        if (tmpl) {
            actions.push({ priority: 'P' + (i + 1), ...tmpl });
        }
    });
    return actions;
}

function generateExecutiveSummary(label) {
    const scenarioKey = appState.scenario;
    const labelTemplates = TEMPLATES.executiveSummary[label] || TEMPLATES.executiveSummary['需關注'];
    return labelTemplates[scenarioKey] || labelTemplates.default || '';
}

/* ═══════════════════════════════════════════════
   RESULT RENDERING
   ═══════════════════════════════════════════════ */

function initResultUI() {
    // Copy summary
    document.getElementById('ctaCopy').addEventListener('click', copySummary);

    // Restart
    document.getElementById('ctaRestart').addEventListener('click', function() {
        DataStore.clear();
        appState = createDefaultData();
        document.getElementById('stakeholderList').innerHTML = '';
        goToStep(0);
    });
}

function renderResult() {
    const res = appState.result;

    // 1. Score
    document.getElementById('scoreNumber').textContent = res.healthScore;
    const labelEl = document.getElementById('scoreLabel');
    labelEl.textContent = res.healthLabel;
    labelEl.className = 'bs-score-label ' + getLabelClass(res.healthLabel);

    const circle = document.getElementById('scoreCircle');
    circle.style.borderColor = getLabelColor(res.healthLabel);

    // Executive summary
    document.getElementById('executiveText').textContent = res.executiveSummary;

    // 2. Red Flags (top 3)
    const flagsGrid = document.getElementById('redFlagsGrid');
    flagsGrid.innerHTML = '';
    if (res.redFlags.length === 0) {
        flagsGrid.innerHTML = '<div class="bs-no-redflags">✓ 目前無明顯紅旗</div>';
    } else {
        res.redFlags.slice(0, 3).forEach(f => {
            flagsGrid.innerHTML += `
                <div class="bs-redflag-card">
                    <h4>${f.title}</h4>
                    <p class="bs-redflag-insight">${f.insight}</p>
                    <div class="bs-redflag-response">建議：${f.response}</div>
                </div>`;
        });
    }

    // 3. Actions
    const actionsList = document.getElementById('actionsList');
    actionsList.innerHTML = '';
    res.actions.forEach(a => {
        actionsList.innerHTML += `
            <div class="bs-action-card">
                <div class="bs-action-priority">${a.priority}</div>
                <div class="bs-action-content">
                    <h4>${a.action}</h4>
                    <p>${a.purpose}</p>
                    <span class="bs-action-timeline">${a.timeline}</span>
                </div>
                <input type="checkbox" class="bs-action-check">
            </div>`;
    });

    // 4. Stakeholder Map
    renderStakeholderMap();

    // 5. Radar Chart
    renderRadarChart();

    // 6. CTA
    document.getElementById('ctaText').textContent = TEMPLATES.ctaText[res.healthLabel] || TEMPLATES.ctaText['需關注'];

    // Update booking CTA with bs_ params
    const params = new URLSearchParams({
        bs_scenario: SCENARIO_NAMES[appState.scenario] || appState.scenario,
        bs_health: res.healthLabel,
        bs_flags: res.redFlags.slice(0, 3).map(f => f.title).join(',')
    });
    document.getElementById('ctaBooking').href = 'booking.html?' + params.toString();
}

function renderStakeholderMap() {
    const map = document.getElementById('stakeholderMap');
    const types = [
        { key: 'economic', label: '經濟買家' },
        { key: 'technical', label: '技術買家' },
        { key: 'user', label: '使用者' },
        { key: 'coach', label: '教練' }
    ];

    map.innerHTML = types.map(type => {
        const stakeholders = appState.stakeholders.filter(s => s.buyerType === type.key);
        const cards = stakeholders.length > 0
            ? stakeholders.map(s => {
                const flagClass = s.roleFlag === 'blocker' ? ' blocker' : s.roleFlag === 'sponsor' ? ' sponsor' : '';
                const stanceBadge = `<span class="bs-map-badge ${s.stance}">${{support:'支持',neutral:'中立',oppose:'反對',unknown:'未知'}[s.stance] || '未知'}</span>`;
                const contactLabel = {
                    'no-contact':'未接觸','initial':'初步','developing':'發展中','established':'已建立','deep-trust':'深信任'
                }[s.contactStatus] || s.contactStatus;
                const dots = '●'.repeat(s.influence) + '○'.repeat(5 - s.influence);
                const flagBadge = s.roleFlag !== 'none' ? `<span class="bs-map-badge oppose">${{blocker:'阻擋者',sponsor:'贊助者',gatekeeper:'守門人'}[s.roleFlag] || ''}</span>` : '';
                return `<div class="bs-map-card${flagClass}">
                    <div class="bs-map-name">${s.name || '(未命名)'}${s.title ? ' · ' + s.title : ''}</div>
                    <div class="bs-map-meta">${stanceBadge} ${flagBadge} <span class="bs-map-badge neutral">${contactLabel}</span></div>
                    <div style="font-size:0.7rem;color:var(--bs-navy);margin-top:4px;">${dots}</div>
                </div>`;
            }).join('')
            : '<div class="bs-map-placeholder">未識別</div>';
        return `<div class="bs-map-column"><h4>${type.label}</h4>${cards}</div>`;
    }).join('');
}

function renderRadarChart() {
    const dims = appState.result.dimensions;
    const labels = RISK_DIMENSIONS.map(d => d.label);
    const data = RISK_DIMENSIONS.map(d => dims[d.key] || 0);

    const canvas = document.getElementById('radarChart');
    if (!canvas) return;

    // Destroy existing chart
    if (window._bsRadarChart) window._bsRadarChart.destroy();

    window._bsRadarChart = new Chart(canvas, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: '風險維度得分',
                data: data,
                borderColor: '#003366',
                backgroundColor: 'rgba(0,51,102,0.12)',
                pointBackgroundColor: '#003366',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    min: 0, max: 100,
                    ticks: { stepSize: 25, font: { size: 10 } },
                    pointLabels: { font: { size: 11, family: "'Noto Sans TC', sans-serif" } }
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Dimension notes
    const notes = document.getElementById('dimensionNotes');
    notes.innerHTML = RISK_DIMENSIONS.map(d => {
        const score = dims[d.key] || 0;
        const status = score >= 75 ? '良好' : score >= 50 ? '需注意' : '風險高';
        return `<div class="bs-dimension-note"><strong>${d.label}</strong>：${status}（${score}/100）</div>`;
    }).join('');
}

function getLabelClass(label) {
    return { '良好': 'good', '需關注': 'attention', '高風險': 'high-risk', '危急': 'critical' }[label] || '';
}

function getLabelColor(label) {
    return { '良好': '#2e7d32', '需關注': '#e65100', '高風險': '#c62828', '危急': '#b71c1c' }[label] || '#757575';
}

/* ─── Copy Summary ─── */
function copySummary() {
    const res = appState.result;
    const opp = appState.opportunity;
    const text = `【Blue Sheet AI 商機診斷摘要】
商機：${opp.name}
客戶：${opp.customerName}
健康度：${res.healthScore}/100（${res.healthLabel}）
情境：${SCENARIO_NAMES[appState.scenario] || appState.scenario}

■ 三大紅旗
${res.redFlags.slice(0, 3).map((f, i) => (i + 1) + '. ' + f.title).join('\n') || '（無）'}

■ 優先行動
${res.actions.slice(0, 3).map((a, i) => (i + 1) + '. ' + a.action + '（' + a.timeline + '）').join('\n') || '（無）'}

—— 由核心顧問 Blue Sheet AI 產出
預約深度診斷：https://hexin-consulting.github.io/booking.html`;

    navigator.clipboard.writeText(text).then(() => showToast('已複製到剪貼簿')).catch(() => showToast('複製失敗，請手動複製'));
}

function showToast(msg) {
    const toast = document.getElementById('bsToast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}
