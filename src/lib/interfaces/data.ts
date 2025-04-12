export interface ContactInfo {
  email: string;
  cv: string;
  linkedin: string;
  github: string;
  website: string;
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
  image: string[];
  type: string;
  category: string;
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
  status: string;
  working: string;
}

export interface Data {
  contactInfo: ContactInfo;
  skills: Skills;
  projects: Project[];
  education: Education[];
  experiences: Experience[];
}
