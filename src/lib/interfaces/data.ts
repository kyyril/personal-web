export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  bio: string;
}

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
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface Data {
  personalInfo: PersonalInfo;
  contactInfo: ContactInfo;
  skills: Skills;
  projects: Project[];
  education: Education[];
}
