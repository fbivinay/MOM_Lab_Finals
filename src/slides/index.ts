import { BRAND_URLS } from '../components/brands'
import type { SlideDef } from '../presentation/deck'
import { AimlBasket, AimlClosing, AimlForecast, AimlIntro, AimlRecommend, AimlReportVsPredict } from './aiml'
import { CareersAdvanced, CareersAnalytics, CareersBigData, CareersBusiness, CareersClosing, CareersFoundation, CareersIntro } from './careers'
import { Cover, ThankYou } from './cover'
import { IndustryClosing, IndustryCompare, IndustryEcom, IndustryIntro, IndustryQuick, IndustryStore } from './industry'
import { DataClosing, DataDigital, DataIntro, DataInventory, DataJourney, DataPricing, DataRain, DataTransaction } from './data'
import { RoleAnalyst, RoleBA, RoleEngineer, RoleMLE, RoleScientist, RolesClosing, RolesIntro, RolesJourney } from './roles'

export { sections } from './sections'

/** The deck, in order. Content lives in the section files; this list only sequences it. */
export const slides: SlideDef[] = [
  { id: 'cover', title: 'Retail Analytics', theme: 'dark', transition: 'fade', Component: Cover },

  { id: 'roles-intro', section: 'roles', title: 'From data to decision', theme: 'dark', transition: 'curtain', steps: ['But in reality…'], Component: RolesIntro },
  { id: 'roles-journey', section: 'roles', title: 'Five roles, one journey', transition: 'zoom', Component: RolesJourney },
  { id: 'roles-engineer', section: 'roles', title: 'Data Engineer', transition: 'rise', Component: RoleEngineer },
  { id: 'roles-analyst', section: 'roles', title: 'Retail Analyst', transition: 'fade', steps: ['Why did it happen?'], Component: RoleAnalyst },
  { id: 'roles-scientist', section: 'roles', title: 'Data Scientist', transition: 'fade', steps: ['Features', 'Model', 'Prediction'], Component: RoleScientist },
  { id: 'roles-mle', section: 'roles', title: 'ML Engineer', transition: 'fade', Component: RoleMLE },
  { id: 'roles-ba', section: 'roles', title: 'Business Analyst', transition: 'fade', steps: ['Churn risk rises', 'Competitor price falls'], Component: RoleBA },
  { id: 'roles-closing', section: 'roles', title: 'Data to decision', theme: 'dark', transition: 'iris', Component: RolesClosing },

  { id: 'data-intro', section: 'data', title: 'Data that never stops', theme: 'dark', transition: 'curtain', steps: ['But a modern retailer…'], Component: DataIntro },
  { id: 'data-journey', section: 'data', title: 'The customer journey', transition: 'zoom', steps: ['View', 'Compare', 'Add to cart', 'Abandon', 'Return', 'Purchase', 'Review'], Component: DataJourney },
  { id: 'data-transaction', section: 'data', title: 'Transaction & customer data', transition: 'push', Component: DataTransaction },
  { id: 'data-digital', section: 'data', title: 'Digital behaviour', transition: 'push', Component: DataDigital },
  { id: 'data-inventory', section: 'data', title: 'Inventory & supply chain', transition: 'push', Component: DataInventory },
  { id: 'data-pricing', section: 'data', title: 'Pricing & external signals', transition: 'rise', steps: ['Signals outside the store'], Component: DataPricing },
  { id: 'data-rain', section: 'data', title: 'Rain and umbrellas', transition: 'wipe', steps: ['Searches increase', 'Sales increase', 'Move the stock'], Component: DataRain },
  { id: 'data-closing', section: 'data', title: 'Connect the signals', theme: 'dark', transition: 'iris', Component: DataClosing },

  { id: 'aiml-intro', section: 'aiml', title: 'What happens next?', theme: 'dark', transition: 'curtain', steps: ['Machine learning asks…'], Component: AimlIntro },
  { id: 'aiml-predict', section: 'aiml', title: 'Reporting vs prediction', transition: 'zoom', steps: ['What happens next?'], Component: AimlReportVsPredict },
  { id: 'aiml-forecast', section: 'aiml', title: 'Demand forecasting', transition: 'rise', Component: AimlForecast },
  { id: 'aiml-recommend', section: 'aiml', title: 'Recommendation systems', transition: 'push', steps: ['Content-based filtering', 'Hybrid models'], Component: AimlRecommend },
  { id: 'aiml-basket', section: 'aiml', title: 'Market basket analysis', transition: 'rise', steps: ['Where it is used'], Component: AimlBasket },
  { id: 'aiml-closing', section: 'aiml', title: 'Prepare for the future', theme: 'dark', transition: 'iris', Component: AimlClosing },

  { id: 'industry-intro', section: 'industry', title: 'Different problems', theme: 'dark', transition: 'curtain', steps: ['But they solve…'], Component: IndustryIntro },
  { id: 'industry-ecom', section: 'industry', title: 'E-commerce', transition: 'wipe', steps: ['The recommendation', 'Fulfilment'], Component: IndustryEcom },
  { id: 'industry-store', section: 'industry', title: 'Physical retail', transition: 'wipe', steps: ['Stockout', 'Replenishment'], Component: IndustryStore },
  { id: 'industry-quick', section: 'industry', title: 'Quick commerce', theme: 'dark', transition: 'wipe', steps: ['Heavy rain', 'Behaviour changes', 'Demand rises', 'Stock falls', 'Operations respond'], Component: IndustryQuick },
  { id: 'industry-compare', section: 'industry', title: 'Side by side', transition: 'zoom', Component: IndustryCompare },
  { id: 'industry-closing', section: 'industry', title: 'Real-time problem', theme: 'dark', transition: 'iris', Component: IndustryClosing },

  { id: 'careers-intro', section: 'careers', title: 'What should we learn?', theme: 'dark', transition: 'curtain', steps: ['The question for us'], Component: CareersIntro },
  { id: 'careers-foundation', section: 'careers', title: 'Fundamentals', transition: 'rise', Component: CareersFoundation },
  { id: 'careers-analytics', section: 'careers', title: 'Analytics', transition: 'rise', Component: CareersAnalytics },
  { id: 'careers-advanced', section: 'careers', title: 'Learn to predict', transition: 'rise', Component: CareersAdvanced },
  { id: 'careers-bigdata', section: 'careers', title: 'Build for scale', transition: 'rise', Component: CareersBigData },
  { id: 'careers-business', section: 'careers', title: 'Understand the business', transition: 'rise', steps: ['Why are sales falling?', 'How much inventory?', 'Which customers might leave?', 'What should we recommend?'], Component: CareersBusiness },
  { id: 'careers-closing', section: 'careers', title: 'Connect data to decisions', theme: 'dark', transition: 'iris', Component: CareersClosing },

  { id: 'thanks', section: 'careers', title: 'Thank you', theme: 'dark', transition: 'zoom', Component: ThankYou },
]

export const preload = [
  ...BRAND_URLS,
  ...['shoe-runner', 'shoe-airmax', 'shoe-red', 'shoe-neon', 'socks', 'tee', 'watch', 'bottle', 'headphones', 'fulfilment', 'store-aisle', 'sale'].map((n) => `/images/${n}.webp`),
]
