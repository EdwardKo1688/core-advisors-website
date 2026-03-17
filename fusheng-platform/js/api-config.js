// ===== API Configuration =====
const API_CONFIG = {
  API_ENABLED: false,  // true = 正式模式 (GAS API), false = 展示模式 (demo data)
  GAS_URL: '',         // Google Apps Script Web App URL
  ADMIN_PASSWORD: 'admin',
  SHIPPER_PASSWORD: 'shipper',
  FLEET_PASSWORD: 'fleet',
};

// ===== Demo Data =====
const DEMO_DATA = {
  orders: [
    { id: 'FS-20260301-001', shipper: '台灣電商A', service: 'S90小件', from: '台北市信義區', to: '新北市板橋區', status: '已送達', amount: 180, date: '2026-03-01', driver: '王大明' },
    { id: 'FS-20260301-002', shipper: '品牌商B', service: '1.9噸配送', from: '桃園市中壢區', to: '新竹市東區', status: '配送中', amount: 850, date: '2026-03-01', driver: '李志強' },
    { id: 'FS-20260302-003', shipper: 'MOMO第三地', service: '第三地出貨', from: '台中市西屯區', to: '彰化市', status: '已接單', amount: 420, date: '2026-03-02', driver: '張建華' },
    { id: 'FS-20260302-004', shipper: '製造商C', service: '3.5噸配送', from: '高雄市前鎮區', to: '台南市安平區', status: '已送達', amount: 1200, date: '2026-03-02', driver: '陳國偉' },
    { id: 'FS-20260303-005', shipper: '零售商D', service: '專車棧板', from: '新北市汐止區', to: '台北市內湖區', status: '待接單', amount: 3500, date: '2026-03-03', driver: '' },
    { id: 'FS-20260303-006', shipper: '電商E', service: 'S90小件', from: '台北市大安區', to: '台北市松山區', status: '已送達', amount: 150, date: '2026-03-03', driver: '王大明' },
    { id: 'FS-20260304-007', shipper: '品牌商F', service: '1.9噸配送', from: '新北市三重區', to: '桃園市龜山區', status: '配送中', amount: 780, date: '2026-03-04', driver: '李志強' },
    { id: 'FS-20260304-008', shipper: 'MOMO第三地', service: '第三地出貨', from: '台北市中山區', to: '基隆市仁愛區', status: '已送達', amount: 350, date: '2026-03-04', driver: '張建華' },
  ],

  fleets: [
    { id: 'FL-001', name: '北區快遞車隊', vehicles: 12, drivers: 15, online: 8, todayDone: 34, rating: 4.8, type: '機車+1.9噸' },
    { id: 'FL-002', name: '中區運輸車隊', vehicles: 8, drivers: 10, online: 5, todayDone: 18, rating: 4.6, type: '1.9噸+3.5噸' },
    { id: 'FL-003', name: '南區專車隊', vehicles: 6, drivers: 8, online: 4, todayDone: 12, rating: 4.7, type: '3.5噸+專車' },
    { id: 'FL-004', name: '棧板物流聯盟', vehicles: 10, drivers: 12, online: 6, todayDone: 8, rating: 4.5, type: '棧板車' },
  ],

  customers: [
    { id: 'C-001', company: '台灣電商A', contact: '林經理', phone: '0912-XXX-XXX', orders: 156, totalAmount: 28800, lastOrder: '2026-03-14' },
    { id: 'C-002', company: '品牌商B', contact: '陳主管', phone: '0923-XXX-XXX', orders: 89, totalAmount: 75600, lastOrder: '2026-03-13' },
    { id: 'C-003', company: 'MOMO第三地', contact: '張協理', phone: '0934-XXX-XXX', orders: 342, totalAmount: 143640, lastOrder: '2026-03-14' },
    { id: 'C-004', company: '製造商C', contact: '黃處長', phone: '0945-XXX-XXX', orders: 67, totalAmount: 80400, lastOrder: '2026-03-12' },
    { id: 'C-005', company: '零售商D', contact: '王店長', phone: '0956-XXX-XXX', orders: 45, totalAmount: 157500, lastOrder: '2026-03-10' },
  ],

  kpis: {
    todayOrders: 127, activeFleets: 4, onTimeRate: 94.5, revenue: 856000,
    targetOrders: 200, targetFleets: 8, targetOnTime: 98, targetRevenue: 1500000,
    monthlyOrders: [85,92,105,98,115,120,127], // last 7 days
  },

  drivers: [
    { id: 'D-001', name: '王大明', fleet: '北區快遞車隊', vehicle: '機車', status: '配送中', todayDone: 8, onTime: 96, rating: 4.9 },
    { id: 'D-002', name: '李志強', fleet: '北區快遞車隊', vehicle: '1.9噸', status: '在線', todayDone: 5, onTime: 93, rating: 4.7 },
    { id: 'D-003', name: '張建華', fleet: '中區運輸車隊', vehicle: '1.9噸', status: '配送中', todayDone: 4, onTime: 95, rating: 4.8 },
    { id: 'D-004', name: '陳國偉', fleet: '南區專車隊', vehicle: '3.5噸', status: '休息', todayDone: 3, onTime: 97, rating: 4.6 },
    { id: 'D-005', name: '劉文傑', fleet: '棧板物流聯盟', vehicle: '棧板車', status: '在線', todayDone: 2, onTime: 91, rating: 4.5 },
  ],

  inquiries: [
    { id: 'INQ-001', company: '新創公司X', service: 'S90小件', from: '台北市', to: '新北市', date: '2026-03-14', status: '待回覆', estimate: '150-250' },
    { id: 'INQ-002', company: '食品工廠Y', service: '3.5噸配送', from: '桃園市', to: '台中市', date: '2026-03-13', status: '已報價', estimate: '2800-3500' },
  ],

  cases: [
    { id: 1, title: 'MOMO 第三地出貨整合案', industry: '電商平台', service: '第三地出貨', challenge: '數百家供應商出貨流程分散，追蹤困難', solution: '整合第三地出貨平台，統一配送管理與追蹤', results: ['出貨效率提升 40%', '異常率降低 60%', '地址覆蓋率達 95%'], logo: '🛒' },
    { id: 2, title: '品牌商 D2C 配送升級', industry: '品牌零售', service: '1.9噸配送', challenge: '自有物流成本高，配送品質不穩定', solution: '導入富昇 1.9 噸配送網路，SLA 管理', results: ['物流成本降低 25%', '準時率達 96%', '客訴減少 50%'], logo: '🏷️' },
    { id: 3, title: '製造商跨區專車調度', industry: '製造業', service: '專車棧板', challenge: '大型設備運送需客製化，回頭車利用率低', solution: '專車棧板媒合平台，智慧回頭車調度', results: ['運輸成本降低 30%', '回頭車利用率提升至 65%', '配送時效縮短 20%'], logo: '🏭' },
  ],
};

// ===== Pricing Rules (for estimation) =====
const PRICING = {
  's90':      { base: 80,  perKm: 8,   min: 120,  max: 350 },
  '1.9ton':   { base: 300, perKm: 15,  min: 500,  max: 2000 },
  '3.5ton':   { base: 500, perKm: 22,  min: 800,  max: 4000 },
  'special':  { base: 1500, perKm: 35, min: 2000, max: 15000 },
  '3pl':      { base: 150, perKm: 10,  min: 200,  max: 1500 },
};

function estimatePrice(serviceType) {
  const rule = PRICING[serviceType];
  if (!rule) return { min: 0, max: 0 };
  return { min: rule.min, max: rule.max };
}

function generateOrderId() {
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    String(now.getMonth()+1).padStart(2,'0') +
    String(now.getDate()).padStart(2,'0');
  const seq = String(Math.floor(Math.random()*999)+1).padStart(3,'0');
  return `FS-${dateStr}-${seq}`;
}

function generateInquiryId() {
  return 'INQ-' + String(Math.floor(Math.random()*9999)+1).padStart(4,'0');
}
