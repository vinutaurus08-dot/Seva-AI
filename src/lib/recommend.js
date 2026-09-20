// Rule-based "AI" recommendation engine + chatbot answer lookup.
// No external API — everything is derived from the local scheme dataset.

import { SCHEMES } from '../data/schemes.js'
import { ASSISTANT_FAQS } from '../data/assistantFaqs.js'

// --- Eligibility scoring -------------------------------------------------

// Returns { eligible, score, reasons } for a single scheme against a profile.
function evaluate(scheme, profile) {
  const e = scheme.eligibility
  const reasons = []
  let matched = 0
  let total = 0

  // Occupation
  total++
  if (!e.occupations.length || e.occupations.includes(profile.occupation)) {
    matched++
    if (e.occupations.length) reasons.push('Matches your occupation')
  } else {
    return { eligible: false, score: 0, reasons: ['Occupation does not match'] }
  }

  // Category (SC/ST/OBC/...)
  total++
  if (!e.categories.length || e.categories.includes(profile.category)) {
    matched++
    if (e.categories.length) reasons.push(`Available for ${profile.category} category`)
  } else {
    return { eligible: false, score: 0, reasons: ['Reserved for other categories'] }
  }

  // Gender
  total++
  if (!e.genders.length || e.genders.includes(profile.gender)) {
    matched++
  } else {
    return { eligible: false, score: 0, reasons: ['Gender criteria not met'] }
  }

  // Income
  total++
  if (e.maxIncome == null || (profile.income ?? 0) <= e.maxIncome) {
    matched++
    if (e.maxIncome != null) reasons.push('Within the income limit')
  } else {
    return { eligible: false, score: 0, reasons: ['Income above the allowed limit'] }
  }

  // Age range
  total++
  const age = profile.age ?? 0
  const ageOk =
    (e.minAge == null || age >= e.minAge) && (e.maxAge == null || age <= e.maxAge)
  if (ageOk) {
    matched++
    if (e.minAge != null || e.maxAge != null) reasons.push('Within the age range')
  } else {
    return { eligible: false, score: 0, reasons: ['Age outside the allowed range'] }
  }

  // State
  total++
  if (!e.states.length || e.states.includes(profile.state)) {
    matched++
  } else {
    return { eligible: false, score: 0, reasons: ['Not available in your state'] }
  }

  // All hard criteria passed → compute a confidence-style score.
  // Base 70% + bonus for each specifically-targeted criterion the user matches,
  // so a tightly-targeted scheme the user fits shows a higher match.
  let score = 70
  if (e.occupations.length) score += 8
  if (e.categories.length && e.categories.includes(profile.category)) score += 8
  if (e.maxIncome != null) score += 6
  if (e.genders.length) score += 4
  if (e.minAge != null || e.maxAge != null) score += 4
  score = Math.min(99, score)

  return { eligible: true, score, reasons }
}

// Returns eligible schemes for a profile, each annotated with matchScore & reasons,
// sorted by score (desc).
export function getRecommendations(profile) {
  if (!profile) return []
  return SCHEMES.map((scheme) => {
    const r = evaluate(scheme, profile)
    return { ...scheme, matchScore: r.score, matchReasons: r.reasons, eligible: r.eligible }
  })
    .filter((s) => s.eligible)
    .sort((a, b) => b.matchScore - a.matchScore)
}

// Overall "recommendation score" shown on the dashboard card.
export function getProfileScore(profile, recommendations) {
  if (!recommendations || !recommendations.length) return 0
  const avg =
    recommendations.reduce((sum, s) => sum + s.matchScore, 0) / recommendations.length
  return Math.round(avg)
}

// Group recommendations by scheme type for the dashboard sections.
export function groupByType(recommendations) {
  const groups = {}
  for (const s of recommendations) {
    const key = s.type
    if (!groups[key]) groups[key] = []
    groups[key].push(s)
  }
  return groups
}

// Schemes with the nearest deadlines (for "Deadline Alerts").
export function getUpcomingDeadlines(recommendations, limit = 3) {
  return [...recommendations]
    .sort((a, b) => new Date(a.lastDate) - new Date(b.lastDate))
    .slice(0, limit)
}

const SCHEME_ALIASES = {
  ssp: 'post-matric-sc',
  'post matric scholarship': 'post-matric-sc',
  'post matric': 'post-matric-sc',
  'pm kisan': 'pm-kisan',
  pmkisan: 'pm-kisan',
  yasasvi: 'pm-yasasvi',
}

export function getSchemeById(id) {
  return SCHEMES.find((s) => s.id === id)
}

export function findSchemeByQuery(query) {
  if (!query) return null
  const text = query.toLowerCase()
  const aliasEntry = Object.entries(SCHEME_ALIASES).find(([key]) => text.includes(key))
  if (aliasEntry) {
    return getSchemeById(aliasEntry[1])
  }

  return SCHEMES.find((scheme) => {
    const normalized = `${scheme.name} ${scheme.type} ${scheme.provider}`.toLowerCase()
    const tokens = normalized.split(/[^a-z0-9]+/).filter(Boolean)
    return tokens.some((token) => text.includes(token))
  })
}

