/**
 * XinDrive AI Platform - Demo Story Data
 *
 * Fictional IC distribution company: 芯達科技 (SinDa Technology)
 * Seeds localStorage with realistic, cohesive demo data.
 */

const STORAGE_KEY = 'xindrive_data';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const uuid = () => crypto.randomUUID();
const date = (y, m, d, h = 9, min = 0) =>
  new Date(y, m - 1, d, h, min).toISOString();

// Pre-generate stable IDs so we can cross-reference
const IDS = {
  org: uuid(),
  // Main users
  lin: uuid(),
  chen: uuid(),
  chang: uuid(),
  adminUser: uuid(),
  // Background users
  wang: uuid(),
  liu: uuid(),
  huang: uuid(),
  wu: uuid(),
  yang: uuid(),
  xu: uuid(),
  zhou: uuid(),
  sun: uuid(),
  // Courses
  meddic: uuid(),
  icBasic: uuid(),
  supplyChain: uuid(),
  crm: uuid(),
  // Customers
  ti: uuid(),
  adi: uuid(),
  nxp: uuid(),
  stm: uuid(),
  renesas: uuid(),
  nuvoton: uuid(),
  liteon: uuid(),
  // Coaching plans
  coachMeddic: uuid(),
  coachNewbie: uuid(),
};

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
function buildUsers() {
  const base = {
    org_id: IDS.org,
    password_hash: 'demo',
    status: 'active',
    created_at: date(2025, 9, 1),
  };

  return [
    {
      id: IDS.lin, ...base,
      email: 'lin@sinda.com', name: '林志明', role: 'manager',
      department: '業務部', title: '業務總監',
      avatar_url: null,
    },
    {
      id: IDS.chen, ...base,
      email: 'chen@sinda.com', name: '陳柏翰', role: 'sales',
      department: '業務部', title: '業務專員',
      avatar_url: null,
    },
    {
      id: IDS.chang, ...base,
      email: 'chang@sinda.com', name: '張淑芬', role: 'trainer',
      department: '培訓部', title: '資深教練',
      avatar_url: null,
    },
    {
      id: IDS.adminUser, ...base,
      email: 'admin@sinda.com', name: '管理員', role: 'admin',
      department: 'IT', title: '系統管理員',
      avatar_url: null,
    },
    // Background characters
    {
      id: IDS.wang, ...base,
      email: 'wang@sinda.com', name: '王小明', role: 'sales',
      department: '業務部', title: '業務專員',
    },
    {
      id: IDS.liu, ...base,
      email: 'liu@sinda.com', name: '劉建宏', role: 'sales',
      department: '業務部', title: '資深業務',
    },
    {
      id: IDS.huang, ...base,
      email: 'huang@sinda.com', name: '黃雅琪', role: 'sales',
      department: '業務部', title: '業務主任',
    },
    {
      id: IDS.wu, ...base,
      email: 'wu@sinda.com', name: '吳俊賢', role: 'staff',
      department: '採購部', title: '採購經理',
    },
    {
      id: IDS.yang, ...base,
      email: 'yang@sinda.com', name: '楊佳蓉', role: 'staff',
      department: '供應鏈管理部', title: '供應鏈專員',
    },
    {
      id: IDS.xu, ...base,
      email: 'xu@sinda.com', name: '徐志豪', role: 'staff',
      department: '供應鏈管理部', title: '倉儲主管',
    },
    {
      id: IDS.zhou, ...base,
      email: 'zhou@sinda.com', name: '周美玲', role: 'sales',
      department: '業務部', title: '業務專員',
    },
    {
      id: IDS.sun, ...base,
      email: 'sun@sinda.com', name: '孫偉成', role: 'staff',
      department: '技術支援部', title: '技術工程師',
    },
  ];
}

// ---------------------------------------------------------------------------
// Courses, Modules, Lessons
// ---------------------------------------------------------------------------
function buildCourses() {
  return [
    {
      id: IDS.meddic,
      org_id: IDS.org,
      title: 'MEDDIC 實戰銷售方法論',
      description: '深入學習 MEDDIC 銷售框架，掌握大型 IC Design-in 專案的結構化銷售流程。從指標量化、經濟買家識別到決策流程拆解，結合 IC 通路業務實戰案例。',
      category: 'sales',
      difficulty: 'advanced',
      estimated_hours: 12,
      thumbnail_url: null,
      instructor_id: IDS.chang,
      status: 'published',
      created_at: date(2025, 10, 15),
    },
    {
      id: IDS.icBasic,
      org_id: IDS.org,
      title: 'IC 通路業務基礎',
      description: '從零開始認識 IC 通路產業生態，了解原廠、代理商、系統廠的三角關係。涵蓋產品線認識、報價流程、Design-in 機制與基礎客戶開發技巧。',
      category: 'sales',
      difficulty: 'beginner',
      estimated_hours: 8,
      thumbnail_url: null,
      instructor_id: IDS.chang,
      status: 'published',
      created_at: date(2025, 10, 1),
    },
    {
      id: IDS.supplyChain,
      org_id: IDS.org,
      title: '供應鏈管理入門',
      description: '掌握 IC 通路供應鏈的核心運作機制，包含備貨策略、庫存管理、交期協調與缺料因應對策。適合採購、倉儲及業務人員修習。',
      category: 'supply_chain',
      difficulty: 'beginner',
      estimated_hours: 6,
      thumbnail_url: null,
      instructor_id: IDS.xu,
      status: 'published',
      created_at: date(2025, 11, 1),
    },
    {
      id: IDS.crm,
      org_id: IDS.org,
      title: '客戶關係經營實務',
      description: '系統化學習 IC 通路的客戶關係管理方法，從客戶分級、拜訪規劃、需求探索到長期夥伴經營。結合實際案例探討原廠與系統廠的雙向管理策略。',
      category: 'management',
      difficulty: 'intermediate',
      estimated_hours: 10,
      thumbnail_url: null,
      instructor_id: IDS.chang,
      status: 'published',
      created_at: date(2025, 11, 15),
    },
  ];
}

