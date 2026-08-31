export type CISCity = 
  | 'Москва'
  | 'Санкт-Петербург'
  | 'Алматы'
  | 'Астана'
  | 'Минск'
  | 'Казань'
  | 'Новосибирск'
  | 'Екатеринбург'
  | 'Ташкент'
  | 'Нижний Новгород';

export type Currency = 'RUB' | 'KZT' | 'BYN' | 'USD';

export type ModuleTab = 'scout' | 'matcher' | 'finance' | 'marketplace' | 'flywheel';

export type NicheCategory =
  | 'Общепит & Кофе'
  | 'Услуги & Бьюти'
  | 'Ритейл & ПВЗ'
  | 'Авто & Сервис'
  | 'Образование & Дети'
  | 'Спорт & Здоровье';

export interface NicheData {
  id: string;
  name: string;
  category: NicheCategory;
  icon: string;
  survivalScore: number; // 0-100
  avgPaybackMonths: number;
  initialCapexMin: number;
  initialCapexMax: number;
  avgMonthlyNetProfit: number;
  avgMarginPercent: number;
  demandTrend: 'rising' | 'stable' | 'competitive';
  popularityGrowth: number; // e.g. +18%
  competitionDensity: 'low' | 'medium' | 'high' | 'saturated';
  keySuccessFactors: string[];
  mainPitfalls: string[];
  recommendedFormats: string[];
  seasonalityMonths: { month: string; index: number }[]; // 100 is baseline
  searchWordstatMonthly: number;
  openingsToClosuresRatio: number; // e.g. 1.8 (180 opened vs 100 closed)
}

export interface DistrictGeoData {
  id: string;
  city: CISCity;
  name: string;
  subwayStation?: string;
  officeWorkerDensity: number; // within 500m
  pedestrianTrafficPerHour: number;
  residentPopulation: number;
  avgHouseholdIncome: number;
  avgRentRatePerSqM: number;
  competitionScore: number; // 1-100 (100 is oversaturated)
  footfallQualityScore: number; // 1-100
  bestNiches: string[];
  recommendedMaxRent: number;
  availableCommercialSpacesCount: number;
  coordinates: { x: number; y: number }; // Relative map % position
}

export interface FranchiseItem {
  id: string;
  brandName: string;
  niche: string;
  logo: string;
  survivalScore: number; // 0-100
  totalInvestment: number;
  lumpSumFee: number; // паушальный взнос
  royaltyPercent: number;
  paybackMonths: number;
  openedPointsCount: number;
  closedPointsLastYearPercent: number;
  bankLoanReady: boolean;
  minAreaSqM: number;
  verifiedByBizOS: boolean;
  description: string;
  supportPackage: string[];
}

export interface FinancialModelInputs {
  nicheName: string;
  city: CISCity;
  areaSqM: number;
  avgCheck: number;
  dailyCustomers: number;
  openingHoursPerDay: number;
  staffCount: number;
  avgSalaryPerEmployee: number;
  monthlyRent: number;
  utilityCosts: number;
  foodCostOrCogsPercent: number;
  monthlyMarketing: number;
  otherOpex: number;
  initialCapex: number;
  taxRegime: 'USN_6' | 'USN_15' | 'PATENT' | 'NPD';
  loanAmountRequested: number;
  loanTermMonths: number;
  loanInterestRate: number;
}

export interface B2BContractor {
  id: string;
  name: string;
  category: 'Ремонт и дизайн' | 'Регистрация & Юристы' | 'Кассы & ПО' | 'Поставщики сырья' | 'Маркетинг & Гео';
  rating: number;
  completedDeals: number;
  verifiedBadge: boolean;
  avgPriceLevel: 'Эконом' | 'Оптимум' | 'Премиум';
  typicalTurnaroundDays: number;
  specialOffer: string;
  logo: string;
  contactPerson: string;
}

export interface B2BTender {
  id: string;
  title: string;
  category: string;
  city: CISCity;
  budgetMax: number;
  deadlineDays: number;
  bidsCount: number;
  status: 'active' | 'in_review' | 'awarded';
  authorNiche: string;
  createdAt: string;
  requirements: string[];
}

export interface BankPartner {
  id: string;
  name: string;
  logo: string;
  rating: number;
  maxStartupCredit: number;
  baseInterestRate: number;
  subsidizedRate: number;
  approvalSpeedHours: number;
  cpaCommissionPercent: number; // to BizOS
  specialBenefits: string[];
}