// --- Scheme chatbot ------------------------------------------------------

function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return d
  }
}

// Answer a free-text question about a specific scheme using its stored data.
export function answerSchemeQuestion(scheme, question) {
  if (!scheme) {
    return 'Please open a scheme first, then I can answer questions about it.'
  }
  const q = (question || '').toLowerCase()

  const has = (...words) => words.some((w) => q.includes(w))

  if (has('document', 'documents', 'papers', 'what do i need')) {
    return `📄 Documents required for ${scheme.name}:\n\n${scheme.documents
      .map((d) => `• ${d}`)
      .join('\n')}`
  }

  if (has('certificate', 'certificates')) {
    if (!scheme.certificates.length) return 'No special certificates are required for this scheme.'
    return `🪪 Required certificates:\n\n${scheme.certificates.map((c) => `• ${c}`).join('\n')}`
  }

  if (has('eligible', 'eligibility', 'qualify', 'can i apply', 'who can')) {
    const e = scheme.eligibility
    const parts = []
    if (e.occupations.length) parts.push(`Occupation: ${e.occupations.join(', ')}`)
    if (e.categories.length) parts.push(`Category: ${e.categories.join(', ')}`)
    if (e.genders.length) parts.push(`Gender: ${e.genders.join(', ')}`)
    if (e.maxIncome != null) parts.push(`Annual income up to ₹${e.maxIncome.toLocaleString('en-IN')}`)
    if (e.minAge != null || e.maxAge != null)
      parts.push(`Age: ${e.minAge ?? 'any'} – ${e.maxAge ?? 'any'} years`)
    if (e.states.length) parts.push(`States: ${e.states.join(', ')}`)
    return `✅ Eligibility for ${scheme.name}:\n\n${parts.map((p) => `• ${p}`).join('\n') || '• Open to all citizens'}`
  }

  if (has('how to apply', 'how do i apply', 'apply', 'process', 'steps', 'procedure')) {
    return `📝 How to apply for ${scheme.name}:\n\n${scheme.applicationSteps
      .map((s, i) => `${i + 1}. ${s}`)
      .join('\n')}\n\n🔗 Apply here: ${scheme.applyLink}`
  }

  if (has('last date', 'deadline', 'when', 'date')) {
    return `🗓️ The last date to apply for ${scheme.name} is ${fmtDate(scheme.lastDate)}.`
  }

  if (has('website', 'official', 'site', 'portal')) {
    return `🌐 Official website: ${scheme.officialWebsite}\n🔗 Application link: ${scheme.applyLink}`
  }

  if (has('where', 'link', 'apply online')) {
    return `🔗 You can apply online here: ${scheme.applyLink}`
  }

  if (has('benefit', 'benefits', 'amount', 'money', 'get')) {
    return `🎁 Benefits of ${scheme.name}:\n\n${scheme.benefits.map((b) => `• ${b}`).join('\n')}`
  }

  if (has('contact', 'helpline', 'phone', 'email', 'support')) {
    return `☎️ Contact / Helpline: ${scheme.contact}`
  }

  if (has('mistake', 'mistakes', 'avoid', 'careful')) {
    return `⚠️ Common mistakes to avoid:\n\n${scheme.commonMistakes
      .map((m) => `• ${m}`)
      .join('\n')}`
  }

  // Check stored FAQs
  for (const f of scheme.faqs) {
    const fq = f.q.toLowerCase()
    const overlap = fq.split(' ').filter((w) => w.length > 3 && q.includes(w))
    if (overlap.length >= 1) return `❓ ${f.q}\n\n${f.a}`
  }

  // Fallback summary
  return (
    `Here's what I have on ${scheme.name}:\n\n` +
    `${scheme.description}\n\n` +
    `• Benefits: ${scheme.benefits[0]}\n` +
    `• Last date: ${fmtDate(scheme.lastDate)}\n` +
    `• Apply: ${scheme.applyLink}\n\n` +
    `You can ask me about documents, eligibility, how to apply, the last date, or the official website.`
  )
}

export const SCHEME_SUGGESTIONS = [
  'What documents are required?',
  'Am I eligible?',
  'How do I apply?',
  'What is the last date?',
  'What is the official website?',
]

// --- App assistant -------------------------------------------------------

export function answerAssistantQuestion(question) {
  const q = (question || '').toLowerCase()
  let best = null
  let bestScore = 0
  for (const f of ASSISTANT_FAQS) {
    const score = f.keywords.reduce((n, k) => (q.includes(k) ? n + 1 : n), 0)
    if (score > bestScore) {
      bestScore = score
      best = f
    }
  }
  if (best && bestScore > 0) return best.a
  return "I'm your SevaAI in-app guide. You can ask me how to create or update your profile, how the recommendation system works, how to apply for schemes, upload documents, search schemes, change the language, or track your applications."
}
