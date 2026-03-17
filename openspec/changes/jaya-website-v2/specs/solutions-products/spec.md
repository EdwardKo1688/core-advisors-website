# Solutions & Products — 產品方案

## Overview

展示 Jaya 五大產品線的核心功能與適用場景。採用 Tab 導航或錨點捲動，讓訪客快速找到適合的方案。每個產品以統一格式呈現，最後提供比較表輔助決策。

## ADDED Requirements

### Page Hero
WHEN 訪客進入產品方案頁面
THEN 顯示半高 Hero 深色背景
AND 標題「五大產品線，一站式解決方案」
AND 副標「從通訊整合到雲端客服，滿足各規模企業需求」

### Product Navigation
WHEN 訪客捲動過 Hero
THEN 顯示產品 Tab 導航列（固定於視窗上方，Sticky）
AND 5 個 Tab：innoCTI / innoService / innoSales / innoChat / Genesys Cloud
AND 點擊 Tab 平滑捲動至對應產品區塊
AND 當前可視產品的 Tab 自動高亮（金色下底線）

### Product Card Template（每個產品統一格式）
WHEN 對應 Tab 被點擊或捲動至可視範圍
THEN 顯示產品詳情區塊：
  - 左側：產品名稱 + 一句話定位 + 3-4 項核心功能列表 + CTA 按鈕
  - 右側：產品示意圖/截圖
AND 奇數產品左文右圖，偶數產品右文左圖（交替佈局）
AND Mobile 時改為上圖下文單欄

### innoCTI Section
WHEN innoCTI 區塊可見
THEN 產品定位：「客服通訊整合平台 — 統一管理全通路客戶互動」
AND 核心功能：全通路整合（電話/Email/Chat）、智能路由分配、即時監控儀表板、通話錄音與品質管理

### innoService Section
WHEN innoService 區塊可見
THEN 產品定位：「服務管理系統 — 從工單到滿意度的全流程管理」
AND 核心功能：工單生命週期管理、SLA 追蹤與預警、知識庫搜尋、客戶滿意度調查

### innoSales Section
WHEN innoSales 區塊可見
THEN 產品定位：「外撥電銷系統 — 提升外撥效率，加速營收成長」
AND 核心功能：預測式撥號、名單管理與分配、即時銷售儀表板、績效分析報表

### innoChat Section
WHEN innoChat 區塊可見
THEN 產品定位：「文字對談系統 — 即時訊息服務，提升客戶體驗」
AND 核心功能：多平台整合（LINE/FB/Web）、AI 自動回覆、對話歷史紀錄、即時轉接真人客服

### Genesys Cloud Section
WHEN Genesys Cloud 區塊可見
THEN 產品定位：「雲端客服平台 — 全球領先的 CCaaS 解決方案」
AND 顯示 4 張特色卡片：雲原生架構 / 統一平台 / AI 驅動 / 企業級安全
AND 額外說明 Jaya 作為 Genesys 台灣合作夥伴的附加價值
AND CTA「預約 Genesys Cloud Demo」

### Product Comparison
WHEN 訪客捲動至比較區塊
THEN 顯示產品功能比較表（響應式表格）
AND 比較維度：適用規模、通路支援、部署方式、價格範圍
AND 表格在 Mobile 時轉為可橫向捲動
