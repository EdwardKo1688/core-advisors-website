/**
 * 富昇智慧物流平台 — 貨主入口 SPA
 */

/* ============================================================
   Demo Data
   ============================================================ */
var SHIPPER_PASSWORD = 'shipper';

var DEMO_DATA = {
    orders: [
        { id: 'FS-2026-0301', service: '一般配送', from: '台北市中山區南京東路100號', to: '新北市板橋區文化路50號', status: 'delivered', amount: 1200, date: '2026-03-01', driver: '王大明', cargo: '電子零件', weight: 15 },
        { id: 'FS-2026-0305', service: '急件快遞', from: '台北市信義區信義路500號', to: '桃園市桃園區中正路200號', status: 'delivered', amount: 2800, date: '2026-03-05', driver: '李志強', cargo: '文件資料', weight: 3 },
        { id: 'FS-2026-0308', service: '冷鏈配送', from: '台北市大安區忠孝東路300號', to: '新竹市東區光復路80號', status: 'transit', amount: 4500, date: '2026-03-08', driver: '張小華', cargo: '冷凍食品', weight: 50 },
        { id: 'FS-2026-0310', service: '一般配送', from: '台北市松山區敦化北路60號', to: '台中市西屯區台灣大道200號', status: 'pickup', amount: 3200, date: '2026-03-10', driver: '陳建宏', cargo: '服飾商品', weight: 25 },
        { id: 'FS-2026-0312', service: '大型貨運', from: '新北市三重區重新路100號', to: '高雄市前鎮區中山路300號', status: 'accepted', amount: 8500, date: '2026-03-12', driver: '林正偉', cargo: '機械零件', weight: 200 },
        { id: 'FS-2026-0313', service: '急件快遞', from: '台北市中正區重慶南路10號', to: '台南市東區大學路50號', status: 'pending', amount: 3600, date: '2026-03-13', driver: '--', cargo: '樣品', weight: 8 },
        { id: 'FS-2026-0314', service: '一般配送', from: '台北市內湖區瑞光路200號', to: '新北市新店區北新路100號', status: 'pending', amount: 950, date: '2026-03-14', driver: '--', cargo: '辦公用品', weight: 10 }
    ],
    inquiries: [
        { id: 'INQ-001', service: '一般配送', from: '台北市', to: '新北市', cargo: '電子產品', date: '2026-03-10', estimate: 1500, status: 'quoted' },
        { id: 'INQ-002', service: '冷鏈配送', from: '台北市', to: '台中市', cargo: '生鮮食品', date: '2026-03-12', estimate: 5200, status: 'pending' }
    ]
};

/* ============================================================
   Status Config
   ============================================================ */
var STATUS_MAP = {
    pending:   { label: '待接單', cls: 'pending' },
    accepted:  { label: '已接單', cls: 'accepted' },
    pickup:    { label: '取貨中', cls: 'pickup' },
    transit:   { label: '配送中', cls: 'transit' },
    delivered: { label: '已送達', cls: 'delivered' },
    cancelled: { label: '已取消', cls: 'cancelled' }
};

var STATUS_FLOW = ['pending', 'accepted', 'pickup', 'transit', 'delivered'];

var VIEW_TITLES = {
    dashboard: '儀表板',
    inquiry:   '即時詢價',
    booking:   '預約配送',
    tracking:  '訂單追蹤',
    history:   '歷史紀錄'
};

/* ============================================================
   Helper Functions
   ============================================================ */
function badge(status) {
    var s = STATUS_MAP[status] || { label: status, cls: '' };
    return '<span class="portal-badge ' + s.cls + '">' + s.label + '</span>';
}

function statusFlow(currentStatus) {
    var html = '<div class="status-flow">';
    for (var i = 0; i < STATUS_FLOW.length; i++) {
        var step = STATUS_FLOW[i];
        var s = STATUS_MAP[step];
        var cls = '';
        var currentIdx = STATUS_FLOW.indexOf(currentStatus);
        if (i < currentIdx) cls = 'done';
        else if (i === currentIdx) cls = 'current';
        if (i > 0) html += '<span class="status-flow-arrow">&#9654;</span>';
        html += '<span class="status-flow-step ' + cls + '">' + s.label + '</span>';
    }
    html += '</div>';
    return html;
}

