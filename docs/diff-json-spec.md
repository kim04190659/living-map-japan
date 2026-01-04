# 差分JSON仕様（G-2）

本ドキュメントは、都市再編シミュレーション（G）において  
**AI が出力する結果データの形式（差分JSON）**を定義する。

本仕様の目的は、  
AI が「都市を直接変更する存在」になることを防ぐことである。

---

## 1. 基本原則（絶対）

### 1.1 AIは cities.json を上書きしない
- 入力：cities.json（固定）
- 出力：diff.json（差分のみ）

cities.json は **人間が管理する唯一の正本**とする。

---

## 2. 差分JSONの役割

差分JSONは以下を満たす必要がある。

- 元データとの差が明確
- 元に戻せる（reversible）
- 判断を人間に委ねる

👉 **実行ファイルではなく「検討材料」**

---

## 3. 差分JSON 全体構造

```json
{
  "simulationMeta": {
    "scenario": "200_to_150",
    "assumption": "人口減少・予算制約",
    "date": "YYYY-MM-DD"
  },
  "cityDiffs": [],
  "systemWarnings": []
}
4. cityDiffs の定義
4.1 cityDiff の基本形
json
コードをコピーする
{
  "cityId": "yamagata",
  "changeType": "layerChange",
  "before": { "layer": "広域コア" },
  "after": { "layer": "準拠点" },
  "reason": "医療機能の重複と人口閾値低下"
}
4.2 許可される changeType
changeType	説明
layerChange	層の変更
roleChange	primaryRole の再定義
supportChange	支援レベルの変更
riskFlag	危険状態の付与

👉 都市削除は存在しない

5. before / after の制約
before は 必ず cities.json に存在する値

after は 完全な新定義ではなく、変更部分のみ

❌ NG例

json
コードをコピーする
"after": {
  "name": "新山形",
  "lat": 0,
  "lng": 0
}
6. riskFlag の仕様（極めて重要）
6.1 例
json
コードをコピーする
{
  "cityId": "akita",
  "changeType": "riskFlag",
  "risk": "medicalCollapse",
  "severity": "high",
  "description": "二次医療圏が成立しない可能性"
}
6.2 許可される risk 種別
medicalCollapse

transportIsolation

energyDependency

roleDuplication

overCentralization

👉 「住めない」「消すべき」などの表現は禁止

7. systemWarnings（都市を超えた警告）
json
コードをコピーする
{
  "type": "overCentralization",
  "layer": "国家コア",
  "description": "代替不能機能が2都市に集中"
}
これは 国家全体への警告であり、
特定都市の失敗ではない。

8. UI・人間判断との接続
diff.json は以下の用途のみに使う。

地図上での Before / After 表示

危険箇所のハイライト

人間向け説明文の生成補助

👉 diff.json 単体で何かを「実行」してはならない。

9. AIへの命令文（設計思想）
AIには以下の前提を明示する。

提案しない

結論を出さない

削減を最適化しない

AIの役割は
「条件を変えたとき、壊れる箇所を列挙すること」のみ

10. 結論
差分JSONは、
都市を変えるための武器ではない。

変えてしまった場合の「取り返しのつかなさ」を
可視化するための安全装置である。

人間が判断しない限り、
何も変わらない。

それがこの仕様の最重要要件である。

