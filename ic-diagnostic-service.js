/* ============================================================
   IC 產業人才轉型診斷 — 資料與服務層
   ic-diagnostic-service.js  v1.0.0

   模組架構：
   ├── ICDService.DataStore       (8.7) Session / Lead / Upload 持久化
   ├── ICDService.Validator       (8.5) 資料驗證 service
   ├── ICDService.Parser          (8.6) CSV / Excel 解析 service
   ├── ICDService.Scorer          (8.10) 分數計算 service
   ├── ICDService.RuleEngine      (8.11) 診斷規則引擎
   └── ICDService.Recommendation  (8.12) 建議生成 service

   JSON 結構已確認（由各 Phase 實作完成）：
   ├── 8.1  questions-{role}.json  → 題庫結構（Phase 3 建立）
   ├── 8.2  scoring-config.json   → 權重結構（Phase 3 建立）
   ├── 8.3  diagnostic-rules.json → 規則結構（Phase 5 建立）
   └── 8.4  upload-templates.json → 模板結構（Phase 4 建立）
   ============================================================ */

'use strict';

const ICDService = (() => {

    /* ========================================================
       Storage Keys — 集中管理所有 localStorage key 名稱
       ======================================================== */
    const STORAGE_KEYS = {
        SESSIONS  : 'icd_sessions',
        LAST      : 'icd_last_result',
        LEADS     : 'icd_leads',
        UPLOADS   : 'icd_uploads'
    };

    /* ========================================================
       8.7  DataStore — MVP localStorage 持久化模組
       8.8  Lead 儲存結構
       8.9  Upload 儲存結構
       ======================================================== */

    /**
     * Session 資料結構（診斷結果）
     * {
     *   id                : string   — UUID
     *   role              : string   — sales | pm | fae
     *   info              : object   — { company, name, title, size, products }
     *   modelScores       : object   — { revenue: { raw, score, catScores }, ... }
     *   overallScore      : number   — 0–100
     *   maturity          : object   — { level, label, min, max, color, description }
     *   triggeredRules    : array    — 最多 3 條規則物件
     *   topActions        : array    — 最多 5 條行動物件
     *   completeness      : number   — 0–100 整體完備度
     *   questionCompleteness : number
     *   dataCompleteness  : number
     *   hasUpload         : boolean
     *   timestamp         : string   — ISO 8601
     * }
     *
     * Lead 資料結構（留資）
     * {
     *   id        : string
     *   name      : string
     *   email     : string
     *   phone     : string
     *   company   : string
     *   source    : 'ic-diagnostic'
     *   role      : string
     *   score     : number
     *   maturity  : string
     *   status    : 'new' | 'contacted' | 'qualified' | 'closed'
     *   timestamp : string
     * }
     *
     * Upload 資料結構（檔案上傳紀錄）
     * {
     *   id         : string
     *   sessionId  : string  — 對應 Session id（若有）
     *   fileName   : string
     *   fileSize   : number  — bytes
     *   fileType   : string  — 'csv' | 'xlsx'
     *   role       : string
     *   templateId : string  — 對應 upload-templates.json 中的 id
     *   status     : 'pending' | 'parsed' | 'error'
     *   rowCount   : number
     *   errorCount : number
     *   timestamp  : string
     * }
     */

    const DataStore = (() => {

        /* ----- helpers ----- */
        function _read(key) {
            try {
                return JSON.parse(localStorage.getItem(key) || 'null');
            } catch (e) {
                console.warn('[ICDService.DataStore] read error', key, e);
                return null;
            }
        }

        function _write(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
                return true;
            } catch (e) {
                console.warn('[ICDService.DataStore] write error', key, e);
                return false;
            }
        }

        function _uuid() {
            return 'icd-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
        }

        /* ---------- Session ---------- */

        /**
         * 儲存診斷 Session（同時寫入 icd_sessions 清單與 icd_last_result）
         * @param {object} sessionData — 由 ICD_Scorer 計算後的結果物件
         * @returns {string} 產生的 session id
         */
        function saveSession(sessionData) {
            const id = sessionData.id || _uuid();
            const session = { id, ...sessionData, timestamp: sessionData.timestamp || new Date().toISOString() };

            // 寫入清單（最多保留 100 筆）
            const sessions = getSessions();
            sessions.unshift(session);
            if (sessions.length > 100) sessions.length = 100;
            _write(STORAGE_KEYS.SESSIONS, sessions);

            // 寫入最近一筆（相容舊 icd_last_result 格式）
            _write(STORAGE_KEYS.LAST, session);

            return id;
        }

        /** 取得全部 Session 清單（最新優先） */
        function getSessions() {
            return _read(STORAGE_KEYS.SESSIONS) || [];
        }

        /** 取得最後一筆 Session（相容直接寫入 icd_last_result 的舊資料） */
        function getLastSession() {
            // 優先從清單取
            const sessions = getSessions();
            if (sessions.length > 0) return sessions[0];
            // fallback：舊格式
            return _read(STORAGE_KEYS.LAST);
        }

        /** 依 id 取得單筆 Session */
        function getSessionById(id) {
            return getSessions().find(s => s.id === id) || null;
        }

        /** 刪除單筆 Session */
        function deleteSession(id) {
            const sessions = getSessions().filter(s => s.id !== id);
            _write(STORAGE_KEYS.SESSIONS, sessions);
            const last = getLastSession();
            if (last && last.id === id) localStorage.removeItem(STORAGE_KEYS.LAST);
        }

        /* ---------- Lead ---------- */

        /**
         * 儲存留資
         * @param {object} leadData — { name, email, phone, company, role, score, maturity, source }
         * @returns {string} lead id
         */
        function saveLead(leadData) {
            const id = leadData.id || _uuid();
            const lead = {
                id,
                status: 'new',
                ...leadData,
                timestamp: leadData.timestamp || new Date().toISOString()
            };
            const leads = getLeads();
            leads.unshift(lead);
            _write(STORAGE_KEYS.LEADS, leads);
            return id;
        }

        /** 取得全部 Lead（最新優先） */
        function getLeads() {
            return _read(STORAGE_KEYS.LEADS) || [];
        }

        /**
         * 更新 Lead 狀態
         * @param {string} id
         * @param {'new'|'contacted'|'qualified'|'closed'} status
         */
        function updateLeadStatus(id, status) {
            const leads = getLeads().map(l => l.id === id ? { ...l, status } : l);
            _write(STORAGE_KEYS.LEADS, leads);
        }

        /** 刪除 Lead */
        function deleteLead(id) {
            _write(STORAGE_KEYS.LEADS, getLeads().filter(l => l.id !== id));
        }

        /* ---------- Upload ---------- */

        /**
         * 儲存上傳紀錄
         * @param {object} uploadData — { sessionId?, fileName, fileSize, fileType, role, templateId, status, rowCount, errorCount }
         * @returns {string} upload id
         */
        function saveUpload(uploadData) {
            const id = uploadData.id || _uuid();
            const upload = {
                id,
                status: 'pending',
                rowCount: 0,
                errorCount: 0,
                ...uploadData,
                timestamp: uploadData.timestamp || new Date().toISOString()
            };
            const uploads = getUploads();
            uploads.unshift(upload);
            _write(STORAGE_KEYS.UPLOADS, uploads);
            return id;
        }

        /** 取得全部上傳紀錄（最新優先） */
        function getUploads() {
            return _read(STORAGE_KEYS.UPLOADS) || [];
        }

        /** 更新上傳紀錄狀態 */
        function updateUploadStatus(id, status, extra = {}) {
            const uploads = getUploads().map(u => u.id === id ? { ...u, status, ...extra } : u);
            _write(STORAGE_KEYS.UPLOADS, uploads);
        }

        /* ---------- 統計摘要 ---------- */

        /** 計算 Dashboard 統計數字 */
        function getDashboardStats() {
            const sessions = getSessions();
            const leads    = getLeads();

            const totalSessions = sessions.length;
            const totalLeads    = leads.length;

            const avgScore = totalSessions > 0
                ? Math.round(sessions.reduce((s, r) => s + (r.overallScore || 0), 0) / totalSessions)
                : 0;

            const highRisk = sessions.filter(s =>
                (s.triggeredRules || []).some(r => r.severity === 'high')
            ).length;

            return { totalSessions, totalLeads, avgScore, highRisk };
        }

        /* ---------- 清空 ---------- */
        function clearAll() {
            Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
        }

        return {
            saveSession, getSessions, getLastSession, getSessionById, deleteSession,
            saveLead, getLeads, updateLeadStatus, deleteLead,
            saveUpload, getUploads, updateUploadStatus,
            getDashboardStats, clearAll,
            KEYS: STORAGE_KEYS
        };
    })();


    /* ========================================================
       8.5  Validator — 資料驗證 Service
       ======================================================== */
    const Validator = (() => {

        /* ----- 單一欄位驗證規則 ----- */
        const RULES = {
            /** 非空值（字串 trim 後非空） */
            non_empty(v) {
                return v !== null && v !== undefined && String(v).trim().length > 0;
            },
            /** 正整數 */
            positive_integer(v) {
                const n = Number(v);
                return Number.isInteger(n) && n > 0;
            },
            /** 正數（含小數） */
            positive_number(v) {
                const n = Number(v);
                return !isNaN(n) && n > 0;
            },
            /** 百分比 0–100 */
            percentage(v) {
                const n = Number(v);
                return !isNaN(n) && n >= 0 && n <= 100;
            },
            /** 年份範圍 1900–目前年份 */
            year_range(v) {
                const n = Number(v);
                return Number.isInteger(n) && n >= 1900 && n <= new Date().getFullYear();
            },
            /** 值需在允許清單內 */
            in_list(v, options) {
                if (!options || options.length === 0) return true;
                return options.includes(String(v).trim());
            },
            /** Email 格式 */
            email(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
            },
            /** 台灣手機號碼（09 開頭 10 碼）或留空 */
            phone(v) {
                const s = String(v).trim().replace(/[-\s]/g, '');
                return s === '' || /^09\d{8}$/.test(s) || /^\+886\d{9}$/.test(s);
            }
        };

        /**
         * 驗證單一欄位
         * @param {*} value — 欄位值
         * @param {object} fieldDef — { field, label, type, validation, options? }
         * @returns {{ valid: boolean, message: string }}
         */
        function validateField(value, fieldDef) {
            const ruleName = fieldDef.validation;
            if (!ruleName) return { valid: true, message: '' };

            const ruleFn = RULES[ruleName];
            if (!ruleFn) return { valid: true, message: '' }; // 未知規則視為通過

            const passed = ruleFn(value, fieldDef.options);
            return {
                valid: passed,
                message: passed ? '' : _buildMessage(fieldDef, ruleName)
            };
        }

        function _buildMessage(fieldDef, ruleName) {
            const label = fieldDef.label || fieldDef.field;
            const messages = {
                non_empty      : `「${label}」為必填欄位`,
                positive_integer: `「${label}」須為正整數`,
                positive_number : `「${label}」須為正數`,
                percentage      : `「${label}」須為 0–100 的數字`,
                year_range      : `「${label}」須為有效年份（1900 至今）`,
                in_list         : `「${label}」的值不在允許清單中`,
                email           : `「${label}」格式不正確（請輸入有效 Email）`,
                phone           : `「${label}」格式不正確`
            };
            return messages[ruleName] || `「${label}」驗證失敗`;
        }

        /**
         * 驗證一整列資料
         * @param {object} row       — { fieldName: value, ... }
         * @param {Array}  fields    — 欄位定義陣列（required_fields + optional_fields）
         * @param {boolean} reqOnly  — true 時只驗證 required fields
         * @returns {{ valid: boolean, errors: [{ field, message }] }}
         */
        function validateRow(row, fields, reqOnly = false) {
            const errors = [];
            const toCheck = reqOnly
                ? fields.filter(f => f.validation === 'non_empty' || f.required !== false)
                : fields;

            toCheck.forEach(fieldDef => {
                const value = row[fieldDef.field];
                const result = validateField(value, fieldDef);
                if (!result.valid) errors.push({ field: fieldDef.field, message: result.message });
            });

            return { valid: errors.length === 0, errors };
        }

        /**
         * 驗證上傳檔案（格式 + 大小）
         * @param {File} file
         * @returns {{ valid: boolean, message: string }}
         */
        function validateFile(file) {
            if (!file) return { valid: false, message: '未選取檔案' };

            const ext = file.name.split('.').pop().toLowerCase();
            if (!['xlsx', 'csv'].includes(ext)) {
                return { valid: false, message: `不支援 .${ext} 格式，請上傳 .xlsx 或 .csv` };
            }
            if (file.size > 5 * 1024 * 1024) {
                return { valid: false, message: '檔案大小超過 5MB 上限' };
            }
            if (file.size === 0) {
                return { valid: false, message: '檔案為空，請確認後重新上傳' };
            }
            return { valid: true, message: '' };
        }

        /**
         * 彙總多列驗證結果
         * @param {Array} rowResults — validateRow 回傳值的陣列
         * @returns {{ totalRows, validRows, errorRows, errorRate, errors }}
         */
        function getValidationSummary(rowResults) {
            const totalRows = rowResults.length;
            const errorRows = rowResults.filter(r => !r.valid).length;
            const validRows = totalRows - errorRows;
            const errorRate = totalRows > 0 ? Math.round((errorRows / totalRows) * 100) : 0;

            // 收集前 20 條錯誤訊息
            const errors = [];
            rowResults.forEach((r, idx) => {
                if (!r.valid) {
                    r.errors.forEach(e => {
                        if (errors.length < 20) errors.push({ row: idx + 2, ...e }); // row 2 開始（header 是 row 1）
                    });
                }
            });

            return { totalRows, validRows, errorRows, errorRate, errors };
        }

        return { validateField, validateRow, validateFile, getValidationSummary };
    })();


    /* ========================================================
       8.6  Parser — CSV / Excel 解析 Service
       ======================================================== */
    const Parser = (() => {

        /**
         * 解析 CSV 文字為 row 物件陣列
         * @param {string} text   — CSV 全文
         * @param {object} opts   — { delimiter: ',' | '\t', hasHeader: true }
         * @returns {{ headers: string[], rows: object[], rawRows: string[][] }}
         */
        function parseCSV(text, opts = {}) {
            const delimiter = opts.delimiter || ',';
            const hasHeader = opts.hasHeader !== false;

            // 處理 BOM（UTF-8 with BOM）
            const cleaned = text.replace(/^\uFEFF/, '');

            const lines = _splitCSVLines(cleaned);
            if (lines.length === 0) return { headers: [], rows: [], rawRows: [] };

            const rawRows = lines.map(line => _parseCSVLine(line, delimiter));

            if (!hasHeader) {
                const rows = rawRows.map(cells => {
                    const obj = {};
                    cells.forEach((v, i) => { obj[`col_${i + 1}`] = v.trim(); });
                    return obj;
                });
                return { headers: [], rows, rawRows };
            }

            const headers = rawRows[0].map(h => h.trim());
            const dataRows = rawRows.slice(1);

            // 過濾全空列
            const rows = dataRows
                .filter(cells => cells.some(c => c.trim() !== ''))
                .map(cells => {
                    const obj = {};
                    headers.forEach((h, i) => { obj[h] = (cells[i] || '').trim(); });
                    return obj;
                });

            return { headers, rows, rawRows };
        }

        /** 依 \r\n / \n / \r 拆行，但保留引號內的換行 */
        function _splitCSVLines(text) {
            const lines = [];
            let current = '';
            let inQuote = false;

            for (let i = 0; i < text.length; i++) {
                const ch = text[i];
                if (ch === '"') {
                    // 雙引號跳脫（""）
                    if (inQuote && text[i + 1] === '"') { current += '"'; i++; }
                    else { inQuote = !inQuote; }
                } else if ((ch === '\r' || ch === '\n') && !inQuote) {
                    if (ch === '\r' && text[i + 1] === '\n') i++; // CRLF
                    if (current.trim() !== '' || lines.length > 0) lines.push(current);
                    current = '';
                } else {
                    current += ch;
                }
            }
            if (current !== '') lines.push(current);
            return lines;
        }

        /** 解析單行 CSV，考慮引號與逗號 */
        function _parseCSVLine(line, delimiter) {
            const cells = [];
            let current = '';
            let inQuote = false;

            for (let i = 0; i < line.length; i++) {
                const ch = line[i];
                if (ch === '"') {
                    if (inQuote && line[i + 1] === '"') { current += '"'; i++; }
                    else { inQuote = !inQuote; }
                } else if (ch === delimiter && !inQuote) {
                    cells.push(current);
                    current = '';
                } else {
                    current += ch;
                }
            }
            cells.push(current);
            return cells;
        }

        /**
         * Excel 解析（MVP 佔位實作）
         * 正式環境可整合 SheetJS (xlsx.js)
         * @param {ArrayBuffer} buffer
         * @returns {Promise<{ headers, rows }>}
         */
        async function parseExcel(buffer) {
            // Phase 2：整合 SheetJS
            // if (window.XLSX) {
            //     const wb = XLSX.read(new Uint8Array(buffer));
            //     const ws = wb.Sheets[wb.SheetNames[0]];
            //     const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            //     const headers = data[0].map(String);
            //     const rows = data.slice(1).map(cells => {
            //         const obj = {};
            //         headers.forEach((h, i) => { obj[h] = cells[i] ?? ''; });
            //         return obj;
            //     });
            //     return { headers, rows };
            // }
            console.warn('[ICDService.Parser] Excel 解析需整合 SheetJS，MVP 暫不支援');
            return {
                headers: [],
                rows: [],
                error: 'Excel 解析功能於 Phase 2 啟用，目前請改用 CSV 格式上傳。'
            };
        }

        /**
         * 讀取 File 物件並自動依副檔名選擇解析方式
         * @param {File} file
         * @returns {Promise<{ headers, rows, error? }>}
         */
        async function parseFile(file) {
            const ext = file.name.split('.').pop().toLowerCase();
            if (ext === 'csv') {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(parseCSV(e.target.result));
                    reader.onerror = () => reject(new Error('檔案讀取失敗'));
                    reader.readAsText(file, 'UTF-8');
                });
            }
            if (ext === 'xlsx') {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = async e => resolve(await parseExcel(e.target.result));
                    reader.onerror = () => reject(new Error('檔案讀取失敗'));
                    reader.readAsArrayBuffer(file);
                });
            }
            return { headers: [], rows: [], error: `不支援 .${ext} 格式` };
        }

        /**
         * 欄位映射：將資料欄位名稱轉換為標準欄位名稱
         * @param {object[]} rows    — 原始 row 陣列
         * @param {object}   aliases — { 標準名稱: [別名1, 別名2, ...], ... }
         * @returns {object[]} 映射後的 rows
         */
        function applyFieldMapping(rows, aliases) {
            if (!aliases || rows.length === 0) return rows;

            // 建立反查表：別名 → 標準名稱
            const reverseMap = {};
            Object.entries(aliases).forEach(([canonical, aliasList]) => {
                (aliasList || []).forEach(alias => {
                    reverseMap[alias.toLowerCase()] = canonical;
                });
                reverseMap[canonical.toLowerCase()] = canonical; // 自身也加入
            });

            return rows.map(row => {
                const mapped = {};
                Object.entries(row).forEach(([key, val]) => {
                    const canonical = reverseMap[key.toLowerCase()] || key;
                    mapped[canonical] = val;
                });
                return mapped;
            });
        }

        /**
         * 偵測資料欄位最接近的模板類型
         * @param {string[]} headers — CSV/Excel 欄位名稱
         * @param {object[]} templates — upload-templates.json 的 templates 陣列
         * @returns {object|null} 最匹配的模板（或 null）
         */
        function detectTemplateType(headers, templates) {
            if (!templates || templates.length === 0 || headers.length === 0) return null;

            const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
            let best = null;
            let bestScore = 0;

            templates.forEach(tpl => {
                const reqFields = (tpl.required_fields || []).map(f => f.label.toLowerCase());
                const matches = reqFields.filter(f => normalizedHeaders.includes(f)).length;
                const score = matches / (reqFields.length || 1);
                if (score > bestScore) {
                    bestScore = score;
                    best = tpl;
                }
            });

            return bestScore >= 0.5 ? best : null; // 至少 50% 欄位匹配才認定
        }

        /**
         * 計算資料完備度（依模板定義）
         * @param {object[]} rows
         * @param {object}   template — 單一模板定義
         * @returns {number} 0–100 完備度百分比
         */
        function calculateDataCompleteness(rows, template) {
            if (!template || rows.length === 0) return 0;

            const allFields = [
                ...(template.required_fields || []),
                ...(template.optional_fields || [])
            ];

            if (allFields.length === 0) return 100;

            const scores = rows.map(row => {
                const filled = allFields.filter(f => {
                    const v = row[f.field] ?? row[f.label];
                    return v !== null && v !== undefined && String(v).trim() !== '';
                }).length;
                return filled / allFields.length;
            });

            const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
            return Math.round(avg * 100);
        }

        return { parseCSV, parseExcel, parseFile, applyFieldMapping, detectTemplateType, calculateDataCompleteness };
    })();


    /* ========================================================
       8.10  Scorer — 分數計算 Service
       ======================================================== */
    const Scorer = (() => {

        const MODEL_ORDER = ['revenue', 'grossprofit', 'expense', 'contribution', 'capability'];

        /**
         * 計算五個模型分數
         * @param {object[]} questions      — 題目陣列（含 model, category, weight 欄位）
         * @param {object}   answers        — { questionId: numericValue (1–5) }
         * @param {object}   subScoreWeights — { result, quality, trend, synergy }
         * @returns {object} { revenue: { raw, score, catScores }, ... }
         */
        function calculateModelScores(questions, answers, subScoreWeights) {
            const weights = subScoreWeights || { result: 0.40, quality: 0.25, trend: 0.15, synergy: 0.20 };
            const categories = ['result', 'quality', 'trend', 'synergy'];
            const modelScores = {};

            MODEL_ORDER.forEach(model => {
                const modelQs = questions.filter(q => q.model === model);
                const catScores = {};

                categories.forEach(cat => {
                    const catQs = modelQs.filter(q => q.category === cat);
                    if (catQs.length === 0) {
                        catScores[cat] = null;
                        return;
                    }
                    const total = catQs.reduce((sum, q) => {
                        const ans = answers[q.id];
                        return sum + (ans !== undefined ? ans * (q.weight || 1) : 0);
                    }, 0);
                    const maxTotal = catQs.reduce((sum, q) => sum + 5 * (q.weight || 1), 0);
                    catScores[cat] = maxTotal > 0 ? (total / maxTotal) * 5 : 0;
                });

                // 加權子分數 → 模型分數（0–5）
                let modelTotal = 0;
                let weightSum  = 0;
                categories.forEach(cat => {
                    if (catScores[cat] !== null) {
                        modelTotal += catScores[cat] * (weights[cat] || 0);
                        weightSum  += weights[cat] || 0;
                    }
                });
                const raw = weightSum > 0 ? modelTotal / weightSum : 0;

                modelScores[model] = {
                    raw,
                    score: Math.round(raw * 20), // 0–5 → 0–100
                    catScores
                };
            });

            return modelScores;
        }

        /**
         * 計算加權總分
         * @param {object} modelScores — calculateModelScores 回傳值
         * @param {object} roleWeights — { revenue, grossprofit, expense, contribution, capability }
         * @returns {number} 0–100
         */
        function calculateOverallScore(modelScores, roleWeights) {
            const defaultWeight = 0.2;
            let score = 0;
            MODEL_ORDER.forEach(model => {
                const w = roleWeights?.[model] ?? defaultWeight;
                score += (modelScores[model]?.score || 0) * w;
            });
            return Math.round(score);
        }

        /**
         * 取得成熟度等級
         * @param {number}   score         — 0–100
         * @param {object[]} maturityLevels — scoring-config.json 的 maturityLevels 陣列
         * @returns {object} maturity level 物件
         */
        function getMaturityLevel(score, maturityLevels) {
            const levels = maturityLevels || [
                { level: 'A', label: '成熟領先',   min: 85, max: 100, color: '#2e7d32', description: '各項指標表現優異。' },
                { level: 'B', label: '穩定可優化', min: 70, max: 84,  color: '#1565c0', description: '基礎穩固，部分面向仍有提升空間。' },
                { level: 'C', label: '轉型起步',   min: 55, max: 69,  color: '#e65100', description: '已具備基本運作能力，但需系統性強化。' },
                { level: 'D', label: '高風險待改善', min: 0, max: 54, color: '#c62828', description: '多項核心指標偏弱，建議優先啟動改善計畫。' }
            ];
            return levels.find(l => score >= l.min && score <= l.max) || levels[levels.length - 1];
        }

        /**
         * 計算資料完備度
         * @param {object[]} questions  — 題目陣列
         * @param {object}   answers    — 已作答的 answers
         * @param {boolean}  hasUpload  — 是否有上傳檔案
         * @returns {{ question: number, data: number, overall: number }} 百分比（0–100）
         */
        function calculateCompleteness(questions, answers, hasUpload) {
            const required   = questions.filter(q => q.required !== false);
            const answered   = required.filter(q => answers[q.id] !== undefined);
            const questionPct = required.length > 0 ? (answered.length / required.length) : 1;

            const dataPct    = hasUpload ? 0.30 : 0; // 上傳資料最多貢獻 30%
            const overall    = Math.round((questionPct * 0.70 + dataPct) * 100);

            return {
                question: Math.round(questionPct * 100),
                data    : hasUpload ? 30 : 0,
                overall
            };
        }

        /**
         * 完整計算診斷結果（整合以上所有計算）
         * @param {object} params — { role, questions, answers, info, hasUpload, scoringConfig }
         * @returns {object} 診斷結果物件（可直接傳入 DataStore.saveSession）
         */
        function calculateDiagnostic(params) {
            const { role, questions, answers, info, hasUpload, scoringConfig } = params;
            const config = scoringConfig || {};

            const modelScores   = calculateModelScores(questions, answers, config.subScoreWeights);
            const roleWeights   = config.roleWeights?.[role] || {};
            const overallScore  = calculateOverallScore(modelScores, roleWeights);
            const maturity      = getMaturityLevel(overallScore, config.maturityLevels);
            const completeness  = calculateCompleteness(questions, answers, hasUpload);

            return {
                role, info, modelScores, overallScore, maturity,
                completeness: completeness.overall,
                questionCompleteness: completeness.question,
                dataCompleteness: completeness.data,
                hasUpload: !!hasUpload,
                timestamp: new Date().toISOString()
                // triggeredRules 與 topActions 由 RuleEngine 補入
            };
        }

        return { calculateModelScores, calculateOverallScore, getMaturityLevel, calculateCompleteness, calculateDiagnostic };
    })();


    /* ========================================================
       8.11  RuleEngine — 診斷規則引擎
       ======================================================== */
    const RuleEngine = (() => {

        const SEV_ORDER = { high: 0, medium: 1, low: 2 };

        /**
         * 評估單條規則
         * @param {object} rule        — 規則物件（含 condition.checks）
         * @param {object} modelScores — { model: { catScores: { cat: number|null } } }
         * @returns {boolean}
         */
        function evaluateRule(rule, modelScores) {
            const checks = rule.condition?.checks || [];
            if (checks.length === 0) return false;

            const condType = rule.condition.type || 'and';

            const results = checks.map(check => {
                const ms  = modelScores[check.model];
                if (!ms) return false;
                const val = ms.catScores?.[check.category];
                if (val === null || val === undefined) return false;

                switch (check.operator) {
                    case '>=': return val >= check.threshold;
                    case '<=': return val <= check.threshold;
                    case '>':  return val >  check.threshold;
                    case '<':  return val <  check.threshold;
                    case '==': return val == check.threshold; // eslint-disable-line eqeqeq
                    default:   return false;
                }
            });

            return condType === 'or'
                ? results.some(Boolean)
                : results.every(Boolean);
        }

        /**
         * 評估全部規則，回傳觸發的規則列表（Top 3 by severity × priority）
         * @param {object}   modelScores — 分數物件
         * @param {string}   role        — sales | pm | fae
         * @param {object[]} rules       — diagnostic-rules.json 的 rules 陣列
         * @param {number}   topN        — 最多回傳幾條（預設 3）
         * @returns {object[]} 觸發的規則陣列
         */
        function evaluate(modelScores, role, rules, topN = 3) {
            const triggered = (rules || []).filter(rule => {
                if (!rule.roleScope?.includes(role)) return false;
                return evaluateRule(rule, modelScores);
            });

            triggered.sort((a, b) => {
                const sevDiff = (SEV_ORDER[a.severity] ?? 2) - (SEV_ORDER[b.severity] ?? 2);
                return sevDiff !== 0 ? sevDiff : (a.priority || 99) - (b.priority || 99);
            });

            return triggered.slice(0, topN);
        }

        /**
         * 保守模式：依完備度對規則進行降級處理
         * @param {object[]} triggeredRules   — 已觸發的規則
         * @param {number}   completeness     — 整體完備度（0–100）
         * @param {object}   conservativeConf — diagnostic-rules.json 的 conservativeMode 設定
         * @returns {object[]} 處理後的規則（部分 severity 可能被降級）
         */
        function applyConservativeMode(triggeredRules, completeness, conservativeConf) {
            // conservativeMode 存在即視為啟用（不需 enabled 欄位）
            if (!conservativeConf) return triggeredRules;

            const downgradeRules = conservativeConf.rules || [];

            // 第 4 條規則：完備度 < 30% 時紅旗降級（含 action 文字比對）
            const rule4 = downgradeRules[3];
            const threshold = rule4?.condition?.match(/(\d+)%/) ? parseInt(rule4.condition.match(/(\d+)%/)[1]) : 30;
            if (completeness >= threshold) return triggeredRules; // 完備度足夠，不需降級

            return triggeredRules.map(rule => {
                if (rule.severity === 'high') {
                    return {
                        ...rule,
                        severity        : 'medium',
                        _downgraded     : true,
                        _downgradeReason: '資料完備度不足（< ' + threshold + '%），風險等級已保守調降為潛在風險（待驗證）'
                    };
                }
                return rule;
            });
        }

        return { evaluate, evaluateRule, applyConservativeMode };
    })();


    /* ========================================================
       8.12  Recommendation — 建議生成 Service
       ======================================================== */
    const Recommendation = (() => {

        const PRI_ORDER = { P1: 0, P2: 1, P3: 2 };

        /**
         * 從觸發的規則中萃取優先行動建議（Top 5）
         * @param {object[]} triggeredRules — RuleEngine.evaluate 的回傳值
         * @param {number}   topN           — 最多回傳幾條（預設 5）
         * @returns {object[]} 行動建議陣列
         */
        function getTopActions(triggeredRules, topN = 5) {
            const allActions = [];
            (triggeredRules || []).forEach(rule => {
                (rule.actions || []).forEach(action => {
                    allActions.push({
                        ...action,
                        ruleId  : rule.id,
                        ruleName: rule.name,
                        severity: rule.severity
                    });
                });
            });

            allActions.sort((a, b) => (PRI_ORDER[a.priority] ?? 2) - (PRI_ORDER[b.priority] ?? 2));
            return allActions.slice(0, topN);
        }

        /**
         * 取得角色別優劣勢回饋文字
         * @param {string} role      — sales | pm | fae
         * @param {number} score     — 0–100
         * @param {object} templates — diagnostic-rules.json 的 roleActionTemplates
         * @returns {{ strengthMessages: string[], improvementMessages: string[] }}
         */
        function getRoleFeedback(role, score, templates) {
            const roleTpl = templates?.[role];
            if (!roleTpl) {
                return { strengthMessages: [], improvementMessages: [] };
            }

            // 依分數選擇訊息組（高分選第 1 組，中分選第 2 組，低分選第 3 組）
            const idx = score >= 70 ? 0 : (score >= 55 ? 1 : 2);

            return {
                strengthMessages   : roleTpl.strengthMessages    || [],
                improvementMessages: roleTpl.improvementMessages || [],
                selectedIdx: idx
            };
        }

        /**
         * 產生純文字診斷摘要（供複製到剪貼簿）
         * @param {object} result      — 診斷結果物件
         * @param {object} modelLabels — { revenue: '營收模型', ... }
         * @param {object} roleLabels  — { sales: 'Sales 業務開發', ... }
         * @returns {string}
         */
        function generateSummaryText(result, modelLabels, roleLabels) {
            const MODEL_ORDER = ['revenue', 'grossprofit', 'expense', 'contribution', 'capability'];
            const r = result;
            if (!r) return '';

            const roleLabel = roleLabels?.[r.role] || r.role;
            const dateStr   = new Date(r.timestamp).toLocaleDateString('zh-TW');
            const modelLine = MODEL_ORDER
                .map(m => `${modelLabels?.[m] || m}：${r.modelScores?.[m]?.score || 0}`)
                .join(' | ');
            const risksText = (r.triggeredRules || [])
                .map(rule => `- ${rule.flag || rule.name}`)
                .join('\n') || '（無）';
            const actionsText = (r.topActions || []).slice(0, 3)
                .map(a => `- [${a.priority}] ${a.text}`)
                .join('\n') || '（無）';

            return `IC 產業人才轉型診斷摘要
公司：${r.info?.company || '—'}
受診者：${r.info?.name || '—'}
角色：${roleLabel}
日期：${dateStr}

總分：${r.overallScore} / 100
成熟度：Level ${r.maturity?.level} — ${r.maturity?.label}
${modelLine}

風險紅旗：
${risksText}

優先行動建議：
${actionsText}

— 核心顧問有限公司`;
        }

        /**
         * 計算完整診斷結果（Scorer + RuleEngine + Recommendation 整合）
         * @param {object} params — { role, questions, answers, info, hasUpload, scoringConfig, diagnosticRules }
         * @returns {object} 完整診斷結果物件（可直接存入 DataStore）
         */
        function computeFullResult(params) {
            const { role, questions, answers, info, hasUpload, scoringConfig, diagnosticRules } = params;

            // 1. 計算分數
            const partial = Scorer.calculateDiagnostic({ role, questions, answers, info, hasUpload, scoringConfig });

            // 2. 執行規則引擎
            const rules          = diagnosticRules?.rules || [];
            const conservativeConf = diagnosticRules?.conservativeMode;
            let triggeredRules   = RuleEngine.evaluate(partial.modelScores, role, rules);
            triggeredRules       = RuleEngine.applyConservativeMode(triggeredRules, partial.completeness, conservativeConf);

            // 3. 生成行動建議
            const topActions = getTopActions(triggeredRules);

            return { ...partial, triggeredRules, topActions };
        }

        return { getTopActions, getRoleFeedback, generateSummaryText, computeFullResult };
    })();


    /* ========================================================
       Public API
       ======================================================== */
    return {
        DataStore,
        Validator,
        Parser,
        Scorer,
        RuleEngine,
        Recommendation,
        version: '1.0.0'
    };
})();