function formatCurrency(n) {
    return 'NT$ ' + Number(n).toLocaleString();
}

function generateOrderId() {
    var now = new Date();
    var m = String(now.getMonth() + 1).padStart(2, '0');
    var d = String(now.getDate()).padStart(2, '0');
    var r = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    return 'FS-' + now.getFullYear() + '-' + m + d + r;
}

function estimatePrice(service, weight) {
    var base = { '一般配送': 500, '急件快遞': 1200, '冷鏈配送': 1800, '大型貨運': 2500 };
    var rate = { '一般配送': 30, '急件快遞': 60, '冷鏈配送': 50, '大型貨運': 15 };
    var b = base[service] || 800;
    var r = rate[service] || 30;
    return b + Math.round(weight * r);
}

/* ============================================================
   View Renderers
   ============================================================ */
function renderDashboard() {
    var orders = DEMO_DATA.orders;
    var totalMonth = orders.length;
    var inTransit = orders.filter(function(o) { return o.status === 'transit' || o.status === 'pickup'; }).length;
    var completed = orders.filter(function(o) { return o.status === 'delivered'; }).length;
    var pendingCount = orders.filter(function(o) { return o.status === 'pending' || o.status === 'accepted'; }).length;
    var recent = orders.slice(-5).reverse();

    var html = '';

    // Stat cards
    html += '<div class="portal-stats">';
    html += '<div class="portal-stat-card"><span class="stat-icon">&#128230;</span><div class="stat-label">本月訂單</div><div class="stat-value">' + totalMonth + '</div></div>';
    html += '<div class="portal-stat-card"><span class="stat-icon">&#128666;</span><div class="stat-label">配送中</div><div class="stat-value">' + inTransit + '</div></div>';
    html += '<div class="portal-stat-card"><span class="stat-icon">&#9989;</span><div class="stat-label">已完成</div><div class="stat-value">' + completed + '</div></div>';
    html += '<div class="portal-stat-card"><span class="stat-icon">&#9200;</span><div class="stat-label">待處理</div><div class="stat-value">' + pendingCount + '</div></div>';
    html += '</div>';

    // Quick actions
    html += '<div class="portal-quick-actions">';
    html += '<button class="portal-btn portal-btn-accent" onclick="switchView(\'inquiry\')">&#36;&#36; 新增詢價</button>';
    html += '<button class="portal-btn portal-btn-primary" onclick="switchView(\'booking\')">&#128203; 預約配送</button>';
    html += '</div>';

    // Recent orders table
    html += '<div class="portal-table-wrap">';
    html += '<div class="portal-table-header"><h3>近期訂單</h3></div>';
    html += '<table class="portal-table">';
    html += '<thead><tr><th>訂單編號</th><th>服務類型</th><th>起點</th><th>終點</th><th>狀態</th><th>金額</th></tr></thead>';
    html += '<tbody>';
    for (var i = 0; i < recent.length; i++) {
        var o = recent[i];
        html += '<tr>';
        html += '<td>' + o.id + '</td>';
        html += '<td>' + o.service + '</td>';
        html += '<td>' + o.from.substring(0, 8) + '...</td>';
        html += '<td>' + o.to.substring(0, 8) + '...</td>';
        html += '<td>' + badge(o.status) + '</td>';
        html += '<td>' + formatCurrency(o.amount) + '</td>';
        html += '</tr>';
    }
    html += '</tbody></table></div>';

    return html;
}

