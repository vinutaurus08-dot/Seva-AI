// Full occupation / citizen categories eligible for welfare schemes,
// each with relevant sub-categories. Per SevaAI requirements.

export const OCCUPATIONS = [
  {
    id: 'student',
    label: 'Student',
    sub: [
      'School Student',
      'PU Student',
      'Diploma',
      'Undergraduate',
      'Postgraduate',
      'PhD',
      'Competitive Exam Aspirant',
    ],
  },
  {
    id: 'farmer',
    label: 'Farmer',
    sub: [
      'Small Farmer',
      'Marginal Farmer',
      'Organic Farmer',
      'Dairy Farmer',
      'Sericulture',
      'Horticulture',
      'Fisheries',
      'Poultry',
    ],
  },
  {
    id: 'women',
    label: 'Women',
    sub: [
      'Pregnant Women',
      'Widow',
      'Single Woman',
      'Working Woman',
      'Self Help Group (SHG) Member',
    ],
  },
  {
    id: 'senior_citizen',
    label: 'Senior Citizen',
    sub: ['Pensioner', 'Retired Government Employee', 'Retired Private Employee'],
  },
  {
    id: 'homemaker',
    label: 'Homemaker',
    sub: ['Housewife', 'SHG Member', 'Home-based Worker'],
  },
  {
    id: 'self_employed',
    label: 'Self-Employed',
    sub: ['Shop Owner', 'Freelancer', 'Artisan', 'Vendor', 'Service Provider'],
  },
  {
    id: 'employee',
    label: 'Employee',
    sub: ['Government Employee', 'Private Employee', 'Contract Worker', 'Daily Wage Worker'],
  },
  {
    id: 'unemployed',
    label: 'Unemployed',
    sub: ['Fresh Graduate', 'Job Seeker', 'Skill Trainee', 'Long-term Unemployed'],
  },
  {
    id: 'disability',
    label: 'Person with Disability',
    sub: ['Physical Disability', 'Visual Impairment', 'Hearing Impairment', 'Intellectual Disability', 'Multiple Disabilities'],
  },
  {
    id: 'entrepreneur',
    label: 'Entrepreneur',
    sub: ['Startup Founder', 'MSME Owner', 'Innovator', 'Women Entrepreneur'],
  },
  {
    id: 'business_owner',
    label: 'Business Owner',
    sub: ['Micro Enterprise', 'Small Enterprise', 'Medium Enterprise', 'Trader'],
  },
  {
    id: 'other',
    label: 'Other',
    sub: ['General Citizen', 'Other'],
  },
]

export const CATEGORIES = ['General', 'SC', 'ST', 'OBC', 'Minority']

export const STATES = [
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Telangana',
  'Andhra Pradesh',
  'Kerala',
  'Uttar Pradesh',
  'Delhi',
]

export const INCOME_RANGES = [
  { label: 'Below ₹1,00,000', value: 100000 },
  { label: '₹1,00,000 - ₹2,50,000', value: 250000 },
  { label: '₹2,50,000 - ₹5,00,000', value: 500000 },
  { label: '₹5,00,000 - ₹8,00,000', value: 800000 },
  { label: 'Above ₹8,00,000', value: 1500000 },
]

export const EDUCATION_LEVELS = [
  'Below 10th',
  '10th Pass',
  '12th Pass',
  'Diploma',
  'Undergraduate',
  'Postgraduate',
  'PhD',
]