function buildModulesAndLessons() {
  const modules = [];
  const lessons = [];

  const define = (courseId, moduleDefs) => {
    moduleDefs.forEach((mod, mi) => {
      const modId = uuid();
      modules.push({
        id: modId,
        course_id: courseId,
        title: mod.title,
        description: mod.description,
        order_index: mi + 1,
      });
      mod.lessons.forEach((les, li) => {
        lessons.push({
          id: uuid(),
          module_id: modId,
          title: les.title,
          type: les.type || 'video',
          duration_minutes: les.duration || 15,
          content_url: null,
          order_index: li + 1,
        });
      });
    });
  };

  // MEDDIC - 6 modules
  define(IDS.meddic, [
    {
      title: 'M - Metrics（指標量化）',
      description: '學習如何用量化指標定義客戶價值',
      lessons: [
        { title: '什麼是 Metrics？IC 產業的價值量化', duration: 20 },
        { title: '實作：為 Design-in 案建立 ROI 模型', type: 'exercise', duration: 30 },
        { title: '案例分析：TI 電源 IC 導入效益計算', duration: 15 },
      ],
    },
    {
      title: 'E - Economic Buyer（經濟買家）',
      description: '識別並接觸握有預算決策權的關鍵人物',
      lessons: [
        { title: '經濟買家 vs 技術評估者', duration: 15 },
        { title: '系統廠採購決策鏈分析', duration: 20 },
        { title: '實作：繪製客戶決策地圖', type: 'exercise', duration: 25 },
      ],
    },
    {
      title: 'D - Decision Criteria（決策標準）',
      description: '理解客戶如何評估 IC 供應商',
      lessons: [
        { title: 'IC 選型的技術與商務決策標準', duration: 20 },
        { title: '競品比較與差異化定位', duration: 15 },
        { title: '測驗：決策標準識別', type: 'quiz', duration: 10 },
      ],
    },
    {
      title: 'D - Decision Process（決策流程）',
      description: '掌握客戶內部的決策與審批流程',
      lessons: [
        { title: '系統廠的 Design-in 審批流程', duration: 20 },
        { title: '如何加速客戶決策進程', duration: 15 },
        { title: '角色扮演：推動客戶內部立案', type: 'exercise', duration: 30 },
      ],
    },
    {
      title: 'I - Identify Pain（痛點識別）',
      description: '深入探索客戶的真實痛點',
      lessons: [
        { title: '提問技巧：從表面需求到深層痛點', duration: 20 },
        { title: 'IC 通路常見客戶痛點清單', duration: 15 },
      ],
    },
    {
      title: 'C - Champion（內部支持者）',
      description: '培養客戶端的內部支持者',
      lessons: [
        { title: '識別與培養 Champion', duration: 20 },
        { title: '案例：從 FAE 到 Champion 的轉化', duration: 15 },
        { title: '綜合實戰演練', type: 'exercise', duration: 40 },
        { title: '期末測驗', type: 'quiz', duration: 20 },
      ],
    },
  ]);

  // IC 通路業務基礎 - 4 modules
  define(IDS.icBasic, [
    {
      title: 'IC 通路產業全景',
      description: '認識 IC 通路的產業結構與商業模式',
      lessons: [
        { title: '半導體產業鏈總覽', duration: 20 },
        { title: '通路代理商的角色與價值', duration: 15 },
        { title: '主要原廠品牌介紹', duration: 20 },
      ],
    },
    {
      title: '產品線基礎知識',
      description: '認識常見 IC 產品線與應用',
      lessons: [
        { title: '類比 IC、MCU、電源管理概論', duration: 25 },
        { title: '車用、工控、消費性應用分類', duration: 20 },
        { title: '測驗：產品線與應用配對', type: 'quiz', duration: 10 },
      ],
    },
    {
      title: '報價與 Design-in 流程',
      description: '學習 IC 通路業務的核心作業流程',
      lessons: [
        { title: '報價流程與價格策略', duration: 20 },
        { title: 'Design-in 登記與追蹤', duration: 15 },
        { title: '實作：完成一筆 Design-in 登記', type: 'exercise', duration: 25 },
      ],
    },
    {
      title: '客戶開發入門',
      description: '基礎客戶開發技巧',
      lessons: [
        { title: '目標客戶篩選與拜訪準備', duration: 20 },
        { title: '首次拜訪的黃金法則', duration: 15 },
      ],
    },
  ]);

  // 供應鏈管理入門 - 3 modules
  define(IDS.supplyChain, [
    {
      title: 'IC 供應鏈基礎',
      description: '了解 IC 從原廠到終端客戶的流通路徑',
      lessons: [
        { title: '供應鏈結構與物流概論', duration: 20 },
        { title: '通路庫存管理的重要性', duration: 15 },
      ],
    },
    {
      title: '備貨與庫存策略',
      description: '學習科學化的備貨與庫存管理方法',
      lessons: [
        { title: '安全庫存與再訂購點計算', duration: 25 },
        { title: '缺料預警與因應對策', duration: 20 },
        { title: '實作：建立庫存監控表', type: 'exercise', duration: 20 },
      ],
    },
    {
      title: '交期管理與供應商協調',
      description: '學習如何有效管理交期與協調供應商',
      lessons: [
        { title: '原廠交期資訊解讀', duration: 15 },
        { title: '跨部門協調與交期承諾', duration: 20 },
        { title: '案例：車用 IC 缺料危機處理', duration: 15 },
        { title: '期末測驗', type: 'quiz', duration: 15 },
      ],
    },
  ]);

  // 客戶關係經營實務 - 5 modules
  define(IDS.crm, [
    {
      title: '客戶分級與資源配置',
      description: '建立科學化的客戶分級體系',
      lessons: [
        { title: '客戶分級模型（A/B/C/D）', duration: 20 },
        { title: '資源分配與拜訪頻率規劃', duration: 15 },
      ],
    },
    {
      title: '客戶需求探索',
      description: '深入了解客戶真實需求的方法',
      lessons: [
        { title: 'SPIN 提問法在 IC 產業的應用', duration: 20 },
        { title: '客戶技術路線圖解讀', duration: 20 },
        { title: '實作：客戶需求訪談演練', type: 'exercise', duration: 30 },
      ],
    },
    {
      title: '原廠關係管理',
      description: '維護與原廠的策略夥伴關係',
      lessons: [
        { title: '原廠 BDM 溝通與協作', duration: 15 },
        { title: '原廠季度業務回顧準備', duration: 20 },
      ],
    },
    {
      title: '系統廠客戶經營',
      description: '針對系統廠客戶的深度經營策略',
      lessons: [
        { title: '系統廠組織結構與決策流程', duration: 20 },
        { title: '多產品線交叉銷售策略', duration: 15 },
        { title: '案例：從單一料號到整機方案', duration: 20 },
      ],
    },
    {
      title: '長期夥伴關係建立',
      description: '從供應商到策略夥伴的升級之路',
      lessons: [
        { title: '客戶滿意度與忠誠度管理', duration: 15 },
        { title: '年度客戶經營計畫撰寫', duration: 20 },
        { title: '期末專題報告', type: 'exercise', duration: 30 },
      ],
    },
  ]);

  return { modules, lessons };
}

