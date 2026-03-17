/**
 * 富昇智慧物流平台 — 車隊入口 SPA
 */

/* ============================================================
   Local State
   ============================================================ */
var fleetOrders = [];
var currentDriver = null;
var currentView = 'dashboard';

var FLEET_VIEW_TITLES = {
    dashboard: '任務總覽',
    accept: '接單管理',
    execution: '任務執行',
    performance: '績效統計'
};

var FLEET_STATUS_MAP = {
    '待接單':  { cls: 'pending' },
    '已接單':  { cls: 'accepted' },
    '取貨中':  { cls: 'pickup' },
    '配送中':  { cls: 'transit' },
    '已送達':  { cls: 'delivered' },
    '已取消':  { cls: 'cancelled' }
};

/* ============================================================
   Helper Functions
   ============================================================ */
function fleetBadge(status) {
    var s = FLEET_STATUS_MAP[status] || { cls: '' };
    return '<span class="portal-badge ' + s.cls + '">' + status + '</span>';
}

function fleetFormatCurrency(n) {
    return 'NT$ ' + Number(n).toLocaleString();
}

function showToast(message) {
    var toast = document.getElementById('toastNotification');
    toast.textContent = message;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    setTimeout(function() {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
    }, 2500);
}

function getOrdersByStatus(status) {
    return fleetOrders.filter(function(o) { return o.status === status; });
}

function getActiveOrders() {
    return fleetOrders.filter(function(o) {
        return o.status === '已接單' || o.status === '取貨中' || o.status === '配送中';
    });
}

/* ============================================================
   View: Dashboard (任務總覽)
   ============================================================ */
function renderFleetDashboard() {
    var totalToday = fleetOrders.length;
    var pending = getOrdersByStatus('待接單').length;
    var inProgress = fleetOrders.filter(function(o) {
        return o.status === '取貨中' || o.status === '配送中';
    }).length;
    var completed = getOrdersByStatus('已送達').length;

    var html = '';

    // Stat cards
    html += '<div class="portal-stats">';
    html += '<div class="portal-stat-card"><span class="stat-icon">&#128203;</span><div class="stat-label">今日任務</div><div class="stat-value">' + totalToday + '</div></div>';
    html += '<div class="portal-stat-card"><span class="stat-icon">&#9200;</span><div class="stat-label">待接單</div><div class="stat-value">' + pending + '</div></div>';
    html += '<div class="portal-stat-card"><span class="stat-icon">&#128666;</span><div class="stat-label">配送中</div><div class="stat-value">' + inProgress + '</div></div>';
    html += '<div class="portal-stat-card"><span class="stat-icon">&#9989;</span><div class="stat-label">已完成</div><div class="stat-value">' + completed + '</div></div>';
    html += '</div>';

    // Active tasks
    var active = getActiveOrders();
    html += '<div class="portal-table-wrap">';
    html += '<div class="portal-table-header"><h3>進行中任務</h3></div>';
    if (active.length > 0) {
        html += '<div style="padding:16px;">';
        for (var i = 0; i < active.length; i++) {
            var o = active[i];
            html += '<div style="background:var(--gray-50);border-radius:8px;padding:16px;margin-bottom:12px;border:1px solid var(--border);">';
            html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
            html += '<strong>' + o.id + '</strong> ' + fleetBadge(o.status);
            html += '</div>';
            html += '<div style="font-size:0.875rem;color:var(--text-body);margin-bottom:4px;">' + o.service + ' | ' + o.shipper + '</div>';
            html += '<div style="font-size:0.85rem;color:var(--text-body);">';
            html += '<strong>起：</strong>' + o.from + '<br>';
            html += '<strong>迄：</strong>' + o.to;
            html += '</div>';
            html += '</div>';
        }
        html += '</div>';
    } else {
        html += '<div style="text-align:center;padding:40px;color:var(--text-light);">目前沒有進行中的任務</div>';
    }
    html += '</div>';

    // Quick stats bar
    html += '<div class="portal-summary">';
    html += '<div class="portal-summary-item"><div class="summary-label">已接單</div><div class="summary-value">' + getOrdersByStatus('已接單').length + '</div></div>';
    html += '<div class="portal-summary-item"><div class="summary-label">取貨中</div><div class="summary-value">' + getOrdersByStatus('取貨中').length + '</div></div>';
    html += '<div class="portal-summary-item"><div class="summary-label">配送中</div><div class="summary-value">' + getOrdersByStatus('配送中').length + '</div></div>';
    html += '<div class="portal-summary-item"><div class="summary-label">完成率</div><div class="summary-value">' + (totalToday > 0 ? Math.round(completed / totalToday * 100) : 0) + '%</div></div>';
    html += '</div>';

    return html;
}

