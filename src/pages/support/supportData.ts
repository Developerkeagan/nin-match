export interface ChatMessage {
  id: string;
  from: "customer" | "agent" | "admin";
  text: string;
  at: string;
}

export interface Chat {
  id: string;
  name: string;
  company: string;
  email: string;
  avatar: string;
  status: "open" | "closed";
  unread: number;
  topic: string;
  priority: "low" | "normal" | "high";
  lastAt: string;
  messages: ChatMessage[];
}

export const seedChats: Chat[] = [
  {
    id: "c1", name: "Adaeze Okafor", company: "Acme Corp", email: "adaeze@acme.io", avatar: "AO",
    status: "open", unread: 3, topic: "Cannot post a job — payment fails", priority: "high", lastAt: "09:42",
    messages: [
      { id: "m1", from: "customer", text: "Hi, I tried to post a job but my card keeps getting declined. Please help.", at: "09:30" },
      { id: "m2", from: "customer", text: "I've already tried 3 different cards.", at: "09:31" },
      { id: "m3", from: "agent", text: "Hello Adaeze, sorry about that. Can you share the last 4 digits of the card you tried last?", at: "09:33" },
      { id: "m4", from: "customer", text: "**** 4421", at: "09:42" },
    ],
  },
  {
    id: "c2", name: "Tunde Bakare", company: "Lagos Talent Co.", email: "tunde@lagostalent.ng", avatar: "TB",
    status: "open", unread: 1, topic: "How do credits work?", priority: "normal", lastAt: "09:15",
    messages: [
      { id: "m1", from: "customer", text: "What's the difference between job credits and promotion credits?", at: "09:15" },
    ],
  },
  {
    id: "c3", name: "Ngozi Eze", company: "BrightHire", email: "ngozi@brighthire.co", avatar: "NE",
    status: "open", unread: 0, topic: "NIN verification stuck", priority: "high", lastAt: "Yesterday",
    messages: [
      { id: "m1", from: "customer", text: "Our employee's NIN has been pending for 2 days.", at: "Yesterday 14:10" },
      { id: "m2", from: "agent", text: "Let me escalate this to the verifications team.", at: "Yesterday 14:30" },
    ],
  },
  {
    id: "c4", name: "Samuel Adeola", company: "RoyalStaff", email: "sam@royalstaff.com", avatar: "SA",
    status: "closed", unread: 0, topic: "Invoice request", priority: "low", lastAt: "Mon",
    messages: [
      { id: "m1", from: "customer", text: "Can I get a PDF invoice for last month?", at: "Mon 10:00" },
      { id: "m2", from: "agent", text: "Sent to your inbox. Anything else?", at: "Mon 10:05" },
      { id: "m3", from: "customer", text: "All good, thanks!", at: "Mon 10:06" },
    ],
  },
  {
    id: "c5", name: "Chioma Nwankwo", company: "TalentPath", email: "chioma@talentpath.io", avatar: "CN",
    status: "open", unread: 2, topic: "Promotion campaign not running", priority: "normal", lastAt: "08:50",
    messages: [
      { id: "m1", from: "customer", text: "My boost campaign shows paused but I never paused it.", at: "08:48" },
      { id: "m2", from: "customer", text: "Please check ASAP, we have hiring deadlines.", at: "08:50" },
    ],
  },
];
