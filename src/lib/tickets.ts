// Shared support-ticket store used by both the Customer Care dashboard and the
// company (hiring) dashboard. Backed by localStorage so both sides stay in sync.

export interface TicketMessage {
  id: string;
  from: "customer" | "agent" | "admin";
  author: string;
  text: string;
  at: string; // ISO timestamp
}

export type TicketStatus = "open" | "closed";
export type TicketPriority = "low" | "normal" | "high";

export interface Ticket {
  id: string;
  ref: string;
  subject: string;
  category: string;
  name: string;
  company: string;
  email: string;
  avatar: string;
  status: TicketStatus;
  priority: TicketPriority;
  operator: string | null;
  createdAt: string;
  updatedAt: string;
  unreadForAgent: number;
  unreadForCustomer: number;
  messages: TicketMessage[];
}

export const TICKET_CATEGORIES = [
  "Billing & Payments",
  "Job Posting",
  "Credits & Promotions",
  "NIN Verification",
  "Account & Access",
  "Bug Report",
  "Other",
];

const KEY = "hiravel_tickets_v1";
const EVENT = "hiravel-tickets-changed";

const iso = (minsAgo: number) => new Date(Date.now() - minsAgo * 60000).toISOString();

const seed: Ticket[] = [
  {
    id: "t1", ref: "HV-1042", subject: "Cannot post a job — payment fails",
    category: "Billing & Payments", name: "Adaeze Okafor", company: "Acme Corp",
    email: "adaeze@acme.io", avatar: "AO", status: "open", priority: "high",
    operator: "Ijeoma Bello", createdAt: iso(180), updatedAt: iso(12),
    unreadForAgent: 2, unreadForCustomer: 0,
    messages: [
      { id: "m1", from: "customer", author: "Adaeze Okafor", text: "Hi, I tried to post a job but my card keeps getting declined. Please help.", at: iso(180) },
      { id: "m2", from: "agent", author: "Ijeoma Bello", text: "Hello Adaeze, sorry about that. Can you share the last 4 digits of the card you used?", at: iso(150) },
      { id: "m3", from: "customer", author: "Adaeze Okafor", text: "**** 4421. I've tried 3 different cards already.", at: iso(12) },
    ],
  },
  {
    id: "t2", ref: "HV-1043", subject: "How do credits work?",
    category: "Credits & Promotions", name: "Tunde Bakare", company: "Lagos Talent Co.",
    email: "tunde@lagostalent.ng", avatar: "TB", status: "open", priority: "normal",
    operator: null, createdAt: iso(95), updatedAt: iso(95),
    unreadForAgent: 1, unreadForCustomer: 0,
    messages: [
      { id: "m1", from: "customer", author: "Tunde Bakare", text: "What's the difference between job credits and promotion credits?", at: iso(95) },
    ],
  },
  {
    id: "t3", ref: "HV-1039", subject: "NIN verification stuck",
    category: "NIN Verification", name: "Ngozi Eze", company: "BrightHire",
    email: "ngozi@brighthire.co", avatar: "NE", status: "open", priority: "high",
    operator: "Ijeoma Bello", createdAt: iso(1600), updatedAt: iso(1500),
    unreadForAgent: 0, unreadForCustomer: 1,
    messages: [
      { id: "m1", from: "customer", author: "Ngozi Eze", text: "Our employee's NIN has been pending for 2 days.", at: iso(1600) },
      { id: "m2", from: "agent", author: "Ijeoma Bello", text: "Let me escalate this to the verifications team — I'll update you today.", at: iso(1500) },
    ],
  },
  {
    id: "t4", ref: "HV-1021", subject: "Invoice request",
    category: "Billing & Payments", name: "Samuel Adeola", company: "RoyalStaff",
    email: "sam@royalstaff.com", avatar: "SA", status: "closed", priority: "low",
    operator: "Ijeoma Bello", createdAt: iso(5000), updatedAt: iso(4900),
    unreadForAgent: 0, unreadForCustomer: 0,
    messages: [
      { id: "m1", from: "customer", author: "Samuel Adeola", text: "Can I get a PDF invoice for last month?", at: iso(5000) },
      { id: "m2", from: "agent", author: "Ijeoma Bello", text: "Sent to your inbox. Anything else?", at: iso(4950) },
      { id: "m3", from: "customer", author: "Samuel Adeola", text: "All good, thanks!", at: iso(4900) },
    ],
  },
  {
    id: "t5", ref: "HV-1044", subject: "Promotion campaign not running",
    category: "Credits & Promotions", name: "Chioma Nwankwo", company: "TalentPath",
    email: "chioma@talentpath.io", avatar: "CN", status: "open", priority: "normal",
    operator: null, createdAt: iso(40), updatedAt: iso(38),
    unreadForAgent: 2, unreadForCustomer: 0,
    messages: [
      { id: "m1", from: "customer", author: "Chioma Nwankwo", text: "My boost campaign shows paused but I never paused it.", at: iso(40) },
      { id: "m2", from: "customer", author: "Chioma Nwankwo", text: "Please check ASAP, we have hiring deadlines.", at: iso(38) },
    ],
  },
];

// The signed-in company on the hiring dashboard (mocked).
export const CURRENT_COMPANY = {
  name: "Acme Corp",
  contact: "Adaeze Okafor",
  email: "adaeze@acme.io",
  avatar: "AO",
};

export const loadTickets = (): Ticket[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Ticket[];
  } catch {
    /* ignore */
  }
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
};

export const saveTickets = (tickets: Ticket[]) => {
  localStorage.setItem(KEY, JSON.stringify(tickets));
  window.dispatchEvent(new CustomEvent(EVENT));
};

export const subscribeTickets = (cb: () => void) => {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};

export const newId = () => Math.random().toString(36).slice(2, 10);

export const nextRef = (tickets: Ticket[]) =>
  `HV-${1045 + tickets.filter((t) => t.ref.startsWith("HV-")).length}`;

export const formatTime = (isoStr: string) =>
  new Date(isoStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const formatWhen = (isoStr: string) => {
  const d = new Date(isoStr);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  if (sameDay) return formatTime(isoStr);
  const yest = new Date(today.getTime() - 86400000);
  if (d.toDateString() === yest.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { day: "2-digit", month: "short" });
};
