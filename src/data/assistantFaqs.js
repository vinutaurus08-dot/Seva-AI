// Canned answers for the in-app AI Assistant (different from the scheme chatbot).
// Each entry has keywords used for simple matching and a written answer.

export const ASSISTANT_FAQS = [
  {
    keywords: ['create', 'profile', 'make', 'setup', 'set up'],
    q: 'How do I create my profile?',
    a: 'Go through the 4 simple steps after login: 1) Personal Details, 2) Education Details, 3) Occupation Details, and 4) Additional Details. Tap "Save & Continue" on the last step and SevaAI will analyse your details and show schemes you are eligible for.',
  },
  {
    keywords: ['recommend', 'recommendation', 'work', 'how does', 'engine', 'match'],
    q: 'How does the recommendation system work?',
    a: 'SevaAI analyses your profile — age, gender, education, occupation, annual income, category, state and disability status. It then matches these against the eligibility criteria of every scheme and shows only the ones you qualify for, with a match score so you know the best fits.',
  },
  {
    keywords: ['update', 'edit', 'change profile', 'modify'],
    q: 'How do I update my profile?',
    a: 'Open the Profile tab from the bottom navigation. You can switch demo profiles there, or re-run the profile steps to change your details. Recommendations refresh automatically when your profile changes.',
  },
  {
    keywords: ['not eligible', 'why', "can't", 'cannot', 'ineligible', 'rejected'],
    q: 'Why am I not eligible for a scheme?',
    a: 'A scheme may not appear if your income is above its limit, your occupation or category does not match, or your age is outside the allowed range. Open the scheme details to see its full eligibility criteria and compare with your profile.',
  },
  {
    keywords: ['upload', 'document', 'documents', 'attach'],
    q: 'How do I upload documents?',
    a: 'On a scheme details page, open the "Documents" tab to see exactly what is required. In this demo, document upload is shown for reference — in the full app you would attach scans of each listed document before applying.',
  },
  {
    keywords: ['search', 'find', 'browse', 'all schemes'],
    q: 'How do I search for schemes?',
    a: 'Tap the "Schemes" tab in the bottom navigation to see all recommended schemes. Use the filter chips (Scholarships, Government, Foundation, NGO) to narrow the list.',
  },
  {
    keywords: ['chatbot', 'chat', 'ask', 'scheme info'],
    q: 'How do I use the AI Chatbot?',
    a: 'Open any scheme and tap "Ask AI about this scheme". The chatbot answers questions like required documents, eligibility, how to apply, last date and official website — using the information stored for that scheme.',
  },
  {
    keywords: ['language', 'kannada', 'hindi', 'english'],
    q: 'How do I change the language?',
    a: 'Language is chosen on the Language Selection screen during onboarding (English, ಕನ್ನಡ, हिंदी). You can revisit it anytime from the start of the app.',
  },
  {
    keywords: ['support', 'contact', 'help', 'helpline'],
    q: 'How do I contact support?',
    a: 'Each scheme lists its own helpline and email on the details page. For app help, use this AI Assistant — it can guide you through any feature of SevaAI.',
  },
  {
    keywords: ['track', 'application', 'status', 'applied'],
    q: 'How do I track my applications?',
    a: 'Use the "Applications" section from the bottom navigation. It lists the schemes you have applied to and their status. In this demo the list is illustrative.',
  },
]

export const ASSISTANT_SUGGESTIONS = [
  'How do I create my profile?',
  'How does the recommendation system work?',
  'How do I update my profile?',
  'Why am I not eligible for a scheme?',
  'How do I track my applications?',
]
