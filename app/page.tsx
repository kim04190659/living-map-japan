"use client";

// ================================
// Living Map Japan – JSX Layout (②)
// ================================

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

// ================================
// Page Component
// ================================

export default function Page() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* ================================ */}
      {/* A. ファーストビュー */}
      {/* ================================ */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Living Map Japan</h1>
        <p className="text-xl text-zinc-600 mb-8">
          人口減少社会における、日本の都市構造を再設計する国家戦略マップ
        </p>
        <p className="leading-relaxed">
          日本はすでに「すべての都市を維持する」段階を過ぎた。<br />
          Living Map Japan は、都市を 国家コア／広域コア／準拠点 の3層に整理し、
          2050年を見据えた持続可能な国土構造を可視化する試みである。
        </p>
      </section>

      {/* ================================ */}
      {/* B. このマップが示すもの */}
      {/* ================================ */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-4">このマップが示すもの</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>日本全国の主要都市を、機能と役割によって分類</li>
          <li>人口動態・インフラ制約を前提にした都市再編シナリオ</li>
          <li>現状（Before）と戦略（After）の比較</li>
        </ul>
      </section>

      {/* ================================ */}
      {/* C. 都市の3層構造 */}
      {/* ================================ */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-6">都市の3層構造</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 border rounded">
            <h3 className="font-bold mb-2">国家コア</h3>
            <p>外交・金融・研究など国家機能を集約する中枢都市</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-bold mb-2">広域コア</h3>
            <p>医療・大学・産業を担い、複数県を支える拠点</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-bold mb-2">準拠点</h3>
            <p>生活・教育・行政の最低限を保証する基盤都市</p>
          </div>
        </div>
      </section>

      {/* ================================ */}
      {/* D. Before / After */}
      {/* ================================ */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-4">Before / After シナリオ</h2>
        <p className="mb-2"><strong>Before：</strong> 現在の都市機能配置</p>
        <p><strong>After：</strong> 人口減少を前提とした国家最適化シナリオ</p>
      </section>

      {/* ================================ */}
      {/* E. 地図エリア */}
      {/* ================================ */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-4">戦略マップ</h2>
        <div className="w-full h-[500px] bg-zinc-200 flex items-center justify-center rounded">
          <span className="text-zinc-500">（ここに地図が表示されます）</span>
        </div>
      </section>

      {/* ================================ */}
      {/* F. 注記 */}
      {/* ================================ */}
      <section className="max-w-5xl mx-auto px-6 py-12 text-sm text-zinc-500">
        ※ 本マップは試作段階（MVP）であり、都市データ・分類基準は今後更新されます。
      </section>
    </main>
  );
}

