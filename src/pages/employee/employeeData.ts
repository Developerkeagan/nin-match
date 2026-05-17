export interface ETask {
  id: string;
  title: string;
  project: string;
  due: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in-progress" | "review" | "done";
  progress: number;
  estimatedHours: number;
}

export interface AttendanceRow {
  date: string;
  signIn: string | null;
  signOut: string | null;
  hours: number;
  status: "present" | "late" | "absent" | "leave";
}

export const myTasks: ETask[] = [
  { id: "T-101", title: "Refactor auth flow components", project: "Q1 Platform Revamp", due: "2026-05-21", priority: "high", status: "in-progress", progress: 65, estimatedHours: 12 },
  { id: "T-102", title: "Write release notes for v2.4", project: "Internal Tools", due: "2026-05-18", priority: "medium", status: "todo", progress: 0, estimatedHours: 3 },
  { id: "T-103", title: "Review PR #482", project: "Q1 Platform Revamp", due: "2026-05-16", priority: "urgent", status: "review", progress: 90, estimatedHours: 1 },
  { id: "T-104", title: "Pair with Aisha on onboarding", project: "Internal Tools", due: "2026-05-20", priority: "low", status: "todo", progress: 0, estimatedHours: 2 },
  { id: "T-105", title: "Investigate dashboard latency", project: "Q1 Platform Revamp", due: "2026-05-14", priority: "high", status: "in-progress", progress: 40, estimatedHours: 6 },
  { id: "T-106", title: "Update component library docs", project: "Internal Tools", due: "2026-05-10", priority: "low", status: "done", progress: 100, estimatedHours: 4 },
];

export const attendanceSeed: AttendanceRow[] = [
  { date: "2026-05-15", signIn: "08:55", signOut: "17:20", hours: 8.4, status: "present" },
  { date: "2026-05-14", signIn: "09:10", signOut: "17:05", hours: 7.9, status: "late" },
  { date: "2026-05-13", signIn: "08:50", signOut: "17:30", hours: 8.7, status: "present" },
  { date: "2026-05-12", signIn: "08:45", signOut: "17:00", hours: 8.3, status: "present" },
  { date: "2026-05-11", signIn: null, signOut: null, hours: 0, status: "leave" },
];

export const STORAGE_TASKS = "hiravel_emp_tasks";
export const STORAGE_ATT = "hiravel_emp_attendance";