function renderInquiry() {
    var html = '';

    // Inquiry form
    html += '<div class="portal-form">';
    html += '<h3>新增詢價</h3>';
    html += '<div class="portal-form-grid">';
    html += '<div class="portal-form-group"><label>服務類型 <span class="required">*</span></label><select id="inqService"><option value="一般配送">一般配送</option><option value="急件快遞">急件快遞</option><option value="冷鏈配送">冷鏈配送</option><option value="大型貨運">大型貨運</option></select></div>';
    html += '<div class="portal-form-group"><label>預估重量 (kg) <span class="required">*</span></label><input type="number" id="inqWeight" placeholder="例：20" min="1"></div>';
    html += '<div class="portal-form-group"><label>取貨地址 <span class="required">*</span></label><input type="text" id="inqFrom" placeholder="取貨地址"></div>';
    html += '<div class="portal-form-group"><label>送達地址 <span class="required">*</span></label><input type="text" id="inqTo" placeholder="送達地址"></div>';
    html += '<div class="portal-form-group"><label>貨物說明</label><input type="text" id="inqCargo" placeholder="貨物類型"></div>';
    html += '<div class="portal-form-group"><label>預計日期</label><input type="date" id="inqDate"></div>';
    html += '</div>';
    html += '<div class="portal-form-actions">';
    html += '<button class="portal-btn portal-btn-accent" onclick="handleEstimate()">&#36; 估算價格</button>';
    html += '<button class="portal-btn portal-btn-primary" onclick="handleInquirySubmit()">送出詢價</button>';
    html += '</div>';
    html += '</div>';

    // Price estimate placeholder
    html += '<div id="priceEstimate"></div>';

    // Confirmation placeholder
    html += '<div id="inquiryConfirm"></div>';

    // Past inquiries
    html += '<div class="portal-table-wrap">';
    html += '<div class="portal-table-header"><h3>歷史詢價紀錄</h3></div>';
    html += '<table class="portal-table">';
    html += '<thead><tr><th>編號</th><th>服務</th><th>起點</th><th>終點</th><th>貨物</th><th>估價</th><th>狀態</th></tr></thead>';
    html += '<tbody>';
    for (var i = 0; i < DEMO_DATA.inquiries.length; i++) {
        var q = DEMO_DATA.inquiries[i];
        html += '<tr>';
        html += '<td>' + q.id + '</td>';
        html += '<td>' + q.service + '</td>';
        html += '<td>' + q.from + '</td>';
        html += '<td>' + q.to + '</td>';
        html += '<td>' + q.cargo + '</td>';
        html += '<td>' + formatCurrency(q.estimate) + '</td>';
        html += '<td><span class="portal-badge ' + (q.status === 'quoted' ? 'accepted' : 'pending') + '">' + (q.status === 'quoted' ? '已報價' : '處理中') + '</span></td>';
        html += '</tr>';
    }
    html += '</tbody></table></div>';

    return html;
}

function renderBooking() {
    var html = '';

    html += '<div id="bookingConfirm"></div>';

    html += '<div class="portal-form">';
    html += '<h3>預約配送</h3>';
    html += '<div class="portal-form-grid">';
    html += '<div class="portal-form-group"><label>服務類型 <span class="required">*</span></label><select id="bookService"><option value="一般配送">一般配送</option><option value="急件快遞">急件快遞</option><option value="冷鏈配送">冷鏈配送</option><option value="大型貨運">大型貨運</option></select></div>';
    html += '<div class="portal-form-group"><label>預估重量 (kg) <span class="required">*</span></label><input type="number" id="bookWeight" placeholder="例：20" min="1"></div>';
    html += '<div class="portal-form-group"><label>取貨地址 <span class="required">*</span></label><input type="text" id="bookFrom" placeholder="取貨地址"></div>';
    html += '<div class="portal-form-group"><label>送達地址 <span class="required">*</span></label><input type="text" id="bookTo" placeholder="送達地址"></div>';
    html += '<div class="portal-form-group full-width"><label>貨物說明 <span class="required">*</span></label><input type="text" id="bookCargo" placeholder="貨物類型及內容"></div>';
    html += '<div class="portal-form-group"><label>配送日期 <span class="required">*</span></label><input type="date" id="bookDate"></div>';
    html += '<div class="portal-form-group"><label>時段 <span class="required">*</span></label><select id="bookTime"><option value="09:00-12:00">上午 09:00-12:00</option><option value="12:00-15:00">中午 12:00-15:00</option><option value="15:00-18:00">下午 15:00-18:00</option><option value="18:00-21:00">晚間 18:00-21:00</option></select></div>';
    html += '<div class="portal-form-group full-width"><label>特殊需求</label><textarea id="bookNotes" placeholder="例如：需要堆高機、需冷藏車、需兩人搬運等"></textarea></div>';
    html += '</div>';
    html += '<div class="portal-form-actions">';
    html += '<button class="portal-btn portal-btn-primary" onclick="handleBookingSubmit()">確認預約</button>';
    html += '<button class="portal-btn portal-btn-secondary" onclick="renderView(\'booking\')">清除重填</button>';
    html += '</div>';
    html += '</div>';

    return html;
}

