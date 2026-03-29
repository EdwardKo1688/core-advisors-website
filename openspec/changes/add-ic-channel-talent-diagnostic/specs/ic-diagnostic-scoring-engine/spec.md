## ADDED Requirements

### Requirement: 五模型加權計分
系統 SHALL 依角色別套用五模型權重計算總分。所有權重 MUST 集中於 SCORING_CONFIG 物件管理。

#### Scenario: Sales 計分
- **WHEN** Sales 角色完成所有題目
- **THEN** 系統依 Sales 權重（營收25%, 毛利25%, 費效10%, 貢獻25%, 能力與協同15%）計算總分

#### Scenario: 權重變更
- **WHEN** 管理員在後台修改 PM 的毛利權重從 25% 改為 30%
- **THEN** 後續 PM 診斷使用新權重，不需修改程式碼

### Requirement: 模型內子分數計算
每個模型總分 SHALL 由四個子分數加權計算：結果分 × 40% + 品質分 × 25% + 趨勢分 × 15% + 協同分 × 20%。

#### Scenario: 計算營收模型分數
- **WHEN** Sales 角色完成營收模型相關題目
- **THEN** 系統分別計算結果分、品質分、趨勢分、協同分，再依權重加總

### Requirement: 成熟度分級
系統 SHALL 依總分將企業分為四個成熟度等級。

#### Scenario: Level A 判定
- **WHEN** 總分 >= 85
- **THEN** 系統判定為 Level A「成熟領先」

#### Scenario: Level D 判定
- **WHEN** 總分 < 55
- **THEN** 系統判定為 Level D「高風險待改善」

### Requirement: 規則式紅旗偵測
系統 SHALL 執行診斷規則引擎，偵測高營收低毛利、高支援低轉換、預測品質偏弱、費用投入無效等紅旗。

#### Scenario: 高營收低毛利偵測
- **WHEN** 營收達成分數高但毛利率分數低於門檻
- **THEN** 系統標記「價格與客戶結構風險」紅旗

#### Scenario: 無紅旗
- **WHEN** 所有維度分數均在健康範圍
- **THEN** 系統不產出紅旗，顯示「目前無重大風險」

### Requirement: 問卷與資料分數整合
系統 SHALL 支援整合問卷分數與上傳資料分數，資料分數作為精度補強。

#### Scenario: 僅問卷模式
- **WHEN** 使用者僅完成問卷（Mode A）
- **THEN** 系統以問卷分數計算，資料完備度標示為「基礎」

#### Scenario: 問卷 + 資料模式
- **WHEN** 使用者完成問卷並上傳有效資料（Mode B）
- **THEN** 系統整合兩者分數，資料完備度標示為「進階」

### Requirement: 資料不足保守判讀
當資料不足時，系統 SHALL 採保守判讀，不得過度推論。

#### Scenario: 部分模型缺少資料
- **WHEN** 費效模型相關資料全部缺失
- **THEN** 系統以問卷分數為準，結果附註「費效模型資料不足，建議補充後重新診斷」
