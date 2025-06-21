export interface ContactInfo {
  email: string;
  cv: string;
  linkedin: string;
  github: string;
}

export interface Skills {
  languages: string[];
  frameworks: string[];
  tools: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  live_url: string;
  code_repo_url: string;
  date: string;
  features: string[];
  images: string[];
  type: "personal" | "work" | "academic";
  category: "web" | "mobile" | "desktop" | "library";
  featured: boolean;
  isPrivate: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  description: string;
  startDate: string;
  endDate: string;
}
export interface Experience {
  id: string;
  institution: string;
  job: string;
  technologies: string[];
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  working: "remote" | "onsite" | "hybrid";
}

export interface Data {
  contactInfo: ContactInfo;
  skills: Skills;
  projects: Project[];
  education: Education[];
  experiences: Experience[];
}
