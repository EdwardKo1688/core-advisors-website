# Cases & Insights — 案例洞見

## Overview

以數據成果為核心展示客戶案例，輔以產業洞見文章建立思想領導力。內容透過 Google Sheets 動態管理，支持持續更新。

## ADDED Requirements

### Page Hero
WHEN 訪客進入案例洞見頁面
THEN 顯示半高 Hero 深色背景
AND 標題「用成果說話」
AND 副標「看看我們如何幫助企業提升客服競爭力」

### Case Filter
WHEN 案例區塊載入
THEN 顯示產業別篩選按鈕列
AND 選項：全部 / 金融 / 電信 / 零售 / 製造 / 政府
AND 預設選中「全部」
AND 點擊篩選按鈕即時過濾案例卡片（前端過濾，含淡入動畫）

### Case Cards
WHEN 案例資料從 Google Sheets 載入完成
THEN 顯示案例卡片網格（Desktop 3 欄 / Tablet 2 欄 / Mobile 1 欄）
AND 每張卡片包含：
  - 產業標籤（彩色 Badge）
  - 客戶名稱
  - 挑戰摘要（2 行截斷）
  - 關鍵成果數據（1-2 個高亮數字，如「效率提升 40%」）
  - 「查看詳情」連結
AND 卡片 hover 浮起效果
AND 載入中顯示骨架屏動畫

### Case Detail Modal
WHEN 訪客點擊案例卡片的「查看詳情」
THEN 顯示全螢幕 Modal Overlay
AND 內容結構：
  - 客戶名稱 + 產業標籤
  - 挑戰（客戶面臨的問題）
  - 方案（Jaya 提供的解決方案）
  - 成果（數據化成果，至少 2-3 個指標）
AND Modal 可透過 ESC 鍵或點擊背景關閉
AND URL 不變（非路由切換）

### Insights Section
WHEN 訪客捲動至洞見區塊
THEN 從 Google Sheets 載入產業洞見文章列表
AND 顯示為列表格式：發布日期 + 標題 + 摘要（2 行）+ 分類標籤
AND 點擊連結至外部文章（target="_blank"）
AND 最多顯示 6 篇，含「查看更多」按鈕

### Empty State
WHEN 篩選結果為空或 API 載入失敗
THEN 顯示友善提示訊息
AND 篩選無結果：「此分類暫無案例，查看全部案例」
AND API 失敗：「資料載入中，請稍後再試」+ 重試按鈕
