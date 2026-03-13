// === Dynamic Report Engine for AI Assessment ===
// Reads sessionStorage data from assessment.js, computes scores, generates report

(function () {
    'use strict';

    // ====== 1. Load assessment data ======
    const raw = sessionStorage.getItem('assessmentData');
    if (!raw) {
        showNoDataScreen();
        return;
    }

    let data;
    try {
        data = JSON.parse(raw);
    } catch (e) {
        showNoDataScreen();
        return;
    }

    const answers = data.answers || {};
    const notes = data.notes || {};

    // ====== 2. Dimension scoring ======
    // Six dimensions, each with 5 questions (Q1-Q5, Q6-Q10, ..., Q26-Q30)
    const DIMENSIONS = [
        { key: 'strategy', name: '企業戰略與決策', questions: [1, 2, 3, 4, 5] },
        { key: 'process', name: '營運流程成熟度', questions: [6, 7, 8, 9, 10] },
        { key: 'data', name: '數據與資料能力', questions: [11, 12, 13, 14, 15] },
        { key: 'tech', name: '技術與系統基礎', questions: [16, 17, 18, 19, 20] },
        { key: 'governance', name: 'AI 策略與治理', questions: [21, 22, 23, 24, 25] },
        { key: 'culture', name: '組織文化與人才', questions: [26, 27, 28, 29, 30] }
    ];

    const RADAR_LABELS = ['戰略決策', '流程成熟度', '數據能力', '技術基礎', 'AI治理', '組織文化'];

    // Question types: 'scale5' (radio 1-5), 'scale10' (rating 1-10), 'multi' (checkbox), 'choice' (single non-numeric)
    const Q_TYPES = {
        1: 'scale5', 2: 'scale5', 3: 'multi', 4: 'scale10', 5: 'choice',
        6: 'scale5', 7: 'scale10', 8: 'multi', 9: 'scale5', 10: 'choice',
        11: 'scale5', 12: 'scale10', 13: 'scale5', 14: 'multi', 15: 'scale5',
        16: 'multi', 17: 'scale5', 18: 'scale5', 19: 'scale10', 20: 'scale5',
        21: 'scale5', 22: 'scale5', 23: 'scale10', 24: 'multi', 25: 'scale5',
        26: 'scale10', 27: 'scale5', 28: 'scale5', 29: 'scale5', 30: 'choice'
    };

    // Score a single question (normalized to 0-100)
    function scoreQuestion(qNum) {
        const val = answers['q' + qNum];
        if (!val) return null; // unanswered
        const type = Q_TYPES[qNum];

        if (type === 'scale5') {
            return (parseInt(val) / 5) * 100;
        }
        if (type === 'scale10') {
            return (parseInt(val) / 10) * 100;
        }
        if (type === 'multi') {
            // More selections = higher awareness/complexity — cap at 5 items = 100
            const items = Array.isArray(val) ? val : [val];
            return Math.min(items.length / 5, 1) * 100;
        }
        if (type === 'choice') {
            // Non-numeric choices get a neutral 50 (these are qualitative)
            return 50;
        }
        return 50;
    }

    // Compute dimension scores
    const dimScores = DIMENSIONS.map(dim => {
        const scores = dim.questions.map(q => scoreQuestion(q)).filter(s => s !== null);
        const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        return { ...dim, score: avg };
    });

    const totalScore = Math.round(dimScores.reduce((a, d) => a + d.score, 0) / dimScores.length);

    // ====== 3. Maturity stage ======
    function getStage(score) {
        if (score >= 80) return { name: '領先期', desc: '企業 AI 能力成熟，已進入規模化應用與持續優化階段，具備領先同業的數位競爭力。' };
        if (score >= 60) return { name: '整合期', desc: '企業已有基礎條件，正在整合資源與流程以推動 AI 導入，需聚焦突破瓶頸。' };
        if (score >= 40) return { name: '探索期', desc: '企業對 AI 有初步認知，但在數據、流程、組織等方面仍有較大提升空間。' };
        return { name: '起步期', desc: '企業數位化程度偏低，建議從基礎數位化與資料盤點開始，為 AI 導入打好地基。' };
    }

    function getDimLevel(score) {
        if (score >= 80) return '成熟';
        if (score >= 60) return '發展中';
        if (score >= 40) return '初步建立';
        return '待強化';
    }

    function getDimBarClass(score) {
        if (score >= 70) return 'score-high';
        if (score >= 50) return 'score-mid';
        return 'score-low';
    }

    const stage = getStage(totalScore);

    // ====== 4. Populate header ======
    setText('resultCompanyName', data.companyName || '未填寫公司名稱');
    setText('resultUserName', data.userName || '未填寫');
    setText('resultJobTitle', data.jobTitle || '未填寫');
    setText('resultIndustry', data.industry || '未填寫');
    setText('resultDate', formatDate(data.timestamp));

    // ====== 5. Score overview ======
    const scoreCircle = document.querySelector('.result-score-circle');
    const scoreValue = document.querySelector('.result-score-value');
    const stageName = document.querySelector('.result-stage-name');
    const stageDesc = document.querySelector('.result-stage-desc');

    if (scoreCircle) scoreCircle.style.setProperty('--score', totalScore);
    if (scoreValue) scoreValue.innerHTML = totalScore + '<span>%</span>';
    if (stageName) stageName.textContent = stage.name;
    if (stageDesc) stageDesc.textContent = stage.desc;

    // ====== 6. Dimension bars ======
    const dimContainer = document.querySelector('.result-dims');
    if (dimContainer) {
        dimContainer.innerHTML = dimScores.map(d => `
            <div class="result-dim-item">
                <div class="result-dim-score">${d.score}</div>
                <div class="result-dim-info">
                    <h4>${d.name}</h4>
                    <div class="result-dim-bar"><div class="result-dim-bar-fill ${getDimBarClass(d.score)}" style="width:${d.score}%"></div></div>
                    <span class="result-dim-level">${getDimLevel(d.score)}</span>
                </div>
            </div>
        `).join('');
    }

    // ====== 7. Radar chart ======
    drawRadarChart(dimScores.map(d => d.score));

    // ====== 8. AI Analysis ======
    const analysisEl = document.querySelector('.result-analysis-text');
    if (analysisEl) {
        analysisEl.innerHTML = generateAnalysis(data, dimScores, totalScore, stage);
    }

    // ====== 9. Priority improvements ======
    const priorityList = document.querySelector('.result-priority-list');
    if (priorityList) {
        priorityList.innerHTML = generatePriorities(data, dimScores, answers);
    }

    // ====== 10. Industry AI scenarios ======
    const scenarioContainer = document.querySelector('.result-scenarios');
    if (scenarioContainer) {
        scenarioContainer.innerHTML = generateScenarios(data, answers);
    }

    // ====== 11. Analysis logic explanation ======
    const logicSection = document.querySelectorAll('.result-section')[3]; // 4th section
    if (logicSection) {
        const logicText = logicSection.querySelector('.result-analysis-text');
        if (logicText) {
            logicText.innerHTML = generateLogicExplanation(data, dimScores, answers, totalScore);
        }
    }

    // ====== 12. Recommended consulting plans ======
    const solutionsContainer = document.querySelector('.result-solutions');
    if (solutionsContainer) {
        solutionsContainer.innerHTML = generateSolutions(totalScore, stage);
    }

    // ====== 13. Roadmap ======
    const roadmapContainer = document.querySelector('.result-roadmap');
    if (roadmapContainer) {
        roadmapContainer.innerHTML = generateRoadmap(totalScore, dimScores, data);
    }

    // ========================================
    // Helper Functions
    // ========================================

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function formatDate(ts) {
        try {
            const d = new Date(ts);
            return d.getFullYear() + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getDate()).padStart(2, '0');
        } catch (e) {
            const now = new Date();
            return now.getFullYear() + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + String(now.getDate()).padStart(2, '0');
        }
    }

    function showNoDataScreen() {
        const wrapper = document.querySelector('.result-wrapper');
        if (!wrapper) return;
        wrapper.innerHTML = `
            <div style="text-align:center; padding:120px 20px;">
                <div style="font-size:64px; margin-bottom:24px;">📋</div>
                <h2 style="color:#0a1628; margin-bottom:16px;">尚未完成診斷問卷</h2>
                <p style="color:#64748b; font-size:1.1rem; margin-bottom:32px; line-height:1.8;">
                    此報告頁面需要先完成 AI 智慧導入診斷問卷，<br>
                    系統將根據您的回答自動產出專屬診斷報告。
                </p>
                <div style="background:#f0fdf9; border:1px solid #00d4aa; border-radius:12px; padding:24px; max-width:500px; margin:0 auto 32px; text-align:left;">
                    <h4 style="color:#0a1628; margin-bottom:12px;">報告將包含：</h4>
                    <ul style="color:#475569; line-height:2; list-style:none; padding:0;">
                        <li>✅ 六大構面 AI 成熟度評分與雷達圖</li>
                        <li>✅ 依據產業特性的 AI 自動診斷分析</li>
                        <li>✅ 優先改善項目與判斷依據</li>
                        <li>✅ 產業專屬 AI 落地場景建議</li>
                        <li>✅ 建議顧問方案與 AI 導入路線圖</li>
                    </ul>
                </div>
                <a href="navigator.html" class="btn btn-primary" style="font-size:1.1rem; padding:14px 40px;">
                    前往 AI 智慧診斷 →
                </a>
            </div>
        `;
    }

    // ====== Radar Chart ======
    function drawRadarChart(scores) {
        const canvas = document.getElementById('radarChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = 280, h = 280;
        canvas.width = w * 2; canvas.height = h * 2;
        ctx.scale(2, 2);
        const cx = w / 2, cy = h / 2, r = 100;
        const n = scores.length;

        function getPoint(i, val) {
            const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
            return { x: cx + Math.cos(angle) * val, y: cy + Math.sin(angle) * val };
        }

        // Grid
        [20, 40, 60, 80, 100].forEach(level => {
            ctx.beginPath();
            for (let i = 0; i <= n; i++) {
                const p = getPoint(i % n, level * r / 100);
                if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
            }
            ctx.closePath();
            ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 0.5; ctx.stroke();
        });

        // Axes
        for (let i = 0; i < n; i++) {
            const p = getPoint(i, r);
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 0.5; ctx.stroke();
        }

        // Data polygon
        ctx.beginPath();
        scores.forEach((d, i) => {
            const p = getPoint(i, d * r / 100);
            if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 212, 170, 0.15)'; ctx.fill();
        ctx.strokeStyle = '#00d4aa'; ctx.lineWidth = 2; ctx.stroke();

        // Points
        scores.forEach((d, i) => {
            const p = getPoint(i, d * r / 100);
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#00d4aa'; ctx.fill();
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        });

        // Labels
        ctx.fillStyle = '#4a5568'; ctx.font = '11px "Noto Sans TC", sans-serif'; ctx.textAlign = 'center';
        RADAR_LABELS.forEach((label, i) => {
            const p = getPoint(i, r + 18);
            ctx.fillText(label, p.x, p.y + 4);
        });
    }

    // ====== AI Analysis Text ======
    function generateAnalysis(data, dims, total, stage) {
        const sorted = [...dims].sort((a, b) => b.score - a.score);
        const best = sorted[0];
        const worst = sorted[sorted.length - 1];
        const secondWorst = sorted[sorted.length - 2];

        let html = `<p>根據診斷結果，${data.companyName} 目前處於 AI 導入的「<strong>${stage.name}</strong>」，整體成熟度為 <strong>${total} 分</strong>。`;
        html += `企業在<strong>${best.name}</strong>方面表現最為突出（${best.score} 分），`;
        html += getBestDimInsight(best);
        html += `</p><br>`;

        html += `<p>然而，<strong>${worst.name}</strong>（${worst.score} 分）和 <strong>${secondWorst.name}</strong>（${secondWorst.score} 分）為目前最需優先強化的領域。`;
        html += getWeakDimInsight(worst, secondWorst);
        html += `</p><br>`;

        // Add context from specific answers
        const q5val = answers.q5;
        const q10val = answers.q10;
        if (q5val || q10val) {
            html += `<p>`;
            if (q5val) html += `企業最希望 AI 優先解決的場景為「${q5val}」，`;
            if (q10val) html += `而流程改善最大阻力為「${getQ10Label(q10val)}」，`;
            html += `建議在制定導入策略時優先考慮這些因素，選擇能快速展現成果的切入點，建立內部信心後再逐步擴展。</p>`;
        }

        return html;
    }

    function getBestDimInsight(dim) {
        const insights = {
            strategy: '顯示高層對 AI 的關注度較高且具備策略思維，這是推動 AI 導入的重要驅動力。',
            process: '顯示企業流程已有一定的標準化與系統化基礎，為 AI 應用提供了良好的流程條件。',
            data: '顯示企業在資料管理方面有較好的基礎，具備支撐 AI 應用的資料條件。',
            tech: '顯示企業技術基礎設施較為完善，系統整合度較高，有利於 AI 工具的快速部署。',
            governance: '顯示企業已有較成熟的 AI 策略規劃與治理意識，為規模化導入奠定了管理基礎。',
            culture: '顯示團隊對新技術的接受度高且具備一定的變革管理經驗，這是推動 AI 導入的重要優勢。'
        };
        return insights[dim.key] || '';
    }

    function getWeakDimInsight(worst, secondWorst) {
        const insights = {
            strategy: '高層對 AI 的認知與投入有待加強，建議盡快安排高層共識工作坊，讓決策層理解 AI 的戰略價值。',
            process: '流程標準化程度不足，直接影響 AI 應用的效果，建議先進行流程盤點與標準化。',
            data: '資料基礎薄弱，建議優先建立資料治理機制，確保資料品質與可用性。',
            tech: '技術基礎有待加強，建議評估系統整合與雲端化的優先順序。',
            governance: 'AI 策略與治理框架尚未建立，建議制定明確的 AI 導入目標與風險管理機制。',
            culture: '組織文化與人才儲備有待提升，建議啟動內部培訓計畫並培養 AI 推手。'
        };
        return insights[worst.key] + ' 同時，' + (insights[secondWorst.key] || '');
    }

    function getQ10Label(val) {
        const map = {
            '習慣阻力': '員工習慣原有做法',
            '缺乏工具': '缺乏合適的數位工具',
            '管理層不支持': '管理層支持不足',
            '預算限制': '預算有限',
            '不知從何開始': '不知從何下手'
        };
        return map[val] || val;
    }

    // ====== Priority Improvements ======
    function generatePriorities(data, dims, ans) {
        const priorities = [];
        const sorted = [...dims].sort((a, b) => a.score - b.score);

        // Priority based on weakest dimensions
        sorted.slice(0, 3).forEach((dim, i) => {
            const p = getPriorityForDim(dim, ans, data);
            if (p) {
                p.rank = i + 1;
                priorities.push(p);
            }
        });

        // Add a strategic priority from Q5 (desired AI scenario)
        const q5p = getQ5Priority(ans, data);
        if (q5p) {
            q5p.rank = priorities.length + 1;
            priorities.push(q5p);
        }

        return priorities.map(p => `
            <div class="result-priority-item">
                <h4>${p.rank}. ${p.title}</h4>
                <p>${p.desc}</p>
                <div class="result-priority-basis">判斷依據：${p.basis}</div>
            </div>
        `).join('');
    }

    function getPriorityForDim(dim, ans, data) {
        const templates = {
            strategy: {
                title: '強化高階支持與策略整合',
                desc: '將 AI 導入議題提升至高層決策層級，制定明確的數位轉型策略文件，並撥出專項預算，確保 AI 專案有充足的資源與推動力。',
                basis: getBasis(dim, ans, [1, 2, 4])
            },
            process: {
                title: '優化核心流程標準化與系統覆蓋',
                desc: '針對最耗費人力的業務流程進行盤點，建立標準作業程序（SOP），並逐步將手動環節數位化，為 AI 應用打好流程基礎。',
                basis: getBasis(dim, ans, [6, 7, 9])
            },
            data: {
                title: '建立基礎資料治理與整合機制',
                desc: '將分散在不同系統中的業務資料進行盤點，建立統一的資料標準與清洗流程，指定專責窗口管理資料品質，為 AI 應用奠定資料基礎。',
                basis: getBasis(dim, ans, [11, 12, 15])
            },
            tech: {
                title: '強化系統整合與技術基礎建設',
                desc: '優先解決系統間資料串接的斷點，評估雲端化策略，並逐步提升 IT 團隊的技術能力，確保具備部署 AI 工具的技術條件。',
                basis: getBasis(dim, ans, [17, 18, 20])
            },
            governance: {
                title: '制定明確的 AI 導入策略與 KPI',
                desc: '結合企業戰略目標，設定可量化的 AI 導入階段性指標，建立跨部門推動組織，並制定基本的 AI 使用規範與風險管理機制。',
                basis: getBasis(dim, ans, [21, 22, 25])
            },
            culture: {
                title: '啟動內部 AI 培訓與變革管理',
                desc: '規劃系統化的 AI 基礎培訓計畫，培養內部 AI 推手與種子教師，同時借鑑過往變革經驗建立推動方法論，降低導入阻力。',
                basis: getBasis(dim, ans, [26, 27, 28])
            }
        };
        return templates[dim.key] || null;
    }

    function getBasis(dim, ans, qNums) {
        const parts = [];
        qNums.forEach(q => {
            const val = ans['q' + q];
            if (val) {
                const label = getQuestionShortLabel(q);
                if (typeof val === 'string' && !isNaN(val)) {
                    const level = parseInt(val) <= 2 ? '偏低' : parseInt(val) <= 3 ? '中等' : '較高';
                    parts.push(`${label}${level}（Q${q}）`);
                } else if (Array.isArray(val)) {
                    parts.push(`${label}：${val.slice(0, 2).join('、')}（Q${q}）`);
                } else {
                    parts.push(`${label}：${val}（Q${q}）`);
                }
            }
        });
        return parts.join('、') || `${dim.name}構面得分 ${dim.score} 分，低於平均水準`;
    }

    function getQuestionShortLabel(q) {
        const labels = {
            1: '高層參與度', 2: '策略納入程度', 4: '預算配置意願',
            6: 'SOP 建置程度', 7: '跨部門協作', 9: '系統覆蓋率',
            11: '資料儲存方式', 12: '資料品質滿意度', 15: '資料管理專責',
            17: '系統串接程度', 18: 'AI 工具採用', 19: 'IT 能力', 20: '雲端採用',
            21: 'AI 目標設定', 22: '治理規範', 25: '推動組織',
            26: '新技術接受度', 27: '培訓計畫', 28: 'AI 專業人才'
        };
        return labels[q] || 'Q' + q;
    }

    function getQ5Priority(ans, data) {
        const q5 = ans.q5;
        if (!q5) return null;
        const scenarios = {
            '提升營運效率': {
                title: '導入流程自動化以提升營運效率',
                desc: '針對最耗費人力的重複性工作，導入 RPA 或 AI 自動化工具，快速產生可量化的效率提升成果。',
                basis: '最希望 AI 解決的場景為「提升營運效率」（Q5）'
            },
            '強化客戶經營': {
                title: '優化客戶開發與銷售流程',
                desc: '針對客戶經營瓶頸，導入 AI 輔助的客戶分析、智能推薦與自動化溝通機制，提升業務團隊的精準度與效率。',
                basis: '最希望 AI 解決的場景為「強化客戶經營」（Q5）'
            },
            '優化供應鏈': {
                title: '建立智慧供應鏈管理',
                desc: '運用 AI 進行需求預測、智慧排程與庫存優化，降低供應鏈風險與成本。',
                basis: '最希望 AI 解決的場景為「優化供應鏈」（Q5）'
            },
            '輔助決策分析': {
                title: '建立數據驅動決策體系',
                desc: '建置 AI 驅動的商業智慧儀表板與異常偵測系統，讓管理層能即時掌握關鍵指標並做出精準決策。',
                basis: '最希望 AI 解決的場景為「輔助決策分析」（Q5）'
            },
            '知識管理': {
                title: '建立企業 AI 知識庫系統',
                desc: '導入 AI 智能文件檢索與知識管理系統，讓員工透過自然語言快速找到所需資訊，加速經驗傳承。',
                basis: '最希望 AI 解決的場景為「知識管理」（Q5）'
            },
            '品質管控': {
                title: '導入 AI 智慧品質檢測',
                desc: '運用 AI 視覺辨識或數據分析技術，建立智能品質檢測系統，提升良率並降低人工檢測成本。',
                basis: '最希望 AI 解決的場景為「品質管控」（Q5）'
            }
        };
        return scenarios[q5] || null;
    }

    // ====== Industry AI Scenarios ======
    function generateScenarios(data, ans) {
        const industry = data.industry || '';
        const q5 = ans.q5 || '';
        const q3 = ans.q3 || [];
        const challenges = Array.isArray(q3) ? q3 : [q3];

        // Build scenario list based on industry + user preferences
        const allScenarios = getIndustryScenarios(industry);
        // Prioritize scenarios matching user's Q5 preference and Q3 challenges
        const sorted = allScenarios.sort((a, b) => {
            let scoreA = 0, scoreB = 0;
            if (a.tags.some(t => q5.includes(t))) scoreA += 10;
            if (b.tags.some(t => q5.includes(t))) scoreB += 10;
            challenges.forEach(c => {
                if (a.tags.some(t => c.includes(t))) scoreA += 5;
                if (b.tags.some(t => c.includes(t))) scoreB += 5;
            });
            return scoreB - scoreA;
        });

        return sorted.slice(0, 4).map(s => `
            <div class="result-scenario-card">
                <h4>${s.title}</h4>
                <div class="result-scenario-meta">
                    <span class="result-scenario-tag tag-difficulty-${s.difficulty === '低' ? 'low' : s.difficulty === '中' ? 'mid' : 'high'}">難度：${s.difficulty}</span>
                    <span class="result-scenario-tag" style="background:var(--teal-dim);color:var(--teal)">時程：${s.timeline}</span>
                </div>
                <p>${s.desc}</p>
                <div class="result-scenario-kpi">預期 KPI：${s.kpi}</div>
            </div>
        `).join('');
    }

    function getIndustryScenarios(industry) {
        // Universal scenarios applicable to most industries
        const universal = [
            { title: '智能客戶溝通與查詢自動化', desc: '部署 AI 智能客服處理常見查詢、規格確認、價格試算等重複性溝通，釋放業務人力專注高價值工作。', difficulty: '低', timeline: '2-4 週', kpi: '客服回應時間縮短 60%', tags: ['客戶', '效率', '自動化'] },
            { title: '內部知識庫與文件智能檢索', desc: '建立企業 AI 知識庫，讓員工透過自然語言快速找到產品手冊、技術文件、歷史紀錄等內部資訊。', difficulty: '中', timeline: '6-8 週', kpi: '資訊搜尋時間縮短 70%', tags: ['知識', '文件', '效率'] },
            { title: '智能報表與數據分析自動化', desc: '運用 AI 自動產出營運報表、異常偵測與趨勢分析，讓管理層即時掌握關鍵指標，支撐數據驅動決策。', difficulty: '中', timeline: '4-8 週', kpi: '報表產出時間縮短 80%', tags: ['決策', '數據', '報表'] },
            { title: '員工 AI 助手與工作流自動化', desc: '為員工配備個人 AI 助手，自動處理郵件分類、會議紀錄、文件摘要等日常事務，提升工作效率。', difficulty: '低', timeline: '2-4 週', kpi: '日常事務處理時間縮短 40%', tags: ['效率', '自動化', '人力'] },
        ];

        // Industry-specific scenarios
        const industrySpecific = {
            '半導體/電子': [
                { title: '銷售潛在客戶智能推薦與管理', desc: '運用 AI 分析既有客戶資料與互動紀錄，自動識別高潛力客戶並推薦開發策略，提升業務精準度。', difficulty: '低', timeline: '4-6 週', kpi: '客戶轉換率提升 15-25%', tags: ['客戶', '銷售', '開發'] },
                { title: '採購需求預測與庫存優化', desc: '結合歷史銷售資料與市場趨勢，AI 預測未來採購需求，降低庫存成本與缺貨風險。', difficulty: '高', timeline: '8-12 週', kpi: '庫存週轉天數縮短 20%', tags: ['供應鏈', '預測', '庫存'] },
            ],
            '製造業': [
                { title: 'AI 智慧品質檢測', desc: '運用 AI 視覺辨識技術，自動檢測產品瑕疵，提升良率並降低人工檢測成本。', difficulty: '中', timeline: '6-10 週', kpi: '檢測準確率提升至 98%', tags: ['品質', '檢測', '生產'] },
                { title: '設備預測性維護', desc: '透過 IoT 感測器與 AI 分析，預測設備故障並安排最佳維護時間，減少非預期停機。', difficulty: '高', timeline: '10-16 週', kpi: '非預期停機減少 30%', tags: ['設備', '預測', '維護'] },
            ],
            '零售/電商': [
                { title: '個性化商品推薦引擎', desc: '基於用戶瀏覽與購買行為，AI 自動推薦高相關性商品，提升轉換率與客單價。', difficulty: '中', timeline: '6-8 週', kpi: '推薦商品點擊率提升 35%', tags: ['客戶', '推薦', '銷售'] },
                { title: '智慧定價與促銷策略', desc: 'AI 分析市場競爭、庫存水位與需求彈性，自動建議最佳定價與促銷方案。', difficulty: '高', timeline: '8-12 週', kpi: '毛利率提升 5-10%', tags: ['定價', '銷售', '決策'] },
            ],
            '金融/銀行': [
                { title: '智能風控與反詐騙偵測', desc: '運用 AI 即時監控交易行為，自動辨識異常模式並啟動風險警報。', difficulty: '高', timeline: '10-16 週', kpi: '詐騙案件偵測率提升 40%', tags: ['風控', '安全', '偵測'] },
                { title: '智能理財顧問', desc: '基於客戶財務狀況與風險偏好，AI 自動生成個人化投資建議與資產配置方案。', difficulty: '中', timeline: '8-12 週', kpi: '客戶滿意度提升 25%', tags: ['客戶', '服務', '推薦'] },
            ],
            '物流/運輸業': [
                { title: '智慧路線規劃與調度', desc: '運用 AI 即時分析交通、天氣、訂單等變數，自動計算最佳配送路線。', difficulty: '中', timeline: '6-10 週', kpi: '配送成本降低 15%', tags: ['供應鏈', '路線', '效率'] },
                { title: '貨量預測與運力調配', desc: 'AI 分析歷史數據與市場趨勢，預測未來貨量並自動調配運力資源。', difficulty: '高', timeline: '8-12 週', kpi: '運力利用率提升 20%', tags: ['預測', '供應鏈', '調度'] },
            ],
            '醫療/生技': [
                { title: '智能醫療影像分析', desc: '運用 AI 輔助醫師判讀 X 光、CT 等醫療影像，提升診斷速度與準確率。', difficulty: '高', timeline: '12-20 週', kpi: '影像判讀時間縮短 50%', tags: ['影像', '診斷', '品質'] },
                { title: '病歷智能摘要與分析', desc: 'AI 自動整理病歷資料，產出結構化摘要，協助醫療團隊快速了解病患狀況。', difficulty: '中', timeline: '6-10 週', kpi: '病歷整理時間縮短 60%', tags: ['知識', '文件', '效率'] },
            ],
        };

        const specific = industrySpecific[industry] || [];
        return [...specific, ...universal];
    }

    // ====== Logic Explanation ======
    function generateLogicExplanation(data, dims, ans, total) {
        const sizeLabel = data.companySize || '未知';
        const industry = data.industry || '未知';
        let html = '';

        html += `<p><strong>AI 分析依據</strong></p>`;
        html += `<p>• <strong>產業適配性：</strong>${industry}產業的 AI 應用正處於快速發展階段，`;
        html += getIndustryInsight(industry);
        html += `</p>`;
        html += `<p>• <strong>規模適配性：</strong>${sizeLabel} 人的企業，`;
        html += getSizeInsight(sizeLabel);
        html += `</p><br>`;

        html += `<p><strong>關鍵答案影響分析</strong></p>`;

        // Q3 challenges
        const q3 = ans.q3;
        if (q3) {
            const challenges = Array.isArray(q3) ? q3 : [q3];
            html += `<p>• 最大營運挑戰為「${challenges.join('」與「')}」→ 優先推薦相關場景解決方案</p>`;
        }

        // Q5 desired scenario
        if (ans.q5) {
            html += `<p>• 最希望 AI 解決的問題為「${ans.q5}」→ 聚焦相關領域的 AI 應用方案</p>`;
        }

        // Q10 obstacle
        if (ans.q10) {
            html += `<p>• 流程改善最大阻力為「${getQ10Label(ans.q10)}」→ 建議在導入策略中納入變革管理</p>`;
        }

        // Q23 readiness
        if (ans.q23) {
            const readiness = parseInt(ans.q23);
            html += `<p>• AI 導入準備度自評 ${readiness}/10 → `;
            if (readiness <= 3) html += '建議先進行策略診斷與教育訓練，建立基礎信心';
            else if (readiness <= 6) html += '建議分階段推進，由低風險場景開始建立成功經驗';
            else html += '具備較高信心，可直接推動 POC 驗證';
            html += `</p>`;
        }

        // Q11 data storage
        if (ans.q11) {
            const dataLevel = parseInt(ans.q11);
            if (dataLevel <= 3) html += `<p>• 業務資料儲存於多個系統但未整合 → 資料治理為前置必要工作</p>`;
        }

        // Supplementary notes
        if (notes.q5_note) {
            html += `<p>• 使用者補充期望：${notes.q5_note}</p>`;
        }
        if (notes.q30_note) {
            html += `<p>• 使用者額外回饋：${notes.q30_note}</p>`;
        }

        html += `<br><p><strong>優先順序判斷邏輯</strong></p>`;
        html += `<p>根據「影響範圍 × 改善空間 × 實施難度」三維評估，`;

        const sortedDims = [...dims].sort((a, b) => a.score - b.score);
        html += `${sortedDims[0].name}為最優先強化項目（得分最低 ${sortedDims[0].score} 分），`;
        html += `其次為${sortedDims[1].name}（${sortedDims[1].score} 分），`;
        html += `建議從影響範圍最大、實施難度最低的場景切入，快速產生可見成果後再擴展。</p>`;

        return html;
    }

    function getIndustryInsight(industry) {
        const insights = {
            '半導體/電子': '已有大量業界成功案例可參考，特別在供應鏈優化、品質檢測、客戶管理等領域。',
            '製造業': '特別在智慧製造、品質管控、設備維護與供應鏈管理等領域已有成熟解決方案。',
            '零售/電商': '特別在個性化推薦、智慧定價、客戶分析與物流優化等領域有豐富的 AI 應用。',
            '金融/銀行': '在風控、客服自動化、智能投顧與反洗錢等領域的 AI 應用已相當成熟。',
            '物流/運輸業': '在路線優化、貨量預測、智慧調度與自動化倉儲等領域的 AI 應用正快速落地。',
            '醫療/生技': '在醫療影像、藥物研發、臨床決策支援與健康管理等領域 AI 應用潛力巨大。',
            '科技/軟體': '作為 AI 技術的核心產業，在產品智能化、開發效率提升與服務創新方面具有先天優勢。',
        };
        return insights[industry] || '各產業正積極探索 AI 的應用場景與商業價值，具備跨產業通用的 AI 導入機會。';
    }

    function getSizeInsight(size) {
        if (size === '1-50') return '作為小型企業，建議聚焦 1-2 個高影響力場景，以最小投入快速驗證 AI 價值。';
        if (size === '51-200') return '具備一定組織基礎，建議選擇 2-3 個場景進行 POC，並指定專人推動。';
        if (size === '201-500') return '具備導入 AI 的組織基礎，但需要確保跨部門協調與資源配置。';
        if (size === '501-1000') return '組織規模支撐系統化的 AI 導入，建議建立正式的推動委員會與階段性計畫。';
        if (size === '1001+') return '大型企業適合建立 AI 卓越中心（CoE），制定全面的 AI 策略與治理框架。';
        return '建議根據企業規模與資源，選擇適合的導入節奏與範圍。';
    }

    // ====== Consulting Solutions ======
    function generateSolutions(total, stage) {
        const solutions = [
            {
                name: 'AI Strategy Sprint',
                desc: '2-4 週內找到最有價值的 AI 導入場景，交付 AI 導入路線圖與優先順序建議。適合目前處於探索與整合期的企業。',
                fit: total < 65
            },
            {
                name: 'AI POC Sprint',
                desc: '6-8 週完成概念驗證，交付 POC 系統與驗證報告，確認 AI 的實際業務效益。適合已有明確場景的企業。',
                fit: total >= 40 && total < 80
            },
            {
                name: 'AI Governance & Scale',
                desc: '3-12 個月建立企業 AI 治理架構與規模化導入機制，交付治理框架與擴展策略。適合已驗證場景的企業。',
                fit: total >= 60
            }
        ];

        // Determine recommended
        let recommended;
        if (total < 40) recommended = 'AI Strategy Sprint';
        else if (total < 65) recommended = 'AI Strategy Sprint';
        else if (total < 80) recommended = 'AI POC Sprint';
        else recommended = 'AI Governance & Scale';

        return solutions.map(s => `
            <div class="result-solution-card ${s.name === recommended ? 'recommended' : ''}">
                ${s.name === recommended ? '<span class="result-solution-badge">推薦方案</span>' : ''}
                <h4>${s.name}</h4>
                <p>${s.desc}</p>
            </div>
        `).join('');
    }

    // ====== Roadmap ======
    function generateRoadmap(total, dims, data) {
        const sortedWeak = [...dims].sort((a, b) => a.score - b.score);
        const weakest = sortedWeak[0];

        const phase1Tasks = [
            '高層共識工作坊：AI 願景與策略對齊',
            '核心業務流程 AI 潛力評估與優先排序',
        ];
        if (weakest.key === 'data') phase1Tasks.push('資料現況盤點與初步治理規劃');
        else if (weakest.key === 'strategy') phase1Tasks.push('制定 AI 導入策略文件與預算規劃');
        else if (weakest.key === 'governance') phase1Tasks.push('建立 AI 導入目標與初步治理框架');
        else phase1Tasks.push('弱項構面（' + weakest.name + '）改善行動計畫');
        phase1Tasks.push('建立跨部門 AI 推動小組');

        const q5 = data.answers?.q5 || '提升營運效率';
        const phase2Tasks = [
            '挑選 1-2 個高頻業務流程進行 AI POC',
        ];
        if (q5 === '強化客戶經營') phase2Tasks.push('導入客戶溝通自動化工具（如智能客服、銷售助理）');
        else if (q5 === '優化供應鏈') phase2Tasks.push('導入供應鏈預測與庫存優化 AI 工具');
        else if (q5 === '知識管理') phase2Tasks.push('建置企業 AI 知識庫與文件智能檢索系統');
        else if (q5 === '品質管控') phase2Tasks.push('導入 AI 輔助品質檢測工具');
        else phase2Tasks.push('導入針對「' + q5 + '」的 AI 解決方案');
        phase2Tasks.push('建置 POC 所需資料集與資料清洗機制');
        phase2Tasks.push('團隊 AI 基礎知識與工具操作培訓');

        return `
            <div class="result-roadmap-phase">
                <div class="result-roadmap-time">0–4 週</div>
                <div class="result-roadmap-content">
                    <h4>Strategy Sprint — 戰略對焦</h4>
                    <ul>${phase1Tasks.map(t => '<li>' + t + '</li>').join('')}</ul>
                </div>
            </div>
            <div class="result-roadmap-phase">
                <div class="result-roadmap-time">4–12 週</div>
                <div class="result-roadmap-content">
                    <h4>POC 驗證 — 場景落地</h4>
                    <ul>${phase2Tasks.map(t => '<li>' + t + '</li>').join('')}</ul>
                </div>
            </div>
            <div class="result-roadmap-phase">
                <div class="result-roadmap-time">3–12 月</div>
                <div class="result-roadmap-content">
                    <h4>AI 治理與規模化</h4>
                    <ul>
                        <li>POC 成果評估與效益量化</li>
                        <li>建立 AI 導入標準流程與治理框架</li>
                        <li>將成功 AI 應用擴展至其他業務流程</li>
                        <li>持續培訓與組織能力建設</li>
                    </ul>
                </div>
            </div>
        `;
    }

})();