// ---------------------------------------------------------------------------
// Enrollments & Lesson Progress
// ---------------------------------------------------------------------------
function buildEnrollmentsAndProgress(modules, lessons) {
  const enrollments = [];
  const lessonProgress = [];

  // Helper: get lessons for a course through its modules
  const courseLessons = (courseId) => {
    const modIds = modules.filter(m => m.course_id === courseId).map(m => m.id);
    return lessons.filter(l => modIds.includes(l.module_id));
  };

  const markProgress = (userId, courseId, pct, enrollId) => {
    const cls = courseLessons(courseId);
    const totalToComplete = Math.floor(cls.length * pct);
    cls.forEach((lesson, i) => {
      const completed = i < totalToComplete;
      lessonProgress.push({
        id: uuid(),
        enrollment_id: enrollId,
        lesson_id: lesson.id,
        user_id: userId,
        status: completed ? 'completed' : (i === totalToComplete ? 'in_progress' : 'not_started'),
        completed_at: completed ? date(2026, 1, 10 + Math.floor(i * 0.5)) : null,
        score: completed && lesson.type === 'quiz' ? 70 + Math.floor(Math.random() * 25) : null,
        time_spent_minutes: completed ? lesson.duration_minutes + Math.floor(Math.random() * 5) : (i === totalToComplete ? Math.floor(lesson.duration_minutes * 0.4) : 0),
      });
    });
  };

  // 陳柏翰 - MEDDIC 45%
  const e1 = uuid();
  enrollments.push({
    id: e1, user_id: IDS.chen, course_id: IDS.meddic,
    enrolled_at: date(2025, 12, 15), status: 'in_progress', progress_pct: 45,
    last_accessed_at: date(2026, 3, 12),
  });
  markProgress(IDS.chen, IDS.meddic, 0.45, e1);

  // 陳柏翰 - IC 通路基礎 80%
  const e2 = uuid();
  enrollments.push({
    id: e2, user_id: IDS.chen, course_id: IDS.icBasic,
    enrolled_at: date(2025, 11, 1), status: 'in_progress', progress_pct: 80,
    last_accessed_at: date(2026, 3, 10),
  });
  markProgress(IDS.chen, IDS.icBasic, 0.80, e2);

  // 王小明 - IC 通路基礎 60%
  const e3 = uuid();
  enrollments.push({
    id: e3, user_id: IDS.wang, course_id: IDS.icBasic,
    enrolled_at: date(2025, 12, 1), status: 'in_progress', progress_pct: 60,
    last_accessed_at: date(2026, 3, 8),
  });
  markProgress(IDS.wang, IDS.icBasic, 0.60, e3);

  // 劉建宏 - MEDDIC 70%, CRM 100%
  const e4 = uuid();
  enrollments.push({
    id: e4, user_id: IDS.liu, course_id: IDS.meddic,
    enrolled_at: date(2025, 11, 1), status: 'in_progress', progress_pct: 70,
    last_accessed_at: date(2026, 3, 11),
  });
  markProgress(IDS.liu, IDS.meddic, 0.70, e4);

  const e5 = uuid();
  enrollments.push({
    id: e5, user_id: IDS.liu, course_id: IDS.crm,
    enrolled_at: date(2025, 10, 1), status: 'completed', progress_pct: 100,
    last_accessed_at: date(2026, 2, 20),
  });
  markProgress(IDS.liu, IDS.crm, 1.0, e5);

  // 黃雅琪 - CRM 50%
  const e6 = uuid();
  enrollments.push({
    id: e6, user_id: IDS.huang, course_id: IDS.crm,
    enrolled_at: date(2026, 1, 10), status: 'in_progress', progress_pct: 50,
    last_accessed_at: date(2026, 3, 13),
  });
  markProgress(IDS.huang, IDS.crm, 0.50, e6);

  // 楊佳蓉 - 供應鏈 90%
  const e7 = uuid();
  enrollments.push({
    id: e7, user_id: IDS.yang, course_id: IDS.supplyChain,
    enrolled_at: date(2025, 12, 5), status: 'in_progress', progress_pct: 90,
    last_accessed_at: date(2026, 3, 12),
  });
  markProgress(IDS.yang, IDS.supplyChain, 0.90, e7);

  // 周美玲 - IC 通路基礎 30%
  const e8 = uuid();
  enrollments.push({
    id: e8, user_id: IDS.zhou, course_id: IDS.icBasic,
    enrolled_at: date(2026, 2, 1), status: 'in_progress', progress_pct: 30,
    last_accessed_at: date(2026, 3, 7),
  });
  markProgress(IDS.zhou, IDS.icBasic, 0.30, e8);

  return { enrollments, lessonProgress };
}

