import React, { useState } from 'react';
import { 
  MapPin, 
  Store, 
  Users, 
  Building2, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  ShieldCheck,
  ChevronRight,
  Filter,
  DollarSign
} from 'lucide-react';
import { CISCity, Currency, DistrictGeoData, FranchiseItem, NicheData } from '../types';
import { DISTRICTS_GEO_DATA, FRANCHISES_DATA } from '../data/mockData';
import { formatCurrency, formatNumber, getSurvivalColor } from '../utils/formatters';
import { getClientLocationFallback } from '../utils/aiFallbacks';
import confetti from 'canvas-confetti';

interface MatcherModuleProps {
  selectedCity: CISCity;
  currency: Currency;
  activeNiche: NicheData;
  onProceedToFinanceWithLocation: (district: DistrictGeoData | null, franchise: FranchiseItem | null) => void;
}

export const MatcherModule: React.FC<MatcherModuleProps> = ({
  selectedCity,
  currency,
  activeNiche,
  onProceedToFinanceWithLocation,
}) => {
  const [subTab, setSubTab] = useState<'geo-matcher' | 'franchises'>('geo-matcher');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictGeoData>(DISTRICTS_GEO_DATA[0]);
  const [selectedFranchise, setSelectedFranchise] = useState<FranchiseItem | null>(null);
  
  // Custom Address Test Form state
  const [customAddress, setCustomAddress] = useState<string>('');
  const [customRent, setCustomRent] = useState<number>(140000);
  const [customArea, setCustomArea] = useState<number>(35);
  const [isEvaluatingLocation, setIsEvaluatingLocation] = useState<boolean>(false);
  const [locationAiReport, setLocationAiReport] = useState<any | null>(null);

  // Franchise Filters
  const [maxInvestment, setMaxInvestment] = useState<number>(6000000);
  const [franchiseApplied, setFranchiseApplied] = useState<string | null>(null);

  const cityDistricts = DISTRICTS_GEO_DATA.filter((d) => d.city === selectedCity);
  const displayDistricts = cityDistricts.length > 0 ? cityDistricts : DISTRICTS_GEO_DATA;

  const handleEvaluateCustomLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluatingLocation(true);
    setLocationAiReport(null);
    const fallback = getClientLocationFallback(
      activeNiche.name,
      selectedCity,
      customAddress || `${selectedDistrict.name}, 1-я линия`,
      customRent,
      customArea
    );

    try {
      const response = await fetch('/api/ai/evaluate-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: activeNiche.name,
          city: selectedCity,
          streetAddress: customAddress || `${selectedDistrict.name}, 1-я линия`,
          rentPrice: customRent,
          area: customArea,
          targetAudienceNotes: 'Пешеходный трафик, офисы и жилой массив',
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data) {
        setLocationAiReport(data.data);
      } else {
        setLocationAiReport(fallback);
      }
    } catch (err) {
      console.warn('Using client analytical fallback for location scoring:', err);
      setLocationAiReport(fallback);
    } finally {
      setIsEvaluatingLocation(false);
    }
  };

  const handleApplyFranchise = (franchise: FranchiseItem) => {
    setSelectedFranchise(franchise);
    setFranchiseApplied(franchise.id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg relative overflow-hidden text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Модуль 2: Matcher • Локации и Франшизы</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI-Матчер помещений и каталог проверенных франшиз
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Выбранная ниша: <strong className="text-blue-400">{activeNiche.name}</strong>. Подберите идеальную улицу в г. {selectedCity} с плотностью офисов и пешеходов или выберите готовую франшизу с подтвержденным скором выживаемости.
            </p>
          </div>

          {/* Sub-tab switcher */}
          <div className="flex items-center bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 shrink-0">
            <button
              onClick={() => setSubTab('geo-matcher')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                subTab === 'geo-matcher'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Гео-Матчер Улиц & ТЦ</span>
            </button>
            <button
              onClick={() => setSubTab('franchises')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                subTab === 'franchises'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Каталог Франшиз</span>
            </button>
          </div>
        </div>
      </div>

      {subTab === 'geo-matcher' ? (
        /* Geo-Matcher View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Districts & Map Simulation (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Горячие зоны в г. {selectedCity}
              </span>
              <span className="text-[11px] text-blue-600 font-semibold">Big Data сотовых операторов</span>
            </div>

            {/* Interactive Simulated Map Canvas Card */}
            <div className="relative h-64 bg-slate-900 rounded-2xl border border-slate-800 p-3 overflow-hidden shadow-inner flex flex-col justify-between">
              {/* Simulated Map Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              
              {/* Simulated Roads/Traffic Arteries */}
              <svg className="absolute inset-0 w-full h-full stroke-slate-800 stroke-[2] pointer-events-none">
                <path d="M 0 50 Q 150 120 400 90" fill="none" className="stroke-blue-900/60 stroke-[4]" />
                <path d="M 120 0 Q 180 200 280 300" fill="none" className="stroke-indigo-900/60 stroke-[3]" />
                <circle cx="210" cy="110" r="45" fill="rgba(59, 130, 246, 0.12)" stroke="rgba(59, 130, 246, 0.4)" strokeDasharray="3 3" />
                <circle cx="280" cy="180" r="35" fill="rgba(99, 102, 241, 0.12)" stroke="rgba(99, 102, 241, 0.4)" strokeDasharray="3 3" />
              </svg>

              {/* District Interactive Pins */}
              {displayDistricts.map((district) => {
                const isSelected = selectedDistrict.id === district.id;
                return (
                  <button
                    key={district.id}
                    onClick={() => setSelectedDistrict(district)}
                    style={{ left: `${district.coordinates.x}%`, top: `${district.coordinates.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all z-20`}
                  >
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold shadow-lg transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-white scale-110 ring-4 ring-blue-500/30'
                        : 'bg-slate-800/95 text-slate-100 border-slate-600 hover:border-blue-400 hover:scale-105'
                    }`}>
                      <MapPin className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-blue-400'}`} />
                      <span>{district.name}</span>
                    </div>
                  </button>
                );
              })}

              <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-300 bg-slate-950/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Зона высокой концентрации трафика
                </span>
                <span className="font-mono text-slate-400">2ГИС + Карты</span>
              </div>
            </div>

            {/* Districts List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {displayDistricts.map((district) => {
                const isSelected = selectedDistrict.id === district.id;
                return (
                  <div
                    key={district.id}
                    onClick={() => setSelectedDistrict(district)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/60 border-blue-500 shadow-sm ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          {district.name}
                        </h4>
                        <span className="text-[11px] text-slate-500">{district.subwayStation || 'Центральный район'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-blue-600 block">{formatNumber(district.pedestrianTrafficPerHour)}</span>
                        <span className="text-[10px] text-slate-400">чел / час в пике</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep District Geo-Analytics & Match Report (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Detailed Geo Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {selectedDistrict.city}
                    </span>
                    <span className="text-xs text-slate-500">{selectedDistrict.subwayStation}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">{selectedDistrict.name}</h2>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800">Качество трафика</div>
                    <div className="text-[11px] text-slate-500">Footfall Quality Score</div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-black text-base ${getSurvivalColor(selectedDistrict.footfallQualityScore)}`}>
                    {selectedDistrict.footfallQualityScore}
                  </div>
                </div>
              </div>

              {/* Big Data Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    Плотность офисов (500м)
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-1.5">
                    {formatNumber(selectedDistrict.officeWorkerDensity)} чел.
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Высокий платежеспособный спрос</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    Пешеходный трафик
                  </span>
                  <p className="text-sm font-bold text-emerald-600 mt-1.5">
                    ~{formatNumber(selectedDistrict.pedestrianTrafficPerHour)} чел/час
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Утренний и вечерний час пик</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                    <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                    Рекомендуемая аренда
                  </span>
                  <p className="text-sm font-bold text-amber-700 mt-1.5">
                    до {formatCurrency(selectedDistrict.recommendedMaxRent, currency)}/мес
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">~{formatCurrency(selectedDistrict.avgRentRatePerSqM, currency)}/м²</span>
                </div>
              </div>

              {/* AI Geo-Matching Insight */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                    AI-Вердикт для ниши: {activeNiche.name}
                  </h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  💡 В радиусе 450 метров от метро плотность офисных сотрудников составляет <strong className="text-slate-900">{formatNumber(selectedDistrict.officeWorkerDensity)} человек</strong>, при этом ближайший прямой конкурент удален на 380 метров. Рекомендуемая арендная ставка — до <strong className="text-amber-700">{formatCurrency(selectedDistrict.recommendedMaxRent, currency)}</strong> (не более 18% от прогнозируемой выручки).
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <span>Свободных коммерческих помещений: <strong className="text-emerald-700">{selectedDistrict.availableCommercialSpacesCount} объекта</strong></span>
                  <span>•</span>
                  <span>Давление конкурентов: <strong className="text-slate-700">{selectedDistrict.competitionScore}/100</strong></span>
                </div>
              </div>

              {/* Custom Location Real-time Test Form */}
              <form onSubmit={handleEvaluateCustomLocation} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-purple-600" />
                    Проверить конкретный адрес или объект с Авито/Циан:
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      placeholder="Адрес: ул. Лесная 5, 1-я линия (или ТЦ)"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={customRent}
                      onChange={(e) => setCustomRent(Number(e.target.value))}
                      placeholder="Аренда ₽/мес"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isEvaluatingLocation}
                  className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isEvaluatingLocation ? 'animate-spin' : ''}`} />
                  <span>{isEvaluatingLocation ? 'Анализируем гео-слои...' : 'Рассчитать адекватность аренды и трафик'}</span>
                </button>
              </form>

              {/* AI Location Output Drawer */}
              {locationAiReport && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2.5 animate-in fade-in duration-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">Оценка локации: {locationAiReport.locationScore}/100</span>
                    <span className="text-emerald-700 font-semibold">{locationAiReport.rentVerdict}</span>
                  </div>
                  <p className="text-slate-700">{locationAiReport.trafficQuality}</p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="text-emerald-800">
                      <strong>Плюсы:</strong>
                      <ul className="list-disc list-inside mt-0.5 text-slate-700">
                        {locationAiReport.keyPros?.map((p: string, i: number) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                    <div className="text-rose-800">
                      <strong>Минусы:</strong>
                      <ul className="list-disc list-inside mt-0.5 text-slate-700">
                        {locationAiReport.keyCons?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Выбрано: <strong className="text-slate-800">{selectedDistrict.name}</strong>
                </span>

                <button
                  onClick={() => onProceedToFinanceWithLocation(selectedDistrict, null)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <span>3. Рассчитать Финмодель для этой локации</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Franchise Catalog View */
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Фильтры каталога:</span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Бюджет до:</span>
                <select
                  value={maxInvestment}
                  onChange={(e) => setMaxInvestment(Number(e.target.value))}
                  className="bg-slate-50 text-slate-800 border border-slate-300 px-2.5 py-1.5 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value={1500000}>до 1.5 млн ₽</option>
                  <option value={3000000}>до 3.0 млн ₽</option>
                  <option value={6000000}>до 6.0 млн ₽</option>
                  <option value={10000000}>до 10 млн ₽</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Только проверенные BizOS</span>
              </div>
            </div>
          </div>

          {/* Franchise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FRANCHISES_DATA.filter((f) => f.totalInvestment <= maxInvestment).map((franchise) => {
              const isApplied = franchiseApplied === franchise.id;
              return (
                <div
                  key={franchise.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md p-5 space-y-4 shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl">
                          {franchise.logo}
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900">{franchise.brandName}</h3>
                          <span className="text-xs text-slate-500">{franchise.niche}</span>
                        </div>
                      </div>

                      {/* Survival Score Badge */}
                      <div className={`px-2 py-1 rounded-lg border text-xs font-black text-center ${getSurvivalColor(franchise.survivalScore)}`}>
                        <div>{franchise.survivalScore}</div>
                        <div className="text-[8px] uppercase tracking-tighter">Скор</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {franchise.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Инвестиции</span>
                        <span className="font-bold text-slate-800">{formatCurrency(franchise.totalInvestment, currency)}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Окупаемость</span>
                        <span className="font-bold text-emerald-600">~{franchise.paybackMonths} мес</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Паушальный взнос</span>
                        <span className="font-semibold text-slate-700">{formatCurrency(franchise.lumpSumFee, currency)}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Закрытий точек</span>
                        <span className="font-semibold text-blue-600">{franchise.closedPointsLastYearPercent}% (мин.)</span>
                      </div>
                    </div>

                    {/* Support highlights */}
                    <div className="space-y-1 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-800 block">Пакет франшизы:</span>
                      {franchise.supportPackage.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleApplyFranchise(franchise)}
                      disabled={isApplied}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                        isApplied
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Заявка отправлена франчайзеру</span>
                        </>
                      ) : (
                        <span>Подать заявку франчайзеру</span>
                      )}
                    </button>

                    <button
                      onClick={() => onProceedToFinanceWithLocation(null, franchise)}
                      className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all border border-slate-200"
                    >
                      Финмодель для {franchise.brandName}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