/* ============================================================
   View: Accept Orders (接單管理)
   ============================================================ */
function renderAcceptOrders() {
    var pending = getOrdersByStatus('待接單');
    var html = '';

    html += '<div style="margin-bottom:16px;font-size:0.9rem;color:var(--text-body);">共 <strong>' + pending.length + '</strong> 筆待接訂單</div>';

    if (pending.length === 0) {
        html += '<div class="portal-table-wrap" style="text-align:center;padding:60px 20px;">';
        html += '<div style="font-size:2rem;margin-bottom:12px;">&#128077;</div>';
        html += '<div style="color:var(--text-light);font-size:1rem;">目前沒有待接的訂單</div>';
        html += '</div>';
        return html;
    }

    for (var i = 0; i < pending.length; i++) {
        var o = pending[i];
        html += '<div class="portal-table-wrap" id="order-card-' + o.id + '" style="padding:20px;margin-bottom:16px;transition:all 0.3s ease;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">';
        html += '<div><strong style="font-size:1rem;">' + o.id + '</strong> ' + fleetBadge(o.status) + '</div>';
        html += '<div style="font-size:1.1rem;font-weight:700;color:var(--portal-accent);">' + fleetFormatCurrency(o.amount) + '</div>';
        html += '</div>';

        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.875rem;color:var(--text-body);margin-bottom:12px;">';
        html += '<div><strong>貨主：</strong>' + o.shipper + '</div>';
        html += '<div><strong>服務：</strong>' + o.service + '</div>';
        html += '</div>';

        html += '<div style="font-size:0.875rem;color:var(--text-body);margin-bottom:16px;">';
        html += '<div style="margin-bottom:4px;"><strong>起：</strong>' + o.from + '</div>';
        html += '<div><strong>迄：</strong>' + o.to + '</div>';
        html += '</div>';

        html += '<div style="display:flex;gap:12px;">';
        html += '<button class="portal-btn portal-btn-sm" style="background:#10b981;color:#fff;flex:1;" onclick="handleAcceptOrder(\'' + o.id + '\')">&#10003; 接單</button>';
        html += '<button class="portal-btn portal-btn-sm" style="background:#ef4444;color:#fff;flex:1;" onclick="handleRejectOrder(\'' + o.id + '\')">&#10005; 拒單</button>';
        html += '</div>';
        html += '</div>';
    }

    return html;
}

function handleAcceptOrder(orderId) {
    for (var i = 0; i < fleetOrders.length; i++) {
        if (fleetOrders[i].id === orderId) {
            fleetOrders[i].status = '已接單';
            fleetOrders[i].driver = currentDriver.name;
            break;
        }
    }
    showToast('已成功接單：' + orderId);
    renderView('accept');
}

function handleRejectOrder(orderId) {
    var card = document.getElementById('order-card-' + orderId);
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateX(100px)';
        card.style.maxHeight = card.scrollHeight + 'px';
        setTimeout(function() {
            card.style.maxHeight = '0';
            card.style.padding = '0 20px';
            card.style.marginBottom = '0';
            card.style.overflow = 'hidden';
        }, 200);
        setTimeout(function() {
            // Remove from local data
            fleetOrders = fleetOrders.filter(function(o) { return o.id !== orderId; });
            showToast('已拒絕訂單：' + orderId);
            renderView('accept');
        }, 500);
    }
}

/* ============================================================
   View: Task Execution (任務執行)
   ============================================================ */