function renderTracking() {
    var html = '';

    // Filter
    html += '<div class="portal-filter-bar">';
    html += '<label>篩選狀態：</label>';
    html += '<select id="trackFilter" onchange="applyTrackFilter()">';
    html += '<option value="all">全部</option>';
    for (var key in STATUS_MAP) {
        html += '<option value="' + key + '">' + STATUS_MAP[key].label + '</option>';
    }
    html += '</select>';
    html += '</div>';

    // Order cards
    html += '<div id="trackingList">';
    html += renderTrackingOrders(DEMO_DATA.orders);
    html += '</div>';

    return html;
}

function renderTrackingOrders(orders) {
    var html = '';
    for (var i = 0; i < orders.length; i++) {
        var o = orders[i];
        html += '<div class="portal-table-wrap" style="margin-bottom:16px; padding:20px;">';
        html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">';
        html += '<strong>' + o.id + '</strong> ' + badge(o.status);
        html += '</div>';
        html += '<div style="font-size:0.875rem; color:var(--text-body); margin-bottom:4px;">' + o.service + ' | ' + o.date + '</div>';
        html += '<div style="font-size:0.875rem; color:var(--text-body);">';
        html += '<strong>起：</strong>' + o.from + '<br>';
        html += '<strong>迄：</strong>' + o.to;
        html += '</div>';
        if (o.status !== 'cancelled') {
            html += statusFlow(o.status);
        }
        html += '</div>';
    }
    if (orders.length === 0) {
        html += '<div style="text-align:center; padding:40px; color:var(--text-light);">無符合條件的訂單</div>';
    }
    return html;
}

function renderHistory() {
    var html = '';

    // Date filter
    html += '<div class="portal-filter-bar">';
    html += '<label>起始日期：</label>';
    html += '<input type="date" id="histFrom" value="2026-03-01">';
    html += '<label>結束日期：</label>';
    html += '<input type="date" id="histTo" value="2026-03-14">';
    html += '<button class="portal-btn portal-btn-sm portal-btn-primary" onclick="applyHistoryFilter()">篩選</button>';
    html += '</div>';

    // Summary
    var orders = DEMO_DATA.orders;
    var totalAmount = orders.reduce(function(sum, o) { return sum + o.amount; }, 0);
    var avg = orders.length > 0 ? Math.round(totalAmount / orders.length) : 0;

    html += '<div class="portal-summary">';
    html += '<div class="portal-summary-item"><div class="summary-label">訂單總數</div><div class="summary-value">' + orders.length + '</div></div>';
    html += '<div class="portal-summary-item"><div class="summary-label">總金額</div><div class="summary-value">' + formatCurrency(totalAmount) + '</div></div>';
    html += '<div class="portal-summary-item"><div class="summary-label">平均單價</div><div class="summary-value">' + formatCurrency(avg) + '</div></div>';
    html += '</div>';

    // Full table
    html += '<div id="historyTableWrap">';
    html += renderHistoryTable(orders);
    html += '</div>';

    return html;
}

function renderHistoryTable(orders) {
    var html = '<div class="portal-table-wrap">';
    html += '<div class="portal-table-header"><h3>訂單紀錄</h3></div>';
    html += '<table class="portal-table">';
    html += '<thead><tr><th>訂單編號</th><th>服務</th><th>起點</th><th>終點</th><th>狀態</th><th>金額</th><th>日期</th><th>司機</th></tr></thead>';
    html += '<tbody>';
    for (var i = 0; i < orders.length; i++) {
        var o = orders[i];
        html += '<tr>';
        html += '<td>' + o.id + '</td>';
        html += '<td>' + o.service + '</td>';
        html += '<td>' + o.from.substring(0, 8) + '...</td>';
        html += '<td>' + o.to.substring(0, 8) + '...</td>';
        html += '<td>' + badge(o.status) + '</td>';
        html += '<td>' + formatCurrency(o.amount) + '</td>';
        html += '<td>' + o.date + '</td>';
        html += '<td>' + o.driver + '</td>';
        html += '</tr>';
    }
    if (orders.length === 0) {
        html += '<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--text-light);">無資料</td></tr>';
    }
    html += '</tbody></table></div>';
    return html;
}

