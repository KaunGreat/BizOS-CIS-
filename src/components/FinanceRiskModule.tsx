import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Download, 
  PieChart, 
  FileText, 
  ArrowRight,
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';
import { CISCity, Currency, FinancialModelInputs, BankPartner, NicheData, DistrictGeoData, FranchiseItem } from '../types';
import { BANK_PARTNERS } from '../data/mockData';
import { formatCurrency, formatNumber, getSurvivalColor } from '../utils/formatters';
import { getClientBankScoringFallback } from '../utils/aiFallbacks';
import confetti from 'canvas-confetti';

interface FinanceRiskModuleProps {
  selectedCity: CISCity;
  currency: Currency;
  activeNiche: NicheData;
  activeDistrict: DistrictGeoData | null;
  activeFranchise: FranchiseItem | null;
  onProceedToMarketplace: () => void;
}

export const FinanceRiskModule: React.FC<FinanceRiskModuleProps> = ({
  selectedCity,
  currency,
  activeNiche,
  activeDistrict,
  activeFranchise,
  onProceedToMarketplace
}) => {
  // Financial Model Input state
  const [inputs, setInputs] = useState<FinancialModelInputs>({
    nicheName: activeFranchise ? activeFranchise.brandName : activeNiche.name,
    city: selectedCity,
    areaSqM: activeFranchise ? activeFranchise.minAreaSqM : 35,
    avgCheck: 340,
    dailyCustomers: 110,
    openingHoursPerDay: 13,
    staffCount: 3,
    avgSalaryPerEmployee: 55000,
    monthlyRent: activeDistrict ? activeDistrict.recommendedMaxRent : 140000,
    utilityCosts: 22000,
    foodCostOrCogsPercent: activeNiche.avgMarginPercent ? 100 - activeNiche.avgMarginPercent : 32,
    monthlyMarketing: 35000,
    otherOpex: 18000,
    initialCapex: activeFranchise ? activeFranchise.totalInvestment : activeNiche.initialCapexMin,
    taxRegime: 'USN_6',
    loanAmountRequested: Math.round((activeFranchise ? activeFranchise.totalInvestment : activeNiche.initialCapexMin) * 0.6),
    loanTermMonths: 36,
    loanInterestRate: 15.5,
  });

  const [selectedBank, setSelectedBank] = useState<BankPartner>(BANK_PARTNERS[0]);
  const [isSendingToBank, setIsSendingToBank] = useState<boolean>(false);
  const [bankSentSuccess, setBankSentSuccess] = useState<boolean>(false);
  const [aiScoringReport, setAiScoringReport] = useState<any | null>(null);
  const [isScoringAi, setIsScoringAi] = useState<boolean>(false);

  // Financial Computations
  const calculations = useMemo(() => {
    const monthlyRevenue = inputs.dailyCustomers * inputs.avgCheck * 30;
    const annualRevenue = monthlyRevenue * 12;

    const monthlyCogs = monthlyRevenue * (inputs.foodCostOrCogsPercent / 100);
    const monthlyGrossProfit = monthlyRevenue - monthlyCogs;

    const monthlyPayroll = inputs.staffCount * inputs.avgSalaryPerEmployee;
    const monthlyPayrollTaxes = monthlyPayroll * 0.30; // 30% insurance contributions
    const monthlyTotalStaffCost = monthlyPayroll + monthlyPayrollTaxes;

    const monthlyFixedOpex = 
      inputs.monthlyRent + 
      inputs.utilityCosts + 
      monthlyTotalStaffCost + 
      inputs.monthlyMarketing + 
      inputs.otherOpex;

    const monthlyEbitda = monthlyGrossProfit - monthlyFixedOpex;

    // Tax calculation
    let monthlyTaxes = 0;
    if (inputs.taxRegime === 'USN_6') {
      monthlyTaxes = Math.max(0, monthlyRevenue * 0.06 - monthlyPayrollTaxes * 0.5); // max 50% deduction
    } else if (inputs.taxRegime === 'USN_15') {
      const taxableBase = Math.max(0, monthlyRevenue - monthlyCogs - monthlyFixedOpex);
      monthlyTaxes = taxableBase * 0.15;
    } else if (inputs.taxRegime === 'PATENT') {
      monthlyTaxes = 12000; // Flat average patent in large cities
    }

    const monthlyNetProfit = Math.round(monthlyEbitda - monthlyTaxes);
    const annualNetProfit = monthlyNetProfit * 12;
    const netMarginPercent = monthlyRevenue > 0 ? ((monthlyNetProfit / monthlyRevenue) * 100).toFixed(1) : '0';

    // Break-even point (Точка безубыточности)
    // Fixed Costs / Contribution Margin Ratio
    const contributionMarginRatio = (monthlyRevenue - monthlyCogs) / monthlyRevenue || 0.68;
    const breakEvenMonthlyRevenue = Math.round(monthlyFixedOpex / contributionMarginRatio);
    const breakEvenDailyCustomers = Math.round(breakEvenMonthlyRevenue / (inputs.avgCheck * 30));

    // Payback period (Срок окупаемости)
    const paybackMonths = monthlyNetProfit > 0 ? (inputs.initialCapex / monthlyNetProfit).toFixed(1) : '∞';

    // Bank Scoring Metrics
    const monthlyLoanPayment = Math.round(
      (inputs.loanAmountRequested * (inputs.loanInterestRate / 100 / 12)) /
      (1 - Math.pow(1 + inputs.loanInterestRate / 100 / 12, -inputs.loanTermMonths))
    );
    const dscr = monthlyLoanPayment > 0 ? (monthlyNetProfit / monthlyLoanPayment).toFixed(2) : '3.5';
    const revenueSafetyBuffer = monthlyRevenue > 0 ? (((monthlyRevenue - breakEvenMonthlyRevenue) / monthlyRevenue) * 100).toFixed(0) : '0';

    return {
      monthlyRevenue,
      annualRevenue,
      monthlyCogs,
      monthlyGrossProfit,
      monthlyFixedOpex,
      monthlyTotalStaffCost,
      monthlyEbitda,
      monthlyTaxes,
      monthlyNetProfit,
      annualNetProfit,
      netMarginPercent,
      breakEvenMonthlyRevenue,
      breakEvenDailyCustomers,
      paybackMonths,
      monthlyLoanPayment,
      dscr,
      revenueSafetyBuffer
    };
  }, [inputs]);

  // Run AI Bank Underwriting Scoring
  const handleGenerateAiBankScoring = async () => {
    setIsScoringAi(true);
    setAiScoringReport(null);
    const fallback = getClientBankScoringFallback(
      inputs.nicheName,
      activeNiche.name,
      selectedCity,
      inputs.initialCapex,
      calculations.monthlyNetProfit,
      inputs.loanAmountRequested
    );

    try {
      const response = await fetch('/api/ai/bank-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: inputs.nicheName,
          niche: activeNiche.name,
          city: selectedCity,
          capex: inputs.initialCapex,
          monthlyRevenue: calculations.monthlyRevenue,
          monthlyProfit: calculations.monthlyNetProfit,
          loanRequested: inputs.loanAmountRequested,
          experienceYears: 2
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data) {
        setAiScoringReport(data.data);
      } else {
        setAiScoringReport(fallback);
      }
    } catch (err) {
      console.warn('Using client analytical fallback for bank scoring:', err);
      setAiScoringReport(fallback);
    } finally {
      setIsScoringAi(false);
    }
  };

  const handleSendToBank = () => {
    setIsSendingToBank(true);
    setTimeout(() => {
      setIsSendingToBank(false);
      setBankSentSuccess(true);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg relative overflow-hidden text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Calculator className="w-3.5 h-3.5" />
              <span>Модуль 3: Finance & Risk • Финмодель и Скоринг для Банков</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Интерактивная Финмодель (P&L, CashFlow, Точка Безубыточности)
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Рассчитайте Unit-экономику бизнеса и отправьте верифицированный AI-бизнес план напрямую в банки-партнеры (Т-Банк, Точка, Сбер, Альфа) с готовым отчетом скоринга рисков.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateAiBankScoring}
              disabled={isScoringAi}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Sparkles className={`w-4 h-4 ${isScoringAi ? 'animate-spin' : ''}`} />
              <span>{isScoringAi ? 'Скоринг андеррайтера...' : 'AI-Скоринг для Банка'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Parameters & Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editable Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-600" />
                Параметры Unit-Экономики
              </span>
              <span className="text-[11px] text-slate-500 font-medium">г. {selectedCity}</span>
            </div>

            {/* Input Controls */}
            <div className="space-y-3 text-xs">
              {/* Daily guests & avg check */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Гостей в день: <strong className="text-slate-900">{inputs.dailyCustomers}</strong></label>
                  <input
                    type="range"
                    min="20"
                    max="400"
                    step="5"
                    value={inputs.dailyCustomers}
                    onChange={(e) => setInputs({ ...inputs, dailyCustomers: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Средний чек: <strong className="text-slate-900">{formatCurrency(inputs.avgCheck, currency)}</strong></label>
                  <input
                    type="range"
                    min="100"
                    max="2500"
                    step="20"
                    value={inputs.avgCheck}
                    onChange={(e) => setInputs({ ...inputs, avgCheck: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>

              {/* Area & Rent */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Площадь (м²)</label>
                  <input
                    type="number"
                    value={inputs.areaSqM}
                    onChange={(e) => setInputs({ ...inputs, areaSqM: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Аренда в мес (₽)</label>
                  <input
                    type="number"
                    value={inputs.monthlyRent}
                    onChange={(e) => setInputs({ ...inputs, monthlyRent: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Staff & Salary */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Сотрудников (чел)</label>
                  <input
                    type="number"
                    value={inputs.staffCount}
                    onChange={(e) => setInputs({ ...inputs, staffCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">ФОТ на 1 сотр. (₽)</label>
                  <input
                    type="number"
                    value={inputs.avgSalaryPerEmployee}
                    onChange={(e) => setInputs({ ...inputs, avgSalaryPerEmployee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Food Cost / COGS & Marketing */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Себестоимость / Food cost: <strong className="text-slate-900">{inputs.foodCostOrCogsPercent}%</strong></label>
                  <input
                    type="range"
                    min="15"
                    max="65"
                    step="1"
                    value={inputs.foodCostOrCogsPercent}
                    onChange={(e) => setInputs({ ...inputs, foodCostOrCogsPercent: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Маркетинг (₽/мес)</label>
                  <input
                    type="number"
                    value={inputs.monthlyMarketing}
                    onChange={(e) => setInputs({ ...inputs, monthlyMarketing: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Initial CAPEX & Tax Regime */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">CAPEX на запуск (₽)</label>
                  <input
                    type="number"
                    value={inputs.initialCapex}
                    onChange={(e) => setInputs({ ...inputs, initialCapex: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Налоговый режим</label>
                  <select
                    value={inputs.taxRegime}
                    onChange={(e) => setInputs({ ...inputs, taxRegime: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="USN_6">УСН 6% (Доходы)</option>
                    <option value="USN_15">УСН 15% (Доходы-Расходы)</option>
                    <option value="PATENT">Патент (ПСН)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: P&L Report, Break-even & Bank Scoring (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Key Output Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block">Выручка в месяц</span>
              <p className="text-base font-extrabold text-slate-900 mt-1">
                {formatCurrency(calculations.monthlyRevenue, currency)}
              </p>
              <span className="text-[10px] text-slate-400">~{formatCurrency(calculations.annualRevenue, currency)}/год</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block">Чистая прибыль</span>
              <p className="text-base font-extrabold text-emerald-600 mt-1">
                {formatCurrency(calculations.monthlyNetProfit, currency)}
              </p>
              <span className="text-[10px] text-emerald-700 font-semibold">Рентабельность: {calculations.netMarginPercent}%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block">Точка безубыточности</span>
              <p className="text-base font-extrabold text-amber-700 mt-1">
                {formatCurrency(calculations.breakEvenMonthlyRevenue, currency)}
              </p>
              <span className="text-[10px] text-slate-400">мин. {calculations.breakEvenDailyCustomers} гостей/день</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block">Окупаемость (Payback)</span>
              <p className="text-base font-extrabold text-blue-700 mt-1">
                ~{calculations.paybackMonths} мес
              </p>
              <span className="text-[10px] text-blue-600 font-semibold">Запас прочности: {calculations.revenueSafetyBuffer}%</span>
            </div>
          </div>

          {/* Interactive P&L Statement Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Отчет о прибылях и убытках (P&L)
              </span>
              <span className="text-[11px] text-blue-600 font-semibold">Авторасчет BizOS Engine</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 font-semibold text-slate-900">
                <span>1. Валовая Выручка (Revenue)</span>
                <span>{formatCurrency(calculations.monthlyRevenue, currency)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600 pl-3">
                <span>— Себестоимость сырья / COGS ({inputs.foodCostOrCogsPercent}%)</span>
                <span className="text-rose-600 font-medium">-{formatCurrency(calculations.monthlyCogs, currency)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 font-semibold text-slate-900">
                <span>2. Валовая прибыль (Gross Profit)</span>
                <span className="text-emerald-600 font-bold">{formatCurrency(calculations.monthlyGrossProfit, currency)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600 pl-3">
                <span>— Аренда и коммунальные платежи</span>
                <span className="text-rose-600 font-medium">-{formatCurrency(inputs.monthlyRent + inputs.utilityCosts, currency)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600 pl-3">
                <span>— ФОТ персонала и налоги с зарплаты (30%)</span>
                <span className="text-rose-600 font-medium">-{formatCurrency(calculations.monthlyTotalStaffCost, currency)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600 pl-3">
                <span>— Маркетинг и привлечение гостей</span>
                <span className="text-rose-600 font-medium">-{formatCurrency(inputs.monthlyMarketing, currency)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600 pl-3">
                <span>— Прочие операционные расходы</span>
                <span className="text-rose-600 font-medium">-{formatCurrency(inputs.otherOpex, currency)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600 pl-3">
                <span>— Налоги ({inputs.taxRegime})</span>
                <span className="text-rose-600 font-medium">-{formatCurrency(calculations.monthlyTaxes, currency)}</span>
              </div>
              <div className="flex justify-between py-2 pt-2 border-t-2 border-slate-200 font-extrabold text-sm text-slate-900 bg-emerald-50/70 border-emerald-200 px-3 rounded-lg">
                <span className="text-emerald-800">Итого Чистая прибыль (Net Profit):</span>
                <span className="text-emerald-700">{formatCurrency(calculations.monthlyNetProfit, currency)} / мес</span>
              </div>
            </div>
          </div>

          {/* Killer Feature: Bank Gateway & AI Credit Risk Scoring */}
          <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-purple-50/90 rounded-2xl border border-blue-200 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Киллер-фича: Отправить бизнес-план в Банк-Партнер
                </h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-semibold">
                Альтернативный AI-Скоринг
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Банк получает не просто сырую заявку, а независимый скоринг BizOS с оценкой коэффициента покрытия долга (DSCR: <strong className="text-blue-700">{calculations.dscr}x</strong>) и запаса прочности ({calculations.revenueSafetyBuffer}%).
            </p>

            {/* Bank Selector Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {BANK_PARTNERS.map((bank) => {
                const isSelected = selectedBank.id === bank.id;
                return (
                  <button
                    key={bank.id}
                    onClick={() => setSelectedBank(bank)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-blue-500 shadow-sm ring-2 ring-blue-500'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{bank.logo}</div>
                    <div className="text-xs font-bold text-slate-900 truncate">{bank.name}</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-1">до {formatCurrency(bank.maxStartupCredit, currency)}</div>
                    <div className="text-[10px] text-slate-500">Ставка: от {bank.subsidizedRate}%</div>
                  </button>
                );
              })}
            </div>

            {/* AI Underwriter Report (if generated) */}
            {aiScoringReport && (
              <div className="p-4 rounded-xl bg-white border border-purple-200 space-y-2 text-xs animate-in fade-in duration-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900">Оценка риска: {aiScoringReport.riskGrade} (Скор: {aiScoringReport.creditScore}/100)</span>
                  <span className="text-emerald-700 font-bold">Вероятность одобрения: {aiScoringReport.approvalProbability}%</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{aiScoringReport.bankVerdict}</p>
                <div className="text-blue-700 text-[11px]">
                  Рекомендуемая сумма кредита: <strong className="text-slate-900">{formatCurrency(aiScoringReport.maxRecommendedLoan || inputs.loanAmountRequested, currency)}</strong> под {aiScoringReport.recommendedInterestRate}
                </div>
              </div>
            )}

            {/* Send Action */}
            {bankSentSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-xs font-bold text-emerald-800">
                  Бизнес-план и скоринг успешно переданы в {selectedBank.name}!
                </h4>
                <p className="text-[11px] text-slate-600">
                  Специалист корпоративного отдела свяжется с вами в течение {selectedBank.approvalSpeedHours} часов для согласования транша кредита.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-600 text-center sm:text-left">
                  Запрашиваемый кредит: <strong className="text-slate-900">{formatCurrency(inputs.loanAmountRequested, currency)}</strong>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleSendToBank}
                    disabled={isSendingToBank}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    <Send className={`w-4 h-4 ${isSendingToBank ? 'animate-spin' : ''}`} />
                    <span>{isSendingToBank ? 'Шифрование & Отправка...' : `Отправить заявку в ${selectedBank.name}`}</span>
                  </button>

                  <button
                    onClick={onProceedToMarketplace}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition-all shadow-xs"
                  >
                    4. Тендеры
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
