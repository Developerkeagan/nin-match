import { useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CalendarIcon, X, Sparkles, Save, Send, Briefcase, MapPin, Users, Brain, Settings2,
} from "lucide-react";

const AI_SUGGESTIONS = {
  skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "REST APIs", "Git"],
  traits: ["Fast learner", "Team player", "Self-motivated", "Detail-oriented"],
  description:
    "We are looking for an experienced developer to join our team. You will be responsible for building and maintaining scalable applications, collaborating with cross-functional teams, and contributing to architectural decisions.",
};

const CreateJob = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [traits, setTraits] = useState<string[]>([]);
  const [traitInput, setTraitInput] = useState("");
  const [prioritySkills, setPrioritySkills] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<Date>();
  const [maxApplicants, setMaxApplicants] = useState("");
  const [visibility, setVisibility] = useState("public");

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const addTag = (
    value: string,
    list: string[],
    setter: (v: string[]) => void,
    inputSetter: (v: string) => void
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setter([...list, trimmed]);
    }
    inputSetter("");
  };

  const removeTag = (tag: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.filter((t) => t !== tag));
  };

  const handleSkillKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(skillInput, skills, setSkills, setSkillInput);
    }
  };

  const handleTraitKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(traitInput, traits, setTraits, setTraitInput);
    }
  };

  const togglePrioritySkill = (skill: string) => {
    setPrioritySkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Job title is required";
    if (!description.trim()) errs.description = "Job description is required";
    if (!employmentType) errs.employmentType = "Employment type is required";
    if (!workMode) errs.workMode = "Work mode is required";
    if (!location.trim()) errs.location = "Location is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (publish: boolean) => {
    if (publish && !validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast({
      title: publish ? "Job published successfully!" : "Draft saved!",
      description: publish
        ? "Your job listing is now live."
        : "You can continue editing later.",
    });
    navigate("/dashboard/jobs");
  };

  const applyAiSuggestions = () => {
    const newSkills = [...new Set([...skills, ...AI_SUGGESTIONS.skills])];
    setSkills(newSkills);
    const newTraits = [...new Set([...traits, ...AI_SUGGESTIONS.traits])];
    setTraits(newTraits);
    if (!description.trim()) setDescription(AI_SUGGESTIONS.description);
    setAiModalOpen(false);
    toast({ title: "AI suggestions applied!" });
  };

  const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) => (
    <div className="flex items-start gap-3 mb-6">
      <div className="h-10 w-10 rounded-none bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );

  const TagInput = ({
    tags, input, onInputChange, onKeyDown, onRemove, placeholder,
  }: {
    tags: string[]; input: string; onInputChange: (v: string) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    onRemove: (t: string) => void; placeholder: string;
  }) => (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="rounded-none gap-1 pr-1">
            {tag}
            <button onClick={() => onRemove(tag)} className="ml-1 hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="rounded-none"
      />
      <p className="text-xs text-muted-foreground">Press Enter to add</p>
    </div>
  );

  return (
    <div className="pb-28">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create New Job</h1>
          <p className="text-muted-foreground">Fill in the details to attract the best candidates</p>
        </div>
        <Button variant="outline" className="rounded-none w-fit" onClick={() => handleSave(false)} disabled={saving}>
          <Save className="h-4 w-4 mr-2" /> Save as Draft
        </Button>
      </div>

      <div className="space-y-8 max-w-3xl">
        {/* Section 1: Basic Information */}
        <section className="border border-border bg-card p-6 rounded-none">
          <SectionHeader icon={Briefcase} title="Basic Information" subtitle="Core details about the position" />
          <div className="space-y-4">
            <div>
              <Label>Job Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Backend Developer"
                className={cn("rounded-none mt-1", errors.title && "border-destructive")}
              />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
            </div>
            <div>
              <Label>Job Description *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the role, responsibilities, and expectations…"
                className={cn("rounded-none mt-1 min-h-[140px]", errors.description && "border-destructive")}
              />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
            </div>
            <div>
              <Label>Company</Label>
              <Input value="TechCorp Nigeria" readOnly className="rounded-none mt-1 bg-muted cursor-not-allowed" />
            </div>
          </div>
        </section>

        {/* Section 2: Job Details */}
        <section className="border border-border bg-card p-6 rounded-none">
          <SectionHeader icon={MapPin} title="Job Details" subtitle="Employment specifics and compensation" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Employment Type *</Label>
              <Select value={employmentType} onValueChange={setEmploymentType}>
                <SelectTrigger className={cn("rounded-none mt-1", errors.employmentType && "border-destructive")}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
              {errors.employmentType && <p className="text-sm text-destructive mt-1">{errors.employmentType}</p>}
            </div>
            <div>
              <Label>Work Mode *</Label>
              <Select value={workMode} onValueChange={setWorkMode}>
                <SelectTrigger className={cn("rounded-none mt-1", errors.workMode && "border-destructive")}>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="on-site">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {errors.workMode && <p className="text-sm text-destructive mt-1">{errors.workMode}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label>Location *</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lagos"
                className={cn("rounded-none mt-1", errors.location && "border-destructive")}
              />
              {errors.location && <p className="text-sm text-destructive mt-1">{errors.location}</p>}
            </div>
            <div>
              <Label>Min Salary (₦)</Label>
              <Input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="e.g. 300000"
                className="rounded-none mt-1"
              />
            </div>
            <div>
              <Label>Max Salary (₦)</Label>
              <Input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="e.g. 600000"
                className="rounded-none mt-1"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Requirements */}
        <section className="border border-border bg-card p-6 rounded-none">
          <SectionHeader icon={Users} title="Requirements" subtitle="Skills and qualifications needed" />
          <div className="space-y-5">
            <div>
              <Label>Skills</Label>
              <div className="mt-1">
                <TagInput
                  tags={skills}
                  input={skillInput}
                  onInputChange={setSkillInput}
                  onKeyDown={handleSkillKey}
                  onRemove={(t) => removeTag(t, skills, setSkills)}
                  placeholder="Type a skill and press Enter"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Experience Required</Label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger className="rounded-none mt-1">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0–1 years</SelectItem>
                    <SelectItem value="1-2">1–2 years</SelectItem>
                    <SelectItem value="2-3">2–3 years</SelectItem>
                    <SelectItem value="3-5">3–5 years</SelectItem>
                    <SelectItem value="5+">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Education</Label>
                <Input
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. BSc Computer Science"
                  className="rounded-none mt-1"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: AI Matching Boost */}
        <section className="border border-primary/30 bg-primary/5 p-6 rounded-none">
          <SectionHeader icon={Brain} title="AI Matching Boost" subtitle="Improve AI matching quality for better results" />
          <div className="space-y-5">
            <div>
              <Label>Preferred Candidate Traits</Label>
              <div className="mt-1">
                <TagInput
                  tags={traits}
                  input={traitInput}
                  onInputChange={setTraitInput}
                  onKeyDown={handleTraitKey}
                  onRemove={(t) => removeTag(t, traits, setTraits)}
                  placeholder="e.g. Fast learner, Team player"
                />
              </div>
            </div>
            {skills.length > 0 && (
              <div>
                <Label>Priority Skills (click to toggle)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant={prioritySkills.includes(skill) ? "default" : "outline"}
                      className="rounded-none cursor-pointer"
                      onClick={() => togglePrioritySkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              className="rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => setAiModalOpen(true)}
            >
              <Sparkles className="h-4 w-4 mr-2" /> Generate Suggestions
            </Button>
          </div>
        </section>

        {/* Section 5: Application Settings */}
        <section className="border border-border bg-card p-6 rounded-none">
          <SectionHeader icon={Settings2} title="Application Settings" subtitle="Control how candidates apply" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Application Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full rounded-none mt-1 justify-start text-left font-normal",
                      !deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Max Applicants</Label>
              <Input
                type="number"
                value={maxApplicants}
                onChange={(e) => setMaxApplicants(e.target.value)}
                placeholder="e.g. 100"
                className="rounded-none mt-1"
              />
            </div>
            <div>
              <Label>Visibility</Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className="rounded-none mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-6 py-4">
        <div className="max-w-3xl mx-auto flex justify-end gap-3">
          <Button
            variant="outline"
            className="rounded-none"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" /> Save as Draft
          </Button>
          <Button
            className="rounded-none"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            <Send className="h-4 w-4 mr-2" /> Publish Job
          </Button>
        </div>
      </div>

      {/* AI Suggestions Modal */}
      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> AI Suggestions
            </DialogTitle>
            <DialogDescription>
              AI-generated suggestions to improve your job listing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="font-semibold">Suggested Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {AI_SUGGESTIONS.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="rounded-none">{s}</Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="font-semibold">Suggested Traits</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {AI_SUGGESTIONS.traits.map((t) => (
                  <Badge key={t} variant="outline" className="rounded-none">{t}</Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="font-semibold">Suggested Description</Label>
              <p className="text-sm text-muted-foreground mt-1">{AI_SUGGESTIONS.description}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setAiModalOpen(false)}>
              Ignore
            </Button>
            <Button className="rounded-none" onClick={applyAiSuggestions}>
              Apply Suggestions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateJob;
