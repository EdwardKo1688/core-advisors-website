/**
 * Admin Dashboard SPA - Core Consultant
 */
(function () {
    'use strict';

    let authToken = null;
    let currentPage = 1;
    let charts = {};

    // ===== Demo Data (used when API not configured) =====
    const DEMO_DATA = {
        assessments: [
            { id: '1', timestamp: '2026-03-10T14:30:00Z', companyName: '威倫電子股份有限公司', industry: '半導體/電子', companySize: '201-500 人', userName: '陳彥廷', userEmail: 'chen@welen.com', totalScore: 56, maturityLevel: '整合期', status: 'contacted', dim1Score: 62, dim2Score: 58, dim3Score: 45, dim4Score: 52, dim5Score: 48, dim6Score: 71 },
            { id: '2', timestamp: '2026-03-08T10:15:00Z', companyName: '台灣智造科技', industry: '製造業', companySize: '501-1000 人', userName: '王大明', userEmail: 'wang@smartmfg.tw', totalScore: 42, maturityLevel: '發展期', status: 'new', dim1Score: 45, dim2Score: 38, dim3Score: 40, dim4Score: 50, dim5Score: 35, dim6Score: 44 },
            { id: '3', timestamp: '2026-03-05T09:00:00Z', companyName: '快運物流', industry: '物流/運輸業', companySize: '51-200 人', userName: '李芳如', userEmail: 'lee@fastlog.com', totalScore: 35, maturityLevel: '發展期', status: 'new', dim1Score: 30, dim2Score: 40, dim3Score: 28, dim4Score: 35, dim5Score: 32, dim6Score: 45 },
            { id: '4', timestamp: '2026-02-28T16:45:00Z', companyName: '鑫盛金融', industry: '金融/銀行', companySize: '1001 人以上', userName: '張志豪', userEmail: 'chang@xinseng.com', totalScore: 68, maturityLevel: '擴展期', status: 'closed', dim1Score: 72, dim2Score: 65, dim3Score: 60, dim4Score: 70, dim5Score: 68, dim6Score: 73 },
            { id: '5', timestamp: '2026-02-20T11:30:00Z', companyName: '綠能科技', industry: '能源/公用事業', companySize: '201-500 人', userName: '林美玲', userEmail: 'lin@greentech.tw', totalScore: 48, maturityLevel: '整合期', status: 'contacted', dim1Score: 55, dim2Score: 45, dim3Score: 42, dim4Score: 48, dim5Score: 50, dim6Score: 48 }
        ],
        bookings: [
            { id: 'b1', timestamp: '2026-03-12T08:00:00Z', name: '陳彥廷', email: 'chen@welen.com', phone: '0912-345-678', company: '威倫電子', date: '2026-03-18', timeSlot: '14:00-15:00', topic: 'AI 導入策略諮詢', status: 'pending' },
            { id: 'b2', timestamp: '2026-03-11T10:00:00Z', name: '王大明', email: 'wang@smartmfg.tw', phone: '0923-456-789', company: '台灣智造', date: '2026-03-19', timeSlot: '10:00-11:00', topic: '製造業 AI 場景設計', status: 'confirmed' }
        ],
        stats: {
            totalAssessments: 5,
            monthlyAssessments: 3,
            averageScore: 50,
            pendingBookings: 1,
            industries: { '半導體/電子': 1, '製造業': 1, '物流/運輸業': 1, '金融/銀行': 1, '能源/公用事業': 1 },
            dimensionAverages: [53, 49, 43, 51, 47, 56],
            monthlyTrend: [
                { month: '2025-10', count: 2 }, { month: '2025-11', count: 3 },
                { month: '2025-12', count: 1 }, { month: '2026-01', count: 4 },
                { month: '2026-02', count: 2 }, { month: '2026-03', count: 3 }
            ],
            recentActivity: [
                { company: '威倫電子', user: '陳彥廷', date: '2026-03-10', score: 56 },
                { company: '台灣智造科技', user: '王大明', date: '2026-03-08', score: 42 },
                { company: '快運物流', user: '李芳如', date: '2026-03-05', score: 35 }
            ]
        }
    };

    // ===== API Helper =====
    function isApiConfigured() {
        return typeof GAS_API_URL !== 'undefined' && typeof API_ENABLED !== 'undefined' && API_ENABLED && GAS_API_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL';
    }

    async function apiCall(action, method, data) {
        if (!isApiConfigured()) return null;

        const url = new URL(GAS_API_URL);
        url.searchParams.set('action', action);
        if (authToken) url.searchParams.set('token', authToken);

        if (method === 'GET' && data) {
            Object.keys(data).forEach(k => url.searchParams.set(k, data[k]));
        }

        const opts = { method };
        if (method === 'POST' && data) {
            opts.body = JSON.stringify(data);
        }

        const res = await fetch(url.toString(), opts);
        return await res.json();
    }

    // ===== SHA-256 Helper =====
    async function sha256(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // ===== Login =====
    const loginForm = document.getElementById('loginForm');
    const loginScreen = document.getElementById('loginScreen');
    const adminApp = document.getElementById('adminApp');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pw = document.getElementById('password').value;
        loginError.style.display = 'none';

        if (isApiConfigured()) {
            try {
                const hash = await sha256(pw);
                const result = await apiCall('login', 'POST', { passwordHash: hash });
                if (result && result.success) {
                    authToken = result.token;
                    sessionStorage.setItem('adminToken', authToken);
                    showDashboard();
                } else {
                    loginError.textContent = result?.error || '密碼錯誤';
                    loginError.style.display = 'block';
                }
            } catch {
                loginError.textContent = 'API 連線失敗';
                loginError.style.display = 'block';
            }
        } else {
            // Demo mode: accept "admin" as password
            if (pw === 'admin') {
                authToken = 'demo-token';
                sessionStorage.setItem('adminToken', authToken);
                showDashboard();
            } else {
                loginError.textContent = '展示模式密碼：admin';
                loginError.style.display = 'block';
            }
        }
    });

    // Check for existing session
    const savedToken = sessionStorage.getItem('adminToken');
    if (savedToken) {
        authToken = savedToken;
        showDashboard();
    }

    function showDashboard() {
        loginScreen.style.display = 'none';
        adminApp.style.display = 'block';

        // Update API status
        const statusEl = document.getElementById('apiStatus');
        if (isApiConfigured()) {
            statusEl.textContent = 'API 已連線';
            statusEl.style.color = '#00d4aa';
        } else {
            statusEl.textContent = '展示模式';
            statusEl.style.color = '#f5a623';
        }

        loadDashboard();
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        authToken = null;
        sessionStorage.removeItem('adminToken');
        loginScreen.style.display = '';
        adminApp.style.display = 'none';
        document.getElementById('password').value = '';
    });

    // ===== Tab Navigation =====
    const navItems = document.querySelectorAll('.admin-nav-item');
    const tabs = document.querySelectorAll('.admin-tab');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.dataset.tab;
            navItems.forEach(n => n.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            item.classList.add('active');
            document.getElementById('tab-' + tabId).classList.add('active');

            // Load tab data
            if (tabId === 'dashboard') loadDashboard();
            else if (tabId === 'records') loadRecords();
            else if (tabId === 'bookings') loadBookings();
            else if (tabId === 'cms') loadCms();
            else if (tabId === 'settings') loadSettings();

            // Close mobile sidebar
            document.getElementById('adminSidebar').classList.remove('open');
        });
    });

    // Mobile menu toggle
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('adminSidebar').classList.toggle('open');
    });

    // ===== Dashboard Tab =====
    async function loadDashboard() {
        let stats;
        if (isApiConfigured()) {
            const result = await apiCall('getDashboardStats', 'GET');
            stats = result?.data || DEMO_DATA.stats;
        } else {
            stats = DEMO_DATA.stats;
        }

        document.getElementById('statTotal').textContent = stats.totalAssessments;
        document.getElementById('statMonthly').textContent = stats.monthlyAssessments;
        document.getElementById('statAvgScore').textContent = stats.averageScore + '%';
        document.getElementById('statBookings').textContent = stats.pendingBookings;

        // Trend chart
        renderChart('chartTrend', 'line', {
            labels: stats.monthlyTrend.map(m => m.month),
            datasets: [{
                label: '診斷數量',
                data: stats.monthlyTrend.map(m => m.count),
                borderColor: '#00d4aa',
                backgroundColor: 'rgba(0,212,170,0.1)',
                fill: true,
                tension: 0.3
            }]
        });

        // Industry chart
        const indLabels = Object.keys(stats.industries);
        const indValues = Object.values(stats.industries);
        const colors = ['#00d4aa', '#1976d2', '#f57c00', '#9c27b0', '#e91e63', '#607d8b', '#ff5722'];
        renderChart('chartIndustry', 'doughnut', {
            labels: indLabels,
            datasets: [{ data: indValues, backgroundColor: colors.slice(0, indLabels.length) }]
        }, { plugins: { legend: { position: 'right' } } });

        // Dimension chart
        const dimLabels = ['企業戰略', '流程成熟度', '數據能力', '技術基礎', 'AI 治理', '組織文化'];
        renderChart('chartDimensions', 'radar', {
            labels: dimLabels,
            datasets: [{
                label: '平均分數',
                data: stats.dimensionAverages,
                borderColor: '#00d4aa',
                backgroundColor: 'rgba(0,212,170,0.2)',
                pointBackgroundColor: '#00d4aa'
            }]
        }, { scales: { r: { min: 0, max: 100, ticks: { stepSize: 20 } } } });

        // Activity list
        const actList = document.getElementById('activityList');
        if (stats.recentActivity && stats.recentActivity.length > 0) {
            actList.innerHTML = stats.recentActivity.map(a => `
                <div class="activity-item">
                    <div>
                        <span class="activity-company">${a.company}</span>
                        <span class="activity-user"> - ${a.user}</span>
                    </div>
                    <div>
                        <span class="activity-score">${a.score}%</span>
                        <span class="activity-date">${formatDate(a.date)}</span>
                    </div>
                </div>
            `).join('');
        } else {
            actList.innerHTML = '<p class="empty-state">尚無活動記錄</p>';
        }
    }

    function renderChart(canvasId, type, data, extraOpts) {
        if (charts[canvasId]) charts[canvasId].destroy();
        const ctx = document.getElementById(canvasId);
        charts[canvasId] = new Chart(ctx, {
            type,
            data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: type !== 'line' } },
                ...extraOpts
            }
        });
    }

    // ===== Records Tab =====
    async function loadRecords(page) {
        currentPage = page || 1;
        let data, total, totalPages;

        if (isApiConfigured()) {
            const params = {
                page: currentPage,
                limit: 20,
                search: document.getElementById('searchInput').value,
                industry: document.getElementById('filterIndustry').value,
                status: document.getElementById('filterStatus').value
            };
            const result = await apiCall('getAssessments', 'GET', params);
            data = result?.data || [];
            total = result?.total || 0;
            totalPages = result?.totalPages || 1;
        } else {
            data = DEMO_DATA.assessments;
            total = data.length;
            totalPages = 1;
        }

        const tbody = document.getElementById('recordsBody');
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">無診斷紀錄</td></tr>';
        } else {
            tbody.innerHTML = data.map(r => `
                <tr>
                    <td>${formatDate(r.timestamp)}</td>
                    <td><strong>${r.companyName || '-'}</strong></td>
                    <td>${r.userName || '-'}<br><small style="color:#999">${r.userEmail || ''}</small></td>
                    <td>${r.industry || '-'}</td>
                    <td><strong>${r.totalScore || '-'}%</strong></td>
                    <td>${r.maturityLevel || '-'}</td>
                    <td>
                        <select class="status-select" data-id="${r.id}" onchange="window._updateStatus(this)">
                            <option value="new" ${r.status==='new'?'selected':''}>新提交</option>
                            <option value="contacted" ${r.status==='contacted'?'selected':''}>已聯繫</option>
                            <option value="closed" ${r.status==='closed'?'selected':''}>已結案</option>
                        </select>
                    </td>
                    <td><button class="btn-action" onclick="window._viewDetail('${r.id}')">詳情</button></td>
                </tr>
            `).join('');
        }

        // Pagination
        const pagEl = document.getElementById('pagination');
        pagEl.innerHTML = '';
        for (let p = 1; p <= totalPages; p++) {
            const btn = document.createElement('button');
            btn.className = 'page-btn' + (p === currentPage ? ' active' : '');
            btn.textContent = p;
            btn.onclick = () => loadRecords(p);
            pagEl.appendChild(btn);
        }
    }

    // Expose for inline handlers
    window._updateStatus = async function (el) {
        const id = el.dataset.id;
        const status = el.value;
        if (isApiConfigured()) {
            await apiCall('updateAssessmentStatus', 'POST', { id, status });
        }
    };

    window._viewDetail = function (id) {
        const data = isApiConfigured() ? null : DEMO_DATA.assessments.find(r => r.id === id);
        if (data) showDetailModal(data);
    };

    function showDetailModal(record) {
        const modal = document.getElementById('detailModal');
        const body = document.getElementById('modalBody');
        document.getElementById('modalTitle').textContent = record.companyName + ' - 診斷詳情';

        body.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item"><label>公司</label><span>${record.companyName}</span></div>
                <div class="detail-item"><label>產業</label><span>${record.industry}</span></div>
                <div class="detail-item"><label>規模</label><span>${record.companySize}</span></div>
                <div class="detail-item"><label>聯絡人</label><span>${record.userName}</span></div>
                <div class="detail-item"><label>Email</label><span>${record.userEmail}</span></div>
                <div class="detail-item"><label>總分</label><span>${record.totalScore}%</span></div>
                <div class="detail-item"><label>等級</label><span>${record.maturityLevel}</span></div>
                <div class="detail-item"><label>狀態</label><span>${getAssessmentStatusLabel(record.status)}</span></div>
            </div>
            <h4>六大構面分數</h4>
            <div class="detail-grid">
                <div class="detail-item"><label>企業戰略與決策</label><span>${record.dim1Score}</span></div>
                <div class="detail-item"><label>營運流程成熟度</label><span>${record.dim2Score}</span></div>
                <div class="detail-item"><label>數據與資料能力</label><span>${record.dim3Score}</span></div>
                <div class="detail-item"><label>技術與系統基礎</label><span>${record.dim4Score}</span></div>
                <div class="detail-item"><label>AI 策略與治理</label><span>${record.dim5Score}</span></div>
                <div class="detail-item"><label>組織文化與人才</label><span>${record.dim6Score}</span></div>
            </div>
        `;

        modal.style.display = 'flex';
    }

    document.getElementById('modalClose').addEventListener('click', () => {
        document.getElementById('detailModal').style.display = 'none';
    });
    document.getElementById('detailModal').addEventListener('click', (e) => {
        if (e.target.id === 'detailModal') e.target.style.display = 'none';
    });

    // Search & filter
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => loadRecords(1), 300);
    });
    document.getElementById('filterIndustry').addEventListener('change', () => loadRecords(1));
    document.getElementById('filterStatus').addEventListener('change', () => loadRecords(1));

    // Export CSV
    document.getElementById('btnExport').addEventListener('click', async () => {
        let csv;
        if (isApiConfigured()) {
            const result = await apiCall('exportAssessments', 'GET');
            csv = result?.csv;
        } else {
            // Demo CSV
            const headers = ['日期', '公司', '聯絡人', 'Email', '產業', '規模', '總分', '等級', '狀態'];
            const rows = DEMO_DATA.assessments.map(r =>
                [formatDate(r.timestamp), r.companyName, r.userName, r.userEmail, r.industry, r.companySize, r.totalScore, r.maturityLevel, r.status].join(',')
            );
            csv = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
        }

        if (csv) {
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'diagnosis-records-' + new Date().toISOString().slice(0, 10) + '.csv';
            a.click();
            URL.revokeObjectURL(url);
        }
    });

    // ===== Bookings Tab =====
    async function loadBookings() {
        let data;
        if (isApiConfigured()) {
            const result = await apiCall('getBookings', 'GET');
            data = result?.data || [];
        } else {
            data = DEMO_DATA.bookings;
        }

        const tbody = document.getElementById('bookingsBody');
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">無預約記錄</td></tr>';
        } else {
            tbody.innerHTML = data.map(b => `
                <tr>
                    <td>${b.date || '-'}</td>
                    <td>${b.timeSlot || '-'}</td>
                    <td>${b.name || '-'}<br><small style="color:#999">${b.email || ''}</small></td>
                    <td>${b.company || '-'}</td>
                    <td>${b.topic || '-'}</td>
                    <td><span class="status-badge status-${b.status}">${getBookingStatusLabel(b.status)}</span></td>
                    <td>
                        <select class="status-select" data-bid="${b.id}" onchange="window._updateBookingStatus(this)">
                            <option value="pending" ${b.status==='pending'?'selected':''}>待確認</option>
                            <option value="confirmed" ${b.status==='confirmed'?'selected':''}>已確認</option>
                            <option value="completed" ${b.status==='completed'?'selected':''}>已完成</option>
                            <option value="cancelled" ${b.status==='cancelled'?'selected':''}>已取消</option>
                        </select>
                    </td>
                </tr>
            `).join('');
        }

        // Render slot manager
        renderSlotManager();
    }

    window._updateBookingStatus = async function (el) {
        const id = el.dataset.bid;
        const status = el.value;
        if (isApiConfigured()) {
            await apiCall('updateBookingStatus', 'POST', { id, status });
        }
    };

    function getAssessmentStatusLabel(s) {
        const map = { new: '新提交', contacted: '已聯繫', closed: '已結案' };
        return map[s] || s;
    }

    function getBookingStatusLabel(s) {
        const map = { pending: '待確認', confirmed: '已確認', completed: '已完成', cancelled: '已取消' };
        return map[s] || s;
    }

    // Booking sub-tabs
    document.querySelectorAll('.booking-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.booking-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.booking-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('bpanel-' + btn.dataset.btab).classList.add('active');
        });
    });

    function renderSlotManager() {
        const grid = document.getElementById('slotsGrid');
        const days = ['週一', '週二', '週三', '週四', '週五'];
        const times = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'];

        grid.innerHTML = days.map((day, di) => `
            <div class="slots-day">
                <div class="slots-day-label">${day}</div>
                <div class="slots-times">
                    ${times.map(t => `<button class="slot-btn ${di < 5 && t !== '09:00-10:00' ? 'active' : ''}" data-day="${di}" data-time="${t}" onclick="this.classList.toggle('active')">${t}</button>`).join('')}
                </div>
            </div>
        `).join('');
    }

    document.getElementById('btnSaveSlots')?.addEventListener('click', async () => {
        if (!isApiConfigured()) {
            alert('展示模式：時段已模擬儲存');
            return;
        }
        // Collect active slots and save
        const slots = [];
        document.querySelectorAll('.slot-btn.active').forEach(btn => {
            slots.push({ day: btn.dataset.day, timeSlot: btn.dataset.time, isAvailable: true });
        });
        await apiCall('updateSlots', 'POST', { slots });
        alert('時段已儲存');
    });

    // ===== CMS Tab =====
    const CMS_SECTIONS = {
        index: [
            { id: 'hero-title', label: '首頁 Hero 標題' },
            { id: 'hero-desc', label: '首頁 Hero 描述' },
            { id: 'pain-title', label: '痛點區塊標題' },
            { id: 'cta-title', label: 'CTA 區塊標題' }
        ],
        about: [
            { id: 'hero-title', label: '關於我們 Hero 標題' },
            { id: 'hero-desc', label: '關於我們 Hero 描述' },
            { id: 'founder-name', label: '創辦人姓名' },
            { id: 'founder-desc', label: '創辦人介紹' }
        ],
        services: [
            { id: 'hero-title', label: '顧問服務 Hero 標題' },
            { id: 'hero-desc', label: '顧問服務 Hero 描述' }
        ],
        solutions: [
            { id: 'hero-title', label: '解決方案 Hero 標題' },
            { id: 'hero-desc', label: '解決方案 Hero 描述' }
        ],
        tools: [
            { id: 'hero-title', label: '工具方案 Hero 標題' },
            { id: 'hero-desc', label: '工具方案 Hero 描述' }
        ],
        navigator: [
            { id: 'hero-title', label: 'AI 診斷 Hero 標題' },
            { id: 'hero-desc', label: 'AI 診斷 Hero 描述' }
        ],
        resources: [
            { id: 'hero-title', label: '資源觀點 Hero 標題' },
            { id: 'hero-desc', label: '資源觀點 Hero 描述' }
        ]
    };

    async function loadCms() {
        const page = document.getElementById('cmsPageSelect').value;
        const sections = CMS_SECTIONS[page] || [];
        const fields = document.getElementById('cmsFields');

        let existingContent = {};
        if (isApiConfigured()) {
            const result = await apiCall('getCmsContent', 'GET', { page });
            (result?.data || []).forEach(item => {
                existingContent[item.sectionId] = item.content;
            });
        }

        fields.innerHTML = sections.map(s => `
            <div class="cms-field">
                <label>${s.label}</label>
                <textarea id="cms-${s.id}" placeholder="輸入內容...">${existingContent[s.id] || ''}</textarea>
                <div class="cms-field-actions">
                    <button class="btn-primary-sm" onclick="window._saveCms('${page}', '${s.id}')">儲存</button>
                </div>
            </div>
        `).join('');
    }

    document.getElementById('cmsPageSelect').addEventListener('change', loadCms);

    window._saveCms = async function (pageId, sectionId) {
        const content = document.getElementById('cms-' + sectionId).value;
        if (isApiConfigured()) {
            await apiCall('updateCmsContent', 'POST', { pageId, sectionId, content });
            alert('已儲存');
        } else {
            alert('展示模式：內容已模擬儲存');
        }
    };

    // ===== Settings Tab =====
    function loadSettings() {
        const urlDisplay = document.getElementById('gasUrlDisplay');
        const connStatus = document.getElementById('connectionStatus');

        if (isApiConfigured()) {
            urlDisplay.textContent = GAS_API_URL.substring(0, 60) + '...';
            connStatus.textContent = '已連線';
            connStatus.style.color = '#00d4aa';
        } else {
            urlDisplay.textContent = '未設定（展示模式）';
            connStatus.textContent = '未連線 - 使用展示資料';
            connStatus.style.color = '#f5a623';
        }
    }

    document.getElementById('btnChangePassword')?.addEventListener('click', async () => {
        const current = document.getElementById('currentPassword').value;
        const newPw = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmPassword').value;

        if (!current || !newPw) { alert('請填寫所有欄位'); return; }
        if (newPw !== confirm) { alert('新密碼不一致'); return; }
        if (newPw.length < 6) { alert('密碼至少 6 字元'); return; }

        if (isApiConfigured()) {
            const currentHash = await sha256(current);
            const newHash = await sha256(newPw);
            const result = await apiCall('changePassword', 'POST', { currentPasswordHash: currentHash, newPasswordHash: newHash });
            if (result?.success) {
                alert('密碼已變更');
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
            } else {
                alert(result?.error || '變更失敗');
            }
        } else {
            alert('展示模式：無法變更密碼');
        }
    });

    // ===== Helpers =====
    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.getFullYear() + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getDate()).padStart(2, '0');
    }

})();
