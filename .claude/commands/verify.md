# 網站自動驗證技能 (Website Auto-Verification Skill)

每次設計或程式碼修改完成後，自動執行完整驗證流程並輸出結構化驗證報告。

## 執行流程

### Step 1: 啟動 Preview Server
- 確認 preview server 是否運行中（使用 `preview_list`）
- 若未運行，使用 `preview_start` 啟動 `static-server`
- 記錄 serverId

### Step 2: 頁面清單掃描
掃描專案根目錄所有 `.html` 檔案（排除 `cilt-website/`、`deploy/`、`node_modules/`），建立待驗證頁面清單：
- index.html（首頁）
- about.html（關於我們）
- services.html（顧問服務）
- solutions.html（解決方案）
- tools.html（工具方案）
- navigator.html（AI 導入診斷）
- resources.html（資源觀點）
- assessment.html（診斷問卷）
- result.html（診斷結果）
- booking.html（預約諮詢）
- admin.html（後台管理）

### Step 3: 逐頁驗證（Desktop 1280x800）
對每一頁執行：
1. **導航測試**：`preview_eval` 設定 `window.location.href`
2. **Console 錯誤檢查**：`preview_console_logs` with `level: "error"` — 記錄任何 JS 錯誤
3. **頁面載入確認**：`preview_snapshot` 確認頁面正確渲染（檢查 heading / 關鍵文字）
4. **Navbar 連結驗證**：檢查 navbar 中「預約諮詢」連結是否指向 `booking.html`
5. **CSS 關鍵樣式檢查**：`preview_inspect` 檢查 body 或主要容器的 font-family、background-color
6. **截圖存檔**：`preview_screenshot` 作為視覺證據

### Step 4: 互動功能驗證
針對有互動功能的頁面執行額外測試：

#### booking.html
- 點擊一個可預約日期 → 確認時段列表出現
- 點擊一個時段 → 確認表單顯示
- 檢查「← 重新選擇時段」按鈕可返回

#### admin.html
- 填入密碼 "admin" 登入 → 確認儀表板顯示
- 切換到「診斷紀錄」tab → 確認表格載入
- 切換到「預約管理」tab → 確認預約列表載入
- 切換到「內容管理」tab → 確認 CMS 欄位載入
- 切換到「設定」tab → 確認密碼表單與 API 狀態顯示
- 點擊「匯出 CSV」→ 確認無錯誤
- 點擊第一筆「詳情」→ 確認 modal 開啟

#### assessment.html
- 確認進度條顯示「0 / 30 題」
- 確認 Section 導航正常

### Step 5: RWD 響應式驗證
使用 `preview_resize` 切換到 mobile (375x812)：
1. 重新載入 index.html → 截圖
2. 載入 booking.html → 確認月曆單欄顯示 → 截圖
3. 載入 admin.html → 登入 → 確認側邊欄可收合 → 截圖
4. 恢復 desktop (1280x800)

### Step 6: 網路請求驗證
- 檢查是否有 404 錯誤（缺失的 CSS/JS/圖片資源）
- 使用 `preview_network` with `filter: "failed"` 確認無失敗請求

### Step 7: 輸出驗證報告

以下列格式輸出 Markdown 驗證報告：

```
## 網站驗證報告
**驗證時間**：YYYY-MM-DD HH:MM
**驗證範圍**：N 個頁面 / Desktop + Mobile

### 總覽
| 項目 | 狀態 |
|------|------|
| 頁面載入 | PASS/FAIL (N/N 頁面) |
| Console 錯誤 | PASS/FAIL |
| Navbar 連結 | PASS/FAIL |
| 互動功能 | PASS/FAIL |
| RWD 響應式 | PASS/FAIL |
| 網路請求 | PASS/FAIL |

### 各頁面詳情
| 頁面 | 載入 | Console | Navbar | 截圖 |
|------|------|---------|--------|------|
| index.html | OK | 0 errors | OK | [Desktop] [Mobile] |
| ... | ... | ... | ... | ... |

### 互動功能測試
- [ ] booking.html：日期選擇 → 時段選擇 → 表單顯示
- [ ] admin.html：登入 → 5 Tab 切換 → 詳情 Modal → CSV 匯出
- [ ] assessment.html：進度條 → Section 導航

### 發現的問題
1. (如有問題列於此)

### 建議修復
1. (對應修復建議)

### 截圖證據
(附上關鍵截圖)
```

## 注意事項
- 驗證過程中若發現問題，**先完成全部驗證**再統一報告，不要中途停止
- 截圖以 Desktop 為主，Mobile 只截關鍵頁面（首頁、預約、後台）
- admin.html 測試時使用展示模式密碼 "admin"
- 若 preview server 未啟動，先啟動再驗證
- 驗證完成後恢復 viewport 為 desktop (1280x800)
