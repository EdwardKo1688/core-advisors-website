// ============================================================
//  富昇智慧物流平台 — Admin Dashboard SPA
//  營運管理中心
// ============================================================

(function () {
  'use strict';

  // ---- DOM refs ----
  const loginScreen = document.getElementById('adminLogin');
  const adminApp    = document.getElementById('adminApp');
  const adminContent = document.getElementById('adminContent');
  const headerTitle  = document.getElementById('headerTitle');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContainer = document.getElementById('modalContainer');
  const loginError   = document.getElementById('loginError');

  let currentView = 'dashboard';

  // ============================================================
  //  1. Login
  // ============================================================
  document.getElementById('btnLogin').addEventListener('click', handleLogin);
  document.getElementById('adminPassword').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleLogin();
  });

  function handleLogin() {
    const pw = document.getElementById('adminPassword').value.trim();
    if (pw === API_CONFIG.ADMIN_PASSWORD) {
      loginScreen.style.display = 'none';
      adminApp.style.display = 'flex';
      loginError.classList.remove('show');
      navigateTo('dashboard');
    } else {
      loginError.classList.add('show');
    }
  }

  // ---- Logout ----
  document.getElementById('btnLogout').addEventListener('click', function () {
    adminApp.style.display = 'none';
    loginScreen.style.display = '';
    document.getElementById('adminPassword').value = '';
  });

  // ---- Mobile sidebar toggle ----
  document.getElementById('sidebarToggle').addEventListener('click', function () {
    document.getElementById('adminSidebar').classList.toggle('open');
  });

  // ============================================================
  //  2. Navigation
  // ============================================================
  document.querySelectorAll('.admin-sidebar-nav .nav-item[data-view]').forEach(function (item) {
    item.addEventListener('click', function () {
      navigateTo(this.dataset.view);
      // close mobile sidebar
      document.getElementById('adminSidebar').classList.remove('open');
    });
  });

  const viewTitles = {
    dashboard: '儀表板',
    orders: '訂單管理',
    fleet: '車隊管理',
    kpi: 'KPI追蹤',
    customers: '客戶管理',
  };

  function navigateTo(view) {
    currentView = view;
    headerTitle.textContent = viewTitles[view] || view;
    // active state
    document.querySelectorAll('.admin-sidebar-nav .nav-item').forEach(function (n) {
      n.classList.toggle('active', n.dataset.view === view);
    });
    renderView(view);
  }

  function renderView(view) {
    switch (view) {
      case 'dashboard':  renderAdminDashboard(); break;
      case 'orders':     renderOrderManagement(); break;
      case 'fleet':      renderFleetManagement(); break;
      case 'kpi':        renderKPITracking(); break;
      case 'customers':  renderCustomerManagement(); break;
    }
  }

  // ============================================================
  //  3a. Dashboard
  // ============================================================
  function renderAdminDashboard() {
    var k = DEMO_DATA.kpis;
    var days = ['一','二','三','四','五','六','日'];
    var maxOrders = Math.max.apply(null, k.monthlyOrders);

    var barsHtml = k.monthlyOrders.map(function (v, i) {
      var pct = Math.round((v / maxOrders) * 100);
      return '<div class="bar-item">' +
        '<span class="bar-value">' + v + '</span>' +
        '<div class="bar-fill" style="height:' + pct + '%"></div>' +
        '<span class="bar-label">週' + days[i] + '</span>' +
      '</div>';
    }).join('');

    var alertsHtml =
      alertItem('⚠️', '車隊FL-003準時率下降', '南區專車隊準時率降至 89%，低於目標 98%', '30分鐘前', '') +
      alertItem('🔴', '訂單FS-20260303-005異常', '待接單超過24小時未分配司機', '1小時前', 'alert-danger') +
      alertItem('ℹ️', '新客戶詢價', '新創公司X 提交 S90 小件配送詢價', '2小時前', 'alert-info');

    adminContent.innerHTML =
      '<div class="admin-kpi-grid">' +
        kpiCard('kpi-blue', '今日訂單', k.todayOrders, '單', '+8.5%', 'up') +
        kpiCard('kpi-green', '活躍車隊', k.activeFleets, '隊', '', '') +
        kpiCard('kpi-orange', '準時率', k.onTimeRate + '%', '', '-1.2%', 'down') +
        kpiCard('kpi-purple', '今日營收', 'NT$' + formatNum(k.revenue), '', '+12.3%', 'up') +
      '</div>' +
      '<div class="admin-dashboard-grid">' +
        '<div class="admin-section">' +
          '<div class="admin-section-title">📊 近7日訂單趨勢</div>' +
          '<div class="admin-bar-chart">' + barsHtml + '</div>' +
        '</div>' +
        '<div class="admin-section">' +
          '<div class="admin-section-title">🔔 即時警報</div>' +
          '<div class="admin-alerts-list">' + alertsHtml + '</div>' +
        '</div>' +
      '</div>';
  }

  // ============================================================
  //  3b. Order Management
  // ============================================================
  function renderOrderManagement() {
    var orders = DEMO_DATA.orders;

    var filterHtml =
      '<div class="admin-filter-bar">' +
        '<span class="filter-label">篩選：</span>' +
        '<input type="date" id="filterDateFrom" title="起始日期">' +
        '<input type="date" id="filterDateTo" title="結束日期">' +
        '<select id="filterStatus">' +
          '<option value="">全部狀態</option>' +
          '<option value="待接單">待接單</option>' +
          '<option value="已接單">已接單</option>' +
          '<option value="配送中">配送中</option>' +
          '<option value="已送達">已送達</option>' +
        '</select>' +
        '<select id="filterService">' +
          '<option value="">全部服務</option>' +
          '<option value="S90小件">S90小件</option>' +
          '<option value="1.9噸配送">1.9噸配送</option>' +
          '<option value="3.5噸配送">3.5噸配送</option>' +
          '<option value="專車棧板">專車棧板</option>' +
          '<option value="第三地出貨">第三地出貨</option>' +
        '</select>' +
      '</div>';

    adminContent.innerHTML =
      '<div class="admin-section">' +
        filterHtml +
        '<div class="admin-table-wrap">' +
          '<table class="admin-table" id="ordersTable">' +
            '<thead><tr>' +
              '<th>訂單編號</th><th>託運人</th><th>服務</th><th>出發地</th><th>目的地</th><th>狀態</th><th>金額</th><th>日期</th><th>司機</th><th>操作</th>' +
            '</tr></thead>' +
            '<tbody>' + ordersTableRows(orders) + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';

    // Filter listeners
    ['filterStatus', 'filterService', 'filterDateFrom', 'filterDateTo'].forEach(function (id) {
      document.getElementById(id).addEventListener('change', applyOrderFilters);
    });
  }

  function ordersTableRows(orders) {
    return orders.map(function (o) {
      return '<tr>' +
        '<td><strong>' + o.id + '</strong></td>' +
        '<td>' + o.shipper + '</td>' +
        '<td>' + o.service + '</td>' +
        '<td>' + o.from + '</td>' +
        '<td>' + o.to + '</td>' +
        '<td>' + statusBadge(o.status) + '</td>' +
        '<td>NT$' + formatNum(o.amount) + '</td>' +
        '<td>' + o.date + '</td>' +
        '<td>' + (o.driver || '-') + '</td>' +
        '<td><button class="btn-table-action" onclick="window._adminShowOrder(\'' + o.id + '\')">查看</button></td>' +
      '</tr>';
    }).join('');
  }

  function applyOrderFilters() {
    var status  = document.getElementById('filterStatus').value;
    var service = document.getElementById('filterService').value;
    var from    = document.getElementById('filterDateFrom').value;
    var to      = document.getElementById('filterDateTo').value;

    var filtered = DEMO_DATA.orders.filter(function (o) {
      if (status && o.status !== status) return false;
      if (service && o.service !== service) return false;
      if (from && o.date < from) return false;
      if (to && o.date > to) return false;
      return true;
    });

    document.querySelector('#ordersTable tbody').innerHTML = ordersTableRows(filtered);
  }

  // Show order detail modal
  window._adminShowOrder = function (orderId) {
    var order = DEMO_DATA.orders.find(function (o) { return o.id === orderId; });
    if (!order) return;

    var statusOptions = ['待接單','已接單','配送中','已送達'].map(function (s) {
      return '<option' + (s === order.status ? ' selected' : '') + '>' + s + '</option>';
    }).join('');

    var html =
      '<div class="admin-modal-header">' +
        '<h3>訂單詳情 — ' + order.id + '</h3>' +
        '<button class="admin-modal-close" onclick="window._adminHideModal()">&times;</button>' +
      '</div>' +
      '<div class="admin-modal-body">' +
        '<div class="detail-grid">' +
          detailItem('訂單編號', order.id) +
          detailItem('狀態', statusBadge(order.status)) +
          detailItem('託運人', order.shipper) +
          detailItem('服務類型', order.service) +
          detailItem('出發地', order.from) +
          detailItem('目的地', order.to) +
          detailItem('金額', 'NT$' + formatNum(order.amount)) +
          detailItem('日期', order.date) +
          detailItem('配送司機', order.driver || '尚未指派') +
          '<div class="detail-item">' +
            '<span class="detail-label">變更狀態</span>' +
            '<select class="detail-value" id="modalStatusChange" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px">' +
              statusOptions +
            '</select>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="admin-modal-footer">' +
        '<button class="btn-modal" onclick="window._adminHideModal()">關閉</button>' +
        '<button class="btn-modal btn-primary" onclick="window._adminUpdateOrderStatus(\'' + order.id + '\')">儲存變更</button>' +
      '</div>';

    showModal(html);
  };

  window._adminUpdateOrderStatus = function (orderId) {
    var newStatus = document.getElementById('modalStatusChange').value;
    var order = DEMO_DATA.orders.find(function (o) { return o.id === orderId; });
    if (order) {
      order.status = newStatus;
    }
    hideModal();
    renderOrderManagement();
  };

  // ============================================================
  //  3c. Fleet Management
  // ============================================================
  function renderFleetManagement() {
    var fleetsHtml = DEMO_DATA.fleets.map(function (f) {
      return '<div class="fleet-summary-card">' +
        '<div class="fleet-name">' + f.name + '</div>' +
        '<div class="fleet-type">' + f.type + '</div>' +
        '<div class="fleet-stats">' +
          fleetStat(f.vehicles, '車輛數') +
          fleetStat(f.drivers, '司機數') +
          fleetStat(f.online, '在線人數') +
          fleetStat(f.todayDone, '今日完成') +
        '</div>' +
        '<div style="margin-top:12px;text-align:right">' +
          '<span style="font-size:0.8rem;color:var(--text-muted)">評分 </span>' +
          '<span style="font-weight:700;color:var(--warning)">★ ' + f.rating + '</span>' +
        '</div>' +
      '</div>';
    }).join('');

    var driversHtml = DEMO_DATA.drivers.map(function (d) {
      return '<tr>' +
        '<td><strong>' + d.name + '</strong></td>' +
        '<td>' + d.fleet + '</td>' +
        '<td>' + d.vehicle + '</td>' +
        '<td>' + driverStatusBadge(d.status) + '</td>' +
        '<td>' + d.todayDone + '</td>' +
        '<td>' + d.onTime + '%</td>' +
        '<td><span style="color:var(--warning)">★</span> ' + d.rating + '</td>' +
      '</tr>';
    }).join('');

    adminContent.innerHTML =
      '<div class="admin-section">' +
        '<div class="admin-section-title">🚛 車隊總覽</div>' +
        '<div class="fleet-summary-grid">' + fleetsHtml + '</div>' +
      '</div>' +
      '<div class="admin-section">' +
        '<div class="admin-section-title" style="justify-content:space-between">' +
          '<span>👤 司機列表</span>' +
          '<button class="btn-table-action btn-dispatch" onclick="window._adminShowDispatch()">➕ 派車</button>' +
        '</div>' +
        '<div class="admin-table-wrap">' +
          '<table class="admin-table">' +
            '<thead><tr>' +
              '<th>姓名</th><th>所屬車隊</th><th>車型</th><th>狀態</th><th>今日完成</th><th>準時率</th><th>評分</th>' +
            '</tr></thead>' +
            '<tbody>' + driversHtml + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
  }

  // Dispatch modal
  window._adminShowDispatch = function () {
    var pendingOrders = DEMO_DATA.orders.filter(function (o) { return o.status === '待接單'; });
    var availableDrivers = DEMO_DATA.drivers.filter(function (d) { return d.status === '在線'; });

    var orderOpts = pendingOrders.map(function (o) {
      return '<option value="' + o.id + '">' + o.id + ' — ' + o.shipper + ' (' + o.service + ')</option>';
    }).join('');

    var driverOpts = availableDrivers.map(function (d) {
      return '<option value="' + d.id + '">' + d.name + ' — ' + d.fleet + ' (' + d.vehicle + ')</option>';
    }).join('');

    if (!pendingOrders.length) {
      orderOpts = '<option value="">目前無待接單訂單</option>';
    }
    if (!availableDrivers.length) {
      driverOpts = '<option value="">目前無可用司機</option>';
    }

    var html =
      '<div class="admin-modal-header">' +
        '<h3>手動派車</h3>' +
        '<button class="admin-modal-close" onclick="window._adminHideModal()">&times;</button>' +
      '</div>' +
      '<div class="admin-modal-body">' +
        '<div class="dispatch-form">' +
          '<div class="form-group">' +
            '<label>選擇訂單（待接單）</label>' +
            '<select id="dispatchOrder">' + orderOpts + '</select>' +
          '</div>' +
          '<div class="form-group">' +
            '<label>指派司機（在線）</label>' +
            '<select id="dispatchDriver">' + driverOpts + '</select>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="admin-modal-footer">' +
        '<button class="btn-modal" onclick="window._adminHideModal()">取消</button>' +
        '<button class="btn-modal btn-primary" onclick="window._adminDoDispatch()">確認派車</button>' +
      '</div>';

    showModal(html);
  };

  window._adminDoDispatch = function () {
    var orderId  = document.getElementById('dispatchOrder').value;
    var driverId = document.getElementById('dispatchDriver').value;
    if (!orderId || !driverId) { hideModal(); return; }

    var order  = DEMO_DATA.orders.find(function (o) { return o.id === orderId; });
    var driver = DEMO_DATA.drivers.find(function (d) { return d.id === driverId; });

    if (order && driver) {
      order.status = '已接單';
      order.driver = driver.name;
    }

    hideModal();
    renderFleetManagement();
  };

  // ============================================================
  //  3d. KPI Tracking
  // ============================================================
  function renderKPITracking() {
    var k = DEMO_DATA.kpis;

    var kpis = [
      { name: '今日訂單', current: k.todayOrders, target: k.targetOrders, unit: '單', color: 'blue' },
      { name: '活躍車隊', current: k.activeFleets, target: k.targetFleets, unit: '隊', color: 'green' },
      { name: '準時率', current: k.onTimeRate, target: k.targetOnTime, unit: '%', color: 'orange' },
      { name: '今日營收', current: k.revenue, target: k.targetRevenue, unit: 'NT$', color: 'purple' },
    ];

    var cardsHtml = kpis.map(function (item) {
      var pct = Math.min(Math.round((item.current / item.target) * 100), 100);
      var fillClass = pct >= 90 ? 'fill-green' : pct >= 70 ? 'fill-blue' : pct >= 50 ? 'fill-orange' : 'fill-red';
      var currentDisplay = item.unit === 'NT$' ? 'NT$' + formatNum(item.current) : item.current + (item.unit === '%' ? '%' : '');
      var targetDisplay  = item.unit === 'NT$' ? 'NT$' + formatNum(item.target) : item.target + (item.unit === '%' ? '%' : '');

      return '<div class="kpi-progress-card">' +
        '<div class="kpi-prog-header">' +
          '<span class="kpi-prog-name">' + item.name + '</span>' +
          '<span class="kpi-prog-pct" style="color:var(--' + (pct >= 70 ? 'success' : 'danger') + ')">' + pct + '%</span>' +
        '</div>' +
        '<div class="kpi-prog-values">' +
          '<span>目前：' + currentDisplay + '</span>' +
          '<span>目標：' + targetDisplay + '</span>' +
        '</div>' +
        '<div class="kpi-progress-bar">' +
          '<div class="kpi-prog-fill ' + fillClass + '" style="width:' + pct + '%"></div>' +
        '</div>' +
      '</div>';
    }).join('');

    // Trend chart
    var days = ['一','二','三','四','五','六','日'];
    var maxOrders = Math.max.apply(null, k.monthlyOrders);
    var barsHtml = k.monthlyOrders.map(function (v, i) {
      var pct = Math.round((v / maxOrders) * 100);
      return '<div class="bar-item">' +
        '<span class="bar-value">' + v + '</span>' +
        '<div class="bar-fill" style="height:' + pct + '%"></div>' +
        '<span class="bar-label">週' + days[i] + '</span>' +
      '</div>';
    }).join('');

    adminContent.innerHTML =
      '<div class="kpi-progress-grid">' + cardsHtml + '</div>' +
      '<div class="admin-section">' +
        '<div class="admin-section-title">📊 每日訂單趨勢</div>' +
        '<div class="admin-bar-chart">' + barsHtml + '</div>' +
      '</div>';
  }

  // ============================================================
  //  3e. Customer Management
  // ============================================================
  function renderCustomerManagement() {
    adminContent.innerHTML =
      '<div class="admin-section">' +
        '<div class="admin-filter-bar">' +
          '<span class="filter-label">搜尋客戶：</span>' +
          '<input type="search" id="customerSearch" placeholder="輸入公司名稱...">' +
        '</div>' +
        '<div class="admin-table-wrap">' +
          '<table class="admin-table">' +
            '<thead><tr>' +
              '<th>公司名稱</th><th>聯絡人</th><th>電話</th><th>累計訂單</th><th>累計金額</th><th>最近下單</th>' +
            '</tr></thead>' +
            '<tbody id="customerTableBody">' + customerTableRows(DEMO_DATA.customers) + '</tbody>' +
          '</table>' +
        '</div>' +
        '<div id="customerDetail"></div>' +
      '</div>';

    document.getElementById('customerSearch').addEventListener('input', function () {
      var q = this.value.trim().toLowerCase();
      var filtered = DEMO_DATA.customers.filter(function (c) {
        return c.company.toLowerCase().indexOf(q) >= 0;
      });
      document.getElementById('customerTableBody').innerHTML = customerTableRows(filtered);
      document.getElementById('customerDetail').innerHTML = '';
    });
  }

  function customerTableRows(customers) {
    return customers.map(function (c) {
      return '<tr style="cursor:pointer" onclick="window._adminShowCustomer(\'' + c.id + '\')">' +
        '<td><strong>' + c.company + '</strong></td>' +
        '<td>' + c.contact + '</td>' +
        '<td>' + c.phone + '</td>' +
        '<td>' + c.orders + '</td>' +
        '<td>NT$' + formatNum(c.totalAmount) + '</td>' +
        '<td>' + c.lastOrder + '</td>' +
      '</tr>';
    }).join('');
  }

  window._adminShowCustomer = function (custId) {
    var c = DEMO_DATA.customers.find(function (x) { return x.id === custId; });
    if (!c) return;

    var custOrders = DEMO_DATA.orders.filter(function (o) { return o.shipper === c.company; });
    var avgAmount = c.orders > 0 ? Math.round(c.totalAmount / c.orders) : 0;

    document.getElementById('customerDetail').innerHTML =
      '<div class="customer-detail-card">' +
        '<div class="cust-header">' +
          '<div class="cust-avatar">' + c.company.charAt(0) + '</div>' +
          '<div class="cust-info">' +
            '<h3>' + c.company + '</h3>' +
            '<p>' + c.contact + ' · ' + c.phone + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="cust-stats">' +
          custStat(c.orders, '累計訂單') +
          custStat('NT$' + formatNum(c.totalAmount), '累計金額') +
          custStat('NT$' + formatNum(avgAmount), '平均單價') +
        '</div>' +
      '</div>';
  };

  // ============================================================
  //  4. Modal Functions
  // ============================================================
  function showModal(html) {
    modalContainer.innerHTML = html;
    modalOverlay.classList.add('show');
  }

  function hideModal() {
    modalOverlay.classList.remove('show');
  }

  window._adminHideModal = hideModal;

  // Close modal on overlay click
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) hideModal();
  });

  // Close modal on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hideModal();
  });

  // ============================================================
  //  5. Helpers
  // ============================================================
  function formatNum(n) {
    return Number(n).toLocaleString('zh-TW');
  }

  function statusBadge(status) {
    var cls = {
      '待接單': 'status-pending',
      '已接單': 'status-accepted',
      '配送中': 'status-transit',
      '已送達': 'status-delivered',
    }[status] || '';
    return '<span class="status-badge ' + cls + '">' + status + '</span>';
  }

  function driverStatusBadge(status) {
    var cls = {
      '在線':   'status-online',
      '配送中': 'status-busy',
      '休息':   'status-offline',
    }[status] || '';
    return '<span class="status-badge ' + cls + '">' + status + '</span>';
  }

  function kpiCard(colorClass, label, value, unit, trend, dir) {
    var trendHtml = '';
    if (trend) {
      trendHtml = '<span class="kpi-trend trend-' + dir + '">' +
        (dir === 'up' ? '▲' : '▼') + ' ' + trend +
      '</span>';
    }
    return '<div class="admin-kpi-card ' + colorClass + '">' +
      '<div class="kpi-label">' + label + '</div>' +
      '<div class="kpi-value">' + value + (unit ? ' <span style="font-size:0.5em;color:var(--text-sec)">' + unit + '</span>' : '') + '</div>' +
      trendHtml +
    '</div>';
  }

  function alertItem(icon, title, desc, time, extraClass) {
    return '<div class="admin-alert-item ' + (extraClass || '') + '">' +
      '<span class="alert-icon">' + icon + '</span>' +
      '<div class="alert-content">' +
        '<div class="alert-title">' + title + '</div>' +
        '<div class="alert-desc">' + desc + '</div>' +
      '</div>' +
      '<span class="alert-time">' + time + '</span>' +
    '</div>';
  }

  function detailItem(label, value) {
    return '<div class="detail-item">' +
      '<span class="detail-label">' + label + '</span>' +
      '<span class="detail-value">' + value + '</span>' +
    '</div>';
  }

  function fleetStat(val, label) {
    return '<div class="fleet-stat-item">' +
      '<div class="stat-val">' + val + '</div>' +
      '<div class="stat-label">' + label + '</div>' +
    '</div>';
  }

  function custStat(val, label) {
    return '<div class="cust-stat">' +
      '<div class="val">' + val + '</div>' +
      '<div class="lbl">' + label + '</div>' +
    '</div>';
  }

})();