function renderTaskExecution() {
    var tasks = fleetOrders.filter(function(o) {
        return o.status === '已接單' || o.status === '取貨中' || o.status === '配送中';
    });
    var html = '';

    html += '<div style="margin-bottom:16px;font-size:0.9rem;color:var(--text-body);">共 <strong>' + tasks.length + '</strong> 筆進行中任務</div>';

    if (tasks.length === 0) {
        html += '<div class="portal-table-wrap" style="text-align:center;padding:60px 20px;">';
        html += '<div style="font-size:2rem;margin-bottom:12px;">&#128203;</div>';
        html += '<div style="color:var(--text-light);font-size:1rem;">目前沒有進行中的任務</div>';
        html += '<div style="color:var(--text-light);font-size:0.85rem;margin-top:8px;">前往「接單管理」接取新任務</div>';
        html += '</div>';
        return html;
    }

    for (var i = 0; i < tasks.length; i++) {
        var o = tasks[i];
        html += '<div class="portal-table-wrap" style="padding:20px;margin-bottom:16px;">';

        // Header
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">';
        html += '<strong style="font-size:1rem;">' + o.id + '</strong> ' + fleetBadge(o.status);
        html += '</div>';

        // Info
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.875rem;color:var(--text-body);margin-bottom:8px;">';
        html += '<div><strong>貨主：</strong>' + o.shipper + '</div>';
        html += '<div><strong>服務：</strong>' + o.service + '</div>';
        html += '<div><strong>金額：</strong>' + fleetFormatCurrency(o.amount) + '</div>';
        html += '<div><strong>日期：</strong>' + o.date + '</div>';
        html += '</div>';

        html += '<div style="font-size:0.875rem;color:var(--text-body);margin-bottom:16px;">';
        html += '<div style="margin-bottom:4px;"><strong>起：</strong>' + o.from + '</div>';
        html += '<div><strong>迄：</strong>' + o.to + '</div>';
        html += '</div>';

        // Status flow visualization
        var steps = ['已接單', '取貨中', '配送中', '已送達'];
        var currentIdx = steps.indexOf(o.status);
        html += '<div class="status-flow" style="margin-bottom:16px;">';
        for (var j = 0; j < steps.length; j++) {
            if (j > 0) html += '<span class="status-flow-arrow">&#9654;</span>';
            var stepCls = '';
            if (j < currentIdx) stepCls = 'done';
            else if (j === currentIdx) stepCls = 'current';
            html += '<span class="status-flow-step ' + stepCls + '">' + steps[j] + '</span>';
        }
        html += '</div>';

        // Action button based on current status
        if (o.status === '已接單') {
            html += '<button class="portal-btn portal-btn-sm" style="background:#8b5cf6;color:#fff;width:100%;" onclick="handleStatusChange(\'' + o.id + '\', \'取貨中\')">&#128230; 開始取貨</button>';
        } else if (o.status === '取貨中') {
            html += '<button class="portal-btn portal-btn-sm" style="background:#06b6d4;color:#fff;width:100%;" onclick="handleStatusChange(\'' + o.id + '\', \'配送中\')">&#128666; 開始配送</button>';
        } else if (o.status === '配送中') {
            html += '<button class="portal-btn portal-btn-sm" style="background:#10b981;color:#fff;width:100%;" onclick="handleStatusChange(\'' + o.id + '\', \'已送達\')">&#9989; 確認送達</button>';
        }

        html += '</div>';
    }

    return html;
}

function handleStatusChange(orderId, newStatus) {
    for (var i = 0; i < fleetOrders.length; i++) {
        if (fleetOrders[i].id === orderId) {
            fleetOrders[i].status = newStatus;
            break;
        }
    }
    var messages = {
        '取貨中': '開始取貨：' + orderId,
        '配送中': '開始配送：' + orderId,
        '已送達': '已確認送達：' + orderId
    };
    showToast(messages[newStatus] || '狀態已更新');
    renderView('execution');
}

/* ============================================================
   View: Performance (績效統計)
   ============================================================ */
