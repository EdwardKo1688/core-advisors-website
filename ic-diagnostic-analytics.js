/* ============================================================
   IC 產業人才轉型診斷 — 分析與事件追蹤模組
   ic-diagnostic-analytics.js  v1.0.0

   追蹤事件清單：
   ├── icd_start              (10.1) 開始診斷（角色選擇）
   ├── icd_questionnaire_done (10.2) 問卷完成（所有題組答畢）
   ├── icd_upload_success     (10.3) 資料上傳成功
   ├── icd_view_result        (10.4) 結果頁瀏覽
   ├── icd_lead_submit        (10.5) 留資送出
   └── icd_booking_click      (10.6) 預約顧問點擊

   傳送策略（依優先順序）：
   1. GA4 gtag()  — 如頁面已載入 Google Analytics
   2. localStorage — 本機 fallback（MVP 除錯用，最多 200 筆）
   ============================================================ */

'use strict';

const ICDAnalytics = (() => {

    const STORAGE_KEY = 'icd_analytics_events';
    const MAX_LOCAL_EVENTS = 200;

    /* ---- 標籤對照 ---- */
    const ROLE_LABELS = {
        sales: 'Sales 業務開發',
        pm   : 'PM 產品經理',
        fae  : 'FAE 技術支援'
    };

    /* ========================================================
       核心追蹤函式
       ======================================================== */

    /**
     * 傳送事件
     * @param {string} eventName   — GA4 event_name
     * @param {object} params      — 額外參數（會被合併進 event payload）
     */
    function track(eventName, params = {}) {
        const payload = {
            event_category : 'ic_diagnostic',
            event_label    : params.role ? (ROLE_LABELS[params.role] || params.role) : undefined,
            ...params,
            timestamp      : new Date().toISOString()
        };

        // 移除 undefined 值（避免 GA4 收到空參數）
        Object.keys(payload).forEach(k => {
            if (payload[k] === undefined) delete payload[k];
        });

        // 1. GA4
        _sendToGA4(eventName, payload);

        // 2. localStorage fallback
        _saveLocal(eventName, payload);

        // Debug log（dev 環境）
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('[ICDAnalytics]', eventName, payload);
        }
    }

    /* ---- GA4 ---- */
    function _sendToGA4(eventName, payload) {
        try {
            if (typeof gtag === 'function') {
                gtag('event', eventName, payload);
            }
        } catch (e) { /* gtag 不可用時靜默略過 */ }
    }

    /* ---- localStorage fallback ---- */
    function _saveLocal(eventName, payload) {
        try {
            const raw    = localStorage.getItem(STORAGE_KEY);
            const events = raw ? JSON.parse(raw) : [];
            events.unshift({ event: eventName, ...payload });
            if (events.length > MAX_LOCAL_EVENTS) events.length = MAX_LOCAL_EVENTS;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        } catch (e) { /* localStorage 不可用時靜默略過 */ }
    }

    /* ========================================================
       10.1  開始診斷（角色選擇完成）
       ======================================================== */
    /**
     * @param {string} role — sales | pm | fae
     */
    function trackStart(role) {
        track('icd_start', {
            role,
            role_label: ROLE_LABELS[role] || role
        });
    }

    /* ========================================================
       10.2  問卷完成（最後一個題組通過驗證，進入上傳步驟）
       ======================================================== */
    /**
     * @param {string} role
     * @param {number} questionCount — 已作答題數
     * @param {number} totalCount    — 全部必填題數
     */
    function trackQuestionnaireDone(role, questionCount, totalCount) {
        track('icd_questionnaire_done', {
            role,
            question_count : questionCount,
            total_count    : totalCount,
            completion_rate: totalCount > 0 ? Math.round((questionCount / totalCount) * 100) : 0
        });
    }

    /* ========================================================
       10.3  資料上傳成功
       ======================================================== */
    /**
     * @param {string} role
     * @param {string} fileName
     * @param {string} fileType  — csv | xlsx
     * @param {number} fileSize  — bytes
     */
    function trackUploadSuccess(role, fileName, fileType, fileSize) {
        track('icd_upload_success', {
            role,
            file_type : fileType,
            file_size : fileSize,
            file_name : fileName
        });
    }

    /* ========================================================
       10.4  結果頁瀏覽
       ======================================================== */
    /**
     * @param {string} role
     * @param {number} score         — 0–100
     * @param {string} maturityLevel — A | B | C | D
     * @param {number} completeness  — 0–100
     * @param {number} riskCount     — 觸發規則數
     */
    function trackViewResult(role, score, maturityLevel, completeness, riskCount) {
        track('icd_view_result', {
            role,
            score,
            maturity_level : maturityLevel,
            completeness,
            risk_count     : riskCount
        });
    }

    /* ========================================================
       10.5  留資送出
       ======================================================== */
    /**
     * @param {string} role
     * @param {number} score
     * @param {string} maturityLevel
     */
    function trackLeadSubmit(role, score, maturityLevel) {
        track('icd_lead_submit', {
            role,
            score,
            maturity_level: maturityLevel
        });
    }

    /* ========================================================
       10.6  預約顧問點擊
       ======================================================== */
    /**
     * @param {string} role
     * @param {string} maturityLevel
     * @param {string} source — 'result_cta' | 'result_secondary' | 'intro_cta'
     */
    function trackBookingClick(role, maturityLevel, source) {
        track('icd_booking_click', {
            role,
            maturity_level : maturityLevel,
            click_source   : source || 'unknown'
        });
    }

    /* ========================================================
       工具方法（管理後台 / 除錯用）
       ======================================================== */

    /** 取得本機儲存的所有事件（最新優先） */
    function getLocalEvents() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch (e) { return []; }
    }

    /** 清空本機事件紀錄 */
    function clearLocalEvents() {
        localStorage.removeItem(STORAGE_KEY);
    }

    /** 統計事件次數摘要 */
    function getEventSummary() {
        const events = getLocalEvents();
        const summary = {};
        events.forEach(e => {
            summary[e.event] = (summary[e.event] || 0) + 1;
        });
        return summary;
    }

    /**
     * 10.7 AI 分析生成追蹤
     * @param {string} role - 角色
     * @param {string} level - 成熟度等級 A-D
     * @param {string} status - 'start' | 'success' | 'error'
     */
    function trackAIGenerate(role, level, status) {
        track('icd_ai_generate', {
            event_category: 'ic_diagnostic',
            role: role,
            maturity_level: level,
            status: status
        });
    }

    /**
     * 10.8 PDF 下載追蹤
     */
    function trackPDFDownload(role, level) {
        track('icd_pdf_download', {
            event_category: 'ic_diagnostic',
            role: role,
            maturity_level: level
        });
    }

    /**
     * 10.9 Email 報告發送追蹤
     */
    function trackEmailSend(role, level) {
        track('icd_email_send', {
            event_category: 'ic_diagnostic',
            role: role,
            maturity_level: level
        });
    }

    /* ========================================================
       Public API
       ======================================================== */
    return {
        track,
        trackStart,
        trackQuestionnaireDone,
        trackUploadSuccess,
        trackViewResult,
        trackLeadSubmit,
        trackBookingClick,
        trackAIGenerate,
        trackPDFDownload,
        trackEmailSend,
        getLocalEvents,
        clearLocalEvents,
        getEventSummary,
        version: '1.1.0'
    };
})();
