export interface ProfileProps {}

export type Biodata = {
  full_name: string;
  avatar: string;
  description: string;
  email: string;
  phone: string;
  social_media: SocialMedia[];
  experiences: Experiences[];
  educations: Educations[];
  skills: Skills[];
  showcase: ShowCase[];
};

export type SocialMedia = {
  name: string;
  slug: string;
  link: string;
};

export type Experiences = {
  start_date: string;
  end_date: string;
  role: string;
  company_name: string;
  description: string;
};

export type Educations = {
  start_date: string;
  end_date: string;
  school_name: string;
  degree: string;
  description: string;
};

export type Skills = {
  name: string;
  slug: string;
};

export type ShowCase = {
  title: string;
  thumbnail: string;
  description: string;
  tech_stacks: TechStack[];
  contributors: Contributor[];
  repositories: Repository[];
  platforms: Platform[];
};

interface Platform {
  app_store_link: string;
  google_play_link: string;
  web_link: string;
}

interface Repository {
  backend_link: string;
  frontend_link: string;
  mobile_link: string;
}

interface TechStack {
  name: string;
  slug: string;
}

interface Contributor {
  name: string;
  role: string;
  github_link: string;
}
