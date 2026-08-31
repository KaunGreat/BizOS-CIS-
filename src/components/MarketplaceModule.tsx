import React, { useState } from 'react';
import { 
  Handshake, 
  Hammer, 
  Scale, 
  CreditCard, 
  Coffee, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  Star, 
  Send, 
  Sparkles, 
  Clock, 
  DollarSign,
  Users,
  Search,
  Filter
} from 'lucide-react';
import { CISCity, Currency, B2BContractor, B2BTender, NicheData } from '../types';
import { B2B_CONTRACTORS, INITIAL_TENDERS } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';
import confetti from 'canvas-confetti';

interface MarketplaceModuleProps {
  selectedCity: CISCity;
  currency: Currency;
  activeNiche: NicheData;
}

export const MarketplaceModule: React.FC<MarketplaceModuleProps> = ({
  selectedCity,
  currency,
  activeNiche
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [tenders, setTenders] = useState<B2BTender[]>(INITIAL_TENDERS);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'contractors' | 'tenders'>('contractors');

  // New Tender form state
  const [tenderTitle, setTenderTitle] = useState<string>('');
  const [tenderCategory, setTenderCategory] = useState<string>('Ремонт и дизайн');
  const [tenderBudget, setTenderBudget] = useState<number>(450000);
  const [tenderDeadline, setTenderDeadline] = useState<number>(20);
  const [tenderRequirements, setTenderRequirements] = useState<string>('Под ключ по дизайн-проекту, гарантия 12 месяцев');
  const [tenderCreatedSuccess, setTenderCreatedSuccess] = useState<boolean>(false);

  // Quick Action Tenders
  const handleQuickCreateTender = (categoryName: string, defaultTitle: string, defaultBudget: number) => {
    setTenderCategory(categoryName);
    setTenderTitle(defaultTitle);
    setTenderBudget(defaultBudget);
    setCreateModalOpen(true);
  };

  const handleCreateTenderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenderTitle) return;

    const newTender: B2BTender = {
      id: `tender-${Date.now()}`,
      title: tenderTitle,
      category: tenderCategory,
      city: selectedCity,
      budgetMax: tenderBudget,
      deadlineDays: tenderDeadline,
      bidsCount: 3, // simulated initial instant matches
      status: 'active',
      authorNiche: activeNiche.name,
      createdAt: 'Только что',
      requirements: tenderRequirements.split(',').map((s) => s.trim()).filter(Boolean)
    };

    setTenders([newTender, ...tenders]);
    setTenderCreatedSuccess(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setCreateModalOpen(false);
      setTenderCreatedSuccess(false);
      setActiveTab('tenders');
    }, 1800);
  };

  const categories = ['Все', 'Ремонт и дизайн', 'Регистрация & Юристы', 'Кассы & ПО', 'Поставщики сырья', 'Маркетинг & Гео'];

  const filteredContractors = B2B_CONTRACTORS.filter((c) => {
    return selectedCategory === 'Все' || c.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg relative overflow-hidden text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Handshake className="w-3.5 h-3.5" />
              <span>Модуль 4: Marketplace • Тендерная площадка и Подрядчики</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              One-Stop-Shop: Подрядчики и Закупки в г. {selectedCity}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Не нужно искать ремонтников на непроверенных досках объявлений. Опубликуйте заявку, и проверенные аккредитованные B2B-партнеры BizOS пришлют КП с гарантией сроков и безопасной сделкой.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Создать тендер / Заявку</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action 1-Click Launch Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => handleQuickCreateTender('Ремонт и дизайн', `Ремонт под ключ для ${activeNiche.name}`, 550000)}
          className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all group cursor-pointer shadow-xs"
        >
          <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-2 group-hover:scale-110 transition-transform">
            <Hammer className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Начать ремонт</h4>
          <span className="text-[11px] text-slate-500">Бригады с лицензией СРО</span>
        </button>

        <button
          onClick={() => handleQuickCreateTender('Регистрация & Юристы', `Регистрация ИП/ООО под ${activeNiche.name} с УСН`, 15000)}
          className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all group cursor-pointer shadow-xs"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 transition-transform">
            <Scale className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Регистрация ООО/ИП</h4>
          <span className="text-[11px] text-slate-500">Бесплатно при открытии счета</span>
        </button>

        <button
          onClick={() => handleQuickCreateTender('Кассы & ПО', `Касса, 54-ФЗ и софт для ${activeNiche.name}`, 45000)}
          className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all group cursor-pointer shadow-xs"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
            <CreditCard className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Кассы & POS-софт</h4>
          <span className="text-[11px] text-slate-500">iiko / QuickResto / 1С</span>
        </button>

        <button
          onClick={() => handleQuickCreateTender('Поставщики сырья', `Оборудование и оптовые поставки для ${activeNiche.name}`, 350000)}
          className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all group cursor-pointer shadow-xs"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-2 group-hover:scale-110 transition-transform">
            <Coffee className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Оборудование & Сырье</h4>
          <span className="text-[11px] text-slate-500">Дилерские оптовые скидки</span>
        </button>
      </div>

      {/* Sub-tab view toggle & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('contractors')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'contractors'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Аккредитованные Подрядчики ({filteredContractors.length})
          </button>
          <button
            onClick={() => setActiveTab('tenders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tenders'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Активные Тендеры ({tenders.length})
          </button>
        </div>

        {/* Category Pills */}
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

      {activeTab === 'contractors' ? (
        /* Contractors Directory */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredContractors.map((contractor) => (
            <div
              key={contractor.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 space-y-4 shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl">
                      {contractor.logo}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">{contractor.name}</h3>
                      <span className="text-xs text-blue-600 font-semibold">{contractor.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-amber-700 text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{contractor.rating}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{contractor.specialOffer}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Выполнено сделок</span>
                    <strong className="text-slate-800">{contractor.completedDeals} объектов</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Средний срок</span>
                    <strong className="text-slate-800">~{contractor.typicalTurnaroundDays} дней</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 pt-1">
                  Контакт: <strong className="text-slate-800">{contractor.contactPerson}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleQuickCreateTender(contractor.category, `Заказ для ${contractor.name} (${activeNiche.name})`, 300000)}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Запросить расчет КП
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Active Tenders Feed */
        <div className="space-y-3">
          {tenders.map((tender) => (
            <div
              key={tender.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                      {tender.category}
                    </span>
                    <span className="text-xs text-slate-500">г. {tender.city}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{tender.createdAt}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{tender.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Бюджет до</span>
                    <span className="text-base font-extrabold text-emerald-700">{formatCurrency(tender.budgetMax, currency)}</span>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-blue-700">
                    {tender.bidsCount} отклика
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {tender.requirements.map((req, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200">
                    ✓ {req}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Tender Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 text-lg font-bold"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-1">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Создать B2B-тендер: {selectedCity}
              </h3>
              <p className="text-xs text-slate-600">
                Заявка мгновенно поступит проверенным подрядчикам платформы BizOS с лицензиями и отзывами.
              </p>
            </div>

            {tenderCreatedSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
                <p className="text-xs font-bold text-emerald-800">
                  Тендер опубликован и разослан 5 проверенным подрядчикам!
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateTenderSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Название задачи / Тендера</label>
                  <input
                    type="text"
                    required
                    value={tenderTitle}
                    onChange={(e) => setTenderTitle(e.target.value)}
                    placeholder="Например: Ремонт помещения 40 м² под кофейню to-go"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Категория</label>
                    <select
                      value={tenderCategory}
                      onChange={(e) => setTenderCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Ремонт и дизайн">Ремонт и дизайн</option>
                      <option value="Регистрация & Юристы">Регистрация & Юристы</option>
                      <option value="Кассы & ПО">Кассы & ПО</option>
                      <option value="Поставщики сырья">Поставщики сырья</option>
                      <option value="Маркетинг & Гео">Маркетинг & Гео</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Максимальный бюджет (₽)</label>
                    <input
                      type="number"
                      required
                      value={tenderBudget}
                      onChange={(e) => setTenderBudget(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Требования к подрядчику (через запятую)</label>
                  <textarea
                    rows={2}
                    value={tenderRequirements}
                    onChange={(e) => setTenderRequirements(e.target.value)}
                    placeholder="Опыт в HoReCa, наличие СРО, гарантия 12 мес..."
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Опубликовать тендер и получить КП
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
