import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScoutModule } from './components/ScoutModule';
import { MatcherModule } from './components/MatcherModule';
import { FinanceRiskModule } from './components/FinanceRiskModule';
import { MarketplaceModule } from './components/MarketplaceModule';
import { FlywheelHub } from './components/FlywheelHub';
import { CISCity, Currency, ModuleTab, NicheData, DistrictGeoData, FranchiseItem } from './types';
import { NICHES_DATA, DISTRICTS_GEO_DATA } from './data/mockData';
import { 
  Radar, 
  MapPin, 
  Calculator, 
  Handshake, 
  Repeat, 
  ShieldCheck, 
  Sparkles,
  TrendingDown,
  Building2,
  Users
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ModuleTab>('scout');
  const [selectedCity, setSelectedCity] = useState<CISCity>('Москва');
  const [currency, setCurrency] = useState<Currency>('RUB');
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Shared pipeline state between modules
  const [activeNiche, setActiveNiche] = useState<NicheData>(NICHES_DATA[0]);
  const [activeDistrict, setActiveDistrict] = useState<DistrictGeoData | null>(DISTRICTS_GEO_DATA[0]);
  const [activeFranchise, setActiveFranchise] = useState<FranchiseItem | null>(null);

  // Handlers for cross-module workflows
  const handleSelectNicheForMatcher = (niche: NicheData) => {
    setActiveNiche(niche);
    setActiveTab('matcher');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToFinance = (niche: NicheData) => {
    setActiveNiche(niche);
    setActiveTab('finance');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToFinanceWithLocation = (district: DistrictGeoData | null, franchise: FranchiseItem | null) => {
    if (district) setActiveDistrict(district);
    if (franchise) setActiveFranchise(franchise);
    setActiveTab('finance');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToMarketplace = () => {
    setActiveTab('marketplace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAiAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiResponse(null);
    try {
      const response = await fetch('/api/ai/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          city: selectedCity,
          niche: activeNiche.name,
          context: `City: ${selectedCity}, Niche: ${activeNiche.name}, Budget: ${activeNiche.initialCapexMin}`
        }),
      });
      const data = await response.json();
      if (data.success) {
        setAiResponse(data.reply || data.data?.reply || 'Консультация подготовлена на базе Big Data BizOS.');
      } else {
        setAiResponse('Для выбранного города ' + selectedCity + ' и ниши ' + activeNiche.name + ' рекомендуется начать с валидации локации в Матчере и расчета Unit-экономики.');
      }
    } catch {
      setAiResponse(`Для запуска бизнеса в нише "${activeNiche.name}" в г. ${selectedCity} оптимальный формат — Street Retail с трафиком от 450 чел/час. Рекомендуемый бюджет: ${activeNiche.initialCapexMin.toLocaleString('ru-RU')} ₽.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Platform Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        currency={currency}
        setCurrency={setCurrency}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Module Pipeline Breadcrumb / Progress Bar */}
        <div className="hidden sm:flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-2">
              Пайплайн запуска:
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('scout')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'scout'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Radar className="w-3.5 h-3.5" />
              <span>1. Scout (Ниша)</span>
            </button>

            <span className="text-slate-400">→</span>

            <button
              onClick={() => setActiveTab('matcher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'matcher'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>2. Matcher (Локация/Франшиза)</span>
            </button>

            <span className="text-slate-400">→</span>

            <button
              onClick={() => setActiveTab('finance')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'finance'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>3. Finance & Скоринг</span>
            </button>

            <span className="text-slate-400">→</span>

            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Handshake className="w-3.5 h-3.5" />
              <span>4. Подрядчики & Закупки</span>
            </button>
          </div>

          <button
            onClick={() => setActiveTab('flywheel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'flywheel'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-700 hover:bg-indigo-50 border border-indigo-200/80'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Маховик & Стратегия</span>
          </button>
        </div>

        {/* Dynamic Module Rendering */}
        {activeTab === 'scout' && (
          <ScoutModule
            selectedCity={selectedCity}
            currency={currency}
            onSelectNicheForMatcher={handleSelectNicheForMatcher}
            onProceedToFinance={handleProceedToFinance}
          />
        )}

        {activeTab === 'matcher' && (
          <MatcherModule
            selectedCity={selectedCity}
            currency={currency}
            activeNiche={activeNiche}
            onProceedToFinanceWithLocation={handleProceedToFinanceWithLocation}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceRiskModule
            selectedCity={selectedCity}
            currency={currency}
            activeNiche={activeNiche}
            activeDistrict={activeDistrict}
            activeFranchise={activeFranchise}
            onProceedToMarketplace={handleProceedToMarketplace}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceModule
            selectedCity={selectedCity}
            currency={currency}
            activeNiche={activeNiche}
          />
        )}

        {activeTab === 'flywheel' && (
          <FlywheelHub
            selectedCity={selectedCity}
            currency={currency}
          />
        )}
      </main>

      {/* AI Advisor Modal */}
      {isAiAssistantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setIsAiAssistantOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 text-lg font-bold"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-1">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                AI Бизнес-Архитектор BizOS
              </h3>
              <p className="text-xs text-slate-500">
                Задайте любой вопрос по открытию бизнеса в г. <strong>{selectedCity}</strong> по нише <strong>{activeNiche.name}</strong>.
              </p>
            </div>

            {aiResponse && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed max-h-48 overflow-y-auto">
                <p className="font-semibold text-blue-700 mb-1">💡 Экспертное заключение:</p>
                {aiResponse}
              </div>
            )}

            <form onSubmit={handleAskAiAdvisor} className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Ваш вопрос или сомнение</label>
                <textarea
                  rows={3}
                  required
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Например: Стоит ли открывать кофейню to-go возле метро или лучше взять франшизу в спальном районе?"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setAiPrompt('Какие скрытые риски и реальные расходы в первый месяц?')}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  ⚡ Проверить риски
                </button>
                <button
                  type="submit"
                  disabled={isAiLoading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                  <span>{isAiLoading ? 'Анализируем...' : 'Спросить AI'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold tracking-tight text-slate-900">BizOS CIS</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                  v2.4 Production Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 max-w-xl">
                Операционная система для запуска и масштабирования малого бизнеса в СНГ. Снижаем смертность стартапов с 50% до &lt; 20% на базе Big Data и AI.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Верификация ФНС & Банков</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>12+ городов СНГ</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Users className="w-4 h-4 text-purple-600" />
                <span>One-Stop-Shop экосистема</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-400">
            <div>
              © 2026 BizOS CIS Platform. Все права защищены. Интегрировано с 2ГИС, Яндекс.Карты, ФНС РФ, ОФД и партнерскими банками.
            </div>
            <div className="flex items-center gap-3">
              <span className="hover:text-slate-600 cursor-pointer">Политика конфиденциальности</span>
              <span>•</span>
              <span className="hover:text-slate-600 cursor-pointer">CPA партнерство</span>
              <span>•</span>
              <span className="hover:text-slate-600 cursor-pointer">API для ритейла</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