// ---------------------------------------------------------------------------
// Coaching Plans, Sessions, Skill Assessments
// ---------------------------------------------------------------------------
function buildCoaching() {
  const coachingPlans = [
    {
      id: IDS.coachMeddic,
      org_id: IDS.org,
      title: 'MEDDIC 實戰養成計畫',
      coach_id: IDS.chang,
      coachee_id: IDS.chen,
      methodology: 'MEDDIC',
      status: 'active',
      start_date: date(2025, 12, 15),
      target_end_date: date(2026, 6, 15),
      goals: '透過 MEDDIC 框架提升陳柏翰的大案經營能力，目標在 Q2 獨立主導至少 2 個 500 萬以上的 Design-in 專案。',
      notes: '柏翰有 2 年業務經驗，技術底子不錯但缺乏結構化銷售方法。需要加強經濟買家識別與內部支持者培養。',
      created_at: date(2025, 12, 10),
    },
    {
      id: IDS.coachNewbie,
      org_id: IDS.org,
      title: '新人快速上手計畫',
      coach_id: IDS.chang,
      coachee_id: IDS.wang,
      methodology: 'GROW',
      status: 'active',
      start_date: date(2026, 1, 5),
      target_end_date: date(2026, 4, 5),
      goals: '協助王小明在 3 個月內完成基礎培訓並獨立處理中小型客戶，達到每月拜訪 15 家客戶的目標。',
      notes: '小明剛從研究所畢業，對 IC 產業還在熟悉階段。態度積極但需要建立信心。',
      created_at: date(2026, 1, 3),
    },
  ];

  // 陳柏翰的 4 次已完成 coaching sessions
  const coachingSessions = [
    {
      id: uuid(),
      plan_id: IDS.coachMeddic,
      session_number: 1,
      scheduled_at: date(2026, 1, 8, 14, 0),
      completed_at: date(2026, 1, 8, 15, 10),
      status: 'completed',
      topic: 'MEDDIC 框架導入 & Metrics 概念',
      notes: '介紹 MEDDIC 六大要素。柏翰對 Metrics 量化概念理解快速，但在實際客戶案例套用上還需要練習。討論了他手上的 TI 電源 IC Design-in 案件作為練習標的。',
      action_items: JSON.stringify([
        '完成 MEDDIC 線上課程模組 1-2',
        '針對 TI 電源 IC 案件建立 ROI 量化模型',
        '下次帶客戶組織圖來討論',
      ]),
      coach_rating: null,
      coachee_feedback: '第一次接觸 MEDDIC，覺得框架很清楚，但要實際用在客戶身上還要多練習。',
    },
    {
      id: uuid(),
      plan_id: IDS.coachMeddic,
      session_number: 2,
      scheduled_at: date(2026, 1, 22, 14, 0),
      completed_at: date(2026, 1, 22, 15, 20),
      status: 'completed',
      topic: 'Economic Buyer 識別 & Decision Criteria',
      notes: '檢視柏翰的 TI 案件進度。他已完成 ROI 模型，數字合理。討論如何從目前的技術窗口（FAE）往上接觸到採購決策者。柏翰擔心層級不夠直接約見，建議透過技術簡報創造機會。',
      action_items: JSON.stringify([
        '準備 TI 電源 IC 技術比較簡報',
        '透過 FAE 安排與客戶採購主管的技術簡報會議',
        '完成 MEDDIC 課程模組 3',
      ]),
      coach_rating: null,
      coachee_feedback: '原來可以用技術簡報來接觸 Economic Buyer，這個策略很實用。',
    },
    {
      id: uuid(),
      plan_id: IDS.coachMeddic,
      session_number: 3,
      scheduled_at: date(2026, 2, 5, 14, 0),
      completed_at: date(2026, 2, 5, 15, 0),
      status: 'completed',
      topic: 'Decision Process 與案件推進策略',
      notes: '柏翰成功約到客戶採購主管的簡報會議，反應正面。但發現客戶內部還有一個競品評估流程要走。討論如何在評估流程中建立優勢，以及如何縮短決策週期。ADI 的一個新案也用 MEDDIC 框架做了初步分析。',
      action_items: JSON.stringify([
        '繪製客戶端完整決策流程圖',
        '準備與競品的差異化比較資料',
        '對 ADI 新案完成 MEDDIC 六項評估表',
      ]),
      coach_rating: null,
      coachee_feedback: '已經能比較自然地用 MEDDIC 框架分析案件了，對 ADI 新案的分析讓我更有信心。',
    },
    {
      id: uuid(),
      plan_id: IDS.coachMeddic,
      session_number: 4,
      scheduled_at: date(2026, 2, 19, 14, 0),
      completed_at: date(2026, 2, 19, 15, 30),
      status: 'completed',
      topic: 'Champion 培養 & 綜合案件檢討',
      notes: '深入討論如何將客戶端的 FAE 培養成 Champion。柏翰分享了一個好消息：TI 案件的客戶技術主管主動向採購推薦了我們的方案。討論 Q2 的業務目標與學習計畫銜接。整體進步明顯，MEDDIC 框架已開始內化。',
      action_items: JSON.stringify([
        '完成 MEDDIC 課程剩餘模組',
        '為 Q2 兩個重點案件建立完整 MEDDIC 評估報告',
        '準備下次教練會議的案件更新簡報',
      ]),
      coach_rating: null,
      coachee_feedback: 'TI 案件的突破讓我很振奮！覺得 MEDDIC 真的有效。接下來要挑戰更大的案子。',
    },
    // 王小明 sessions
    {
      id: uuid(),
      plan_id: IDS.coachNewbie,
      session_number: 1,
      scheduled_at: date(2026, 1, 10, 10, 0),
      completed_at: date(2026, 1, 10, 11, 0),
      status: 'completed',
      topic: 'GROW 模型導入 & 短期目標設定',
      notes: '使用 GROW 模型幫小明建立清晰的短期目標。Reality 部分：目前對產品線認識有限，還不敢獨立拜訪客戶。Options：先從陪訪開始，同時加速線上課程進度。Will：承諾每週完成 2 個課程模組。',
      action_items: JSON.stringify([
        '完成 IC 通路基礎課程模組 1-2',
        '跟隨劉建宏陪訪 3 家客戶',
        '建立自己的產品線筆記',
      ]),
      coach_rating: null,
      coachee_feedback: '有了明確的目標和步驟，比較不會慌了。',
    },
    {
      id: uuid(),
      plan_id: IDS.coachNewbie,
      session_number: 2,
      scheduled_at: date(2026, 2, 7, 10, 0),
      completed_at: date(2026, 2, 7, 11, 15),
      status: 'completed',
      topic: '陪訪回顧 & 獨立拜訪準備',
      notes: '小明完成了 3 次陪訪，觀察記錄做得不錯。討論他在陪訪中注意到的客戶互動模式。決定下個月開始嘗試獨立拜訪小型客戶。',
      action_items: JSON.stringify([
        '完成 IC 通路基礎課程模組 3-4',
        '獨立拜訪 2 家新唐科技的經銷商客戶',
        '每次拜訪後寫拜訪報告',
      ]),
      coach_rating: null,
      coachee_feedback: '陪訪讓我學到很多實際的應對技巧，準備好挑戰獨立拜訪了。',
    },
  ];

  // Skill assessments - 陳柏翰 showing growth
  const skillAssessments = [
    {
      id: uuid(),
      plan_id: IDS.coachMeddic,
      user_id: IDS.chen,
      assessed_by: IDS.chang,
      assessed_at: date(2025, 12, 20),
      type: 'baseline',
      skills: JSON.stringify({
        metrics_quantification: { score: 3, max: 10, note: '基本理解但缺乏實務經驗' },
        economic_buyer_access: { score: 2, max: 10, note: '傾向只跟技術人員溝通' },
        decision_criteria_analysis: { score: 4, max: 10, note: '能列出基本技術規格，但商務面不足' },
        decision_process_mapping: { score: 2, max: 10, note: '對客戶內部流程了解有限' },
        pain_identification: { score: 5, max: 10, note: '技術痛點敏感度不錯' },
        champion_development: { score: 2, max: 10, note: '尚未有培養 Champion 的意識' },
        presentation_skills: { score: 5, max: 10, note: '簡報邏輯清楚但說服力待加強' },
        negotiation: { score: 3, max: 10, note: '容易在價格上讓步' },
      }),
      overall_score: 26,
      overall_max: 80,
      summary: '柏翰技術底子不錯，對客戶痛點有一定的敏感度。主要弱項在高層接觸和結構化銷售流程。建議從 MEDDIC 框架入手，配合實際案件練習。',
    },
    {
      id: uuid(),
      plan_id: IDS.coachMeddic,
      user_id: IDS.chen,
      assessed_by: IDS.chang,
      assessed_at: date(2026, 3, 5),
      type: 'progress',
      skills: JSON.stringify({
        metrics_quantification: { score: 6, max: 10, note: '已能獨立建立 ROI 模型' },
        economic_buyer_access: { score: 5, max: 10, note: '已成功接觸到採購主管層級' },
        decision_criteria_analysis: { score: 6, max: 10, note: '開始結合技術與商務面分析' },
        decision_process_mapping: { score: 5, max: 10, note: '能繪製基本的決策流程圖' },
        pain_identification: { score: 7, max: 10, note: '能從多角度探索客戶痛點' },
        champion_development: { score: 5, max: 10, note: 'TI 案件中成功培養了技術主管作為 Champion' },
        presentation_skills: { score: 6, max: 10, note: '技術簡報的說服力有提升' },
        negotiation: { score: 4, max: 10, note: '開始懂得用價值而非價格談判' },
      }),
      overall_score: 44,
      overall_max: 80,
      summary: '3 個月內成長顯著，尤其在 Metrics 量化和 Champion 培養方面進步最大。MEDDIC 框架已能基本運用。下階段目標是提升談判能力和獨立主導大型案件。',
    },
  ];

  return { coachingPlans, coachingSessions, skillAssessments };
}