/* ============================================================
   Action Handlers
   ============================================================ */
function handleEstimate() {
    var service = document.getElementById('inqService').value;
    var weight = parseFloat(document.getElementById('inqWeight').value) || 0;
    if (weight <= 0) {
        alert('請輸入重量');
        return;
    }
    var price = estimatePrice(service, weight);
    var el = document.getElementById('priceEstimate');
    el.innerHTML = '<div class="portal-price-estimate">' +
        '<div class="price-label">預估運費</div>' +
        '<div class="price-value">' + formatCurrency(price) + '</div>' +
        '<div class="price-note">實際金額以正式報價為準</div>' +
        '</div>';
}

function handleInquirySubmit() {
    var service = document.getElementById('inqService').value;
    var from = document.getElementById('inqFrom').value;
    var to = document.getElementById('inqTo').value;
    var weight = document.getElementById('inqWeight').value;

    if (!from || !to || !weight) {
        alert('請填寫必填欄位');
        return;
    }

    var id = 'INQ-' + String(DEMO_DATA.inquiries.length + 1).padStart(3, '0');
    DEMO_DATA.inquiries.push({
        id: id,
        service: service,
        from: from,
        to: to,
        cargo: document.getElementById('inqCargo').value || '--',
        date: document.getElementById('inqDate').value || new Date().toISOString().slice(0, 10),
        estimate: estimatePrice(service, parseFloat(weight)),
        status: 'pending'
    });

    var el = document.getElementById('inquiryConfirm');
    el.innerHTML = '<div class="portal-confirmation">' +
        '<div class="confirm-icon">&#9989;</div>' +
        '<h4>詢價已送出</h4>' +
        '<p>詢價編號：' + id + '，我們將盡快回覆報價。</p>' +
        '</div>';

    // Clear form
    document.getElementById('inqFrom').value = '';
    document.getElementById('inqTo').value = '';
    document.getElementById('inqWeight').value = '';
    document.getElementById('inqCargo').value = '';
    document.getElementById('inqDate').value = '';
    document.getElementById('priceEstimate').innerHTML = '';
}

function handleBookingSubmit() {
    var service = document.getElementById('bookService').value;
    var from = document.getElementById('bookFrom').value;
    var to = document.getElementById('bookTo').value;
    var cargo = document.getElementById('bookCargo').value;
    var weight = document.getElementById('bookWeight').value;
    var date = document.getElementById('bookDate').value;
    var time = document.getElementById('bookTime').value;

    if (!from || !to || !cargo || !weight || !date) {
        alert('請填寫所有必填欄位');
        return;
    }

    var orderId = generateOrderId();
    var amount = estimatePrice(service, parseFloat(weight));

    DEMO_DATA.orders.push({
        id: orderId,
        service: service,
        from: from,
        to: to,
        status: 'pending',
        amount: amount,
        date: date,
        driver: '--',
        cargo: cargo,
        weight: parseFloat(weight)
    });

    var el = document.getElementById('bookingConfirm');
    el.innerHTML = '<div class="portal-confirmation">' +
        '<div class="confirm-icon">&#128666;</div>' +
        '<h4>預約成功</h4>' +
        '<p>訂單編號：<strong>' + orderId + '</strong></p>' +
        '<p>' + service + ' | ' + date + ' ' + time + '</p>' +
        '<p>預估金額：' + formatCurrency(amount) + '</p>' +
        '</div>';

    // Clear form fields
    document.getElementById('bookFrom').value = '';
    document.getElementById('bookTo').value = '';
    document.getElementById('bookCargo').value = '';
    document.getElementById('bookWeight').value = '';
    document.getElementById('bookDate').value = '';
    document.getElementById('bookNotes').value = '';
}

