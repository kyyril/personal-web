export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  bio: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
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
  title: string;
  description: string;
  technologies: string[];
  live_url: string;
  code_repo_url: string;
  cover: string;
}

export interface Data {
  personalInfo: PersonalInfo;
  contactInfo: ContactInfo;
  skills: Skills;
  projects: Project[];
  hobbies: string[];
}