// ---------------------------------------------------------------------------
// Customers & Contacts
// ---------------------------------------------------------------------------
function buildCustomers() {
  const customers = [
    {
      id: IDS.ti, org_id: IDS.org,
      name: '德州儀器 (TI)', segment: 'tier1', industry: '半導體原廠',
      website: 'https://www.ti.com', region: '全球',
      annual_revenue_twd: 320000000,
      status: 'active',
      owner_id: IDS.lin,
      notes: '最重要的產品線夥伴，涵蓋電源管理、類比信號、嵌入式處理器。Q1 重點推動車用電源 IC 產品線。',
      created_at: date(2025, 6, 1),
    },
    {
      id: IDS.adi, org_id: IDS.org,
      name: '亞德諾 (ADI)', segment: 'tier1', industry: '類比IC',
      website: 'https://www.analog.com', region: '全球',
      annual_revenue_twd: 185000000,
      status: 'active',
      owner_id: IDS.liu,
      notes: '高精度類比 IC 與信號處理領導品牌。工控與醫療市場重要產品線。',
      created_at: date(2025, 6, 1),
    },
    {
      id: IDS.nxp, org_id: IDS.org,
      name: '恩智浦 (NXP)', segment: 'tier1', industry: '車用IC',
      website: 'https://www.nxp.com', region: '全球',
      annual_revenue_twd: 210000000,
      status: 'active',
      owner_id: IDS.lin,
      notes: '車用半導體全球領先。雷達、車身控制、車載網路等關鍵產品線。',
      created_at: date(2025, 6, 1),
    },
    {
      id: IDS.stm, org_id: IDS.org,
      name: '意法半導體 (STM)', segment: 'tier2', industry: 'MCU',
      website: 'https://www.st.com', region: '全球',
      annual_revenue_twd: 95000000,
      status: 'active',
      owner_id: IDS.huang,
      notes: 'STM32 MCU 系列銷量穩定成長，搭配感測器與電源產品交叉銷售。',
      created_at: date(2025, 7, 1),
    },
    {
      id: IDS.renesas, org_id: IDS.org,
      name: '瑞薩 (Renesas)', segment: 'tier2', industry: '車用IC',
      website: 'https://www.renesas.com', region: '全球',
      annual_revenue_twd: 78000000,
      status: 'active',
      owner_id: IDS.liu,
      notes: '車用 MCU 與 SoC 強勢品牌，近年積極拓展 IoT 與工控領域。',
      created_at: date(2025, 7, 1),
    },
    {
      id: IDS.nuvoton, org_id: IDS.org,
      name: '新唐科技', segment: 'tier3', industry: 'MCU/IoT',
      website: 'https://www.nuvoton.com', region: '台灣',
      annual_revenue_twd: 35000000,
      status: 'active',
      owner_id: IDS.chen,
      notes: '台灣本土 MCU 品牌，在教育市場和小型 IoT 應用有穩定出貨。價格敏感客戶群。',
      created_at: date(2025, 8, 1),
    },
    {
      id: IDS.liteon, org_id: IDS.org,
      name: '群光電子', segment: 'tier3', industry: '系統廠',
      website: 'https://www.liteon.com', region: '台灣',
      annual_revenue_twd: 42000000,
      status: 'active',
      owner_id: IDS.chen,
      notes: '光電與電源供應器系統廠，是多條產品線的終端使用客戶。近期有新的工控電源專案。',
      created_at: date(2025, 8, 1),
    },
  ];

  const contacts = [
    // TI
    { id: uuid(), customer_id: IDS.ti, name: '張銘哲', title: '台灣區業務總監', email: 'mc.chang@ti.com', phone: '02-2799-xxxx', role: 'decision_maker', notes: '關鍵決策者，每季需安排 QBR 會議' },
    { id: uuid(), customer_id: IDS.ti, name: '李玉婷', title: '產品行銷經理', email: 'yt.lee@ti.com', phone: '02-2799-xxxx', role: 'influencer', notes: '電源產品線主要技術窗口' },
    { id: uuid(), customer_id: IDS.ti, name: 'David Lin', title: 'FAE Manager', email: 'd.lin@ti.com', phone: '02-2799-xxxx', role: 'technical', notes: '技術支援主要對口' },
    // ADI
    { id: uuid(), customer_id: IDS.adi, name: '許文彥', title: '台灣業務經理', email: 'wy.hsu@analog.com', phone: '02-2658-xxxx', role: 'decision_maker', notes: '負責通路銷售策略' },
    { id: uuid(), customer_id: IDS.adi, name: '陳思穎', title: 'FAE', email: 'sy.chen@analog.com', phone: '02-2658-xxxx', role: 'technical', notes: '高精度 ADC/DAC 技術專家' },
    // NXP
    { id: uuid(), customer_id: IDS.nxp, name: '黃志豪', title: '車用事業部總監', email: 'zh.huang@nxp.com', phone: '03-579-xxxx', role: 'decision_maker', notes: '車用IC重要決策者' },
    { id: uuid(), customer_id: IDS.nxp, name: '林佳蓉', title: '業務經理', email: 'jr.lin@nxp.com', phone: '03-579-xxxx', role: 'influencer', notes: '日常業務對接窗口' },
    // STM
    { id: uuid(), customer_id: IDS.stm, name: '王建中', title: '台灣業務代表', email: 'jz.wang@st.com', phone: '02-2162-xxxx', role: 'decision_maker', notes: 'STM32 產品線主要窗口' },
    { id: uuid(), customer_id: IDS.stm, name: '蔡雅婷', title: 'FAE', email: 'yt.tsai@st.com', phone: '02-2162-xxxx', role: 'technical', notes: 'MCU 技術支援' },
    // Renesas
    { id: uuid(), customer_id: IDS.renesas, name: '田中太郎', title: '台灣支社長', email: 't.tanaka@renesas.com', phone: '02-2175-xxxx', role: 'decision_maker', notes: '日方高層，重要場合需出席' },
    { id: uuid(), customer_id: IDS.renesas, name: '吳政達', title: '業務經理', email: 'cd.wu@renesas.com', phone: '02-2175-xxxx', role: 'influencer', notes: '日常業務主要窗口' },
    // 新唐
    { id: uuid(), customer_id: IDS.nuvoton, name: '蘇明德', title: '業務處長', email: 'md.su@nuvoton.com', phone: '03-526-xxxx', role: 'decision_maker', notes: '通路策略規劃主導者' },
    // 群光
    { id: uuid(), customer_id: IDS.liteon, name: '鄭文傑', title: '採購經理', email: 'wj.cheng@liteon.com', phone: '02-8798-xxxx', role: 'decision_maker', notes: '採購決策者，注重交期與價格' },
    { id: uuid(), customer_id: IDS.liteon, name: '趙建豪', title: '研發工程師', email: 'jh.chao@liteon.com', phone: '02-8798-xxxx', role: 'technical', notes: '新專案技術評估窗口' },
  ];

  return { customers, contacts };
}

