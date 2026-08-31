import React from 'react';
import { 
  Radar, 
  MapPin, 
  Calculator, 
  Handshake, 
  Repeat, 
  Sparkles, 
  TrendingUp, 
  Building,
  Globe2
} from 'lucide-react';
import { CISCity, Currency } from '../types';
import { CITIES_LIST } from '../data/mockData';

interface HeaderProps {
  activeTab: 'scout' | 'matcher' | 'finance' | 'marketplace' | 'flywheel' | 'ai-advisor';
  setActiveTab: (tab: 'scout' | 'matcher' | 'finance' | 'marketplace' | 'flywheel' | 'ai-advisor') => void;
  selectedCity: CISCity;
  setSelectedCity: (city: CISCity) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  onOpenAiAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCity,
  setSelectedCity,
  currency,
  setCurrency,
  onOpenAiAssistant
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Mission & North Star Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Mission:</span>
            <span className="text-slate-300">Снижение смертности стартапов в СНГ с <strong className="text-rose-400 font-semibold">50%</strong> до <strong className="text-emerald-400 font-semibold">20%</strong> за счет AI и данных</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="hidden md:flex items-center gap-1.5 text-slate-300">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <span>North Star: <strong className="text-white font-semibold">1 482</strong> бизнеса &gt; 6 мес</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>Кредитов выдано: <strong className="text-amber-300 font-semibold">1.84 млрд ₽</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <Globe2 className="w-3 h-3 text-slate-400" />
              <select
                aria-label="Выбор города"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as CISCity)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
              >
                {CITIES_LIST.map((city) => (
                  <option key={city} value={city} className="bg-slate-900 text-slate-200">
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center bg-slate-800 rounded border border-slate-700 p-0.5">
              {(['RUB', 'KZT', 'BYN', 'USD'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                    currency === c
                      ? 'bg-blue-500 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c === 'RUB' ? '₽' : c === 'KZT' ? '₸' : c === 'BYN' ? 'Br' : '$'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('scout')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform text-white">
                <Radar className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">BizOS</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold">CIS</span>
                </div>
                <p className="text-[11px] text-slate-500 -mt-0.5 font-medium">Стартап-ОС для малого бизнеса</p>
              </div>
            </button>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('scout')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'scout'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Radar className="w-4 h-4 text-blue-600" />
              <span>1. Scout (Разведка)</span>
            </button>

            <button
              onClick={() => setActiveTab('matcher')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'matcher'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <MapPin className="w-4 h-4 text-cyan-600" />
              <span>2. Matcher (Локации & Франшизы)</span>
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'finance'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>3. Finance & Банк-Скоринг</span>
            </button>

            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Handshake className="w-4 h-4 text-indigo-600" />
              <span>4. Marketplace (Тендеры)</span>
            </button>

            <button
              onClick={() => setActiveTab('flywheel')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'flywheel'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Flywheel & B2G Hub</span>
            </button>
          </nav>

          {/* Quick AI Assistant Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">AI Бизнес-Архитектор</span>
              <span className="sm:hidden">AI</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-200 scrollbar-none">
          <button
            onClick={() => setActiveTab('scout')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${
              activeTab === 'scout' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Scout
          </button>
          <button
            onClick={() => setActiveTab('matcher')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${
              activeTab === 'matcher' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Matcher
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${
              activeTab === 'finance' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Finance & Банк
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${
              activeTab === 'marketplace' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('flywheel')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${
              activeTab === 'flywheel' ? 'bg-indigo-600 text-white font-bold' : 'text-indigo-600'
            }`}
          >
            Flywheel Hub
          </button>
        </div>
      </div>
    </header>
  );
};
