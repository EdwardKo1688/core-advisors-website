# Landing Page — 首頁

## Overview

Jaya 城邦國際官網首頁，採麥肯錫風格設計。訪客在 10 秒內理解：Jaya 是誰、做什麼、為什麼選擇 Jaya。每個區塊都有明確目的，引導訪客進入轉換漏斗。

## ADDED Requirements

### Hero Section
WHEN 訪客進入首頁
THEN 顯示全螢幕深色 Hero（#0d1117 背景）
AND 主標題「為企業打造世界級客服體驗」使用 48px 白色粗體
AND 副標題說明 Jaya 定位（一句話）
AND 顯示主 CTA「免費諮詢」（金色按鈕）+ 次 CTA「了解方案」（幽靈按鈕）
AND Hero 高度佔 viewport 100vh，含向下捲動指示箭頭

### Data Highlights
WHEN 訪客向下捲動經過數據區塊
THEN 顯示 4 個關鍵數字卡片（水平排列）
AND 數字使用 64px Inter Extra Bold + 金色
AND 數字以 CountUp 動畫從 0 遞增（Intersection Observer 觸發）
AND 指標包含：服務企業數（200+）、客戶滿意度（98%）、產業經驗（15+ 年）、成功專案（500+）

### Core Value Proposition
WHEN 訪客繼續捲動
THEN 顯示三列等寬卡片：顧問諮詢 / 系統整合 / 持續運維
AND 每張卡片含：圖示（SVG）、標題、2-3 行說明、「了解更多」連結
AND 卡片 hover 時浮起 + 陰影加深
AND 區塊標題使用金色上橫線裝飾

### Product Preview
WHEN 訪客繼續捲動
THEN 顯示五大產品圖示/Logo 橫列
AND 每個產品含名稱 + 一句話定位
AND 點擊跳轉至 solutions.html 對應錨點
AND 背景使用淺色（#fafafa）與深色區塊交替

### Featured Cases
WHEN 首頁載入完成
THEN 從 Google Sheets API 動態載入最新 3 筆案例
AND 顯示為卡片：客戶名 / 產業 / 成果摘要 / 關鍵數據
AND 點擊卡片跳轉至 cases.html
AND 載入中顯示骨架屏（Skeleton）

### Conversion CTA
WHEN 訪客捲動至頁底前
THEN 顯示全寬深色背景 CTA 區塊
AND 標題「開始您的客服升級之旅」
AND 副標「免費 30 分鐘諮詢，了解最適合您的方案」
AND 顯示金色 CTA 按鈕連結至 contact.html
