import React, { useState } from 'react';
import { 
  Radar, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Download, 
  Flame, 
  Layers,
  ChevronRight,
  HelpCircle,
  BarChart3,
  Store,
  Compass
} from 'lucide-react';
import { NicheData, CISCity, Currency } from '../types';
import { NICHES_DATA } from '../data/mockData';
import { formatCurrency, formatNumber, getSurvivalColor, getSurvivalProgressColor } from '../utils/formatters';
import { getClientNicheFallback } from '../utils/aiFallbacks';

interface ScoutModuleProps {
  selectedCity: CISCity;
  currency: Currency;
  onSelectNicheForMatcher: (niche: NicheData) => void;
  onProceedToFinance: (niche: NicheData) => void;
}

export const ScoutModule: React.FC<ScoutModuleProps> = ({
  selectedCity,
  currency,
  onSelectNicheForMatcher,
  onProceedToFinance
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNiche, setSelectedNiche] = useState<NicheData>(NICHES_DATA[0]);
  const [customNicheInput, setCustomNicheInput] = useState<string>('');
  const [isAnalyzingAi, setIsAnalyzingAi] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [leadModalOpen, setLeadModalOpen] = useState<boolean>(false);
  const [leadPhone, setLeadPhone] = useState<string>('');
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadSuccess, setLeadSuccess] = useState<boolean>(false);

  const categories = ['Все', 'Общепит & Кофе', 'Услуги & Бьюти', 'Ритейл & ПВЗ', 'Авто & Сервис', 'Образование & Дети'];

  const filteredNiches = NICHES_DATA.filter((n) => {
    const matchesCategory = selectedCategory === 'Все' || n.category === selectedCategory;
    const matchesSearch = n.name.toLowerCase().includes(searchQuery.toLowerCase()) || n.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRunAiDeepAudit = async () => {
    setIsAnalyzingAi(true);
    setAiReport(null);
    const fallback = getClientNicheFallback(
      customNicheInput || selectedNiche.name,
      selectedCity,
      formatCurrency(selectedNiche.initialCapexMin, currency),
      selectedNiche.recommendedFormats[0] || 'Street Retail'
    );

    try {
      const response = await fetch('/api/ai/analyze-niche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: customNicheInput || selectedNiche.name,
          city: selectedCity,
          budget: formatCurrency(selectedNiche.initialCapexMin, currency),
          area: selectedNiche.recommendedFormats[0] || '35 м²',
          format: selectedNiche.recommendedFormats[0] || 'Street Retail',
          specificQuestions: 'Оценка выживаемости, сезонность, конкуренция и точка безубыточности'
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data) {
        setAiReport(data.data);
      } else {
        setAiReport(fallback);
      }
    } catch (err) {
      console.warn('Using client analytical fallback for AI audit:', err);
      setAiReport(fallback);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const handleDownloadFullReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail && !leadPhone) return;
    setLeadSuccess(true);
    setTimeout(() => {
      setLeadModalOpen(false);
      setLeadSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner / Module Mission */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg relative overflow-hidden text-white">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Radar className="w-3.5 h-3.5" />
              <span>Модуль 1: Scout • Разведка и Оценка Идеи</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI-Анализ жизнеспособности ниши в г. <span className="text-blue-400">{selectedCity}</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Оцените скор выживаемости, плотность конкуренции на картах (2ГИС / Яндекс.Карты), динамику открытий/закрытий ФНС и сезонность спроса перед тем, как потратить первый рубль.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setLeadModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-xs"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Скачать полный PDF-отчет</span>
            </button>
            <button
              onClick={handleRunAiDeepAudit}
              disabled={isAnalyzingAi}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzingAi ? 'animate-spin' : ''}`} />
              <span>{isAnalyzingAi ? 'Анализируем Big Data...' : 'Запустить AI-аудит ниши'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск ниши (кофейня, ПВЗ, барбершоп, детейлинг...)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-xs"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Niche Cards & Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Niches List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Каталог ниш ({filteredNiches.length})
            </span>
            <span className="text-[11px] text-blue-600 font-semibold">Сортировка по скору выживаемости</span>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredNiches.map((niche) => {
              const isSelected = selectedNiche.id === niche.id;
              return (
                <div
                  key={niche.id}
                  onClick={() => {
                    setSelectedNiche(niche);
                    setCustomNicheInput('');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-500 shadow-sm ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shrink-0">
                        {niche.icon === 'Coffee' ? '☕' : niche.icon === 'Croissant' ? '🥐' : niche.icon === 'Package' ? '📦' : niche.icon === 'Scissors' ? '💈' : niche.icon === 'Car' ? '🏎️' : '💻'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{niche.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-slate-500">{niche.category}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-500">Окупаемость: {niche.avgPaybackMonths} мес.</span>
                        </div>
                      </div>
                    </div>

                    {/* Survival Score Badge */}
                    <div className={`px-2.5 py-1 rounded-lg border text-xs font-extrabold flex flex-col items-center shrink-0 ${getSurvivalColor(niche.survivalScore)}`}>
                      <span className="text-sm font-black">{niche.survivalScore}</span>
                      <span className="text-[9px] uppercase tracking-tighter opacity-80 font-bold">Скор</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Вход (CAPEX)</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(niche.initialCapexMin, currency)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Прибыль / мес</span>
                      <span className="font-semibold text-emerald-600">{formatCurrency(niche.avgMonthlyNetProfit, currency)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">ФНС Открытий/Закр.</span>
                      <span className="font-semibold text-blue-600">+{niche.openingsToClosuresRatio}x</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Idea Input */}
          <div className="p-4 rounded-xl bg-white border border-dashed border-slate-300 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Хотите протестировать нестандартную идею?</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customNicheInput}
                onChange={(e) => setCustomNicheInput(e.target.value)}
                placeholder="Например: Вейк-парк, аренда сапов, глэмпинг..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleRunAiDeepAudit}
                disabled={!customNicheInput || isAnalyzingAi}
                className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs"
              >
                Анализ
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Deep Scout Dashboard & Metrics (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Selected Niche Deep Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {selectedNiche.category}
                  </span>
                  <span className="text-xs text-slate-500">Регион: <strong className="text-slate-800">{selectedCity}</strong></span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">{selectedNiche.name}</h2>
              </div>

              {/* Survival Score Gauge */}
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">Скор выживаемости</div>
                  <div className="text-[11px] text-slate-500">Вероятность работы &gt; 12 мес</div>
                </div>
                <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center flex-col ${getSurvivalColor(selectedNiche.survivalScore)}`}>
                  <span className="text-lg font-black">{selectedNiche.survivalScore}</span>
                  <span className="text-[8px] uppercase tracking-wider font-bold">/ 100</span>
                </div>
              </div>
            </div>

            {/* Key Data Benchmarks (4 cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  Инвестиции (CAPEX)
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {formatCurrency(selectedNiche.initialCapexMin, currency)} — {formatCurrency(selectedNiche.initialCapexMax, currency)}
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">Входной порог</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  Окупаемость
                </span>
                <p className="text-sm font-bold text-blue-700 mt-1">
                  ~{selectedNiche.avgPaybackMonths} месяцев
                </p>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Маржа: {selectedNiche.avgMarginPercent}%</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  Спрос Wordstat
                </span>
                <p className="text-sm font-bold text-amber-800 mt-1">
                  {formatNumber(selectedNiche.searchWordstatMonthly)} / мес
                </p>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">+{selectedNiche.popularityGrowth}% к пред. году</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  ФНС Открытия
                </span>
                <p className="text-sm font-bold text-purple-700 mt-1">
                  {selectedNiche.openingsToClosuresRatio}x
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">на 1 ликвидацию</span>
              </div>
            </div>

            {/* Seasonality Chart Visualizer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  Сезонный индекс спроса (ОФД + Карты за 12 месяцев)
                </span>
                <span className="text-[11px] text-slate-500">100 = Базовый уровень</span>
              </div>
              <div className="grid grid-cols-12 gap-1.5 pt-2">
                {selectedNiche.seasonalityMonths.map((m) => {
                  const heightPercent = Math.min(100, Math.max(20, (m.index - 50) * 1.5));
                  const isHigh = m.index >= 115;
                  const isLow = m.index <= 90;
                  return (
                    <div key={m.month} className="flex flex-col items-center gap-1 group">
                      <div className="text-[9px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {m.index}
                      </div>
                      <div className="w-full h-20 bg-slate-100 rounded-lg p-1 flex items-end justify-center border border-slate-200/60">
                        <div 
                          style={{ height: `${heightPercent}%` }} 
                          className={`w-full rounded-md transition-all ${
                            isHigh ? 'bg-emerald-500 shadow-xs' : isLow ? 'bg-rose-400' : 'bg-slate-400'
                          }`}
                        ></div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Success Factors vs Pitfalls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Factors */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2.5">
                <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Драйверы успеха (Must Have)
                </h4>
                <ul className="space-y-1.5">
                  {selectedNiche.keySuccessFactors.map((factor, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pitfalls */}
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2.5">
                <h4 className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Главные подводные камни (Смертность)
                </h4>
                <ul className="space-y-1.5">
                  {selectedNiche.mainPitfalls.map((pitfall, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{pitfall}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Formats */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  Рекомендуемые форматы для старта:
                </span>
                <p className="text-xs text-slate-600">
                  {selectedNiche.recommendedFormats.join(' • ')}
                </p>
              </div>
            </div>

            {/* AI Real-time Audit Box (if triggered) */}
            {aiReport && (
              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-bold text-slate-900">AI Экспертиза от Бизнес-Архитектора BizOS</h3>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300 font-bold">
                    Скор: {aiReport.survivalScore}/100
                  </span>
                </div>

                <p className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {aiReport.verdict}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-rose-700 block">Ключевые скрытые риски:</span>
                    {aiReport.keyRisks?.slice(0, 3).map((r: string, idx: number) => (
                      <div key={idx} className="text-slate-700 flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-emerald-700 block">Рекомендации по запуску:</span>
                    {aiReport.recommendations?.slice(0, 3).map((rec: string, idx: number) => (
                      <div key={idx} className="text-slate-700 flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-600">
                    Точка безубыточности: <strong className="text-blue-700">{formatCurrency(aiReport.breakEvenRevenue || 650000, currency)}/мес</strong>
                  </span>
                  <span className="text-slate-600">
                    Окупаемость: <strong className="text-emerald-700">{aiReport.estimatedPaybackMonths || 12} мес</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Action Bar: Next Steps */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setLeadModalOpen(true)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 justify-center sm:justify-start font-medium"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Получить полный PDF-анализ конкурентов</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onProceedToFinance(selectedNiche)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition-all shadow-xs"
                >
                  3. Финмодель
                </button>
                <button
                  onClick={() => onSelectNicheForMatcher(selectedNiche)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <span>2. Подобрать локацию & Франшизу</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Magnet PDF Modal */}
      {leadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setLeadModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 text-lg font-bold"
            >
              ✕
            </button>

            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-2">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Скачать развернутый инвест-отчет: {selectedNiche.name}
              </h3>
              <p className="text-xs text-slate-500">
                18-страничный PDF с гео-разбивкой конкурентов 2ГИС по г. {selectedCity}, реальными чеками ОФД и финансовым калькулятором.
              </p>
            </div>

            {leadSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
                <p className="text-xs font-bold text-emerald-800">
                  Отчет сформирован и отправлен на ваш email и в Telegram!
                </p>
                <p className="text-[11px] text-slate-600">
                  Вместе с отчетом мы прикрепили список 7 свободных помещений под эту нишу в г. {selectedCity}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDownloadFullReport} className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Ваш рабочий Email</label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="founder@startup.ru"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Номер телефона (для Telegram-отчета)</label>
                  <input
                    type="tel"
                    required
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="text-[10px] text-slate-400 leading-tight">
                  Нажимая кнопку, вы соглашаетесь на получение аналитических материалов BizOS и скоринг-оценки.
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Мгновенно скачать PDF (Бесплатно)
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