// ---------------------------------------------------------------------------
// Opportunities & Activities
// ---------------------------------------------------------------------------
function buildOpportunities() {
  const opportunities = [];
  const activities = [];

  const opp = (data) => {
    const id = uuid();
    opportunities.push({ id, org_id: IDS.org, ...data, created_at: data.created_at || date(2025, 12, 1) });
    return id;
  };

  const act = (oppId, records) => {
    records.forEach(r => {
      activities.push({ id: uuid(), opportunity_id: oppId, ...r });
    });
  };

  // --- Lead (3) ~$2.1M ---
  let id;

  id = opp({
    name: 'STM32H7 工控 HMI Design-in',
    customer_id: IDS.stm, owner_id: IDS.huang,
    stage: 'lead', amount_twd: 800000,
    probability: 10, expected_close: date(2026, 6, 30),
    description: '群光電子新款工控 HMI 面板需要高效能 MCU，STM32H7 為候選方案。',
    notes: '客戶剛啟動評估，尚未正式立案。',
    created_at: date(2026, 2, 25),
  });
  act(id, [
    { type: 'note', content: '接到群光趙工來電詢問 STM32H7 規格', user_id: IDS.huang, created_at: date(2026, 2, 25) },
    { type: 'email', content: '寄送 STM32H7 產品型錄與評估板資訊', user_id: IDS.huang, created_at: date(2026, 2, 27) },
  ]);

  id = opp({
    name: 'Renesas RA6 IoT 閘道器專案',
    customer_id: IDS.renesas, owner_id: IDS.liu,
    stage: 'lead', amount_twd: 650000,
    probability: 15, expected_close: date(2026, 7, 31),
    description: '某智慧工廠客戶規劃 IoT 閘道器，考慮使用 Renesas RA6 系列 MCU。',
    notes: '客戶目前在研究階段，需求尚未明確。',
    created_at: date(2026, 3, 1),
  });
  act(id, [
    { type: 'meeting', content: '與客戶 PM 初步電話會議，了解專案規模', user_id: IDS.liu, created_at: date(2026, 3, 3) },
    { type: 'note', content: '預估年用量 5K-10K pcs', user_id: IDS.liu, created_at: date(2026, 3, 3) },
  ]);

  id = opp({
    name: '新唐 M467 智慧門鎖方案',
    customer_id: IDS.nuvoton, owner_id: IDS.chen,
    stage: 'lead', amount_twd: 650000,
    probability: 10, expected_close: date(2026, 8, 31),
    description: '新創公司開發智慧門鎖，評估新唐 M467 系列 MCU 搭配 BLE 模組。',
    notes: '初步接觸，客戶預算有限。',
    created_at: date(2026, 3, 5),
  });
  act(id, [
    { type: 'call', content: '電話拜訪客戶 CTO，介紹新唐 MCU 方案', user_id: IDS.chen, created_at: date(2026, 3, 5) },
  ]);

  // --- Qualified (5) ~$8.5M ---

  id = opp({
    name: 'TI 車用電源 IC Design-in (鴻海)',
    customer_id: IDS.ti, owner_id: IDS.chen,
    stage: 'qualified', amount_twd: 3200000,
    probability: 30, expected_close: date(2026, 5, 31),
    description: '鴻海電動車電池管理系統需要高效率降壓轉換器，TI TPS62xxx 系列為目標方案。MEDDIC 分析進行中。',
    notes: '柏翰的重點案件，已透過技術簡報接觸到採購主管。Champion: 客戶技術主管已主動推薦我們的方案。',
    created_at: date(2025, 12, 10),
  });
  act(id, [
    { type: 'meeting', content: '首次技術簡報會議，演示 TPS62 系列效率優勢', user_id: IDS.chen, created_at: date(2026, 1, 15) },
    { type: 'email', content: '寄送正式報價單與 Design-in 支援計畫', user_id: IDS.chen, created_at: date(2026, 2, 3) },
    { type: 'note', content: '客戶技術主管回饋正面，將向採購部門推薦', user_id: IDS.chen, created_at: date(2026, 2, 20) },
  ]);

  id = opp({
    name: 'ADI 高精度 ADC 工控量測',
    customer_id: IDS.adi, owner_id: IDS.liu,
    stage: 'qualified', amount_twd: 1800000,
    probability: 35, expected_close: date(2026, 5, 15),
    description: '國內量測儀器廠商新一代產品需要 24-bit ADC，ADI AD7768 系列為首選。',
    notes: '客戶技術評估中，競品為 TI ADS127。',
    created_at: date(2026, 1, 5),
  });
  act(id, [
    { type: 'meeting', content: '客戶端技術評估會議', user_id: IDS.liu, created_at: date(2026, 1, 20) },
    { type: 'note', content: '客戶對 AD7768 雜訊表現滿意', user_id: IDS.liu, created_at: date(2026, 1, 20) },
  ]);

  id = opp({
    name: 'NXP S32K3 車身控制模組',
    customer_id: IDS.nxp, owner_id: IDS.lin,
    stage: 'qualified', amount_twd: 1500000,
    probability: 40, expected_close: date(2026, 4, 30),
    description: '車用一階供應商新車身控制模組專案，NXP S32K3 系列 MCU + CAN FD 收發器。',
    notes: '客戶為 Tier-1 車廠供應商，專案周期較長。',
    created_at: date(2025, 11, 15),
  });
  act(id, [
    { type: 'meeting', content: '與客戶研發團隊進行架構討論', user_id: IDS.lin, created_at: date(2026, 1, 8) },
    { type: 'email', content: '提供 S32K3 開發板及技術文件', user_id: IDS.lin, created_at: date(2026, 1, 12) },
    { type: 'note', content: '客戶已開始 POC 驗證', user_id: IDS.lin, created_at: date(2026, 2, 10) },
  ]);

  id = opp({
    name: 'STM32U5 低功耗穿戴裝置',
    customer_id: IDS.stm, owner_id: IDS.huang,
    stage: 'qualified', amount_twd: 1200000,
    probability: 25, expected_close: date(2026, 6, 30),
    description: '穿戴裝置新創公司評估 STM32U5 超低功耗 MCU 系列。',
    notes: '競品包含 Nordic 和 Ambiq，功耗是關鍵決策因素。',
    created_at: date(2026, 1, 20),
  });
  act(id, [
    { type: 'meeting', content: '產品介紹會議', user_id: IDS.huang, created_at: date(2026, 2, 5) },
    { type: 'note', content: '客戶要求提供功耗量測數據', user_id: IDS.huang, created_at: date(2026, 2, 5) },
  ]);

  id = opp({
    name: 'ADI 電源模組 Spot Buy',
    customer_id: IDS.adi, owner_id: IDS.chen,
    stage: 'qualified', amount_twd: 800000,
    probability: 50, expected_close: date(2026, 4, 15),
    description: 'EMS 廠急需 ADI LTM4700 電源模組，現貨採購需求。柏翰用 MEDDIC 快速分析案件。',
    notes: '客戶交期壓力大，我們有現貨庫存優勢。',
    created_at: date(2026, 2, 15),
  });
  act(id, [
    { type: 'call', content: '客戶來電詢問庫存與交期', user_id: IDS.chen, created_at: date(2026, 2, 15) },
    { type: 'email', content: '回覆庫存確認與報價', user_id: IDS.chen, created_at: date(2026, 2, 16) },
  ]);

  // --- Proposal (4) ~$12M ---

  id = opp({
    name: 'TI 電源 IC 年度合約 (廣達)',
    customer_id: IDS.ti, owner_id: IDS.lin,
    stage: 'proposal', amount_twd: 5500000,
    probability: 60, expected_close: date(2026, 3, 31),
    description: '廣達筆電事業群年度 TI 電源 IC 採購框架合約，涵蓋 DC-DC、LDO、充電 IC 等多品項。',
    notes: '去年合約到期續約談判中，客戶要求降價 5%。',
    created_at: date(2025, 11, 1),
  });
  act(id, [
    { type: 'meeting', content: '與廣達採購部進行年度合約條件討論', user_id: IDS.lin, created_at: date(2026, 2, 5) },
    { type: 'email', content: '提交正式年度報價方案', user_id: IDS.lin, created_at: date(2026, 2, 20) },
    { type: 'note', content: '客戶回饋價格在可接受範圍，待內部簽核', user_id: IDS.lin, created_at: date(2026, 3, 1) },
  ]);

  id = opp({
    name: 'NXP 車用雷達 MMIC (和碩)',
    customer_id: IDS.nxp, owner_id: IDS.lin,
    stage: 'proposal', amount_twd: 3200000,
    probability: 55, expected_close: date(2026, 4, 15),
    description: '和碩車載雷達專案，NXP TEF82xx 雷達收發器 + S32R 雷達處理器整體方案。',
    notes: '大型 Design-in 專案，量產預計 2026 Q4。',
    created_at: date(2025, 10, 15),
  });
  act(id, [
    { type: 'meeting', content: '方案提案會議，含價格與技術支援計畫', user_id: IDS.lin, created_at: date(2026, 2, 12) },
    { type: 'note', content: '客戶認為方案完整度高，進入內部評選', user_id: IDS.lin, created_at: date(2026, 2, 18) },
  ]);

  id = opp({
    name: 'Renesas RH850 車用儀表板',
    customer_id: IDS.renesas, owner_id: IDS.liu,
    stage: 'proposal', amount_twd: 2100000,
    probability: 50, expected_close: date(2026, 4, 30),
    description: '車用儀表板專案，Renesas RH850 MCU + 車用顯示驅動 IC 組合方案。',
    notes: '客戶端已完成技術評估，進入商務報價階段。',
    created_at: date(2025, 11, 20),
  });
  act(id, [
    { type: 'email', content: '提交正式報價與交期承諾', user_id: IDS.liu, created_at: date(2026, 2, 25) },
    { type: 'note', content: '競爭對手也在報價中，需準備差異化說明', user_id: IDS.liu, created_at: date(2026, 3, 1) },
  ]);

  id = opp({
    name: '新唐 NuMicro 智慧家電方案',
    customer_id: IDS.nuvoton, owner_id: IDS.chen,
    stage: 'proposal', amount_twd: 1200000,
    probability: 45, expected_close: date(2026, 4, 30),
    description: '家電品牌客戶新款智慧電鍋專案，使用新唐 NuMicro M251 MCU + 觸控 IC。',
    notes: '客戶量產經驗豐富，注重成本與交期。柏翰第一個獨立主導的提案案件。',
    created_at: date(2026, 1, 10),
  });
  act(id, [
    { type: 'meeting', content: '客戶端提案會議，展示方案與報價', user_id: IDS.chen, created_at: date(2026, 2, 28) },
    { type: 'email', content: '補充量產價格階梯表', user_id: IDS.chen, created_at: date(2026, 3, 3) },
    { type: 'note', content: '客戶反應正面，等待最終決定', user_id: IDS.chen, created_at: date(2026, 3, 10) },
  ]);

  // --- Negotiation (3) ~$5.2M ---

  id = opp({
    name: 'TI MSP430 智慧電表標案',
    customer_id: IDS.ti, owner_id: IDS.huang,
    stage: 'negotiation', amount_twd: 2500000,
    probability: 70, expected_close: date(2026, 3, 25),
    description: '台電智慧電表更換計畫，電表廠商標案使用 TI MSP430 低功耗 MCU。已得標，進入合約條款協商。',
    notes: '大量採購，價格已基本談定，最後確認付款條件與交期保證。',
    created_at: date(2025, 9, 1),
  });
  act(id, [
    { type: 'meeting', content: '合約條款最終協商會議', user_id: IDS.huang, created_at: date(2026, 3, 10) },
    { type: 'email', content: '修訂版合約寄出等待用印', user_id: IDS.huang, created_at: date(2026, 3, 12) },
  ]);

  id = opp({
    name: 'ADI Signal Chain 醫療設備',
    customer_id: IDS.adi, owner_id: IDS.liu,
    stage: 'negotiation', amount_twd: 1500000,
    probability: 65, expected_close: date(2026, 3, 31),
    description: '醫療設備廠的血氧監測模組，使用 ADI 完整信號鏈方案（AFE + ADC + 光源驅動）。',
    notes: '客戶已完成 FDA 送件準備，採購合約進入最終談判。',
    created_at: date(2025, 10, 1),
  });
  act(id, [
    { type: 'meeting', content: '與客戶採購及法務進行合約條款討論', user_id: IDS.liu, created_at: date(2026, 3, 8) },
    { type: 'note', content: '付款條件 T/T 60 天已取得共識', user_id: IDS.liu, created_at: date(2026, 3, 8) },
  ]);

  id = opp({
    name: '群光電源模組 BOM 整合',
    customer_id: IDS.liteon, owner_id: IDS.chen,
    stage: 'negotiation', amount_twd: 1200000,
    probability: 75, expected_close: date(2026, 3, 20),
    description: '群光新款伺服器電源供應器專案，整合 TI + ADI 電源 IC BOM 一站式供貨。',
    notes: '我們的庫存與交期優勢是關鍵差異化。最後的價格微調中。',
    created_at: date(2025, 11, 1),
  });
  act(id, [
    { type: 'call', content: '電話確認最終價格與交貨排程', user_id: IDS.chen, created_at: date(2026, 3, 13) },
    { type: 'note', content: '客戶口頭同意，等正式 PO', user_id: IDS.chen, created_at: date(2026, 3, 13) },
  ]);

  // --- Closed Won (3) ~$3.8M ---

  id = opp({
    name: 'TI CC2652 BLE 模組量產單',
    customer_id: IDS.ti, owner_id: IDS.liu,
    stage: 'closed_won', amount_twd: 1500000,
    probability: 100, expected_close: date(2026, 1, 31),
    closed_at: date(2026, 1, 28),
    description: 'IoT 設備廠的 BLE 無線模組量產訂單，使用 TI CC2652R7 無線 MCU。Design-in 歷時 8 個月。',
    notes: '順利結案，首批量產 10K pcs 已出貨。',
    created_at: date(2025, 5, 1),
  });
  act(id, [
    { type: 'note', content: '收到正式 PO，金額 $1.5M', user_id: IDS.liu, created_at: date(2026, 1, 28) },
    { type: 'email', content: '確認交期並安排出貨', user_id: IDS.liu, created_at: date(2026, 1, 30) },
  ]);

  id = opp({
    name: 'NXP i.MX8 智慧看板',
    customer_id: IDS.nxp, owner_id: IDS.lin,
    stage: 'closed_won', amount_twd: 1300000,
    probability: 100, expected_close: date(2026, 2, 15),
    closed_at: date(2026, 2, 10),
    description: '數位看板廠商使用 NXP i.MX 8M Plus 處理器進行量產。',
    notes: '從 Design-in 到量產花了 6 個月，客戶滿意度高。',
    created_at: date(2025, 8, 1),
  });
  act(id, [
    { type: 'note', content: '客戶下單量產 5K pcs', user_id: IDS.lin, created_at: date(2026, 2, 10) },
    { type: 'note', content: '出貨完成，客戶回饋良好', user_id: IDS.lin, created_at: date(2026, 2, 25) },
  ]);

  id = opp({
    name: 'STM32F4 工控 PLC 模組',
    customer_id: IDS.stm, owner_id: IDS.huang,
    stage: 'closed_won', amount_twd: 1000000,
    probability: 100, expected_close: date(2026, 2, 28),
    closed_at: date(2026, 2, 22),
    description: '工控 PLC 廠商年度 STM32F4 MCU 採購訂單。',
    notes: '穩定客戶的常規訂單，關係維護良好。',
    created_at: date(2025, 12, 1),
  });
  act(id, [
    { type: 'email', content: '收到年度框架合約與首批 PO', user_id: IDS.huang, created_at: date(2026, 2, 22) },
  ]);

  // --- Closed Lost (2) ---

  id = opp({
    name: 'Renesas RX65N 工控面板（失標）',
    customer_id: IDS.renesas, owner_id: IDS.liu,
    stage: 'closed_lost', amount_twd: 900000,
    probability: 0, expected_close: date(2026, 2, 15),
    closed_at: date(2026, 2, 12),
    lost_reason: '競爭對手提供更低價格與更短交期',
    description: '工控面板專案，客戶最終選擇競爭對手的 Renesas 方案。',
    notes: '價格差距約 8%，且競爭對手承諾更短交期。需要檢討報價策略。',
    created_at: date(2025, 10, 15),
  });
  act(id, [
    { type: 'note', content: '客戶通知已選擇其他供應商', user_id: IDS.liu, created_at: date(2026, 2, 12) },
    { type: 'note', content: '失標檢討：價格與交期雙重劣勢', user_id: IDS.liu, created_at: date(2026, 2, 14) },
  ]);

  id = opp({
    name: 'TI DLP 投影機方案（客戶取消）',
    customer_id: IDS.ti, owner_id: IDS.huang,
    stage: 'closed_lost', amount_twd: 2000000,
    probability: 0, expected_close: date(2026, 1, 31),
    closed_at: date(2026, 1, 25),
    lost_reason: '客戶因市場因素取消整個專案',
    description: 'LED 投影機專案因市場競爭加劇，客戶決定暫停投資。',
    notes: '非供應商問題，持續追蹤客戶後續計畫。',
    created_at: date(2025, 7, 1),
  });
  act(id, [
    { type: 'note', content: '客戶正式通知專案取消', user_id: IDS.huang, created_at: date(2026, 1, 25) },
  ]);

  return { opportunities, activities };
}

