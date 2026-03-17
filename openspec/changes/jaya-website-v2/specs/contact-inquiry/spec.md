# Contact & Inquiry — 聯絡諮詢

## Overview

最終轉換頁面，讓有興趣的訪客留下諮詢資訊。表單簡潔（6 欄位），送出至 Google Apps Script 處理。同時提供直接聯絡方式與地圖。

## ADDED Requirements

### Page Hero
WHEN 訪客進入聯絡諮詢頁面
THEN 顯示半高 Hero 深色背景
AND 標題「開始對話，邁向卓越」
AND 副標「免費 30 分鐘諮詢，了解最適合您的方案」

### Inquiry Form
WHEN 訪客可見表單區塊
THEN 顯示左側諮詢表單 + 右側聯絡資訊（Desktop）
AND 表單欄位：
  - 姓名（text, required）
  - 公司名稱（text, required）
  - Email（email, required）
  - 電話（tel, optional）
  - 感興趣的服務（select: 顧問諮詢/系統整合/運維支持/Genesys Cloud/其他）
  - 訊息內容（textarea, optional, maxlength 500）
AND 送出按鈕使用金色主色
AND Mobile 時表單佔全寬，聯絡資訊移至表單下方

### Form Validation
WHEN 訪客填寫表單
THEN 即時驗證必填欄位（blur 事件觸發）
AND Email 格式驗證
AND 電話格式驗證（可選但填寫時需合法）
AND 錯誤訊息顯示在欄位下方（紅色小字）
AND 送出按鈕在驗證通過前 disabled

### Form Submission
WHEN 訪客點擊送出按鈕
THEN 按鈕顯示 loading spinner + 文字變「送出中...」
AND POST 資料至 Google Apps Script Web App
AND 成功：顯示成功 Modal（綠色勾勾 + 「感謝您的諮詢，我們將在 1 個工作天內回覆」）
AND 失敗：顯示錯誤提示（紅色橫幅 + 「送出失敗，請稍後再試或直接來電」）
AND 成功後表單自動清空

### Contact Info Cards
WHEN 聯絡資訊區塊可見
THEN 顯示 3 張卡片：
  - 電話：+886 2 2506-8086（可點擊撥號）
  - Email：jaya-service@outlook.com（可點擊開啟郵件）
  - 地址：台北市中山區南京東路二段 150 號 2 樓之 210
AND 每張卡片含對應圖示

### Google Maps Embed
WHEN 訪客捲動至地圖區塊
THEN 顯示 Google Maps 嵌入地圖（lazy loading）
AND 標記 Jaya 辦公室位置
AND 地圖高度 400px（Desktop）/ 300px（Mobile）
AND 地圖上方顯示「如何到達」文字連結（開啟 Google Maps 導航）
