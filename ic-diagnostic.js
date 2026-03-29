/* ============================================================
   IC 產業人才轉型診斷 — 主程式
   ============================================================ */

const ICD = (() => {
    // --- State ---
    let state = {
        currentView: 'intro',   // intro | diagnostic | result
        currentStep: 'role',    // role | info | questions | upload
        selectedRole: null,     // sales | pm | fae
        questions: [],
        answers: {},            // { questionId: value }
        questionGroups: [],     // grouped by model
        currentGroupIndex: 0,
        info: {},
        uploadedFile: null,
        scoringConfig: null,
        diagnosticRules: null,
        uploadTemplates: null,
        result: null
    };

    // --- Model labels ---
    const MODEL_LABELS = {
        revenue: '營收模型',
        grossprofit: '毛利模型',
        expense: '費效模型',
        contribution: '貢獻模型',
        capability: '能力與協同'
    };

    const MODEL_ORDER = ['revenue', 'grossprofit', 'expense', 'contribution', 'capability'];

    const ROLE_LABELS = { sales: 'Sales 業務開發', pm: 'PM 產品經理', fae: 'FAE 技術支援' };

    // --- Init ---
    async function init() {
        // Load config files
        try {
            const [configRes, rulesRes, templatesRes] = await Promise.all([
                fetch('ic-diagnostic-data/scoring-config.json'),
                fetch('ic-diagnostic-data/diagnostic-rules.json'),
                fetch('ic-diagnostic-data/upload-templates.json')
            ]);
            state.scoringConfig = await configRes.json();
            state.diagnosticRules = await rulesRes.json();
            state.uploadTemplates = await templatesRes.json();
        } catch (e) {
            console.error('Failed to load config:', e);
        }

        // Check hash for direct navigation
        const hash = window.location.hash;
        if (hash === '#start') showView('start');
        else if (hash === '#result') tryRestoreResult();
        else showView('intro');

        // Upload drag & drop
        setupUploadZone();
    }

    // --- View Management ---
    function showView(view) {
        if (view === 'start') view = 'diagnostic';
        document.querySelectorAll('.icd-view').forEach(v => v.classList.remove('active'));

        if (view === 'intro') {
            document.getElementById('viewIntro').classList.add('active');
            document.getElementById('icdFooter').style.display = '';
            state.currentView = 'intro';
        } else if (view === 'diagnostic') {
            document.getElementById('viewDiagnostic').classList.add('active');
            document.getElementById('icdFooter').style.display = 'none';
            state.currentView = 'diagnostic';
            showStep('role');
        } else if (view === 'result') {
            document.getElementById('viewResult').classList.add('active');
            document.getElementById('icdFooter').style.display = '';
            state.currentView = 'result';

            // 10.4 追蹤：結果頁瀏覽
            if (typeof ICDAnalytics !== 'undefined' && state.result) {
                const r = state.result;
                ICDAnalytics.trackViewResult(
                    r.role,
                    r.overallScore,
                    r.maturity?.level,
                    r.completeness,
                    (r.triggeredRules || []).length
                );
            }
        }

        window.scrollTo(0, 0);
        window.location.hash = view === 'intro' ? '' : (view === 'diagnostic' ? 'start' : 'result');
    }

    // --- Step Management ---
    function showStep(stepName) {
        state.currentStep = stepName;
        document.querySelectorAll('.icd-step').forEach(s => s.classList.remove('active'));

        if (stepName === 'questions') {
            document.querySelector('[data-step="questions"]').classList.add('active');
            renderQuestionGroup();
        } else {
            const step = document.querySelector(`[data-step="${stepName}"]`);
            if (step) step.classList.add('active');
        }

        updateSidebar();
        updateMobileProgress();
        window.scrollTo(0, 0);
    }

    function getStepSequence() {
        const steps = ['role', 'info'];
        state.questionGroups.forEach((g, i) => steps.push('questions_' + i));
        steps.push('upload');
        return steps;
    }

    function getCurrentStepIndex() {
        const seq = getStepSequence();
        if (state.currentStep === 'questions') {
            return seq.indexOf('questions_' + state.currentGroupIndex);
        }
        return seq.indexOf(state.currentStep);
    }

    function nextStep() {
        const seq = getStepSequence();
        const idx = getCurrentStepIndex();

        // Validate current step
        if (state.currentStep === 'info' && !validateInfo()) return;
        if (state.currentStep === 'questions' && !validateCurrentGroup()) return;

        if (idx < seq.length - 1) {
            const next = seq[idx + 1];
            if (next.startsWith('questions_')) {
                state.currentGroupIndex = parseInt(next.split('_')[1]);
                showStep('questions');
            } else if (next === 'upload') {
                // 10.2 追蹤：問卷全部完成（進入上傳步驟）
                if (typeof ICDAnalytics !== 'undefined') {
                    const required = state.questions.filter(q => q.required !== false).length;
                    const answered = state.questions.filter(q => q.required !== false && state.answers[q.id] !== undefined).length;
                    ICDAnalytics.trackQuestionnaireDone(state.selectedRole, answered, required);
                }
                showStep('upload');
            } else {
                showStep(next);
            }
        } else {
            // Last step — submit
            submitDiagnostic();
        }
    }

    function prevStep() {
        const seq = getStepSequence();
        const idx = getCurrentStepIndex();
        if (idx > 0) {
            const prev = seq[idx - 1];
            if (prev.startsWith('questions_')) {
                state.currentGroupIndex = parseInt(prev.split('_')[1]);
                showStep('questions');
            } else {
                showStep(prev);
            }
        }
    }

    // --- Role Selection ---
    async function selectRole(role, el) {
        state.selectedRole = role;

        // Highlight selected card
        document.querySelectorAll('.icd-role-select-card').forEach(c => c.classList.remove('selected'));
        if (el) el.classList.add('selected');

        // Load questions
        try {
            const res = await fetch(`ic-diagnostic-data/questions-${role}.json`);
            state.questions = (await res.json()).filter(q => q.active !== false);
        } catch (e) {
            console.error('Failed to load questions:', e);
            state.questions = [];
        }

        // Group questions by model
        state.questionGroups = groupQuestionsByModel(state.questions);
        state.currentGroupIndex = 0;
        state.answers = {};

        // Build sidebar nav
        buildSidebarNav();

        // Pre-fill lead form
        setTimeout(() => {
            const leadName = document.getElementById('leadName');
            const leadCompany = document.getElementById('leadCompany');
            if (leadName) leadName.value = '';
            if (leadCompany) leadCompany.value = '';
        }, 100);

        // Render upload templates
        renderTemplateLinks();

        // 10.1 追蹤：開始診斷
        if (typeof ICDAnalytics !== 'undefined') {
            ICDAnalytics.trackStart(role);
        }

        // Move to info step
        setTimeout(() => showStep('info'), 300);
    }

    function groupQuestionsByModel(questions) {
        const groups = [];
        const modelMap = {};

        questions.forEach(q => {
            if (!modelMap[q.model]) {
                modelMap[q.model] = [];
            }
            modelMap[q.model].push(q);
        });

        MODEL_ORDER.forEach(model => {
            if (modelMap[model] && modelMap[model].length > 0) {
                groups.push({
                    model: model,
                    label: MODEL_LABELS[model],
                    questions: modelMap[model]
                });
            }
        });

        return groups;
    }

    // --- Sidebar ---
    function buildSidebarNav() {
        const nav = document.getElementById('sidebarNav');
        if (!nav) return;

        let html = '';
        html += `<div class="icd-sidebar-nav-item active" data-nav="role">
            <div class="icd-sidebar-dot"></div>
            <div><div class="icd-sidebar-nav-title">角色選擇</div></div>
        </div>`;
        html += `<div class="icd-sidebar-nav-item" data-nav="info">
            <div class="icd-sidebar-dot"></div>
            <div><div class="icd-sidebar-nav-title">基本資料</div></div>
        </div>`;

        state.questionGroups.forEach((g, i) => {
            html += `<div class="icd-sidebar-nav-item" data-nav="questions_${i}">
                <div class="icd-sidebar-dot"></div>
                <div>
                    <div class="icd-sidebar-nav-title">${g.label}</div>
                    <div class="icd-sidebar-nav-sub">${g.questions.length} 題</div>
                </div>
            </div>`;
        });

        html += `<div class="icd-sidebar-nav-item" data-nav="upload">
            <div class="icd-sidebar-dot"></div>
            <div><div class="icd-sidebar-nav-title">資料上傳（選填）</div></div>
        </div>`;

        nav.innerHTML = html;
    }

    function updateSidebar() {
        const nav = document.getElementById('sidebarNav');
        if (!nav) return;

        const seq = getStepSequence();
        const currentIdx = getCurrentStepIndex();
        const totalQuestions = state.questions.length;
        const answeredCount = Object.keys(state.answers).length;

        // Update progress
        const fill = document.getElementById('sidebarProgressFill');
        const text = document.getElementById('sidebarProgressText');
        if (fill) fill.style.width = totalQuestions ? `${(answeredCount / totalQuestions) * 100}%` : '0%';
        if (text) text.textContent = `${answeredCount} / ${totalQuestions} 題`;

        // Update nav items
        nav.querySelectorAll('.icd-sidebar-nav-item').forEach(item => {
            const navKey = item.dataset.nav;
            const navIdx = seq.indexOf(navKey);

            item.classList.remove('active', 'completed');
            if (navKey === state.currentStep || (state.currentStep === 'questions' && navKey === 'questions_' + state.currentGroupIndex)) {
                item.classList.add('active');
            } else if (navIdx < currentIdx) {
                item.classList.add('completed');
            }
        });
    }

    function updateMobileProgress() {
        const seq = getStepSequence();
        const idx = getCurrentStepIndex();
        const pct = seq.length > 1 ? (idx / (seq.length - 1)) * 100 : 0;

        const fill = document.getElementById('mobileBarFill');
        const text = document.getElementById('mobileBarText');
        if (fill) fill.style.width = pct + '%';

        const stepLabels = {
            role: '選擇角色',
            info: '基本資料',
            upload: '資料上傳'
        };
        let label = stepLabels[state.currentStep];
        if (state.currentStep === 'questions' && state.questionGroups[state.currentGroupIndex]) {
            label = state.questionGroups[state.currentGroupIndex].label;
        }
        if (text) text.textContent = label || '';
    }

    // --- Question Rendering ---
    function renderQuestionGroup() {
        const group = state.questionGroups[state.currentGroupIndex];
        if (!group) return;

        const badge = document.getElementById('questionGroupBadge');
        const title = document.getElementById('questionGroupTitle');
        const desc = document.getElementById('questionGroupDesc');
        const container = document.getElementById('questionContainer');
        const nextBtn = document.getElementById('questionNextBtn');

        if (badge) badge.textContent = `Step ${state.currentGroupIndex + 3}`;
        if (title) title.textContent = group.label;
        if (desc) desc.textContent = `${group.questions.length} 題 — 請根據您的實際情況選擇最接近的選項。`;

        // Check if last group
        const isLastGroup = state.currentGroupIndex === state.questionGroups.length - 1;
        if (nextBtn) nextBtn.innerHTML = isLastGroup ? '下一步 <span class="arrow">&rarr;</span>' : '下一步 <span class="arrow">&rarr;</span>';

        let html = '';
        group.questions.forEach((q, i) => {
            const globalIdx = getGlobalQuestionIndex(q.id);
            const answered = state.answers[q.id] !== undefined;
            html += `<div class="icd-question ${answered ? 'answered' : ''}" data-qid="${q.id}">
                <div class="icd-question-header">
                    <span class="icd-question-num">Q${globalIdx + 1}</span>
                    <span class="icd-question-text">${q.question_text}</span>
                </div>
                <div class="icd-options">`;

            q.options.forEach(opt => {
                const selected = state.answers[q.id] === opt.value;
                html += `<div class="icd-option ${selected ? 'selected' : ''}" onclick="ICD.selectAnswer('${q.id}', ${opt.value}, this)">
                    <div class="icd-option-radio"></div>
                    <span>${opt.label}</span>
                </div>`;
            });

            html += `</div></div>`;
        });

        if (container) container.innerHTML = html;
    }

    function getGlobalQuestionIndex(qid) {
        return state.questions.findIndex(q => q.id === qid);
    }

    function selectAnswer(qid, value, el) {
        state.answers[qid] = value;

        // Update UI (el may be null in programmatic calls)
        const questionEl = el && el.closest ? el.closest('.icd-question') : null;
        if (questionEl) {
            questionEl.classList.add('answered');
            questionEl.querySelectorAll('.icd-option').forEach(o => o.classList.remove('selected'));
            el.classList.add('selected');
        }

        updateSidebar();
    }

    // --- Validation ---
    function validateInfo() {
        const company = document.getElementById('infoCompany').value.trim();
        const name = document.getElementById('infoName').value.trim();
        if (!company || !name) {
            showToast('請填寫公司名稱與姓名');
            return false;
        }
        // Collect customer types (checkboxes)
        const customerTypeEls = document.querySelectorAll('#infoCustomerTypes input[type=checkbox]:checked');
        const customerTypes = Array.from(customerTypeEls).map(el => el.value);

        state.info = {
            company: company,
            name: name,
            title: document.getElementById('infoTitle').value.trim(),
            experience: document.getElementById('infoExperience')?.value || '',
            size: document.getElementById('infoSize').value,
            products: document.getElementById('infoProducts').value.trim(),
            customerTypes: customerTypes,
            challenge: document.getElementById('infoChallenge')?.value.trim() || '',
            goal: document.getElementById('infoGoal')?.value.trim() || ''
        };
        return true;
    }

    function validateCurrentGroup() {
        const group = state.questionGroups[state.currentGroupIndex];
        if (!group) return true;

        const unanswered = group.questions.filter(q => q.required && state.answers[q.id] === undefined);
        if (unanswered.length > 0) {
            showToast(`尚有 ${unanswered.length} 題必填未作答`);
            // Scroll to first unanswered
            const el = document.querySelector(`[data-qid="${unanswered[0].id}"]`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }
        return true;
    }

    // --- Upload ---
    function setupUploadZone() {
        const zone = document.getElementById('uploadZone');
        if (!zone) return;

        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('dragover');
        });
        zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                processUpload(e.dataTransfer.files[0]);
            }
        });
    }

    function handleUpload(input) {
        if (input.files.length > 0) {
            processUpload(input.files[0]);
        }
    }

    function processUpload(file) {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
            'application/vnd.ms-excel'
        ];
        const ext = file.name.split('.').pop().toLowerCase();

        if (!['xlsx', 'csv'].includes(ext)) {
            showToast('僅支援 .xlsx 和 .csv 格式');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('檔案大小不可超過 5MB');
            return;
        }

        state.uploadedFile = file;

        // 10.3 追蹤：資料上傳成功
        if (typeof ICDAnalytics !== 'undefined') {
            ICDAnalytics.trackUploadSuccess(
                state.selectedRole,
                file.name,
                ext,
                file.size
            );
        }

        // Show status
        document.getElementById('uploadZone').style.display = 'none';
        document.getElementById('uploadStatus').style.display = 'block';
        document.getElementById('uploadFileName').textContent = file.name;
        document.getElementById('uploadMsg').textContent = '檔案已選取，將在提交時一併處理';

        // Fake progress
        const fill = document.getElementById('uploadProgressFill');
        fill.style.width = '0%';
        setTimeout(() => fill.style.width = '100%', 100);
    }

    function removeUpload() {
        state.uploadedFile = null;
        document.getElementById('uploadZone').style.display = '';
        document.getElementById('uploadStatus').style.display = 'none';
        document.getElementById('uploadFile').value = '';
    }

    function skipUpload() {
        submitDiagnostic();
    }

    function renderTemplateLinks() {
        const container = document.getElementById('templateLinks');
        if (!container || !state.uploadTemplates) return;

        const templates = state.uploadTemplates.templates || [];
        const roleTemplates = templates.filter(t =>
            !t.role_scope || t.role_scope.includes(state.selectedRole) || t.role_scope.includes('all')
        );

        container.innerHTML = roleTemplates.slice(0, 5).map(t =>
            `<button class="icd-template-link" title="${t.description}">${t.name}</button>`
        ).join('');
    }

    // --- Submit & Calculate ---
    function submitDiagnostic() {
        const config = state.scoringConfig;
        if (!config) {
            showToast('設定載入失敗，請重新整理頁面');
            return;
        }

        // 委派給 ICDService.Recommendation.computeFullResult（整合 Scorer + RuleEngine）
        const svc = (typeof ICDService !== 'undefined') ? ICDService : null;

        let result;
        if (svc) {
            result = svc.Recommendation.computeFullResult({
                role          : state.selectedRole,
                questions     : state.questions,
                answers       : state.answers,
                info          : state.info,
                hasUpload     : !!state.uploadedFile,
                scoringConfig : config,
                diagnosticRules: state.diagnosticRules
            });
        } else {
            // fallback（ICDService 未載入時的內建計算，保持向後相容）
            result = _legacyCalculate(config);
        }

        state.result = result;

        // 儲存至 DataStore（或直接寫 localStorage 以相容舊格式）
        if (svc) {
            svc.DataStore.saveSession(state.result);
        } else {
            try { localStorage.setItem('icd_last_result', JSON.stringify(state.result)); } catch (e) { /* ignore */ }
        }

        // Render result
        renderResult();
        showView('result');
    }

    /** 向後相容用的內建計算（ICDService 不可用時的 fallback） */
    function _legacyCalculate(config) {
        const subScoreWeights = config.subScoreWeights;
        const modelScores = {};

        MODEL_ORDER.forEach(model => {
            const modelQuestions = state.questions.filter(q => q.model === model);
            const categories = ['result', 'quality', 'trend', 'synergy'];
            const catScores = {};

            categories.forEach(cat => {
                const catQs = modelQuestions.filter(q => q.category === cat);
                if (catQs.length === 0) { catScores[cat] = null; return; }
                const total = catQs.reduce((s, q) => s + (state.answers[q.id] !== undefined ? state.answers[q.id] * (q.weight || 1) : 0), 0);
                const maxTotal = catQs.reduce((s, q) => s + 5 * (q.weight || 1), 0);
                catScores[cat] = maxTotal > 0 ? (total / maxTotal) * 5 : 0;
            });

            let modelTotal = 0, weightSum = 0;
            categories.forEach(cat => {
                if (catScores[cat] !== null) {
                    modelTotal += catScores[cat] * (subScoreWeights[cat] || 0);
                    weightSum  += subScoreWeights[cat] || 0;
                }
            });
            const raw = weightSum > 0 ? modelTotal / weightSum : 0;
            modelScores[model] = { raw, score: Math.round(raw * 20), catScores };
        });

        const roleWeights = config.roleWeights[state.selectedRole] || {};
        let overallScore = 0;
        MODEL_ORDER.forEach(m => { overallScore += modelScores[m].score * (roleWeights[m] || 0.2); });
        overallScore = Math.round(overallScore);

        const maturity = config.maturityLevels.find(l => overallScore >= l.min && overallScore <= l.max) || config.maturityLevels[config.maturityLevels.length - 1];

        const triggered = _legacyRunRules(modelScores);
        const topActions = _legacyGetActions(triggered);

        const totalQ = state.questions.filter(q => q.required).length;
        const answeredQ = state.questions.filter(q => q.required && state.answers[q.id] !== undefined).length;
        const qPct = totalQ > 0 ? answeredQ / totalQ : 0;

        return {
            role: state.selectedRole, info: state.info,
            modelScores, overallScore, maturity,
            triggeredRules: triggered, topActions,
            completeness: Math.round((qPct * 0.7 + (state.uploadedFile ? 0.3 : 0)) * 100),
            questionCompleteness: Math.round(qPct * 100),
            dataCompleteness: state.uploadedFile ? 30 : 0,
            hasUpload: !!state.uploadedFile,
            timestamp: new Date().toISOString()
        };
    }

    function _legacyRunRules(modelScores) {
        const rules = state.diagnosticRules?.rules || [];
        const sevOrder = { high: 0, medium: 1, low: 2 };
        const triggered = rules.filter(rule => {
            if (!rule.roleScope.includes(state.selectedRole)) return false;
            return (rule.condition.checks || []).every(check => {
                const ms = modelScores[check.model];
                if (!ms) return false;
                const val = ms.catScores[check.category];
                if (val === null || val === undefined) return false;
                if (check.operator === '>=') return val >= check.threshold;
                if (check.operator === '<=') return val <= check.threshold;
                if (check.operator === '<')  return val <  check.threshold;
                if (check.operator === '>')  return val >  check.threshold;
                return false;
            });
        });
        triggered.sort((a, b) => {
            const d = (sevOrder[a.severity] || 2) - (sevOrder[b.severity] || 2);
            return d !== 0 ? d : (a.priority || 99) - (b.priority || 99);
        });
        return triggered.slice(0, 3);
    }

    function _legacyGetActions(triggeredRules) {
        const priOrder = { P1: 0, P2: 1, P3: 2 };
        const all = [];
        triggeredRules.forEach(r => (r.actions || []).forEach(a => all.push({ ...a, ruleId: r.id, ruleName: r.name })));
        all.sort((a, b) => (priOrder[a.priority] || 2) - (priOrder[b.priority] || 2));
        return all.slice(0, 5);
    }

    // --- Render Result ---
    function renderResult() {
        const r = state.result;
        if (!r) return;

        // Header
        document.getElementById('resultCompany').textContent = r.info.company;
        document.getElementById('resultName').textContent = r.info.name;
        document.getElementById('resultRole').textContent = ROLE_LABELS[r.role] || r.role;
        document.getElementById('resultDate').textContent = new Date(r.timestamp).toLocaleDateString('zh-TW');
        document.getElementById('resultCompleteness').textContent = r.completeness + '%';

        // Score ring
        const scoreVal = document.getElementById('scoreValue');
        const scoreCircle = document.getElementById('scoreCircle');
        scoreVal.textContent = r.overallScore;
        const circumference = 326.73;
        const offset = circumference - (r.overallScore / 100) * circumference;
        scoreCircle.style.stroke = r.maturity.color;
        setTimeout(() => scoreCircle.style.strokeDashoffset = offset, 100);

        // Maturity badge
        const badge = document.getElementById('maturityBadge');
        badge.textContent = `Level ${r.maturity.level} — ${r.maturity.label}`;
        badge.style.background = r.maturity.color;
        document.getElementById('maturityDesc').textContent = r.maturity.description;

        // Radar chart
        renderRadarChart(r.modelScores);

        // Model scores
        renderModelScores(r.modelScores);

        // Risk flags
        renderRiskFlags(r.triggeredRules);

        // Actions
        renderActions(r.topActions);

        // Role feedback
        renderRoleFeedback(r);

        // Completeness
        renderCompleteness(r);

        // CTA link
        const ctaBooking = document.getElementById('ctaBooking');
        if (ctaBooking) {
            const params = new URLSearchParams({
                source: 'ic-diagnostic',
                ic_scenario: r.role,
                ic_health: r.maturity.level,
                ic_risks: r.triggeredRules.map(rule => rule.name).join(',')
            });
            ctaBooking.href = `booking.html?${params.toString()}`;

            // 10.6 追蹤：預約顧問點擊
            ctaBooking.addEventListener('click', () => {
                if (typeof ICDAnalytics !== 'undefined') {
                    ICDAnalytics.trackBookingClick(r.role, r.maturity?.level, 'result_cta');
                }
            }, { once: false });
        }

        // 次 CTA：重新綁定非主按鈕的 booking 連結追蹤
        document.querySelectorAll('[data-booking-source]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (typeof ICDAnalytics !== 'undefined') {
                    ICDAnalytics.trackBookingClick(r.role, r.maturity?.level, btn.dataset.bookingSource || 'secondary');
                }
            }, { once: false });
        });

        // Pre-fill lead form
        const leadName = document.getElementById('leadName');
        const leadCompany = document.getElementById('leadCompany');
        if (leadName) leadName.value = r.info.name;
        if (leadCompany) leadCompany.value = r.info.company;
    }

    function renderRadarChart(modelScores) {
        const ctx = document.getElementById('radarChart');
        if (!ctx) return;

        // Destroy existing chart
        if (ctx._chart) ctx._chart.destroy();

        const labels = MODEL_ORDER.map(m => MODEL_LABELS[m]);
        const data = MODEL_ORDER.map(m => modelScores[m]?.score || 0);

        ctx._chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: ROLE_LABELS[state.selectedRole] || '',
                    data: data,
                    backgroundColor: 'rgba(0, 51, 102, 0.1)',
                    borderColor: '#003366',
                    borderWidth: 2,
                    pointBackgroundColor: '#003366',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            font: { size: 10 },
                            backdropColor: 'transparent'
                        },
                        pointLabels: {
                            font: { size: 12, family: "'Noto Sans TC', sans-serif" }
                        },
                        grid: { color: 'rgba(0,0,0,0.06)' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    function renderModelScores(modelScores) {
        const container = document.getElementById('modelScores');
        if (!container) return;

        container.innerHTML = MODEL_ORDER.map(model => {
            const ms = modelScores[model];
            const score = ms?.score || 0;
            const maturity = state.scoringConfig.maturityLevels.find(l => score >= l.min && score <= l.max);
            const color = maturity?.color || '#757575';

            return `<div class="icd-model-score-card">
                <h4>${MODEL_LABELS[model]}</h4>
                <div class="icd-model-score-value" style="color: ${color}">${score}</div>
                <div class="icd-model-score-bar">
                    <div class="icd-model-score-bar-fill" style="width: ${score}%; background: ${color}"></div>
                </div>
            </div>`;
        }).join('');
    }

    function renderRiskFlags(rules) {
        const container = document.getElementById('riskFlags');
        if (!container) return;

        if (rules.length === 0) {
            container.innerHTML = '<div class="icd-no-risks">未偵測到重大風險，整體表現穩健。</div>';
            return;
        }

        container.innerHTML = rules.map(rule => `
            <div class="icd-risk-card severity-${rule.severity}">
                <div class="icd-risk-severity">${rule.severity.toUpperCase()}</div>
                <div class="icd-risk-content">
                    <h4>${rule.flag || rule.name}</h4>
                    <p>${rule.insight || rule.message || ''}</p>
                </div>
            </div>
        `).join('');
    }

    function renderActions(actions) {
        const container = document.getElementById('actionItems');
        if (!container) return;

        if (actions.length === 0) {
            container.innerHTML = '<p style="color:var(--text-light);font-size:0.88rem;">目前無需優先處理的行動項目。</p>';
            return;
        }

        container.innerHTML = actions.map(a => `
            <div class="icd-action-card">
                <div class="icd-action-priority">${a.priority}</div>
                <div class="icd-action-content">
                    <p>${a.text}</p>
                    <span class="icd-action-timeframe">${a.timeframe || ''}</span>
                </div>
            </div>
        `).join('');
    }

    function renderRoleFeedback(r) {
        const container = document.getElementById('roleFeedback');
        if (!container) return;

        const templates = state.diagnosticRules?.roleActionTemplates?.[r.role];
        if (!templates) {
            container.innerHTML = '';
            return;
        }

        // Pick based on score
        const strengthIdx = r.overallScore >= 70 ? 0 : (r.overallScore >= 55 ? 1 : 2);
        const improveIdx = r.overallScore >= 70 ? 0 : (r.overallScore >= 55 ? 1 : 2);

        container.innerHTML = `
            <div class="icd-feedback-card icd-feedback-strength">
                <h4>優勢回饋</h4>
                <ul>${templates.strengthMessages.map(m => `<li>${m}</li>`).join('')}</ul>
            </div>
            <div class="icd-feedback-card icd-feedback-improve">
                <h4>改善建議</h4>
                <ul>${templates.improvementMessages.map(m => `<li>${m}</li>`).join('')}</ul>
            </div>
        `;
    }

    function renderCompleteness(r) {
        const container = document.getElementById('completenessDetail');
        if (!container) return;

        const items = [
            { label: '問卷', value: r.questionCompleteness, color: '#003366' },
            { label: '資料上傳', value: r.dataCompleteness, color: '#1565c0' }
        ];

        let html = items.map(item => `
            <div class="icd-completeness-bar-wrap">
                <span class="icd-completeness-label">${item.label}</span>
                <div class="icd-completeness-bar">
                    <div class="icd-completeness-bar-fill" style="width: ${item.value}%; background: ${item.color}"></div>
                </div>
                <span class="icd-completeness-value">${item.value}%</span>
            </div>
        `).join('');

        if (r.completeness < 60) {
            html += '<div class="icd-completeness-note">資料完備度偏低，建議補充回答或上傳資料以提升診斷精度。</div>';
        }

        container.innerHTML = html;
    }

    // --- Lead Form ---
    function submitLead() {
        const name = document.getElementById('leadName').value.trim();
        const email = document.getElementById('leadEmail').value.trim();

        if (!name || !email) {
            showToast('請填寫姓名與 Email');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('請輸入有效的 Email 地址');
            return;
        }

        const leadData = {
            name: name,
            email: email,
            phone: document.getElementById('leadPhone').value.trim(),
            company: document.getElementById('leadCompany').value.trim(),
            source: 'ic-diagnostic',
            role: state.selectedRole,
            score: state.result?.overallScore,
            maturity: state.result?.maturity?.level,
            timestamp: new Date().toISOString()
        };

        // 優先使用 ICDService.DataStore 儲存留資
        if (typeof ICDService !== 'undefined') {
            ICDService.DataStore.saveLead(leadData);
        } else {
            // fallback：直接寫 localStorage
            try {
                const leads = JSON.parse(localStorage.getItem('icd_leads') || '[]');
                leads.unshift(leadData);
                localStorage.setItem('icd_leads', JSON.stringify(leads));
            } catch (e) { /* ignore */ }
        }

        // 10.5 追蹤：留資送出
        if (typeof ICDAnalytics !== 'undefined') {
            ICDAnalytics.trackLeadSubmit(
                state.selectedRole,
                state.result?.overallScore,
                state.result?.maturity?.level
            );
        }

        showToast('感謝您的留資！我們的顧問團隊將盡快與您聯繫。');

        // Disable form
        document.querySelector('.icd-lead-form .btn').disabled = true;
        document.querySelector('.icd-lead-form .btn').textContent = '已送出';
    }

    // --- Copy Summary ---
    function copySummary() {
        const r = state.result;
        if (!r) return;

        // 優先使用 ICDService 的 Recommendation 模組
        let summary;
        if (typeof ICDService !== 'undefined') {
            summary = ICDService.Recommendation.generateSummaryText(r, MODEL_LABELS, ROLE_LABELS);
        } else {
            // fallback 內建摘要生成
            const risks = (r.triggeredRules || []).map(rule => `- ${rule.flag || rule.name}`).join('\n') || '（無）';
            const actions = (r.topActions || []).slice(0, 3).map(a => `- [${a.priority}] ${a.text}`).join('\n') || '（無）';
            summary = `IC 產業人才轉型診斷摘要
公司：${r.info.company}
受診者：${r.info.name}
角色：${ROLE_LABELS[r.role]}
日期：${new Date(r.timestamp).toLocaleDateString('zh-TW')}

總分：${r.overallScore} / 100
成熟度：Level ${r.maturity.level} — ${r.maturity.label}
${MODEL_ORDER.map(m => `${MODEL_LABELS[m]}：${r.modelScores[m]?.score || 0}`).join(' | ')}

風險紅旗：
${risks}

優先行動建議：
${actions}

— 核心顧問有限公司`;
        }

        navigator.clipboard.writeText(summary).then(() => {
            showToast('診斷摘要已複製到剪貼簿');
        }).catch(() => {
            showToast('複製失敗，請手動複製');
        });
    }

    // --- Restart ---
    function restart() {
        state.selectedRole = null;
        state.questions = [];
        state.answers = {};
        state.questionGroups = [];
        state.currentGroupIndex = 0;
        state.info = {};
        state.uploadedFile = null;
        state.result = null;
        showView('diagnostic');
    }

    // --- Restore from localStorage ---
    function tryRestoreResult() {
        try {
            const saved = localStorage.getItem('icd_last_result');
            if (saved) {
                state.result = JSON.parse(saved);
                state.selectedRole = state.result.role;
                renderResult();
                showView('result');
                return;
            }
        } catch (e) { /* ignore */ }
        showView('intro');
    }

    // ============================================================
    // AI 智慧顧問分析
    // ============================================================

    let _aiGeneratedText = ''; // Store for copy/email

    function buildDiagnosticPrompt(r) {
        const info = r.info || {};
        const roleLabel = ROLE_LABELS[r.role] || r.role;
        const ms = r.modelScores || {};

        const modelSummary = [
            `營收模型：${ms.revenue?.score ?? '—'}/100`,
            `毛利模型：${ms.grossprofit?.score ?? '—'}/100`,
            `費效模型：${ms.expense?.score ?? '—'}/100`,
            `貢獻模型：${ms.contribution?.score ?? '—'}/100`,
            `能力與協同：${ms.capability?.score ?? '—'}/100`
        ].join('、');

        const rulesText = (r.triggeredRules || []).length > 0
            ? (r.triggeredRules || []).map(rule =>
                `【${rule.severity === 'high' ? '高風險' : rule.severity === 'medium' ? '中風險' : '低風險'}】${rule.flag}：${rule.insight}`
              ).join('\n')
            : '無顯著風險規則觸發';

        const customerTypesText = (info.customerTypes || []).join('、') || '未填寫';
        const challengeText = info.challenge ? `\n- 最大挑戰：${info.challenge}` : '';
        const goalText = info.goal ? `\n- 診斷目標：${info.goal}` : '';
        const experienceText = info.experience ? `、${info.experience}年資` : '';

        return `你是一位資深的 IC 通路商人才轉型顧問，擁有 20 年的半導體通路產業實戰經驗，曾輔導過台灣、中國、東南亞超過 50 家 IC 代理商完成組織轉型。

【診斷對象】
- 姓名：${info.name || '受診者'}${info.title ? '，' + info.title : ''}
- 公司：${info.company || '受診公司'}（${info.size || '規模未填'}${experienceText}）
- 角色：${roleLabel}
- 主要代理品牌：${info.products || '未填寫'}
- 主要客戶類型：${customerTypesText}${challengeText}${goalText}

【診斷結果】
- 總分：${r.overallScore}/100
- 成熟度等級：Level ${r.maturity?.level} — ${r.maturity?.label}（${r.maturity?.description || ''}）
- 資料完備度：${r.completeness}%
- 五模型分析：${modelSummary}

【風險診斷（觸發規則）】
${rulesText}

請以繁體中文、資深顧問的專業語氣，針對以上診斷數據提供以下四個面向的深度分析（請使用 Markdown 格式，## 為大標，**粗體** 強調重點）：

## 一、執行長視角摘要
（200字以內）以 CEO/董事長視角，點出這份診斷結果最核心的 2-3 個策略意涵。不要泛泛而談，要直指核心問題與競爭力缺口。

## 二、三大轉型突破口
列出三個最具潛力的改善方向，每個包含：突破口名稱、現況問題診斷（2句）、建議行動（2句）、預期效果（1句）。要非常具體，避免官話。

## 三、90 天快贏行動計劃
按月份列出 9 個具體、可立即執行的行動：
**第一個月（立即啟動）**：3 個行動（附上具體做法）
**第二個月（深化執行）**：3 個行動（附上具體做法）
**第三個月（制度化固化）**：3 個行動（附上具體做法）

## 四、IC 產業特有洞察
（100字以內）結合 2025-2026 年半導體通路市場趨勢（如：原廠直銷壓力、AI 需求帶動的新商機、設計導入的重要性上升），給予這個職位/公司規模在當前市場環境下的特有建議。

最後加上一段簡短的顧問鼓勵語（2-3句），讓受診者感受到被理解和被支持。`;
    }

    function renderMarkdown(text) {
        if (!text) return '';
        return text
            // H2 headings
            .replace(/^## (.+)$/gm, '<h3 class="icd-ai-h3">$1</h3>')
            // Bold
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            // Bullet points
            .replace(/^[-•] (.+)$/gm, '<li>$1</li>')
            // Wrap consecutive <li> in <ul>
            .replace(/(<li>.*<\/li>\n?)+/gs, match => `<ul class="icd-ai-list">${match}</ul>`)
            // Numbered list
            .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
            // Paragraph breaks
            .replace(/\n{2,}/g, '</p><p class="icd-ai-p">')
            // Wrap in paragraph
            .replace(/^(?!<[hul])(.+)$/gm, (m, p1) => p1.startsWith('<') ? m : `<p class="icd-ai-p">${m}</p>`)
            // Clean up empty tags
            .replace(/<p class="icd-ai-p"><\/p>/g, '');
    }

    function typewriterEffect(htmlContent, container, onDone) {
        // Strip HTML, type plain text, then swap to HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';

        let i = 0;
        container.style.display = 'block';
        container.innerHTML = '';

        // Type character by character (fast mode: every 8ms)
        const interval = setInterval(() => {
            i += 3; // Advance 3 chars at a time for speed
            if (i >= plainText.length) {
                clearInterval(interval);
                // Replace with formatted HTML
                container.innerHTML = htmlContent;
                if (onDone) onDone();
            } else {
                container.textContent = plainText.slice(0, i) + '▌';
            }
        }, 12);
    }

    async function generateAIAnalysis() {
        const proxyUrl = (typeof AI_PROXY_URL !== 'undefined') ? AI_PROXY_URL : '';
        const aiEnabled = (typeof AI_ENABLED !== 'undefined') ? AI_ENABLED : false;

        if (!aiEnabled || !proxyUrl) {
            showAIError('AI 分析功能尚未啟用。請聯繫管理員設定 AI 服務。');
            return;
        }

        if (!state.result) {
            showAIError('找不到診斷結果，請重新完成診斷。');
            return;
        }

        // UI: loading state
        document.getElementById('aiGenerateBtn').style.display = 'none';
        document.getElementById('aiLoading').style.display = 'flex';
        document.getElementById('aiContent').style.display = 'none';
        document.getElementById('aiActions').style.display = 'none';
        document.getElementById('aiError').style.display = 'none';

        // Track
        if (typeof ICDAnalytics !== 'undefined') {
            ICDAnalytics.trackAIGenerate(state.selectedRole, state.result?.maturity?.level, 'start');
        }

        try {
            const prompt = buildDiagnosticPrompt(state.result);
            const res = await fetch(proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ prompt: prompt, max_tokens: 2000, action: 'analyze' })
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'AI 服務錯誤');

            _aiGeneratedText = data.content;
            const html = renderMarkdown(data.content);

            document.getElementById('aiLoading').style.display = 'none';
            const contentEl = document.getElementById('aiContent');

            typewriterEffect(html, contentEl, () => {
                document.getElementById('aiActions').style.display = 'block';
                // Track success
                if (typeof ICDAnalytics !== 'undefined') {
                    ICDAnalytics.trackAIGenerate(state.selectedRole, state.result?.maturity?.level, 'success');
                }
            });

        } catch (err) {
            console.error('AI analysis error:', err);
            document.getElementById('aiLoading').style.display = 'none';
            showAIError('AI 分析失敗：' + (err.message || '請稍後重試'));
            if (typeof ICDAnalytics !== 'undefined') {
                ICDAnalytics.trackAIGenerate(state.selectedRole, state.result?.maturity?.level, 'error');
            }
        }
    }

    function showAIError(msg) {
        document.getElementById('aiError').style.display = 'flex';
        document.getElementById('aiErrorMsg').textContent = msg;
        document.getElementById('aiGenerateBtn').style.display = 'inline-flex';
        document.getElementById('aiLoading').style.display = 'none';
    }

    function regenerateAI() {
        document.getElementById('aiContent').style.display = 'none';
        document.getElementById('aiActions').style.display = 'none';
        document.getElementById('aiGenerateBtn').style.display = 'inline-flex';
        _aiGeneratedText = '';
        generateAIAnalysis();
    }

    function copyAIAnalysis() {
        const text = _aiGeneratedText || document.getElementById('aiContent')?.textContent || '';
        if (!text) { showToast('尚未生成 AI 分析'); return; }
        navigator.clipboard.writeText(text).then(() => {
            showToast('AI 分析已複製到剪貼簿');
        }).catch(() => showToast('複製失敗，請手動選取文字複製'));
    }

    async function sendAIReport() {
        const email = document.getElementById('aiEmailInput')?.value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('請輸入有效的 Email 地址');
            return;
        }

        const proxyUrl = (typeof AI_PROXY_URL !== 'undefined') ? AI_PROXY_URL : '';
        if (!proxyUrl) { showToast('Email 功能尚未設定'); return; }

        const r = state.result;
        const btn = document.querySelector('.icd-ai-email-row .btn');
        if (btn) { btn.disabled = true; btn.textContent = '發送中...'; }

        try {
            const res = await fetch(proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    action: 'email',
                    email: email,
                    name: r?.info?.name || '',
                    company: r?.info?.company || '',
                    role: ROLE_LABELS[r?.role] || r?.role,
                    score: r?.overallScore,
                    level: r?.maturity?.level,
                    aiContent: _aiGeneratedText
                })
            });
            const data = await res.json();
            if (data.success) {
                showToast('AI 分析報告已發送到您的信箱！');
                if (btn) { btn.textContent = '✓ 已發送'; }
                if (typeof ICDAnalytics !== 'undefined') {
                    ICDAnalytics.trackEmailSend(r?.role, r?.maturity?.level);
                }
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            showToast('Email 發送失敗：' + (err.message || '請稍後重試'));
            if (btn) { btn.disabled = false; btn.textContent = '📧 Email 此報告'; }
        }
    }

    function downloadPDF() {
        if (typeof ICDAnalytics !== 'undefined' && state.result) {
            ICDAnalytics.trackPDFDownload(state.selectedRole, state.result?.maturity?.level);
        }
        // Add print class to show PDF-optimized layout
        document.body.classList.add('icd-print-mode');
        setTimeout(() => {
            window.print();
            setTimeout(() => document.body.classList.remove('icd-print-mode'), 1000);
        }, 100);
    }

    // --- Toast ---
    function showToast(msg) {
        const toast = document.getElementById('icdToast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // --- Init on load ---
    document.addEventListener('DOMContentLoaded', init);

    // --- Public API ---
    return {
        showView,
        selectRole,
        nextStep,
        prevStep,
        selectAnswer,
        handleUpload,
        removeUpload,
        skipUpload,
        copySummary,
        submitLead,
        restart,
        generateAIAnalysis,
        regenerateAI,
        copyAIAnalysis,
        sendAIReport,
        downloadPDF
    };
})();
