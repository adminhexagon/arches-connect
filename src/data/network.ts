import type { DemoPerson } from '../types'

export const DEMO_NOTICE =
  'Demo graph — fictional people for this preview. Not a live network, and not a private marketplace.'

export const PEOPLE: DemoPerson[] = [
  {
    id: 'lena-voss',
    name: 'Lena Voss',
    role: 'VP Operations',
    company: 'Harborline Logistics',
    location: 'Chicago',
    kinds: ['customers'],
    priority: 12,
    whyNow: 'Harborline is replacing its billing stack after a March acquisition.',
    fitForYou: 'Lena owns the vendor decision, so a meeting has a point right now.',
    fitForThem: 'A warm intro is easier for her to take than a cold pitch during a live migration.',
    warmPath: {
      mutual: 'Sam Ortiz',
      relationship: 'A customer of yours who used to work with Lena',
      shared: 'Sam mentioned Harborline’s billing migration on your last check-in',
    },
    tags: ['logistics', 'billing', 'operations', 'mid-market'],
  },
  {
    id: 'maya-chen',
    name: 'Maya Chen',
    role: 'Partner',
    company: 'Northline Ventures',
    location: 'New York',
    kinds: ['raise'],
    priority: 10,
    whyNow: 'Northline is taking first meetings with seed-stage infrastructure companies this quarter.',
    fitForYou: 'Maya can open a partner-level conversation while that window is open.',
    fitForThem: 'She asked her team for operator-led infrastructure deals, which matches a raise like this.',
    warmPath: {
      mutual: 'Jordan Hale',
      relationship: 'Your former coworker, now a principal at Northline',
      shared: 'You and Jordan shipped a billing rewrite on the same team',
    },
    tags: ['seed', 'infrastructure', 'fintech', 'investor'],
  },
  {
    id: 'helen-cho',
    name: 'Helen Cho',
    role: 'Former chief product officer',
    company: 'Independent',
    location: 'San Francisco',
    kinds: ['advisors'],
    priority: 10,
    whyNow: 'Helen is taking two new advisory seats this half, both in B2B workflow.',
    fitForYou: 'She is a strong advisor when the need is product judgment, not generic mentorship.',
    fitForThem: 'She takes introductions that come with a specific question she can help with.',
    warmPath: {
      mutual: 'Priya Shah',
      relationship: 'An advisor already in your circle',
      shared: 'Priya and Helen shared a board seat at a previous company',
    },
    tags: ['advisor', 'product', 'b2b'],
  },
  {
    id: 'naomi-park',
    name: 'Naomi Park',
    role: 'Director of Partnerships',
    company: 'Lumen Grid',
    location: 'Seattle',
    kinds: ['partners'],
    priority: 10,
    whyNow: 'Lumen Grid is opening a partner program for workflow tools this month.',
    fitForYou: 'Naomi is the person who can say whether a joint offer is real.',
    fitForThem: 'She is collecting partners who already have a defined customer.',
    warmPath: {
      mutual: 'Alex Rahman',
      relationship: 'A mutual operator from your last company',
      shared: 'Alex and Naomi are building the partner program together',
    },
    tags: ['partnerships', 'channel', 'partner'],
  },
  {
    id: 'quinn-alvarez',
    name: 'Quinn Alvarez',
    role: 'Founder',
    company: 'Studio North',
    location: 'Brooklyn',
    kinds: ['provider'],
    priority: 10,
    whyNow: 'Studio North has a late-summer opening for one implementation partner.',
    fitForYou: 'Quinn’s studio can take specialist work if you need a provider, not a full-time hire.',
    fitForThem: 'The studio fills that opening through introductions, not cold RFPs.',
    warmPath: {
      mutual: 'Morgan Blake',
      relationship: 'Your former head of design',
      shared: 'Morgan contracts with Studio North and offered to make an introduction',
    },
    tags: ['agency', 'implementation', 'provider', 'design'],
  },
  {
    id: 'chris-adeyemi',
    name: 'Chris Adeyemi',
    role: 'Head of Revenue Operations',
    company: 'Fieldwork',
    location: 'Denver',
    kinds: ['customers'],
    priority: 8,
    whyNow: 'Fieldwork is consolidating renewal tooling before its fiscal year starts.',
    fitForYou: 'Chris feels the pain if what you sell touches billing or renewals.',
    fitForThem: 'He takes meetings that come through investors, not inbound sequences.',
    warmPath: {
      mutual: 'Nora Pell',
      relationship: 'An investor who knows you both',
      shared: 'Nora sits on a customer’s board and has worked with Chris',
    },
    tags: ['revops', 'billing', 'saas', 'renewals'],
  },
  {
    id: 'elena-brooks',
    name: 'Elena Brooks',
    role: 'Angel investor',
    company: 'Independent',
    location: 'Austin',
    kinds: ['raise', 'advisors'],
    priority: 7,
    whyNow: 'Elena is writing small angel checks into tools she can also advise.',
    fitForYou: 'Useful when you want capital plus an operator who has been a CFO.',
    fitForThem: 'She prefers founders who already have a concrete round or advisory ask.',
    warmPath: {
      mutual: 'Priya Shah',
      relationship: 'An advisor you both know',
      shared: 'Priya hosted the founder dinner where you and Elena overlapped',
    },
    tags: ['angel', 'advisor', 'finance', 'seed'],
  },
  {
    id: 'andre-silva',
    name: 'Andre Silva',
    role: 'Business development',
    company: 'Copperlane',
    location: 'Lisbon',
    kinds: ['partners'],
    priority: 6,
    whyNow: 'Copperlane wants a US distribution partner for an analytics add-on.',
    fitForYou: 'A possible channel if your buyers overlap with operations teams.',
    fitForThem: 'He needs a concrete joint customer, not a logo swap.',
    warmPath: {
      mutual: 'Riley Cho',
      relationship: 'A founder you advise',
      shared: 'Riley introduced Andre to two US teams last year',
    },
    tags: ['partnerships', 'analytics', 'channel'],
  },
  {
    id: 'jonah-blake',
    name: 'Jonah Blake',
    role: 'Director of Procurement',
    company: 'Fieldnote Freight',
    location: 'Newark',
    kinds: ['customers'],
    priority: 4,
    whyNow: 'There is only a rumor of an RFP, not a confirmed project.',
    fitForYou: 'Worth watching. Not worth an intro until the project is real.',
    fitForThem: 'A premature intro would spend a relationship on a weak ask.',
    warmPath: {
      mutual: 'Casey Nguyen',
      relationship: 'Someone you met once at a logistics meetup',
      shared: 'Casey forwarded a rumor about Fieldnote, not a confirmed need',
    },
    tags: ['logistics', 'procurement'],
  },
]

export function getPerson(id: string): DemoPerson | undefined {
  return PEOPLE.find((person) => person.id === id)
}

export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
}

const AVATAR_COLORS = ['#3d2a86', '#5b45e0', '#8a3f16', '#1f6b45', '#1e3a5f', '#7a3458']

export function avatarColor(id: string): string {
  let hash = 0
  for (const char of id) hash = (hash + char.charCodeAt(0)) % AVATAR_COLORS.length
  return AVATAR_COLORS[hash] ?? AVATAR_COLORS[0]
}
