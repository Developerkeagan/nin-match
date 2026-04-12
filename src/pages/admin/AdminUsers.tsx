import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Eye, MoreVertical, Trash2, ShieldCheck, User, UserCog, MapPin,
  Briefcase, Calendar, Mail, Phone, GraduationCap, Award, Users,
} from "lucide-react";

type UserRole = "user" | "admin";

interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: "active" | "suspended";
  location: string;
  skills: string[];
  experience: string;
  education: string;
  joinDate: string;
  lastActive: string;
  jobsApplied: number;
  summary: string;
  workHistory: { company: string; role: string; duration: string }[];
}

const generateUsers = (): MockUser[] => {
  const firstNames = [
    "Adebayo", "Fatima", "Chinedu", "Amina", "Emeka", "Grace", "Yusuf", "Ngozi",
    "Ibrahim", "Kemi", "Tunde", "Halima", "Obiora", "Aisha", "Segun", "Zainab",
    "Ikenna", "Funke", "Musa", "Chioma", "Dayo", "Hadiza", "Uche", "Binta",
    "Femi", "Salamatu", "Onyeka", "Rahma", "Kunle", "Nkechi", "Abdullahi", "Ifeoma",
  ];
  const lastNames = [
    "Olumide", "Ibrahim", "Okafor", "Yusuf", "Nwankwo", "Adeyemi", "Bello", "Eze",
    "Abubakar", "Ogundimu", "Fashola", "Mohammed", "Okoro", "Suleiman", "Adeleke", "Chukwu",
  ];
  const locations = [
    "Lagos, Nigeria", "Abuja, Nigeria", "Port Harcourt, Nigeria", "Kano, Nigeria",
    "Ibadan, Nigeria", "Enugu, Nigeria", "Kaduna, Nigeria", "Benin City, Nigeria",
    "Accra, Ghana", "Nairobi, Kenya", "Cape Town, South Africa", "Dar es Salaam, Tanzania",
  ];
  const skillSets = [
    ["React", "TypeScript", "Node.js", "MongoDB"],
    ["Python", "Django", "PostgreSQL", "AWS"],
    ["Java", "Spring Boot", "MySQL", "Docker"],
    ["Figma", "Sketch", "Adobe XD", "Prototyping"],
    ["React Native", "Flutter", "Firebase", "REST APIs"],
    ["Vue.js", "Nuxt.js", "Tailwind", "GraphQL"],
    ["Data Analysis", "SQL", "Power BI", "Excel"],
    ["Project Management", "Agile", "Scrum", "Jira"],
  ];
  const companies = ["Paystack", "Flutterwave", "Andela", "Kuda Bank", "Interswitch", "PiggyVest", "Cowrywise", "Bamboo"];
  const roles = ["Software Engineer", "Product Designer", "Data Analyst", "Project Manager", "DevOps Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer"];
  const education = [
    "BSc Computer Science, UNILAG", "BSc Software Engineering, ABU", "BSc Computer Engineering, UNIBEN",
    "HND Computer Science, Yaba Tech", "BSc Information Technology, FUTO", "MSc Data Science, UI",
    "BSc Mathematics, OAU", "BEng Electrical Engineering, UNILORIN",
  ];

  const users: MockUser[] = [];
  for (let i = 0; i < 247; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const skills = skillSets[i % skillSets.length];
    users.push({
      id: `u${i + 1}`,
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i > 31 ? i : ""}@email.com`,
      phone: `+234 ${800 + (i % 100)} ${1000000 + i}`,
      role: i < 3 ? "admin" : "user",
      status: i % 15 === 0 ? "suspended" : "active",
      location: locations[i % locations.length],
      skills,
      experience: `${1 + (i % 8)} years`,
      education: education[i % education.length],
      joinDate: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12]} 202${4 + Math.floor(i / 120)}`,
      lastActive: i % 5 === 0 ? "Today" : i % 3 === 0 ? "Yesterday" : `${2 + (i % 10)} days ago`,
      jobsApplied: i % 20,
      summary: `Experienced professional with ${1 + (i % 8)} years in ${skills[0]} and related technologies.`,
      workHistory: [
        { company: companies[i % companies.length], role: roles[i % roles.length], duration: "2023–Present" },
        { company: companies[(i + 3) % companies.length], role: roles[(i + 2) % roles.length], duration: "2021–2023" },
      ],
    });
  }
  return users;
};

const USERS_PER_PAGE = 100;

