import React, { useState } from 'react';
import { 
  Repeat, 
  Sparkles, 
  Database, 
  Building2, 
  Banknote, 
  Layers, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Globe2, 
  Cpu, 
  BarChart4, 
  CheckCircle2, 
  Briefcase, 
  Landmark,
  ArrowRight,
  Flame
} from 'lucide-react';
import { FLYWHEEL_STEPS, DATA_STRATEGY_LAYERS } from '../data/mockData';
import { CISCity, Currency } from '../types';
import { formatCurrency } from '../utils/formatters';

interface FlywheelHubProps {
  selectedCity: CISCity;
  currency: Currency;
}

export const FlywheelHub: React.FC<FlywheelHubProps> = ({ selectedCity, currency }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeSection, setActiveSection] = useState<'flywheel' | 'monetization' | 'data-strategy' | 'roadmap'>('flywheel');

  // Interactive Live Cohort Simulator State
  const [scoutTrafficMonthly, setScoutTrafficMonthly] = useState<number>(25000);
  const [activationRate, setActivationRate] = useState<number>(42); // 42% get full report
  const [premiumConversionRate, setPremiumConversionRate] = useState<number>(6.5); // 6.5% buy premium / apply bank
  const [avgBankCpa, setAvgBankCpa] = useState<number>(38000); // 38k ₽ CPA per approved loan

  const simulatedActivatedUsers = Math.round((scoutTrafficMonthly * activationRate) / 100);
  const simulatedBankLeads = Math.round((simulatedActivatedUsers * premiumConversionRate) / 100);
  const simulatedMonthlyCpaRevenue = simulatedBankLeads * avgBankCpa;
  const simulatedSurvivedBusinesses = Math.round(simulatedBankLeads * 0.82); // 82% survival rate

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg relative overflow-hidden text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Repeat className="w-3.5 h-3.5" />
              <span>Platform Strategy • Экосистема, Маховик и Монетизация</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Архитектура Платформы BizOS CIS & Сетевой Эффект
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Многосторонняя платформа (Multi-sided platform): объединяем <strong className="text-emerald-400">Demand</strong> (предприниматели), <strong className="text-blue-400">Supply</strong> (банки, риелторы, франчайзеры, подрядчики) и <strong className="text-purple-400">Data</strong> (ФНС, телеком, ОФД, 2ГИС).
            </p>
          </div>

          {/* Section Selector */}
          <div className="flex flex-wrap items-center bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 shrink-0 gap-1">
            <button
              onClick={() => setActiveSection('flywheel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSection === 'flywheel' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              🌪 Маховик (Flywheel)
            </button>
            <button
              onClick={() => setActiveSection('monetization')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSection === 'monetization' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              💰 Монетизация (B2B/B2G)
            </button>
            <button
              onClick={() => setActiveSection('data-strategy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSection === 'data-strategy' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              📡 Data-Стратегия
            </button>
            <button
              onClick={() => setActiveSection('roadmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSection === 'roadmap' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              🚀 Roadmap & North Star
            </button>
          </div>
        </div>
      </div>

      {activeSection === 'flywheel' && (
        /* Section 1: Interactive Flywheel Engine */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Flywheel Steps list (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  7 шагов платформенного маховика BizOS
                </span>
                <span className="text-[11px] text-blue-600 font-semibold">Нажмите на шаг для симуляции</span>
              </div>

              <div className="space-y-2.5">
                {FLYWHEEL_STEPS.map((step) => {
                  const isSelected = activeStep === step.step;
                  return (
                    <div
                      key={step.step}
                      onClick={() => setActiveStep(step.step)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-slate-900 font-black text-sm shrink-0 shadow-xs`}>
                          {step.step}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">{step.title}</h4>
                          <p className="text-[11px] text-slate-600 mt-0.5">{step.description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-blue-600 block">{step.metric}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Visual Interactive Hub Representation (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-6 shadow-sm text-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Repeat className="w-5 h-5 text-blue-600 animate-spin" />
                  <h3 className="text-base font-extrabold text-slate-900">
                    Сетевой эффект: Шаг {activeStep} / 7
                  </h3>
                </div>
                <h4 className="text-sm font-bold text-blue-700">
                  {FLYWHEEL_STEPS[activeStep - 1].title}
                </h4>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {FLYWHEEL_STEPS[activeStep - 1].description}
                </p>
              </div>

              {/* Multi-sided platform triangle */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Баланс сторон рынка:
                </span>

                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-emerald-800 font-semibold">1. Demand (Спрос)</span>
                  <span className="text-slate-700">Стартаперы, Франчайзи</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="text-blue-800 font-semibold">2. Supply (Инфраструктура)</span>
                  <span className="text-slate-700">Банки, Риелторы, Подрядчики</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50 border border-purple-200">
                  <span className="text-purple-800 font-semibold">3. Data (Данные)</span>
                  <span className="text-slate-700">ФНС, Телеком, ОФД, 2ГИС</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveStep(activeStep > 1 ? activeStep - 1 : 7)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  ← Предыдущий
                </button>
                <span className="text-xs text-slate-500 font-mono">Цикл {activeStep}/7</span>
                <button
                  onClick={() => setActiveStep(activeStep < 7 ? activeStep + 1 : 1)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Следующий →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'monetization' && (
        /* Section 2: Monetization Matrix */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* B2C Freemium */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                B2C
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">B2C Freemium + Premium</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Free: Базовый скоринг ниши. Premium (от 2 990 ₽): Глубокий P&L, инвестиционный PDF-бизнес план для фондов, точечный гео-анализ адреса.
              </p>
              <div className="pt-2 text-xs text-emerald-700 font-semibold">
                Высокая маржинальность 95%
              </div>
            </div>

            {/* B2B LeadGen CPA */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                CPA
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">B2B CPA Лидогенерация</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Банки платят 1.5–2% от суммы выданного кредита. Риелторы платят 50-100% месячной ставки за закрытие аренды. Франчайзеры платят за квалифицированный лид.
              </p>
              <div className="pt-2 text-xs text-blue-700 font-semibold">
                Основной драйвер выручки
              </div>
            </div>

            {/* B2B SaaS & API */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold">
                API
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">B2B Enterprise API</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Доступ к гео-движку и AI-скорингу для крупных ритейлеров (X5 Group, Красное&Белое, Додо, СДЭК) для автоматического поиска и валидации новых локаций.
              </p>
              <div className="pt-2 text-xs text-teal-700 font-semibold">
                Подписка от 150 000 ₽ / мес
              </div>
            </div>

            {/* B2G Government */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 font-bold">
                B2G
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">B2G Гос. Сектор ("Мой Бизнес")</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Лицензионные контракты с региональными Минэкономразвития и Центрами "Мой Бизнес" на дашборд инвестиционного климата и карту дефицитных ниш.
              </p>
              <div className="pt-2 text-xs text-purple-700 font-semibold">
                Годовые контракты от 5 млн ₽
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'data-strategy' && (
        /* Section 3: Data Strategy Layers */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DATA_STRATEGY_LAYERS.map((layer) => (
              <div
                key={layer.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {layer.cost}
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold">{layer.status}</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900">{layer.title}</h3>

                  <div className="space-y-1 text-xs text-slate-600">
                    <span className="text-slate-800 font-medium block">Источники:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {layer.sources.map((s, idx) => (
                        <li key={idx} className="text-slate-700">{s}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-xs text-slate-700 bg-blue-50/70 p-2.5 rounded-xl border border-blue-200 leading-relaxed">
                    💡 <strong className="text-slate-900">Ценность для AI:</strong> {layer.valueForAI}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'roadmap' && (
        /* Section 4: Roadmap & North Star Metric Simulator */
        <div className="space-y-6">
          {/* North Star Live Simulator */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  🌟 North Star Metric Simulator (AARRR Воронка)
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  Количество выживших бизнесов (&gt; 6 мес) & CPA Выручка
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-right">
                <span className="text-[10px] text-slate-500 block">Прогноз выживших бизнесов / мес</span>
                <span className="text-2xl font-black text-emerald-700">{simulatedSurvivedBusinesses} бизнесов</span>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-700 flex justify-between font-semibold">
                  <span>Трафик Scout (вход воронки):</span>
                  <span className="text-blue-700 font-bold">{scoutTrafficMonthly.toLocaleString('ru-RU')} польз.</span>
                </label>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="1000"
                  value={scoutTrafficMonthly}
                  onChange={(e) => setScoutTrafficMonthly(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 flex justify-between font-semibold">
                  <span>Конверсия в полный отчет (Activation):</span>
                  <span className="text-emerald-700 font-bold">{activationRate}%</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="1"
                  value={activationRate}
                  onChange={(e) => setActivationRate(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 flex justify-between font-semibold">
                  <span>Конверсия в заявку в Банк / Франшизу:</span>
                  <span className="text-purple-700 font-bold">{premiumConversionRate}%</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={premiumConversionRate}
                  onChange={(e) => setPremiumConversionRate(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>

            {/* Calculated Results */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Активированные лиды</span>
                <span className="text-sm font-bold text-slate-900">{simulatedActivatedUsers.toLocaleString('ru-RU')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Сделок с банками/риелторами</span>
                <span className="text-sm font-bold text-blue-700">{simulatedBankLeads} сделок</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">CPA Доход платформы</span>
                <span className="text-sm font-bold text-emerald-700">{formatCurrency(simulatedMonthlyCpaRevenue, currency)} / мес</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Смертность бизнеса</span>
                <span className="text-sm font-bold text-emerald-700">18% (Цель &lt; 20%)</span>
              </div>
            </div>
          </div>

          {/* 3-Phase Roadmap Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  Phase 1: Месяцы 1–6
                </span>
                <span className="text-xs text-slate-500">MVP & Traction</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Product-Market Fit & Лидогенерация</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Запуск бесплатного "Оценщика ниш" для 6 ключевых индустрий. Сбор контактных данных и намерений тысяч предпринимателей.
              </p>
              <div className="text-[11px] text-slate-500">
                Метрика: <strong className="text-slate-800">CAC &lt; 350 ₽, 10 000+ регистраций</strong>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-700 px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                  Phase 2: Месяцы 6–12
                </span>
                <span className="text-xs text-slate-500">Monetization & Pilots</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Финмодель & Банковский Скоринг</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Запуск модуля генерации P&L и инвест-планов. Пилотные интеграции со Сбером, Т-Банком и Точкой по CPA-модели.
              </p>
              <div className="text-[11px] text-slate-500">
                Метрика: <strong className="text-blue-700">Conversion 6.5%, 15 млн ₽ CPA выручки</strong>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-purple-700 px-2 py-0.5 rounded bg-purple-50 border border-purple-200">
                  Phase 3: Месяцы 12–24
                </span>
                <span className="text-xs text-slate-500">Platform Ecosystem</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Маркетплейс, API & B2G Дашборды</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Тендерная площадка подрядчиков, интеграция с Циан/Авито Недвижимость, продажа API крупному ритейлу и лицензирование "Мой Бизнес".
              </p>
              <div className="text-[11px] text-slate-500">
                Метрика: <strong className="text-purple-700">LTV $1 200+, Смертность &lt; 20%</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
