export type Position =
  | "professor"
  | "phd"
  | "master"
  | "undergraduate"
  | "alumni"
  | "researcher";

export type Role = "admin" | "member";

export type EventCategory =
  | "seminar"
  | "meeting"
  | "conference"
  | "deadline"
  | "holiday"
  | "other";

export type ProjectStatus = "ongoing" | "completed" | "planned";

export type PublicationType =
  | "journal"
  | "conference"
  | "workshop"
  | "thesis"
  | "patent"
  | "other";

export type PostCategory = "notice" | "general" | "resource";

export interface Profile {
  id: string;
  name: string;
  name_en: string | null;
  student_id: string | null;
  position: Position;
  email: string;
  phone: string | null;
  profile_photo_url: string | null;
  role: Role;
  bio: string | null;
  bio_en: string | null;
  is_active: boolean;
  joined_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  clock_in: string;
  clock_out: string | null;
  date: string;
  duration_minutes: number | null;
  note: string | null;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  start_datetime: string;
  end_datetime: string | null;
  is_all_day: boolean;
  category: EventCategory;
  location: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  status: ProjectStatus;
  progress: number;
  start_date: string | null;
  end_date: string | null;
  funding_source: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  project_id: string;
  user_id: string;
  role_in_project: string;
  profile?: Profile;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string | null;
  year: number;
  doi: string | null;
  url: string | null;
  abstract: string | null;
  pub_type: PublicationType;
  project_id: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string | null;
  category: PostCategory;
  is_pinned: boolean;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface PostAttachment {
  id: string;
  post_id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

export interface ProfessorInfo {
  id: string;
  name: string;
  name_en: string | null;
  title: string | null;
  title_en: string | null;
  department: string | null;
  department_en: string | null;
  bio: string | null;
  bio_en: string | null;
  research_areas: { ko: string; en: string }[];
  education: { ko: string; en: string }[];
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  office_location: string | null;
  website: string | null;
  updated_at: string;
}

export interface LabInfo {
  id: string;
  name: string;
  name_en: string | null;
  vision: string | null;
  vision_en: string | null;
  description: string | null;
  description_en: string | null;
  research_areas: { ko: string; en: string }[];
  location: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  address_en: string | null;
  updated_at: string;
}