// ---------------------------------------------------------------------------
// Targets (Q1 2026)
// ---------------------------------------------------------------------------
function buildTargets() {
  return [
    {
      id: uuid(), org_id: IDS.org,
      user_id: IDS.lin, period: '2026-Q1', type: 'team',
      target_twd: 80000000, actual_twd: 62000000,
      achievement_rate: 0.78,
      notes: 'Q1 整體達成率 78%，3 月底仍有數案可望結案。',
    },
    {
      id: uuid(), org_id: IDS.org,
      user_id: IDS.chen, period: '2026-Q1', type: 'individual',
      target_twd: 15000000, actual_twd: 10500000,
      achievement_rate: 0.70,
      notes: '群光 BOM 整合案與新唐智慧家電案若順利結案可提升至 85%。',
    },
    {
      id: uuid(), org_id: IDS.org,
      user_id: IDS.liu, period: '2026-Q1', type: 'individual',
      target_twd: 20000000, actual_twd: 18000000,
      achievement_rate: 0.90,
      notes: 'TI BLE 量產單與 ADI 醫療案貢獻穩定。表現優異。',
    },
    {
      id: uuid(), org_id: IDS.org,
      user_id: IDS.huang, period: '2026-Q1', type: 'individual',
      target_twd: 25000000, actual_twd: 21000000,
      achievement_rate: 0.84,
      notes: 'TI 智慧電表標案即將結案，STM32 工控訂單穩定出貨中。',
    },
  ];
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
function buildNotifications() {
  return [
    {
      id: uuid(), org_id: IDS.org,
      user_id: IDS.chen, type: 'deal_update',
      title: '群光 BOM 整合案客戶口頭同意',
      message: '群光電源模組 BOM 整合案客戶已口頭同意報價，等待正式 PO。預計本週內結案。',
      read: false,
      created_at: date(2026, 3, 13, 16, 30),
    },
    {
      id: uuid(), org_id: IDS.org,
      user_id: IDS.chen, type: 'coaching',
      title: '教練回饋：第 4 次教練會議紀錄已更新',
      message: '張淑芬教練已更新你的第 4 次 MEDDIC 教練會議紀錄，包含 Q2 行動計畫建議。請查閱。',
      read: false,
      created_at: date(2026, 3, 12, 10, 0),
    },
    {
      id: uuid(), org_id: IDS.org,
      user_id: IDS.lin, type: 'target_alert',
      title: 'Q1 業績達成率預警',
      message: '距離 Q1 結束剩餘 17 天，團隊達成率 78%。陳柏翰（70%）需要關注，建議協助推動群光與新唐兩案。',
      read: false,
      created_at: date(2026, 3, 14, 8, 0),
    },
    {
      id: uuid(), org_id: IDS.org,
      user_id: IDS.huang, type: 'deal_update',
      title: 'TI 智慧電表合約已寄出',
      message: '修訂版合約已寄送客戶法務用印，預計下週回簽。',
      read: true,
      created_at: date(2026, 3, 12, 14, 0),
    },
    {
      id: uuid(), org_id: IDS.org,
      user_id: IDS.chang, type: 'learning',
      title: '陳柏翰完成 MEDDIC 模組 3',
      message: '陳柏翰已完成「Decision Criteria（決策標準）」模組，測驗成績 82 分。學習進度已達 45%。',
      read: true,
      created_at: date(2026, 3, 11, 17, 0),
    },
  ];
}

// ---------------------------------------------------------------------------
// Main: seedDemoStory
// ---------------------------------------------------------------------------
export function seedDemoStory() {
  const users = buildUsers();
  const courses = buildCourses();
  const { modules: course_modules, lessons: module_lessons } = buildModulesAndLessons();
  const { enrollments, lessonProgress: lesson_progress } = buildEnrollmentsAndProgress(course_modules, module_lessons);
  const { coachingPlans: coaching_plans, coachingSessions: coaching_sessions, skillAssessments: skill_assessments } = buildCoaching();
  const { customers, contacts } = buildCustomers();
  const { opportunities, activities: opportunity_activities } = buildOpportunities();
  const targets = buildTargets();
  const notifications = buildNotifications();

  const data = {
    organization: {
      id: IDS.org,
      name: '芯達科技股份有限公司',
      slug: 'sinda-tech',
      plan: 'pro',
      created_at: date(2025, 6, 1),
    },
    users,
    courses,
    course_modules,
    module_lessons,
    enrollments,
    lesson_progress,
    coaching_plans,
    coaching_sessions,
    skill_assessments,
    customers,
    contacts,
    opportunities,
    opportunity_activities,
    targets,
    notifications,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function isDemoSeeded() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    return !!(data && data.organization && data.organization.slug === 'sinda-tech');
  } catch {
    return false;
  }
}
