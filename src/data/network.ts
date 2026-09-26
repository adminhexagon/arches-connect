import type { DemoPerson } from '../types'

export const DEMO_NOTICE =
  'Demo graph — fictional people for this preview. Not a live network, and not a private marketplace.'

export const PEOPLE: DemoPerson[] = [
  {
    id: 'maya-chen',
    name: 'Maya Chen',
    role: 'Partner',
    company: 'Northline Ventures',
    location: 'New York',
    kinds: ['investors'],
    priority: 24,
    whyNow: 'Northline is taking first meetings with seed-stage infrastructure companies this quarter.',
    fitForYou: 'Maya can open a partner-level conversation while that seed window is open.',
    fitForThem: 'She asked the firm for operator-led infrastructure deals, which is the shape of this raise.',
    warmPath: {
      mutual: 'Jordan Hale',
      relationship: 'Your former coworker, now a principal at Northline',
      shared: 'You and Jordan shipped a billing rewrite on the same team',
    },
    tags: ['seed', 'infrastructure', 'fintech', 'venture', 'new york'],
    investment: {
      stage: 'Seed',
      checkSize: '$1–3M',
      thesis: 'Operator-led infrastructure and fintech',
      geography: 'United States, East Coast',
    },
  },
  {
    id: 'elias-okonkwo',
    name: 'Elias Okonkwo',
    role: 'General Partner',
    company: 'Harbor & Field',
    location: 'London',
    kinds: ['investors'],
    priority: 18,
    whyNow: 'Harbor & Field is building a seed-to-Series A book in B2B software and is booking partner meetings this month.',
    fitForYou: 'Elias leads those meetings when the company already has a sharp buyer, not just a deck.',
    fitForThem: 'A warm intro is how he prefers to meet founders outside his existing London circle.',
    warmPath: {
      mutual: 'Priya Shah',
      relationship: 'An angel you both know',
      shared: 'Priya co-invested with Elias and introduced you at a founder dinner last year',
    },
    tags: ['b2b', 'london', 'venture', 'workflow'],
    investment: {
      stage: 'Seed to Series A',
      checkSize: '$2–6M',
      thesis: 'B2B workflow and vertical software',
      geography: 'United Kingdom and United States',
    },
  },
  {
    id: 'amira-das',
    name: 'Amira Das',
    role: 'Venture Partner',
    company: 'Sable Peak',
    location: 'Chicago',
    kinds: ['investors'],
    priority: 14,
    whyNow: 'Sable Peak is reserving two seed slots this half for industrial and climate software.',
    fitForYou: 'Amira sponsors the first meeting when the company sells into operators, not consumers.',
    fitForThem: 'She is collecting founder intros from operators she already trusts.',
    warmPath: {
      mutual: 'Morgan Blake',
      relationship: 'A founder you advise',
      shared: 'Morgan co-invested with Amira last year and offered to make an introduction',
    },
    tags: ['climate', 'industrial', 'midwest', 'chicago'],
    investment: {
      stage: 'Seed',
      checkSize: '$500k–$1.5M',
      thesis: 'Climate and industrial software',
      geography: 'Midwest United States',
    },
  },
  {
    id: 'elena-brooks',
    name: 'Elena Brooks',
    role: 'Angel investor',
    company: 'Independent',
    location: 'Austin',
    kinds: ['investors'],
    priority: 11,
    whyNow: 'Elena is writing a small number of angel checks into tools she can also help operate.',
    fitForYou: 'Useful when you want a check plus an operator, not a lead investor.',
    fitForThem: 'She only takes introductions that already name the round and the help she would give.',
    warmPath: {
      mutual: 'Priya Shah',
      relationship: 'An angel you both know',
      shared: 'Priya hosted the dinner where you and Elena overlapped',
    },
    tags: ['angel', 'austin', 'pre-seed'],
    investment: {
      stage: 'Pre-seed and seed',
      checkSize: '$50–150k',
      thesis: 'Tools she can also advise',
      geography: 'United States',
    },
  },
  {
    id: 'rafael-santos',
    name: 'Rafael Santos',
    role: 'Principal',
    company: 'Kindling Capital',
    location: 'San Francisco',
    kinds: ['investors'],
    priority: 7,
    whyNow: 'Kindling is active, but the check is a Series A size and the path to Rafael is thin.',
    fitForYou: 'Worth watching if the round moves later. Not enough of a reason to ask for an intro yet.',
    fitForThem: 'A premature intro would spend a weak relationship on a mismatched stage.',
    warmPath: {
      mutual: 'Casey Nguyen',
      relationship: 'Someone you met once at a founder dinner',
      shared: 'Casey forwarded a note that Kindling is looking, not a real introduction',
    },
    tags: ['series a', 'ai', 'san francisco'],
    investment: {
      stage: 'Series A',
      checkSize: '$8–15M',
      thesis: 'Applied AI in operations',
      geography: 'West Coast United States',
    },
  },
  {
    id: 'lena-voss',
    name: 'Lena Voss',
    role: 'VP Operations',
    company: 'Harborline Logistics',
    location: 'Chicago',
    kinds: ['leads'],
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
    id: 'chris-adeyemi',
    name: 'Chris Adeyemi',
    role: 'Head of Revenue Operations',
    company: 'Fieldwork',
    location: 'Denver',
    kinds: ['leads'],
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
    id: 'jonah-blake',
    name: 'Jonah Blake',
    role: 'Director of Procurement',
    company: 'Fieldnote Freight',
    location: 'Newark',
    kinds: ['leads'],
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
  {
    id: 'naomi-park',
    name: 'Naomi Park',
    role: 'Director of Partnerships',
    company: 'Lumen Grid',
    location: 'Seattle',
    kinds: ['resellers'],
    priority: 16,
    whyNow: 'Lumen Grid is opening a reseller program for workflow tools this month.',
    fitForYou: 'Naomi decides which products the program will actually carry.',
    fitForThem: 'She wants partners who already have a defined buyer, not a concept.',
    warmPath: {
      mutual: 'Alex Rahman',
      relationship: 'A mutual operator from your last company',
      shared: 'Alex and Naomi are building the reseller program together',
    },
    tags: ['reseller', 'channel', 'partnerships', 'seattle'],
  },
  {
    id: 'andre-silva',
    name: 'Andre Silva',
    role: 'Business development',
    company: 'Copperlane',
    location: 'Lisbon',
    kinds: ['resellers'],
    priority: 9,
    whyNow: 'Copperlane wants a US reseller for an analytics add-on its buyers already ask about.',
    fitForYou: 'A possible channel if your buyers overlap with operations teams.',
    fitForThem: 'He needs a concrete joint customer, not a logo swap.',
    warmPath: {
      mutual: 'Riley Cho',
      relationship: 'A founder you advise',
      shared: 'Riley introduced Andre to two US teams last year',
    },
    tags: ['reseller', 'analytics', 'channel'],
  },
  {
    id: 'tomoko-abe',
    name: 'Tomoko Abe',
    role: 'Channel manager',
    company: 'Northwharf',
    location: 'Toronto',
    kinds: ['resellers'],
    priority: 5,
    whyNow: 'Northwharf mentioned a partner motion, but there is no open program yet.',
    fitForYou: 'Worth research. Not enough of a program to justify an intro.',
    fitForThem: 'An early ask would land before she has anything to offer a reseller.',
    warmPath: {
      mutual: 'Riley Cho',
      relationship: 'A founder you advise',
      shared: 'Riley met Tomoko at a partner summit and has not worked with her since',
    },
    tags: ['channel', 'toronto'],
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
