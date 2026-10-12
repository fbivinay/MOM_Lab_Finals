import { BRAND_URLS } from '../components/brands'
import type { SlideDef } from '../presentation/deck'
import { AimlBasket, AimlClosing, AimlForecast, AimlIntro, AimlRecommend, AimlReportVsPredict } from './aiml'
import { CareersAdvanced, CareersAnalytics, CareersBigData, CareersBusiness, CareersClosing, CareersFoundation, CareersIntro } from './careers'
import { Cover } from './cover'
import { DataClosing, DataDigital, DataJourney, DataPricing } from './data'
import { IndustryCollab, IndustryML, IndustryProblems, IndustryProject, IndustryTarget } from './industry'
import { JobsBoard, JobsSites } from './jobs'
import { RoleAnalyst, RoleBA, RoleEngineer, RoleMLE, RoleScientist, RolesClosing, RolesIntro, RolesJourney } from './roles'

export { sections } from './sections'

/** The deck, in order. Content lives in the section files; this list only sequences it. */
export const slides: SlideDef[] = [
  { id: 'cover', title: 'Retail Analytics', transition: 'fade', Component: Cover },

  { id: 'roles-intro', section: 'roles', title: 'From data to decision', transition: 'curtain', Component: RolesIntro },
  { id: 'roles-journey', section: 'roles', title: 'Five roles, one journey', transition: 'zoom', Component: RolesJourney },
  { id: 'roles-engineer', section: 'roles', title: 'Data Engineer', transition: 'rise', Component: RoleEngineer },
  { id: 'roles-analyst', section: 'roles', title: 'Retail Analyst', transition: 'fade', Component: RoleAnalyst },
  { id: 'roles-scientist', section: 'roles', title: 'Data Scientist', transition: 'fade', steps: ['Features', 'Model', 'Prediction'], Component: RoleScientist },
  { id: 'roles-mle', section: 'roles', title: 'ML Engineer', transition: 'fade', Component: RoleMLE },
  { id: 'roles-ba', section: 'roles', title: 'Business Analyst', transition: 'fade', steps: ['Churn risk rises', 'Competitor price falls'], Component: RoleBA },
  { id: 'roles-closing', section: 'roles', title: 'Data to decision', transition: 'iris', Component: RolesClosing },

  { id: 'data-journey', section: 'data', title: 'The customer journey', transition: 'curtain', steps: ['View', 'Compare', 'Add to cart', 'Abandon', 'Return', 'Purchase', 'Review'], Component: DataJourney },
  { id: 'data-digital', section: 'data', title: 'Digital behaviour', transition: 'push', Component: DataDigital },
  { id: 'data-pricing', section: 'data', title: 'Pricing & external signals', transition: 'rise', steps: ['Signals outside the store'], Component: DataPricing },
  { id: 'data-closing', section: 'data', title: 'Connect the signals', transition: 'iris', Component: DataClosing },

  { id: 'aiml-intro', section: 'aiml', title: 'What happens next?', transition: 'curtain', steps: ['Machine learning asks…'], Component: AimlIntro },
  { id: 'aiml-predict', section: 'aiml', title: 'Reporting vs prediction', transition: 'zoom', steps: ['What happens next?'], Component: AimlReportVsPredict },
  { id: 'aiml-forecast', section: 'aiml', title: 'Demand forecasting', transition: 'rise', Component: AimlForecast },
  { id: 'aiml-recommend', section: 'aiml', title: 'Recommendation systems', transition: 'push', steps: ['Content-based filtering', 'Hybrid models'], Component: AimlRecommend },
  { id: 'aiml-basket', section: 'aiml', title: 'Market basket analysis', transition: 'rise', steps: ['Where it is used'], Component: AimlBasket },
  { id: 'aiml-closing', section: 'aiml', title: 'Prepare for the future', transition: 'iris', Component: AimlClosing },

  { id: 'industry-target', section: 'industry', title: 'Target Corporation', transition: 'curtain', Component: IndustryTarget },
  { id: 'industry-problems', section: 'industry', title: 'Business problems and metrics', transition: 'rise', Component: IndustryProblems },
  { id: 'industry-project', section: 'industry', title: 'Essential Beauty: analytics project', transition: 'push', Component: IndustryProject },
  { id: 'industry-collab', section: 'industry', title: 'Collaboration and tools', transition: 'push', Component: IndustryCollab },
  { id: 'industry-ml', section: 'industry', title: 'Machine learning and challenges', transition: 'rise', Component: IndustryML },

  { id: 'careers-intro', section: 'careers', title: 'What should we learn?', transition: 'curtain', steps: ['The question for us'], Component: CareersIntro },
  { id: 'careers-foundation', section: 'careers', title: 'Fundamentals', transition: 'rise', Component: CareersFoundation },
  { id: 'careers-analytics', section: 'careers', title: 'Analytics', transition: 'rise', Component: CareersAnalytics },
  { id: 'careers-advanced', section: 'careers', title: 'Learn to predict', transition: 'rise', Component: CareersAdvanced },
  { id: 'careers-bigdata', section: 'careers', title: 'Build for scale', transition: 'rise', Component: CareersBigData },
  { id: 'careers-business', section: 'careers', title: 'Understand the business', transition: 'rise', steps: ['Why are sales falling?', 'How much inventory?', 'Which customers might leave?', 'What should we recommend?'], Component: CareersBusiness },
  { id: 'careers-closing', section: 'careers', title: 'Connect data to decisions', transition: 'iris', Component: CareersClosing },

  { id: 'jobs-board', section: 'jobs', title: 'Retail analyst jobs', transition: 'curtain', Component: JobsBoard },
  { id: 'jobs-sites', section: 'jobs', title: 'Where else to look', transition: 'push', Component: JobsSites },
]

export const preload = [
  ...BRAND_URLS,
  ...['shoe-runner', 'shoe-airmax', 'shoe-red', 'socks', 'tee', 'watch', 'bottle', 'sale', 'target-store'].map((n) => `/images/${n}.webp`),
]