const AdminUsers = () => {
  const { toast } = useToast();
  const [allUsers, setAllUsers] = useState(generateUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<MockUser | null>(null);

  const filtered = useMemo(() => {
    return allUsers.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.skills.some((s) => s.toLowerCase().includes(q));
      }
      return true;
    });
  }, [allUsers, search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

  const toggleRole = (user: MockUser) => {
    const newRole: UserRole = user.role === "admin" ? "user" : "admin";
    setAllUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
    toast({ title: `${user.name} is now ${newRole === "admin" ? "an Admin" : "a User"}` });
  };

  const deleteUser = () => {
    if (!userToDelete) return;
    setAllUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    toast({ title: `${userToDelete.name} has been deleted`, variant: "destructive" });
    setUserToDelete(null);
    setDeleteDialogOpen(false);
    if (selectedUser?.id === userToDelete.id) setSelectedUser(null);
  };

  const toggleStatus = (user: MockUser) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    setAllUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
    toast({ title: `${user.name} has been ${newStatus}` });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground text-sm">Manage all registered users on the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            {filtered.length} users
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by name, email, or skill…"
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="sm:w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="sm:w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Accordion List */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <Accordion type="single" collapsible className="w-full">
          {paginated.map((user) => (
            <AccordionItem key={user.id} value={user.id} className="border-b border-border last:border-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-foreground truncate">{user.name}</p>
                      {user.role === "admin" && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-primary/15 text-primary border-primary/30 shrink-0">Admin</Badge>
                      )}
                      <Badge
                        variant={user.status === "active" ? "secondary" : "destructive"}
                        className="text-[10px] px-1.5 py-0 shrink-0 hidden sm:inline-flex"
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{user.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Joined {user.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{user.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground truncate">{user.education}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{user.jobsApplied} jobs applied</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1.5">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {user.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    <Button size="sm" variant="outline" onClick={() => setSelectedUser(user)}>
                      <Eye className="h-3.5 w-3.5 mr-1.5" /> View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="h-3.5 w-3.5 mr-1.5" /> Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => toggleRole(user)}>
                          {user.role === "admin" ? (
                            <><User className="h-4 w-4 mr-2" /> Make User</>
                          ) : (
                            <><ShieldCheck className="h-4 w-4 mr-2" /> Make Admin</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(user)}>
                          <UserCog className="h-4 w-4 mr-2" />
                          {user.status === "active" ? "Suspend" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => { setUserToDelete(user); setDeleteDialogOpen(true); }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {paginated.length === 0 && (
          <div className="text-center py-16">
            <User className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* User Detail Sheet */}
      <Sheet open={!!selectedUser} onOpenChange={(open) => { if (!open) setSelectedUser(null); }}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedUser && (
            <>
              <SheetHeader className="pb-4 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle className="text-xl">{selectedUser.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Badge className={selectedUser.role === "admin" ? "bg-primary/15 text-primary border-primary/30" : ""} variant={selectedUser.role === "admin" ? "outline" : "secondary"}>
                      {selectedUser.role === "admin" ? "Admin" : "User"}
                    </Badge>
                    <Badge variant={selectedUser.status === "active" ? "secondary" : "destructive"}>
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="experience" className="text-xs">Experience</TabsTrigger>
                  <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Summary</h4>
                    <p className="text-sm text-muted-foreground">{selectedUser.summary}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium mt-0.5">{selectedUser.location}</p>
                    </div>
                    <div className="border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium mt-0.5">{selectedUser.phone}</p>
                    </div>
                    <div className="border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Joined</p>
                      <p className="text-sm font-medium mt-0.5">{selectedUser.joinDate}</p>
                    </div>
                    <div className="border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Last Active</p>
                      <p className="text-sm font-medium mt-0.5">{selectedUser.lastActive}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedUser.skills.map((s) => (
                        <Badge key={s} variant="secondary">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Education</h4>
                    <p className="text-sm text-muted-foreground">{selectedUser.education}</p>
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-3 mt-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Experience</h4>
                    <p className="text-sm text-muted-foreground mb-3">{selectedUser.experience}</p>
                  </div>
                  {selectedUser.workHistory.map((w, i) => (
                    <div key={i} className="border border-border p-3 rounded-lg">
                      <p className="font-semibold text-sm">{w.role}</p>
                      <p className="text-xs text-muted-foreground">{w.company}</p>
                      <p className="text-xs text-muted-foreground">{w.duration}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="activity" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-border rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-foreground">{selectedUser.jobsApplied}</p>
                      <p className="text-xs text-muted-foreground">Jobs Applied</p>
                    </div>
                    <div className="border border-border rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-foreground">{selectedUser.lastActive}</p>
                      <p className="text-xs text-muted-foreground">Last Active</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Sheet Actions */}
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border">
                <Button size="sm" variant="outline" onClick={() => toggleRole(selectedUser)}>
                  {selectedUser.role === "admin" ? <><User className="h-3.5 w-3.5 mr-1.5" /> Make User</> : <><ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Make Admin</>}
                </Button>
                <Button size="sm" variant="outline" onClick={() => { toggleStatus(selectedUser); setSelectedUser({ ...selectedUser, status: selectedUser.status === "active" ? "suspended" : "active" }); }}>
                  <UserCog className="h-3.5 w-3.5 mr-1.5" /> {selectedUser.status === "active" ? "Suspend" : "Activate"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => { setUserToDelete(selectedUser); setDeleteDialogOpen(true); }}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">{userToDelete?.name}</span>? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteUser}>
              <Trash2 className="h-4 w-4 mr-1.5" /> Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
