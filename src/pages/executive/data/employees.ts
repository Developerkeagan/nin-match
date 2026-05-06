export interface ExecEmployee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  level: "Junior" | "Mid" | "Senior" | "Lead" | "Manager";
  joinedAt: string;
  location: string;
  performance: number;
  status: "active" | "on-leave" | "terminated";
}

export const execEmployees: ExecEmployee[] = [
  { id: "EMP-001", name: "Chinedu Okoro", email: "chinedu@acmecorp.io", role: "Engineering Lead", department: "Engineering", salary: 850000, level: "Lead", joinedAt: "2022-03-14", location: "Lagos, NG", performance: 92, status: "active" },
  { id: "EMP-002", name: "Tolu Adeyinka", email: "tolu@acmecorp.io", role: "Sales Manager", department: "Sales", salary: 720000, level: "Manager", joinedAt: "2021-08-22", location: "Abuja, NG", performance: 88, status: "active" },
  { id: "EMP-003", name: "Halima Sani", email: "halima@acmecorp.io", role: "Marketing Director", department: "Marketing", salary: 780000, level: "Manager", joinedAt: "2020-11-03", location: "Kano, NG", performance: 85, status: "active" },
  { id: "EMP-004", name: "Kunle Adebanjo", email: "kunle@acmecorp.io", role: "Operations Lead", department: "Operations", salary: 650000, level: "Lead", joinedAt: "2022-06-18", location: "Lagos, NG", performance: 80, status: "active" },
  { id: "EMP-005", name: "Mary Johnson", email: "mary@acmecorp.io", role: "Support Manager", department: "Customer Support", salary: 520000, level: "Manager", joinedAt: "2023-02-09", location: "Port Harcourt, NG", performance: 78, status: "on-leave" },
  { id: "EMP-006", name: "Sade Olawale", email: "sade@acmecorp.io", role: "Finance Manager", department: "Finance", salary: 690000, level: "Manager", joinedAt: "2021-04-25", location: "Lagos, NG", performance: 90, status: "active" },
  { id: "EMP-007", name: "Ifeanyi Eze", email: "ifeanyi@acmecorp.io", role: "Senior Engineer", department: "Engineering", salary: 580000, level: "Senior", joinedAt: "2023-01-15", location: "Lagos, NG", performance: 86, status: "active" },
  { id: "EMP-008", name: "Aisha Bello", email: "aisha@acmecorp.io", role: "Product Designer", department: "Engineering", salary: 460000, level: "Mid", joinedAt: "2023-09-04", location: "Abuja, NG", performance: 82, status: "active" },
  { id: "EMP-009", name: "Emeka Nwosu", email: "emeka@acmecorp.io", role: "Sales Executive", department: "Sales", salary: 320000, level: "Junior", joinedAt: "2024-02-20", location: "Lagos, NG", performance: 74, status: "active" },
  { id: "EMP-010", name: "Funmi Adesanya", email: "funmi@acmecorp.io", role: "HR Specialist", department: "Operations", salary: 410000, level: "Mid", joinedAt: "2022-12-01", location: "Lagos, NG", performance: 84, status: "active" },
];

export function downloadCSV(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) => r.map((c) => {
      const s = String(c ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