function renderPerformance() {
    var driver = currentDriver;
    var html = '';

    // Stat cards
    var monthlyOrders = driver.todayDone * 22; // approximate monthly
    html += '<div class="portal-stats">';
    html += '<div class="portal-stat-card"><span class="stat-icon">&#128203;</span><div class="stat-label">本月接單量</div><div class="stat-value">' + monthlyOrders + '</div></div>';
    html += '<div class="portal-stat-card"><span class="stat-icon">&#9200;</span><div class="stat-label">準時率</div><div class="stat-value">' + driver.onTime + '%</div></div>';
    html += '<div class="portal-stat-card"><span class="stat-icon">&#9989;</span><div class="stat-label">完成率</div><div class="stat-value">' + Math.min(driver.onTime + 2, 100) + '%</div></div>';
    html += '<div class="portal-stat-card"><span class="stat-icon">&#11088;</span><div class="stat-label">客戶評分</div><div class="stat-value">' + driver.rating + '</div></div>';
    html += '</div>';

    // 7-day trend bar chart (CSS bars)
    html += '<div class="portal-table-wrap" style="padding:24px;margin-bottom:24px;">';
    html += '<h3 style="font-family:var(--font-heading);font-size:1rem;font-weight:600;color:var(--text-dark);margin-bottom:20px;">近 7 日接單趨勢</h3>';

    var dailyData = [
        { day: '一', value: Math.round(driver.todayDone * 0.7) },
        { day: '二', value: Math.round(driver.todayDone * 0.85) },
        { day: '三', value: Math.round(driver.todayDone * 1.1) },
        { day: '四', value: Math.round(driver.todayDone * 0.9) },
        { day: '五', value: Math.round(driver.todayDone * 1.2) },
        { day: '六', value: Math.round(driver.todayDone * 0.6) },
        { day: '日', value: driver.todayDone }
    ];
    var maxVal = Math.max.apply(null, dailyData.map(function(d) { return d.value; })) || 1;

    html += '<div style="display:flex;align-items:flex-end;gap:12px;height:160px;padding:0 8px;">';
    for (var i = 0; i < dailyData.length; i++) {
        var d = dailyData[i];
        var pct = Math.round((d.value / maxVal) * 100);
        var barColor = i === dailyData.length - 1 ? 'var(--portal-accent)' : '#94a3b8';
        html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;">';
        html += '<div style="font-size:0.75rem;font-weight:600;color:var(--text-dark);">' + d.value + '</div>';
        html += '<div style="width:100%;height:' + Math.max(pct, 5) + '%;background:' + barColor + ';border-radius:4px 4px 0 0;min-height:4px;transition:height 0.3s;"></div>';
        html += '<div style="font-size:0.75rem;color:var(--text-light);">週' + d.day + '</div>';
        html += '</div>';
    }
    html += '</div>';
    html += '</div>';

    // Performance metrics table
    html += '<div class="portal-table-wrap">';
    html += '<div class="portal-table-header"><h3>績效明細</h3></div>';
    html += '<table class="portal-table">';
    html += '<thead><tr><th>指標</th><th>數值</th><th>目標</th><th>狀態</th></tr></thead>';
    html += '<tbody>';

    var metrics = [
        { name: '本月接單量', value: monthlyOrders, target: 200, unit: '單' },
        { name: '準時率', value: driver.onTime, target: 95, unit: '%' },
        { name: '完成率', value: Math.min(driver.onTime + 2, 100), target: 98, unit: '%' },
        { name: '客戶評分', value: driver.rating, target: 4.5, unit: '分' },
        { name: '今日完成', value: driver.todayDone, target: 10, unit: '單' },
        { name: '拒單率', value: 3, target: 5, unit: '%' }
    ];

    for (var i = 0; i < metrics.length; i++) {
        var m = metrics[i];
        var achieved = m.name === '拒單率' ? m.value <= m.target : m.value >= m.target;
        html += '<tr>';
        html += '<td><strong>' + m.name + '</strong></td>';
        html += '<td>' + m.value + ' ' + m.unit + '</td>';
        html += '<td>' + m.target + ' ' + m.unit + '</td>';
        html += '<td>' + (achieved ? '<span class="portal-badge delivered">達標</span>' : '<span class="portal-badge pending">未達</span>') + '</td>';
        html += '</tr>';
    }
    html += '</tbody></table></div>';

    // Driver info
    html += '<div class="portal-summary">';
    html += '<div class="portal-summary-item"><div class="summary-label">司機</div><div class="summary-value">' + driver.name + '</div></div>';
    html += '<div class="portal-summary-item"><div class="summary-label">車隊</div><div class="summary-value">' + driver.fleet + '</div></div>';
    html += '<div class="portal-summary-item"><div class="summary-label">車型</div><div class="summary-value">' + driver.vehicle + '</div></div>';
    html += '<div class="portal-summary-item"><div class="summary-label">狀態</div><div class="summary-value">' + driver.status + '</div></div>';
    html += '</div>';

    return html;
}

/* ============================================================
   Navigation & View Switching
   ============================================================ */
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
    document.getElementById('headerTitle').textContent = FLEET_VIEW_TITLES[viewId] || viewId;

    // Render view
    renderView(viewId);

    // Close mobile sidebar
    closeMobileSidebar();
}

function renderView(viewId) {
    var content = document.getElementById('portalContent');
    switch (viewId) {
        case 'dashboard':   content.innerHTML = renderFleetDashboard(); break;
        case 'accept':      content.innerHTML = renderAcceptOrders(); break;
        case 'execution':   content.innerHTML = renderTaskExecution(); break;
        case 'performance': content.innerHTML = renderPerformance(); break;
        default:            content.innerHTML = renderFleetDashboard();
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
    if (pw === API_CONFIG.FLEET_PASSWORD) {
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
    // Create local copy of orders so status changes persist in session
    fleetOrders = DEMO_DATA.orders.map(function(o) {
        return {
            id: o.id,
            shipper: o.shipper,
            service: o.service,
            from: o.from,
            to: o.to,
            status: o.status,
            amount: o.amount,
            date: o.date,
            driver: o.driver
        };
    });

    // Use first driver as current user
    currentDriver = DEMO_DATA.drivers[0];

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
