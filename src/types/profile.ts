export interface ProfileProps {}

export type BiodataDaum = {
  full_name: string;
  avatar: string;
  description: string;
  tagline: string;
  email: string;
  phone: string;
  social_media: SocialMediaDaum[];
  experiences: ExperiencesDaum[];
  educations: EducationsDaum[];
  skills: SkillsDaum[];
  showcase: ShowCaseDaum[];
  testimonials: TestimoniDaum[];
};

export type TestimoniDaum = {
  fullname: string;
  role: string;
  description: string;
};
export type SocialMediaDaum = {
  name: string;
  slug: string;
  link: string;
};

export type ExperiencesDaum = {
  start_date: string;
  end_date: string;
  role: string;
  type: string;
  company_name: string;
  description: string;
  list_task?: string[];
};

export type EducationsDaum = {
  start_date: string;
  end_date: string;
  school_name: string;
  degree: string;
  description: string;
};

export type SkillsDaum = {
  name: string;
  slug: string;
};

export type ShowCaseDaum = {
  title: string;
  thumbnail: string;
  description: string;
  tech_stacks: TechStackDaum[];
  contributors: ContributorDaum[];
  repositories: RepositoryDaum[];
  platforms: PlatformDaum[];
};

interface PlatformDaum {
  name: string;
  slug?: string;
  reference_link: string;
}

interface RepositoryDaum {
  backend_link: string;
  frontend_link: string;
  mobile_link: string;
}

interface TechStackDaum {
  name: string;
  slug: string;
}

interface ContributorDaum {
  name: string;
  role: string;
  github_link: string;
}