function applyTrackFilter() {
    var filter = document.getElementById('trackFilter').value;
    var orders = DEMO_DATA.orders;
    if (filter !== 'all') {
        orders = orders.filter(function(o) { return o.status === filter; });
    }
    document.getElementById('trackingList').innerHTML = renderTrackingOrders(orders);
}

function applyHistoryFilter() {
    var from = document.getElementById('histFrom').value;
    var to = document.getElementById('histTo').value;
    var orders = DEMO_DATA.orders.filter(function(o) {
        if (from && o.date < from) return false;
        if (to && o.date > to) return false;
        return true;
    });

    // Update summary
    var totalAmount = orders.reduce(function(s, o) { return s + o.amount; }, 0);
    var avg = orders.length > 0 ? Math.round(totalAmount / orders.length) : 0;

    document.getElementById('historyTableWrap').innerHTML = renderHistoryTable(orders);

    // Rebuild summary inline
    var summaryEls = document.querySelectorAll('.portal-summary .summary-value');
    if (summaryEls.length >= 3) {
        summaryEls[0].textContent = orders.length;
        summaryEls[1].textContent = formatCurrency(totalAmount);
        summaryEls[2].textContent = formatCurrency(avg);
    }
}

/* ============================================================
   Navigation & View Switching
   ============================================================ */
var currentView = 'dashboard';

function switchView(viewId) {
    currentView = viewId;

    // Update sidebar active state
    var navItems = document.querySelectorAll('.portal-nav-item[data-view]');
    for (var i = 0; i < navItems.length; i++) {
        navItems[i].classList.remove('active');
        if (navItems[i].getAttribute('data-view') === viewId) {
            navItems[i].classList.add('active');
        }
    }

    // Update header title
    document.getElementById('headerTitle').textContent = VIEW_TITLES[viewId] || viewId;

    // Render view
    renderView(viewId);

    // Close mobile sidebar
    closeMobileSidebar();
}

function renderView(viewId) {
    var content = document.getElementById('portalContent');
    switch (viewId) {
        case 'dashboard': content.innerHTML = renderDashboard(); break;
        case 'inquiry':   content.innerHTML = renderInquiry(); break;
        case 'booking':   content.innerHTML = renderBooking(); break;
        case 'tracking':  content.innerHTML = renderTracking(); break;
        case 'history':   content.innerHTML = renderHistory(); break;
        default:          content.innerHTML = renderDashboard();
    }
}

/* ============================================================
   Mobile Sidebar
   ============================================================ */
function openMobileSidebar() {
    document.getElementById('portalSidebar').classList.add('open');
    document.getElementById('portalOverlay').classList.add('active');
}

function closeMobileSidebar() {
    document.getElementById('portalSidebar').classList.remove('open');
    document.getElementById('portalOverlay').classList.remove('active');
}

/* ============================================================
   Login / Logout
   ============================================================ */
function handleLogin(e) {
    e.preventDefault();
    var pw = document.getElementById('loginPassword').value;
    if (pw === SHIPPER_PASSWORD) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('portalApp').classList.add('active');
        renderView('dashboard');
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

function handleLogout() {
    document.getElementById('portalApp').classList.remove('active');
    document.getElementById('loginScreen').style.display = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginError').style.display = 'none';
    currentView = 'dashboard';

    // Reset sidebar active
    var navItems = document.querySelectorAll('.portal-nav-item[data-view]');
    for (var i = 0; i < navItems.length; i++) {
        navItems[i].classList.remove('active');
        if (navItems[i].getAttribute('data-view') === 'dashboard') {
            navItems[i].classList.add('active');
        }
    }
}

/* ============================================================
   Init
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Sidebar navigation
    var navItems = document.querySelectorAll('.portal-nav-item[data-view]');
    for (var i = 0; i < navItems.length; i++) {
        navItems[i].addEventListener('click', function() {
            switchView(this.getAttribute('data-view'));
        });
    }

    // Hamburger
    document.getElementById('hamburgerBtn').addEventListener('click', openMobileSidebar);

    // Overlay close
    document.getElementById('portalOverlay').addEventListener('click', closeMobileSidebar);
});
