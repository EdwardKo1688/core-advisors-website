# Design System — 品牌設計系統

## Overview

Jaya 城邦國際網站的設計系統，定義所有共用的視覺元素、元件、動畫與互動模式。麥肯錫風格：極簡、大留白、強排版、數據視覺導向。

## ADDED Requirements

### CSS Variables
WHEN 任何頁面載入
THEN `:root` 定義以下 CSS 變數：
```
--primary: #1a1a2e
--accent: #e2b857
--secondary: #16213e
--text-light: #f0f0f0
--text-dark: #2d2d2d
--bg-light: #fafafa
--bg-dark: #0d1117
--border: #e5e5e5
--success: #10b981
--warning: #f59e0b
--danger: #ef4444
--font-zh: 'Noto Sans TC', sans-serif
--font-en: 'Inter', sans-serif
--transition: all 0.3s ease
--shadow-sm: 0 2px 8px rgba(0,0,0,0.08)
--shadow-md: 0 4px 16px rgba(0,0,0,0.12)
--shadow-lg: 0 8px 32px rgba(0,0,0,0.16)
--radius: 8px
--section-gap: 100px
```

### Navbar Component
WHEN 頁面載入
THEN 顯示固定頂部導航列（position: fixed）
AND 深色背景（--bg-dark）+ 白色文字
AND 左側 Jaya Logo，右側導航項目 + CTA 按鈕
AND 捲動超過 50px 時 Navbar 加深 + 加陰影
AND Mobile（<768px）時右側顯示漢堡圖示
AND 漢堡點擊展開全螢幕 Overlay 導航（深色背景 + 居中連結）
AND 當前頁面的導航項目有金色底線標記

### Footer Component
WHEN 頁面捲動至底部
THEN 顯示深色 Footer（--bg-dark 背景）
AND 三欄佈局（Desktop）：
  - 左欄：Logo + 一句話描述 + 社群連結圖示
  - 中欄：導航連結（垂直列表）
  - 右欄：聯絡資訊（電話/Email/地址）
AND 底部：Copyright © 2026 Jaya 城邦國際 版權所有
AND Mobile 時三欄改為垂直堆疊

### CTA Button Variants
WHEN CTA 元件被使用
THEN 支援三種變體：
  - Primary：金色背景（--accent）+ 深色文字，hover 加亮 10%
  - Secondary：透明背景 + 白色邊框 + 白色文字，hover 背景填充白色 + 文字變深
  - Ghost：透明背景 + 金色文字 + 金色底線，hover 底線加粗
AND 所有按鈕 border-radius: 4px，padding: 12px 32px
AND 過渡動畫 0.3s ease

### Section Title Pattern
WHEN 區塊標題被使用
THEN 統一格式：
  - 頂部金色短橫線（40px 寬、3px 高）
  - 主標題（36px Bold）
  - 副標題（16px Regular，--text-dark 的 60% 透明度）
AND 間距：橫線下 16px → 主標 → 8px → 副標
AND 預設居中對齊，可設定左對齊

### Card Component
WHEN 卡片元件被使用
THEN 統一樣式：
  - 白色背景 + border-radius: 8px + shadow-sm
  - padding: 32px
  - hover 時 translateY(-4px) + shadow-md
  - transition: all 0.3s ease
AND 支援變體：
  - Default：白色背景
  - Dark：深色背景（--secondary）+ 白色文字
  - Bordered：白色背景 + 左側 3px 金色邊線

### Scroll Animations
WHEN 元素進入視窗可見範圍
THEN 觸發進場動畫（Intersection Observer，threshold: 0.1）
AND 動畫類型：
  - fade-up：opacity 0→1 + translateY(30px→0)
  - fade-in：opacity 0→1
  - slide-left：opacity 0→1 + translateX(-30px→0)
  - slide-right：opacity 0→1 + translateX(30px→0)
AND 動畫持續 0.6s，ease-out
AND 支援 stagger 延遲（每個子元素延遲 0.1s）

### Responsive Breakpoints
WHEN 視窗寬度改變
THEN 三斷點響應：
  - Desktop：>1200px（最大容器寬度 1140px）
  - Tablet：768px-1200px（容器 padding 40px）
  - Mobile：<768px（容器 padding 20px）
AND Navbar 在 <768px 切換為漢堡選單
AND 多欄佈局在 <768px 切換為單欄
AND 字級在 Mobile 縮小約 75-80%

### Data Counter Animation
WHEN 數字元素進入視窗可見範圍
THEN 數字從 0 動畫遞增至目標值
AND 持續時間 2 秒，easing: ease-out
AND 支援整數和百分比格式
AND 支援後綴文字（如「+」「%」「年」）
AND 動畫只觸發一次（不重複）
